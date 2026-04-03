import { useEffect, useState, useRef } from 'react'
import Modal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Plus, ChevronRight, Image as ImageIcon } from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import { deserializeBlocks, type Block } from '../utils/richText'
import { extractYouTubeId, hasVideo, updateMemory, QUESTION_COLORS, QUESTION_ORDER } from '../data/memories'
import type { Memory, WhQuestion, CategoryType } from '../data/memories'

// =============================================================================
// TYPES
// =============================================================================

export interface MemoryModalProps {
  isOpen: boolean
  onClose: () => void
  memory: Memory | null
  borderColor?: string
  index?: number
  onMemoryUpdate?: (memory: Memory) => void
  onQuestComplete?: () => void
  questionLabels?: Record<string, string>
}

interface FormData {
  question: WhQuestion | null
  title: string
  videoUrl: string
  description: string
}

// =============================================================================
// MODAL STYLES
// =============================================================================

const customStyles: Modal.Styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    inset: 'auto',
    width: '90vw',
    maxWidth: 'none',
    maxHeight: '85vh',
    height: '85vh',
    padding: 0,
    border: 'none',
    background: 'transparent',
    overflow: 'hidden',
    borderRadius: 0,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  },
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const modalVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.12, ease: 'easeOut' as const },
  },
  exit: { 
    opacity: 0, 
    scale: 0.97,
    transition: { duration: 0.08, ease: 'easeIn' as const },
  },
}

// =============================================================================
// COMPONENT
// =============================================================================

export function MemoryModal({
  isOpen,
  onClose,
  memory,
  borderColor = '#E5E7EB',
  index: _index, // eslint-disable-line @typescript-eslint/no-unused-vars
  onMemoryUpdate,
  questionLabels = {},
}: MemoryModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [sources, setSources] = useState<string[]>(['', '', ''])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [videoCurrentTime, setVideoCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const ytPlayerRef = useRef<any>(null)
  const ytTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const ytIframeRef = useRef<HTMLIFrameElement>(null)
  const [formData, setFormData] = useState<FormData>({
    question: null,
    title: '',
    videoUrl: '',
    description: '',
  })
  const [isResumeVisible, setIsResumeVisible] = useState(true)

  useEffect(() => {
    if (memory) {
      const defaultEmptyTitle = memory.title.startsWith('Emplacement ') ? '' : memory.title;
      setFormData({
        question: memory.question,
        title: memory.isFilled ? memory.title : defaultEmptyTitle,
        videoUrl: memory.videoUrl || '',
        description: memory.isFilled ? memory.description : '',
      })
      setIsEditing(!memory.isFilled)
      setIsVideoPlaying(false)
      setImage(null)
      setSources(memory.sources && memory.sources.length ? [...memory.sources, ...Array(Math.max(0, 3 - memory.sources.length)).fill('')].slice(0, 3) : ['', '', ''])
    }
  }, [memory, isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // YouTube IFrame API — tracks current time + duration in cinema mode
  useEffect(() => {
    const vid = memory ? extractYouTubeId(memory.videoUrl) : null
    if (!isVideoPlaying || !vid) {
      if (ytTimerRef.current) { clearInterval(ytTimerRef.current); ytTimerRef.current = null }
      if (ytPlayerRef.current?.destroy) ytPlayerRef.current.destroy()
      ytPlayerRef.current = null
      setVideoCurrentTime(0)
      setVideoDuration(0)  
      return
    }

    const startPlayer = () => {
      if (!ytIframeRef.current) return
      if (ytPlayerRef.current) return
      ytPlayerRef.current = new (window as any).YT.Player(ytIframeRef.current, {
        events: {
          onReady: () => {
            ytTimerRef.current = setInterval(() => {
              const p = ytPlayerRef.current
              if (!p?.getDuration) return
              setVideoCurrentTime(Math.floor(p.getCurrentTime?.() ?? 0))
              setVideoDuration(Math.floor(p.getDuration?.() ?? 0))
            }, 500)
          },
        },
      })
    }

    const w = window as any
    if (w.YT?.Player) {
      setTimeout(startPlayer, 300)
    } else {
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
      }
      const prev = w.onYouTubeIframeAPIReady
      w.onYouTubeIframeAPIReady = () => {
        if (prev) prev()
        setTimeout(startPlayer, 300)
      }
    }

    return () => {
      if (ytTimerRef.current) { clearInterval(ytTimerRef.current); ytTimerRef.current = null }
      if (ytPlayerRef.current?.destroy) ytPlayerRef.current.destroy()
      ytPlayerRef.current = null
    }
  }, [isVideoPlaying, memory])

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  if (!memory) return null

  const videoId = extractYouTubeId(memory.videoUrl)
  const memoryHasVideo = hasVideo(memory)

  const handleSave = () => {
    if (!formData.title.trim()) return

    const updatedMemory = updateMemory(memory.category as CategoryType, 
      parseInt(memory.id.split('-')[1]), {
        question: formData.question,
        title: formData.title.trim(),
        description: formData.description.trim(),
        videoUrl: formData.videoUrl.trim() || null,
        sources: sources.filter(s => s.trim()),
        isFilled: true,
      }
    )

    if (updatedMemory && onMemoryUpdate) onMemoryUpdate(updatedMemory)
    setIsEditing(false)
  }

  const canSave = !!(formData.title.trim())

  // ===========================================================================
  // FILLED VIEW
  // ===========================================================================
  const renderFilledView = () => {
    const getFaviconUrl = (url: string) => {
      try {
        const domain = new URL(url).hostname
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
      } catch { return null }
    }

    const displayBlocks = deserializeBlocks(memory.description || '')

    const DescriptionContent = () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '32px', paddingRight: '4px' }}>
        {displayBlocks.map((block: Block, i: number) => {
          const base: React.CSSProperties = { fontFamily: "'Montserrat', sans-serif", textAlign: 'justify', color: 'rgba(0,0,0,0.88)', lineHeight: 1.7 }
          switch (block.type) {
            case 'h1':    return <p key={i} style={{ ...base, fontWeight: 800, fontSize: '17px' }}>{block.content}</p>
            case 'h2':    return <p key={i} style={{ ...base, fontWeight: 700, fontSize: '14px' }}>{block.content}</p>
            case 'h3':    return <p key={i} style={{ ...base, fontWeight: 700, fontSize: '13px', textDecoration: 'underline' }}>{block.content}</p>
            case 'ul':    return <p key={i} style={{ ...base, fontSize: '13px' }}>• {block.content}</p>
            case 'ol':    return <p key={i} style={{ ...base, fontSize: '13px' }}>{i + 1}. {block.content}</p>
            case 'quote': return <p key={i} style={{ ...base, fontSize: '13px', borderLeft: '3px solid #aaa', paddingLeft: '10px', color: '#555', fontStyle: 'italic' }}>{block.content}</p>
            default:      return <p key={i} style={{ ...base, fontSize: '13px' }}>{block.content}</p>
          }
        })}
      </div>
    )

    // -------------------------------------------------------------------------
    // CINEMA MODE
    // -------------------------------------------------------------------------
    if (isVideoPlaying) {
      return (
        <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', overflow: 'hidden', backgroundColor: '#EAEAEA' }}>
          <style>{`.custom-scrollbar-light::-webkit-scrollbar{width:5px}.custom-scrollbar-light::-webkit-scrollbar-track{background:transparent}.custom-scrollbar-light::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.5);border-radius:20px}`}</style>
          {/* YouTube iframe */}
          {videoId ? (
            <iframe
              ref={ytIframeRef}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', zIndex: 0 }}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`}
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 0 }}>
              <Play size={120} color="white" opacity={0.4} />
            </div>
          )}

          {/* Floating time */}
          <div style={{ position: 'absolute', top: '28px', left: '36px', fontFamily: 'monospace', fontSize: '22px', fontWeight: 900, letterSpacing: '0.08em', background: 'rgba(234,234,234,0.82)', padding: '2px 10px', borderRadius: '8px', backdropFilter: 'blur(6px)', zIndex: 20 }}>
            {formatTime(videoCurrentTime)}{videoDuration > 0 ? ` / ${formatTime(videoDuration)}` : ''}
          </div>

          {/* Floating badge + title */}
          <div style={{ position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20 }}>
            {memory.question && (
              <span style={{ background: QUESTION_COLORS[memory.question] || '#888', border: '3px solid black', borderRadius: '10px', padding: '6px 28px', fontFamily: 'monospace', fontWeight: 900, fontSize: '20px', boxShadow: '2px 2px 0 black', color: 'white' }}>
                {questionLabels[memory.question] || memory.question}
              </span>
            )}
            <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '18px', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '6px', background: 'rgba(234,234,234,0.82)', padding: '2px 10px', borderRadius: '8px', backdropFilter: 'blur(6px)' }}>
              {memory.title}
            </span>
          </div>

          {/* Toggle Résumé */}
          <button
            onClick={() => setIsResumeVisible((v) => !v)}
            style={{ position: 'absolute', top: '24px', right: '90px', height: '40px', padding: '0 16px', borderRadius: '20px', background: isResumeVisible ? '#EAEAEA' : '#4ade80', border: '3px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '2px 2px 0 black', zIndex: 20, fontFamily: 'monospace', fontWeight: 900, fontSize: '14px', textTransform: 'uppercase' }}
          >
            {isResumeVisible ? 'Fermer Résumé' : 'Ouvrir Résumé'}
          </button>

          {/* Exit cinema mode */}
          <button
            onClick={() => setIsVideoPlaying(false)}
            style={{ position: 'absolute', top: '24px', right: '36px', width: '40px', height: '40px', borderRadius: '50%', background: '#ff4d4d', border: '3px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '2px 2px 0 black', zIndex: 20 }}
          >
            <X size={18} strokeWidth={4} color="black" />
          </button>

          {/* Résumé right panel */}
          {isResumeVisible && (
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%', background: 'rgba(234,234,234,0.25)', padding: '32px 28px 28px 28px', display: 'flex', flexDirection: 'column', zIndex: 10, boxSizing: 'border-box' }}>
              <h3 style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '26px', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right', marginBottom: '24px', marginTop: '52px', color: 'white', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>Résumé</h3>
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '6px' }} className="custom-scrollbar-light">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '32px', paddingRight: '4px' }}>
                  {displayBlocks.map((block: Block, i: number) => {
                    const base: React.CSSProperties = { fontFamily: "'Montserrat', sans-serif", textAlign: 'justify', color: 'white', lineHeight: 1.7, textShadow: '0 1px 6px rgba(0,0,0,0.7)' }
                    switch (block.type) {
                      case 'h1':    return <p key={i} style={{ ...base, fontWeight: 800, fontSize: '17px' }}>{block.content}</p>
                      case 'h2':    return <p key={i} style={{ ...base, fontWeight: 700, fontSize: '14px' }}>{block.content}</p>
                      case 'h3':    return <p key={i} style={{ ...base, fontWeight: 700, fontSize: '13px', textDecoration: 'underline' }}>{block.content}</p>
                      case 'ul':    return <p key={i} style={{ ...base, fontSize: '13px' }}>• {block.content}</p>
                      case 'ol':    return <p key={i} style={{ ...base, fontSize: '13px' }}>{i + 1}. {block.content}</p>
                      case 'quote': return <p key={i} style={{ ...base, fontSize: '13px', borderLeft: '3px solid rgba(255,255,255,0.5)', paddingLeft: '10px', color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' }}>{block.content}</p>
                      default:      return <p key={i} style={{ ...base, fontSize: '13px' }}>{block.content}</p>
                    }
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )
    }

    // -------------------------------------------------------------------------
    // STANDARD VIEW
    // -------------------------------------------------------------------------
    return (
      <div style={{ width: '100%', height: '100%', backgroundColor: '#EAEAEA', padding: '28px 32px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
        <style>{`.custom-scrollbar::-webkit-scrollbar{width:6px}.custom-scrollbar::-webkit-scrollbar-track{background:transparent}.custom-scrollbar::-webkit-scrollbar-thumb{background:#000;border-radius:20px}`}</style>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          {/* MODIFIER */}
          <button
            onClick={() => setIsEditing(true)}
            style={{ background: 'white', border: '3px solid black', borderRadius: '12px', padding: '8px 22px', fontFamily: 'monospace', fontWeight: 700, fontSize: '14px', cursor: 'pointer', boxShadow: '2px 2px 0 black', textTransform: 'uppercase', transition: 'transform 0.1s, box-shadow 0.1s' }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(1px)'; e.currentTarget.style.boxShadow = '1px 1px 0 black' }}
            onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '2px 2px 0 black' }}
          >
            Modifier
          </button>

          {/* Badge + Title */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {memory.question && (
              <span style={{ background: QUESTION_COLORS[memory.question] || '#888', border: '3px solid black', borderRadius: '10px', padding: '6px 28px', fontFamily: 'monospace', fontWeight: 900, fontSize: '20px', boxShadow: '2px 2px 0 black', color: 'white' }}>
                {questionLabels[memory.question] || memory.question}
              </span>
            )}
            <h2 style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '18px', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '8px' }}>{memory.title}</h2>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ff4d4d', border: '3px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '2px 2px 0 black', flexShrink: 0 }}
            onMouseOver={e => { e.currentTarget.style.background = '#ff3333'; e.currentTarget.style.transform = 'scale(1.05)' }}
            onMouseOut={e => { e.currentTarget.style.background = '#ff4d4d'; e.currentTarget.style.transform = 'none' }}
          >
            <X size={18} strokeWidth={4} color="black" />
          </button>
        </div>

        {/* Two-column body */}
        <div style={{ flex: 1, display: 'flex', gap: '40px', minHeight: 0 }}>

          {/* LEFT: Gallery + Sources + Video */}
          <div style={{ width: '55%', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: 0 }}>

            {/* Gallery + Sources row */}
            <div style={{ display: 'flex', gap: '28px', flexShrink: 0 }}>
              {/* Gallery */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '22px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Gallery</h3>
                <div
                  onClick={() => {}}
                  style={{ width: '160px', height: '160px', border: '4px solid black', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
                >
                  {image ? (
                    <img src={image} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Plus size={56} strokeWidth={2} color="black" />
                  )}
                </div>
              </div>

              {/* Sources */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '22px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Sources</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(memory.sources || []).filter(s => s.trim()).map((src, i) => (
                    <a
                      key={i}
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', height: '48px', padding: '0 16px', borderRadius: '9999px', border: '3px solid black', background: 'transparent', overflow: 'hidden', boxSizing: 'border-box', textDecoration: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.06)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {getFaviconUrl(src) && <img src={getFaviconUrl(src)!} alt="" style={{ width: '18px', height: '18px', marginRight: '10px', borderRadius: '3px', flexShrink: 0 }} />}
                      <ChevronRight size={16} strokeWidth={4} color="black" style={{ marginRight: '6px', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'black' }}>{src}</span>
                    </a>
                  ))}
                  {(memory.sources || []).filter(s => s.trim()).length === 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', height: '48px', padding: '0 16px', borderRadius: '9999px', border: '3px solid #d1d5db', background: 'transparent', boxSizing: 'border-box' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#aaa' }}>Aucune source</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Video player */}
            <div
              onClick={() => memoryHasVideo && setIsVideoPlaying(true)}
              style={{ flex: 1, border: '4px solid black', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: memoryHasVideo ? 'pointer' : 'default', background: '#d0d0d0', position: 'relative', overflow: 'hidden', minHeight: 0, transition: 'background 0.15s' }}
              onMouseEnter={e => { if (memoryHasVideo) e.currentTarget.style.background = 'rgba(0,0,0,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#d0d0d0' }}
            >
              {videoId && (
                <img src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
              )}
              <Play size={90} strokeWidth={1} fill="white" color="white" style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))', transition: 'transform 0.2s' }} />
            </div>

            {/* VIDEO URL row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>
              <span>Video URL:</span>
              <span style={{ color: 'black', margin: '0 32px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{memory.videoUrl || 'Aucune vidéo'}</span>
              <span style={{ color: 'black' }}>00:00:00</span>
            </div>
          </div>

          {/* RIGHT: Résumé */}
          <div style={{ width: '45%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <h3 style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '22px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', marginBottom: '20px', flexShrink: 0 }}>Résumé</h3>
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', minHeight: 0 }} className="custom-scrollbar">
              <DescriptionContent />
            </div>
          </div>

        </div>
      </div>
    )
  }

  // ===========================================================================
  // EDIT VIEW
  // ===========================================================================
  const renderEditView = () => {
    const wordCount = formData.description.split(/\s+/).filter(Boolean).length;
    
    return (
      <div className="w-full h-full bg-[#D9D9D9] relative" style={{ boxSizing: 'border-box', overflow: 'hidden' }}>

        {/* MEMO Header — 10% from top */}
        <div className="absolute left-0 right-0 flex justify-center" style={{ left: '50%', top: '7.5%', transform: 'translateX(-50%) translateY(-50%)' }}>
          <h2 className="text-6xl md:text-7xl text-white text-center uppercase tracking-widest drop-shadow-sm font-bold" style={{ fontFamily: "'Jersey 15', sans-serif",fontSize: '50px' }}>
            MEMO
          </h2>
        </div>

        {/* Categories — 20% from top */}
        <div className="absolute flex flex-wrap justify-center items-center left-[10%] right-[10%]" style={{ top: '17.5%', transform: 'translateY(-50%)', gap: '5%' }}>
          {QUESTION_ORDER.map((q) => {
            const color = QUESTION_COLORS[q] || '#888888'
            const isSelected = formData.question === q
            return (
              <button
                key={q}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, question: q }))}
                className="cursor-pointer uppercase text-white font-bold tracking-wide shadow-sm transition-transform hover:scale-105"
                  style={{ 
                    backgroundColor: color,
                    fontFamily: "'Jersey 15', sans-serif",
                    fontSize: '25px',
                    opacity: isSelected ? 1 : 0.6,
                    borderRadius: '12px',
                    padding: '10px 30px',
                    border: '4px solid black',
                }}
              >
                {questionLabels[q] || q}
              </button>
            )
          })}
        </div>

        {/* Title Row — 30% from top */}
        <div className="absolute" style={{ top: '30%', left: '10%', right: '10%', transform: 'translateY(-50%)' }}>
          <span className="absolute left-0 top-1/2 font-bold text-black uppercase tracking-widest whitespace-nowrap" style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '35px', transform: 'translateY(-50%)' }}>
            TITRE :
          </span>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="SANS TITRE"
            className="font-bold bg-transparent border-none outline-none text-center uppercase tracking-widest w-full text-black placeholder:text-black/50"
            style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '30px' }}
          />
        </div>

        {/* Image | Résumé | Sources area */}
        <div className="absolute left-[5%] right-[5%]" style={{ top: '35%', bottom: '19%' }}>
          <div style={{
            width: '100%', height: '100%',
            background: 'white',
            border: '4px solid black',
            borderRadius: '28px',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            gap: 0,
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}>

            {/* IMAGE */}
            <div style={{ flex: '0 0 22%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '4px' }}>
              <h3 style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: 700, marginBottom: '14px', letterSpacing: '0.05em' }}>Image</h3>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '70%', aspectRatio: '1/1',
                  border: '4px solid black',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative', overflow: 'hidden',
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {image ? (
                  <>
                    <img src={image} alt="Uploadé" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0 }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                      <ImageIcon color="white" size={24} />
                    </div>
                  </>
                ) : (
                  <Plus size={40} color="black" strokeWidth={3} />
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
            </div>

            {/* SEPARATOR */}
            <div style={{ width: '3px', backgroundColor: 'black', borderRadius: '99px', margin: '12px 20px', flexShrink: 0 }} />

            {/* RÉSUMÉ */}
            <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4px', minWidth: 0 }}>
              <h3 style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: 700, marginBottom: '14px', letterSpacing: '0.05em' }}>Résumé</h3>
              <div style={{ width: '100%', flex: 1, position: 'relative', overflow: 'hidden' }}>
                <RichTextEditor
                  value={formData.description}
                  onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                  maxWords={400}
                  placeholder='Tapez "/" pour les commandes…'
                />
              </div>
            </div>

            {/* SEPARATOR */}
            <div style={{ width: '3px', backgroundColor: 'black', borderRadius: '99px', margin: '12px 20px', flexShrink: 0 }} />

            {/* SOURCES */}
            <div style={{ flex: '0 0 28%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4px' }}>
              <h3 style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: 700, marginBottom: '14px', letterSpacing: '0.05em' }}>Sources</h3>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sources.map((source, index) => {
                  const isActive = source.length > 0
                  return (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        padding: '8px 14px',
                        borderRadius: '9999px',
                        border: `3px solid ${isActive ? '#000' : '#d1d5db'}`,
                        transition: 'border-color 0.15s',
                        boxSizing: 'border-box',
                        backgroundColor: isActive ? 'white' : '#f9fafb',
                      }}
                    >
                      {index === 0 && (
                        <>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'black', marginRight: 6, flexShrink: 0 }} />
                          <ChevronRight size={16} strokeWidth={3} style={{ marginRight: 2, marginLeft: -4, flexShrink: 0 }} />
                        </>
                      )}
                      {index > 0 && isActive && (
                        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'black', marginRight: 6, flexShrink: 0 }} />
                      )}
                      <input
                        type="text"
                        value={source}
                        onChange={(e) => {
                          const newSources = [...sources]
                          newSources[index] = e.target.value
                          setSources(newSources)
                        }}
                        style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontFamily: "'Montserrat', sans-serif", fontSize: '13px' }}
                        placeholder={`Source ${index + 1}`}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>

        {/* VIDEO URL + word count — above buttons */}
        <div className="absolute left-[10%] right-[10%] flex flex-row justify-between items-center" style={{ bottom: 'calc(7.5% + 56px + 10px)' }}>
          <div className="flex items-center w-full flex-1 mr-4">
            <span className="font-black uppercase text-[#FF3B30] whitespace-nowrap" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '24px' }}>
              VIDEO URL:
            </span>
            <input
              type="text"
              value={formData.videoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
              placeholder="HTTPS://..."
              className="flex-1 mx-4 bg-transparent border-none text-center text-black outline-none w-full placeholder:text-black/30"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '20px', fontWeight: 600 }}
            />
          </div>
          <span className="text-3xl md:text-4xl text-black font-bold whitespace-nowrap" style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '35px' }}>
            {wordCount}/400
          </span>
        </div>

        {/* Action Buttons — 10% from bottom */}
        <div className="absolute flex" style={{ bottom: '7.5%', left: '50%', transform: 'translateX(-50%)', gap: '30px' }}>
          <button
            type="button"
            onClick={() => {
              if (memory.isFilled) setIsEditing(false)
              else onClose()
            }}
            style={{ 
              padding: '12px 40px', 
              borderRadius: '16px', 
              backgroundColor: '#444', 
              color: 'white', 
              fontSize: '32px', 
              fontFamily: "'Jersey 15', sans-serif", 
              border: '4px solid black', 
              cursor: 'pointer',
              boxShadow: '0 4px 0px rgba(0,0,0,1)',
              transition: 'transform 0.1s, box-shadow 0.1s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(2px)'
              e.currentTarget.style.boxShadow = '0 2px 0px rgba(0,0,0,1)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '0 4px 0px rgba(0,0,0,1)'
            }}
          >
            ANNULER
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            style={{ 
              padding: '12px 40px', 
              borderRadius: '16px', 
              backgroundColor: !canSave ? 'rgba(255,255,255,0.4)' : 'white', 
              color: !canSave ? 'rgba(0,0,0,0.4)' : 'black', 
              fontSize: '32px', 
              fontFamily: "'Jersey 15', sans-serif", 
              border: !canSave ? '4px solid rgba(0,0,0,0.2)' : '4px solid black', 
              cursor: !canSave ? 'not-allowed' : 'pointer',
              boxShadow: !canSave ? 'none' : '0 4px 0px rgba(0,0,0,1)',
              transition: 'transform 0.1s, box-shadow 0.1s'
            }}
            onMouseOver={(e) => {
              if (canSave) {
                e.currentTarget.style.transform = 'translateY(2px)'
                e.currentTarget.style.boxShadow = '0 2px 0px rgba(0,0,0,1)'
              }
            }}
            onMouseOut={(e) => {
              if (canSave) {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 4px 0px rgba(0,0,0,1)'
              }
            }}
          >
            SAUVEGARDER
          </button>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          style={customStyles}
          closeTimeoutMS={200}
          contentLabel={memory.title || "Memory Modal"}
          shouldCloseOnOverlayClick={true}
          shouldCloseOnEsc={true}
          ariaHideApp={false}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative flex flex-col shadow-2xl w-full"
            style={{
              height: '85vh',
              backgroundColor: '#D9D9D9',
              border: isEditing ? '6px solid #FF3B30' : `6px solid ${borderColor}`,
              borderRadius: '26px',
              overflow: 'hidden',
              overflowX: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            {/* Close Button — only shown in edit mode; filled view has its own */}
            {isEditing && (
            <button
              onClick={onClose}
              style={{ 
                position: 'absolute', 
                top: '24px', 
                right: '24px', 
                zIndex: 100,
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FF4B4B',
                border: '3px solid black',
                cursor: 'pointer',
                boxShadow: '0 4px 0px rgba(0,0,0,1)',
                transition: 'transform 0.1s, box-shadow 0.1s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#ff3333'
                e.currentTarget.style.transform = 'translateY(2px)'
                e.currentTarget.style.boxShadow = '0 2px 0px rgba(0,0,0,1)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#FF4B4B'
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 4px 0px rgba(0,0,0,1)'
              }}
              aria-label="Close modal"
              type="button"
            >
              <X size={24} color="white" strokeWidth={3} />
            </button>
            )}
            
            {/* Main Content Area */}
            <div className="w-full flex-1 flex flex-col overflow-y-auto" style={{ overflowX: 'hidden' }}>
              {isEditing ? renderEditView() : (memory.isFilled ? renderFilledView() : renderEditView())}
            </div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
}