import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play } from 'lucide-react'
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
  index: _index,
  onMemoryUpdate,
}: MemoryModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [inlineUrl, setInlineUrl] = useState('')
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
      setInlineUrl(memory.videoUrl || '')
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

  /** Split text into N roughly equal chunks by character count */
  const chunkText = (text: string, chunks: number): string[] => {
    if (!text) return Array(chunks).fill('')
    const chunkSize = Math.ceil(text.length / chunks)
    const result: string[] = []
    for (let i = 0; i < chunks; i++) {
      result.push(text.slice(i * chunkSize, (i + 1) * chunkSize))
    }
    return result
  }

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
  const renderFilledView = () => {
    const descChunks = chunkText(memory.description || '', 4)
    const rowOpacities = [1, 0.75, 0.5, 0.25]

    return (
      <div className="w-full h-full" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#D9D9D9', flex: 1, height: '100%', minHeight: '100%' }}>

        {/* Background layer: thumbnail at 25% opacity or iframe at 100% */}
        {memoryHasVideo && videoId ? (
          isVideoPlaying ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', zIndex: 0 }}
            />
          ) : (
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt={memory.title}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: 0.25 }}
            />
          )
        ) : (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#D9D9D9', zIndex: 0 }} />
        )}

        {/* Overlay content – hidden while video plays */}
        {!isVideoPlaying && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', zIndex: 20 }}>

            {/* Top Left: Modifier button */}
            {memory.isFilled && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="bg-white text-black font-bold border-none cursor-pointer shadow-lg"
                style={{
                  position: 'absolute',
                  top: '6%', 
                  left: '6%',
                  padding: '12px 30px',
                  borderRadius: '30px',
                  fontFamily: "'Montserrat', sans-serif", 
                  fontSize: '22px',
                  zIndex: 30
                }}
                type="button"
              >
                Modifier
              </motion.button>
            )}

            {/* Top Center: Question badge + Title */}
            <div style={{ position: 'absolute', top: '9%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', pointerEvents: 'none', zIndex: 30 }}>
              {memory.question && (
                <span
                  className="text-white font-bold uppercase"
                  style={{
                    fontFamily: "'Jersey 15', sans-serif",
                    fontSize: '32px',
                    padding: '8px 40px',
                    backgroundColor: QUESTION_COLORS[memory.question] || '#888',
                    border: '4px solid black',
                    borderRadius: '12px',
                    pointerEvents: 'auto'
                  }}
                >
                  {memory.question}
                </span>
              )}
              <h2
                className="text-black uppercase drop-shadow-sm"
                style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '48px', lineHeight: 1.1, marginTop: '8px', textAlign: 'center', pointerEvents: 'auto' }}
              >
                {memory.title}
              </h2>
            </div>

            {/* Center: Play button */}
            {memoryHasVideo && (
              <div
                 className="cursor-pointer"
                 style={{
                   position: 'absolute',
                   top: '50%',
                   left: '50%',
                   transform: 'translate(-50%, -50%)',
                   zIndex: 40
                 }}
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play
                  size={100}
                  fill="white"
                  color="white"
                  className="drop-shadow-2xl hover:scale-110 transition-transform"
                />
              </div>
            )}

            {/* Bottom Area: Fading text lines + URL row */}
            <div style={{ position: 'absolute', bottom: '6%', left: '6%', right: '6%', display: 'flex', flexDirection: 'column', zIndex: 30 }}>
              
              {/* Description notepad area */}
              <div 
                className="w-full text-black overflow-hidden"
                style={{ 
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: '22px',
                  lineHeight: '2.5rem',
                  height: 'calc(4 * 2.5rem)',
                  backgroundImage: 'linear-gradient(transparent, transparent calc(2.5rem - 1.5px), rgba(0,0,0,0.8) calc(2.5rem - 1.5px), rgba(0,0,0,0.8) 2.5rem)',
                  backgroundSize: '100% 2.5rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  // Fading out at the bottom
                  WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
                }}
              >
                {memory.description}
              </div>

              {/* URL Row */}
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '24px' }}>
                <span
                  className="font-black uppercase text-black whitespace-nowrap"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '24px' }}
                >
                  VIDEO URL:
                </span>
                <input
                  type="text"
                  value={inlineUrl}
                  onChange={(e) => setInlineUrl(e.target.value)}
                  onBlur={() => {
                    const trimmed = inlineUrl.trim()
                    const updatedMemory = updateMemory(
                      memory.category as CategoryType,
                      parseInt(memory.id.split('-')[1]),
                      { videoUrl: trimmed || null }
                    )
                    if (updatedMemory && onMemoryUpdate) onMemoryUpdate(updatedMemory)
                  }}
                  className="flex-1 mx-4 bg-transparent border-none text-center text-black outline-none w-full"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '20px', fontWeight: 600 }}
                />
                <span
                  className="font-black uppercase text-white bg-black/30 rounded px-3 py-1 whitespace-nowrap"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '20px' }}
                >
                  1:18:36
                </span>
              </div>
            </div>

          </div>
        )}
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
                {q}
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
        <div className="absolute flex" style={{ bottom: '7.5%', left: '50%', transform: 'translateX(-50%)', gap: '20%' }}>
          <button
            type="button"
            onClick={() => {
              if (memory.isFilled) setIsEditing(false)
              else onClose()
            }}
            className="bg-white text-black rounded-full font-bold uppercase tracking-widest cursor-pointer hover:bg-gray-100 transition-colors shadow-sm border-2 border-black/10"
            style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '40px', padding: '10px 56px' }}
          >
            ANNULER
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!formData.question || !formData.title.trim()}
            className="bg-black text-white rounded-full font-bold uppercase tracking-widest cursor-pointer hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border-2 border-transparent"
            style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '40px', padding: '10px 50px' }}
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
              backgroundColor: '#D9D9D9',
              border: isEditing ? '6px solid #FF3B30' : `6px solid ${borderColor}`,
              borderRadius: '26px',
              overflow: 'hidden',
              overflowX: 'hidden',
              boxSizing: 'border-box',
            }}
          >
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