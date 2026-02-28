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

// Order for display
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem', // increased padding to ensure border isn't clipped
  },
  content: {
    display: 'flex', 
    flexDirection: 'column', 
    position: 'relative',
    inset: 'auto',
    width: '100%',
    maxWidth: '56rem', // max-w-4xl (approx 900px, responsive via 100% width)
    maxHeight: '90vh',
    height: 'auto',
    padding: 0,
    border: 'none',
    background: 'transparent',
    overflow: 'visible',
    borderRadius: 0,
    boxSizing: 'border-box',
  },
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8, 
    y: 50,
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: 'spring' as const,
      damping: 25,
      stiffness: 300,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 30,
    transition: {
      duration: 0.2,
    },
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

  // Reset form when memory changes or modal opens
  useEffect(() => {
    if (memory) {
      setFormData({
        question: memory.question,
        title: memory.isFilled ? memory.title : '',
        videoUrl: memory.videoUrl || '',
        description: memory.isFilled ? memory.description : '',
      })
      // Auto-open edit mode for empty memories
      setIsEditing(!memory.isFilled)
      setIsVideoPlaying(false)
    }
  }, [memory, isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!memory) return null

  const videoId = extractYouTubeId(memory.videoUrl)
  const memoryHasVideo = hasVideo(memory)

  // Handle form submission
  const handleSave = () => {
    if (!formData.question || !formData.title.trim()) {
      return // Don't save if required fields are empty
    }

    const updatedMemory = updateMemory(memory.category as CategoryType, 
      parseInt(memory.id.split('-')[1]), {
        question: formData.question,
        title: formData.title.trim(),
        description: formData.description.trim(),
        videoUrl: formData.videoUrl.trim() || null,
        isFilled: true,
      }
    )

    if (updatedMemory && onMemoryUpdate) {
      onMemoryUpdate(updatedMemory)
    }

    setIsEditing(false)
  }

  // Render the filled memory view (display mode)
  const renderFilledView = () => (
    <div className="relative w-full aspect-video min-h-[400px] flex flex-col overflow-hidden rounded-xl bg-[#2a2a2e]">
      
      {/* Background - Video Thumbnail & 25% Overlay */}
      <div className="absolute inset-0 z-0">
        {memoryHasVideo && videoId ? (
          isVideoPlaying ? (
            <iframe 
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} 
              allow="autoplay; encrypted-media; fullscreen" 
              allowFullScreen 
              className="absolute inset-0 w-full h-full border-none z-30" 
            />
          ) : (
            <>
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt={memory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/25 z-0" />
            </>
          )
        ) : (
          <div 
            className="w-full h-full"
            style={{ backgroundColor: '#2a2a2e' }}
          />
        )}
      </div>

      {/* Main Content Wrapper - with generous padding */}
      {!isVideoPlaying && (
        <div className="relative z-10 flex-1 flex flex-col p-8 sm:p-12 justify-between h-full">
          
          {/* Top: YouTube Link */}
          <div className="text-center flex flex-col items-center">
            <span 
              className="text-xl text-white font-bold tracking-wide drop-shadow-md"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Youtube link:
            </span>
            {memory.videoUrl && (
              <a 
                href={memory.videoUrl.startsWith('http') ? memory.videoUrl : `https://www.youtube.com/watch?v=${memory.videoUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-white/90 hover:text-white underline mt-1 truncate max-w-md drop-shadow-md"
              >
                {memory.videoUrl.startsWith('http') ? memory.videoUrl : `https://www.youtube.com/watch?v=${memory.videoUrl}`}
              </a>
            )}
          </div>

          {/* Center: Absolute Centered Play Button */}
          {memoryHasVideo && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <button
                onClick={() => setIsVideoPlaying(true)}
                className="w-24 h-16 bg-white/90 hover:bg-white rounded-2xl flex items-center justify-center transition-all shadow-xl cursor-pointer border-none"
              >
                {/* Simple Play Icon */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-black ml-2">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          )}

          {/* Bottom: Question, Response & Description */}
          <div className="mt-auto flex flex-col w-full z-20">
            
            {/* Question and Response Row */}
            <div className="flex justify-between items-end w-full mb-4">
              
              {/* Left: Question */}
              <div className="flex flex-col items-start">
                <span 
                  className="text-sm uppercase tracking-widest text-white drop-shadow-md font-black"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
                >
                  QUESTION
                </span>
                <h2 
                  className="text-[48px] text-white leading-none mt-1 drop-shadow-lg"
                  style={{ fontFamily: "'Jersey 15', sans-serif" }}
                >
                  {memory.question || 'Comment ?'}
                </h2>
              </div>

              {/* Right: Response */}
              <div className="flex flex-col items-end text-right">
                <span 
                  className="text-sm uppercase tracking-widest text-white drop-shadow-md font-black"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
                >
                  RÉPONSE
                </span>
                <h2 
                  className="text-[48px] text-white leading-none mt-1 drop-shadow-lg"
                  style={{ fontFamily: "'Jersey 15', sans-serif" }}
                >
                  {memory.title}
                </h2>
              </div>
            </div>

            {/* Description (400 words max limit style) */}
            <div className="text-left mt-2">
              <p 
                className="text-sm text-white/90 leading-relaxed line-clamp-4 drop-shadow-md"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {memory.description}
              </p>
            </div>
            
          </div>
        </div>
      )}
    </div>
  )

  // Render the edit/create form (MEMO style)
  const renderEditView = () => (
    <div className="w-full h-full flex flex-col" style={{ padding: '0' }}>
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto w-full flex flex-col items-center px-4 sm:px-12 pt-8 pb-2">
        {/* MEMO Title */}
        <h2 
          className="text-5xl text-white mb-6 text-center uppercase tracking-wider font-bold"
          style={{ 
            fontFamily: "'Jersey 15', sans-serif"
          }}
        >
          MEMO
        </h2>

        {/* Question Buttons - wrapped and centered */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-8 w-full max-w-full">
          {QUESTION_ORDER.map((q) => {
            const color = QUESTION_COLORS[q] || '#888888'
            const isSelected = formData.question === q
            return (
              <button
                key={q}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, question: q }))}
                className="px-4 sm:px-5 py-2 rounded-full cursor-pointer uppercase text-white font-bold tracking-wide text-xs sm:text-sm whitespace-nowrap"
                style={{ 
                  backgroundColor: color,
                  fontFamily: "'Jersey 15', sans-serif",
                  border: isSelected ? '4px solid #000' : '4px solid #000',
                  opacity: isSelected ? 1 : 0.7,
                  flexShrink: 1,
                  minWidth: '0', 
                }}
              >
                {q}
              </button>
            )
          })}
        </div>

        {/* Title Row */}
        <div className="flex items-center justify-start gap-4 mb-6 w-full max-w-3xl overflow-hidden box-border">
          <span 
            className="text-2xl sm:text-3xl font-bold text-black uppercase tracking-wide whitespace-nowrap"
            style={{ fontFamily: "'Jersey 15', sans-serif" }}
          >
            TITRE :
          </span>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="SANS TITRE"
            className="text-2xl sm:text-3xl font-bold bg-transparent border-none outline-none uppercase tracking-wide flex-1 w-full min-w-0"
            style={{ 
              fontFamily: "'Jersey 15', sans-serif",
              color: '#000',
            }}
          />
        </div>

        {/* Lined Notepad Area for Description */}
        <div 
          className="relative w-full max-w-3xl flex-grow mb-6 mt-4 box-border"
          style={{ minHeight: '180px' }}
        >
          <textarea
            value={formData.description}
            onChange={(e) => {
              const words = e.target.value.split(/\s+/).filter(Boolean)
              if (words.length <= 400) {
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
            }}
            placeholder=""
            className="w-full h-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 resize-none z-10 text-base box-border"
            style={{ 
              fontFamily: "'Montserrat', sans-serif",
              color: '#333',
              lineHeight: '2rem',
              backgroundImage: 'linear-gradient(transparent, transparent 31px, #000 31px, #000 32px)',
              backgroundSize: '100% 32px',
              paddingTop: '0px',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* FIXED BOTTOM SECTION */}
      <div className="w-full flex flex-col flex-shrink-0 bg-transparent px-4 sm:px-12 pt-2 pb-8">
        {/* URL and Counter Row */}
        <div className="flex justify-between items-end w-full max-w-3xl mx-auto mb-6">
          <div className="flex items-center gap-3">
            <span 
              className="text-2xl text-[#FF3B30] uppercase tracking-wide whitespace-nowrap font-bold"
              style={{ fontFamily: "'Jersey 15', sans-serif" }}
            >
              VIDEO URL:
            </span>
            <input
              type="text"
              value={formData.videoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
              placeholder=""
              className="bg-transparent border-none outline-none text-base w-full max-w-[300px] flex-1 min-w-[150px]"
              style={{ 
                fontFamily: "'Montserrat', sans-serif",
                color: '#333',
              }}
            />
          </div>
          <span 
            className="text-2xl text-black font-bold"
            style={{ fontFamily: "'Jersey 15', sans-serif" }}
          >
            {formData.description.split(/\s+/).filter(Boolean).length}/400
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-10 justify-center w-full mt-2">
          <button
            type="button"
            onClick={() => {
              if (memory.isFilled) {
                setIsEditing(false)
              } else {
                onClose()
              }
            }}
            className="px-8 py-2 bg-white border-4 border-black text-black rounded-full font-bold uppercase tracking-wide cursor-pointer hover:bg-gray-100 transition-colors text-lg"
            style={{ fontFamily: "'Jersey 15', sans-serif", minWidth: '150px' }}
          >
            ANNULER
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!formData.question || !formData.title.trim()}
            className="px-8 py-2 bg-black text-white rounded-full font-bold uppercase tracking-wide cursor-pointer hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg border-4 border-transparent"
            style={{ fontFamily: "'Jersey 15', sans-serif", minWidth: '150px' }}
          >
            CONFIRMER
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          style={customStyles}
          closeTimeoutMS={200}
          contentLabel={memory.title}
          shouldCloseOnOverlayClick={true}
          shouldCloseOnEsc={true}
          ariaHideApp={true}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative h-full flex flex-col" 
            style={{
              backgroundColor: isEditing ? '#D9D9D9' : 'transparent',
              border: isEditing ? '6px solid #FF3B30' : `6px solid ${borderColor}`,
              borderRadius: '16px',
              boxShadow: '0 0 40px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              width: '100%',
              flex: 1,
              boxSizing: 'border-box'
            }}
          >
            {/* Button Modifier */}
            {memory.isFilled && !isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="absolute z-50 cursor-pointer bg-white/95 hover:bg-white text-black shadow-xl rounded-full border border-black/10"
                style={{ 
                  top: '18px',     
                  left: '18px', 
                  padding: '8px 20px',   
                  fontSize: '0.95rem',   
                  fontWeight: '600',     
                  fontFamily: "'Montserrat', sans-serif",
                }}
                type="button"
              >
                Modifier
              </motion.button>
            )}

            {/* Button Close Modal*/}
            <motion.button
              onClick={onClose}
              className="absolute z-50 cursor-pointer bg-[#FF3B30] w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
              style={{ 
                  top: '16px', 
                  right: '16px' 
              }}
              aria-label="Close modal"
              type="button"
            >
              <X size={20} strokeWidth={4} className="text-white" />
            </motion.button>
            
            {/* Contenu */}
            <div className="w-full flex-1 flex flex-col min-h-0">
              {isEditing ? renderEditView() : (memory.isFilled ? renderFilledView() : renderEditView())}
            </div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
}
