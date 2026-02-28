import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { extractYouTubeId, hasVideo, updateMemory } from '../data/memories'
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
}

interface FormData {
  question: WhQuestion | null
  title: string
  videoUrl: string
  description: string
}

// =============================================================================
// QUESTION COLORS
// =============================================================================

const QUESTION_COLORS: Record<string, string> = {
  'QUI?': '#F59E0B',
  'QUOI?': '#FACC15',
  'OU?': '#84CC16',
  'QUAND?': '#10B981',
  'COMMENT?': '#0EA5E9',
  'COMBIEN?': '#4F46E5',
  'POURQUOI?': '#8B5CF6',
}

const QUESTION_ORDER: WhQuestion[] = [
  'QUI?',
  'QUOI?',
  'OU?',
  'QUAND?',
  'COMMENT?',
  'COMBIEN?',
  'POURQUOI?',
]

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
  index: _index,
  onMemoryUpdate,
}: MemoryModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    question: null,
    title: '',
    videoUrl: '',
    description: '',
  })

  useEffect(() => {
    if (memory) {
      setFormData({
        question: memory.question,
        title: memory.isFilled ? memory.title : '',
        videoUrl: memory.videoUrl || '',
        description: memory.isFilled ? memory.description : '',
      })
      setIsEditing(!memory.isFilled)
      setIsVideoPlaying(false)
    }
  }, [memory, isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!memory) return null

  const videoId = extractYouTubeId(memory.videoUrl)
  const memoryHasVideo = hasVideo(memory)

  const handleSave = () => {
    if (!formData.question || !formData.title.trim()) return

    const updatedMemory = updateMemory(memory.category as CategoryType, 
      parseInt(memory.id.split('-')[1]), {
        question: formData.question,
        title: formData.title.trim(),
        description: formData.description.trim(),
        videoUrl: formData.videoUrl.trim() || null,
        isFilled: true,
      }
    )

    if (updatedMemory && onMemoryUpdate) onMemoryUpdate(updatedMemory)
    setIsEditing(false)
  }

  // ===========================================================================
  // FILLED VIEW
  // ===========================================================================
  const renderFilledView = () => (
    <div className="relative w-full flex flex-col" style={{ height: '85vh', overflow: 'hidden' }}>

      {/* Background layer: thumbnail stretched to full container */}
      {memoryHasVideo && videoId ? (
        isVideoPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-none z-0"
          />
        ) : (
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={memory.title}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        )
      ) : (
        <div className="absolute inset-0 w-full h-full bg-[#2a2a2e] z-0" />
      )}

      {/* 25% black overlay – always on top of background, below content */}
      {!isVideoPlaying && (
        <div className="absolute inset-0 z-10" style={{ backgroundColor: 'rgba(0,0,0,0.25)' }} />
      )}

      {/* Overlay content – hidden while video plays */}
      {!isVideoPlaying && (
        <div className="relative z-20 flex flex-col justify-between h-full px-12 py-10">

          {/* Top: URL */}
          <div className="flex justify-center">
            {memory.videoUrl ? (
              <a
                href={memory.videoUrl.startsWith('http') ? memory.videoUrl : `https://www.youtube.com/watch?v=${memory.videoUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/80 hover:text-white underline drop-shadow-md truncate max-w-lg"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {memory.videoUrl}
              </a>
            ) : (
              <span className="text-xs text-white/40 italic" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Aucune vidéo
              </span>
            )}
          </div>

          {/* Center: play button */}
          {memoryHasVideo && (
            <div className="flex justify-center">
              <button
                onClick={() => setIsVideoPlaying(true)}
                className="w-24 h-16 bg-white/90 hover:bg-white rounded-2xl flex items-center justify-center transition-all shadow-xl cursor-pointer border-none"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-black ml-2">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          )}

          {/* Bottom: question / answer + description */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end w-full">
              <div className="flex flex-col items-start w-1/2">
                <span className="text-xs uppercase tracking-widest text-white/80 font-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  QUESTION
                </span>
                <h2 className="text-4xl sm:text-5xl text-white leading-none mt-1 drop-shadow-lg" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
                  {memory.question || '?'}
                </h2>
              </div>
              <div className="flex flex-col items-end text-right w-1/2">
                <span className="text-xs uppercase tracking-widest text-white/80 font-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  RÉPONSE
                </span>
                <h2 className="text-4xl sm:text-5xl text-white leading-none mt-1 drop-shadow-lg truncate w-full" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
                  {memory.title}
                </h2>
              </div>
            </div>
            {memory.description && (
              <p className="text-sm text-white/90 leading-relaxed line-clamp-3 drop-shadow-md" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {memory.description}
              </p>
            )}
          </div>

        </div>
      )}
    </div>
  )

  // ===========================================================================
  // EDIT VIEW
  // ===========================================================================
  const renderEditView = () => {
    const wordCount = formData.description.split(/\s+/).filter(Boolean).length;
    
    return (
      <div className="w-full h-full bg-[#D9D9D9] relative" style={{ boxSizing: 'border-box', overflow: 'hidden' }}>

        {/* Top section — header + categories + title */}
        <div className="flex flex-col items-center px-[10%] pt-10" style={{ boxSizing: 'border-box' }}>

          {/* MEMO Header */}
          <h2 className="text-6xl md:text-7xl text-white mb-6 text-center uppercase tracking-widest drop-shadow-sm font-bold" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
            MEMO
          </h2>

          {/* Categories */}
          <div className="flex flex-wrap justify-center items-center mb-8 w-full" style={{ gap: '5%' }}>
            {QUESTION_ORDER.map((q) => {
              const color = QUESTION_COLORS[q] || '#888888'
              const isSelected = formData.question === q
              return (
                <button
                  key={q}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, question: q }))}
                  className="px-6 py-2 border-[3px] border-black cursor-pointer uppercase text-white font-bold tracking-wide text-4xl md:text-5xl shadow-sm transition-transform hover:scale-105"
                  style={{ 
                    backgroundColor: color,
                    fontFamily: "'Jersey 15', sans-serif",
                    opacity: isSelected ? 1 : 0.6,
                    borderRadius: '9px',
                  }}
                >
                  {q}
                </button>
              )
            })}
          </div>

          {/* Title Row */}
          <div className="flex flex-row items-center w-full mb-6">
            <div className="w-1/4 flex justify-start">
              <span className="text-3xl md:text-4xl font-bold text-black uppercase tracking-widest" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
                TITRE :
              </span>
            </div>
            <div className="w-2/4 flex justify-center">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="SANS TITRE"
                className="text-3xl md:text-4xl font-bold bg-transparent border-none outline-none text-center uppercase tracking-widest w-full text-black placeholder:text-black/50"
                style={{ fontFamily: "'Jersey 15', sans-serif" }}
              />
            </div>
            <div className="w-1/4" />
          </div>
        </div>

        {/* Centered notepad area */}
        <div className="absolute left-[10%] right-[10%]" style={{ top: '50%', transform: 'translateY(-50%)' }}>
          <textarea
            value={formData.description}
            onChange={(e) => {
              const words = e.target.value.split(/\s+/).filter(Boolean)
              if (words.length <= 400) {
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
            }}
            className="w-full bg-transparent border-0 outline-none resize-none text-lg md:text-xl font-medium"
            style={{ 
              fontFamily: "'Montserrat', sans-serif",
              color: '#1a1a1a',
              lineHeight: '3rem',
              height: 'calc(4 * 3rem)',
              overflowY: 'auto',
              overflowX: 'hidden',
              display: 'block',
              backgroundImage: 'linear-gradient(transparent, transparent calc(3rem - 1px), #888 calc(3rem - 1px), #888 3rem)',
              backgroundSize: '100% 3rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* VIDEO URL + word count — above buttons */}
        <div className="absolute left-[10%] right-[10%] flex flex-row justify-between items-center" style={{ bottom: 'calc(10% + 60px)' }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl md:text-4xl text-[#FF3B30] uppercase tracking-wide font-bold whitespace-nowrap" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
              VIDEO URL:
            </span>
            <input
              type="text"
              value={formData.videoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
              placeholder="https://..."
              className="bg-transparent border-none outline-none text-lg md:text-xl w-full text-black placeholder:text-black/30"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            />
          </div>
          <span className="text-3xl md:text-4xl text-black font-bold whitespace-nowrap" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
            {wordCount}/400
          </span>
        </div>

        {/* Action Buttons — 10% from bottom */}
        <div className="absolute flex gap-6 sm:gap-12" style={{ bottom: '10%', left: '50%', transform: 'translateX(-50%)' }}>
          <button
            type="button"
            onClick={() => {
              if (memory.isFilled) setIsEditing(false)
              else onClose()
            }}
            className="px-8 md:px-12 py-2 md:py-3 bg-white text-black rounded-full font-bold uppercase tracking-widest cursor-pointer hover:bg-gray-100 transition-colors text-xl md:text-2xl shadow-sm border-2 border-black/10"
            style={{ fontFamily: "'Jersey 15', sans-serif" }}
          >
            ANNULER
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!formData.question || !formData.title.trim()}
            className="px-8 md:px-12 py-2 md:py-3 bg-black text-white rounded-full font-bold uppercase tracking-widest cursor-pointer hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xl md:text-2xl shadow-sm border-2 border-transparent"
            style={{ fontFamily: "'Jersey 15', sans-serif" }}
          >
            CONFIRMER
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
              backgroundColor: isEditing ? '#D9D9D9' : 'transparent',
              border: isEditing ? '6px solid #FF3B30' : `6px solid ${borderColor}`,
              borderRadius: '24px',
              overflow: 'hidden',
              overflowX: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            {/* Modifier Button */}
            {memory.isFilled && !isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="absolute z-50 cursor-pointer bg-white/95 hover:bg-white text-black shadow-xl rounded-full border border-black/10 transition-colors"
                style={{ top: '20px', left: '20px', padding: '8px 24px', fontSize: '1rem', fontWeight: '600', fontFamily: "'Montserrat', sans-serif" }}
                type="button"
              >
                Modifier
              </motion.button>
            )}

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute z-50 cursor-pointer bg-[#FF3B30] w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-transform"
              style={{ top: '16px', right: '16px' }}
              aria-label="Close modal"
              type="button"
            >
              <X size={28} strokeWidth={4} className="text-white" />
            </motion.button>
            
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