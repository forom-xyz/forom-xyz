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
  'Comment ?': '#8000FF',
  'Qui ?': '#FF007F',
  'Pourquoi ?': '#FF8000',
  'Quoi ?': '#0080FF',
  'Quand ?': '#7FFF00',
  'Ou ?': '#00FF7F',
}

// Order for display (2 rows of 3)
const QUESTION_ORDER: WhQuestion[] = [
  'Comment ?',
  'Qui ?',
  'Pourquoi ?',
  'Quoi ?',
  'Quand ?',
  'Ou ?',
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
    padding: '2rem',
  },
  content: {
    display: 'flex', 
    flexDirection: 'column', 
    position: 'relative',
    inset: 'auto',
    width: '75vw',
    height: '75vh',
    padding: 0,
    border: 'none',
    background: 'transparent',
    overflow: 'visible',
    borderRadius: 0,
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
    <div className="relative w-full h-full flex flex-coloverflow-hidden rounded-xl">
      {/* Background - Video Thumbnail or Embed */}
      <div className="absolute inset-0 z-0 w-full h-full">
        {memoryHasVideo && videoId ? (
          <>
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt={memory.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </>
        ) : (
          <div 
            className="w-full h-full"
            style={{ backgroundColor: '#2a2a2e' }}
          />
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex-1 flex flex-col p-8">
        {/* Top: YouTube Link */}
        <div className="text-center mb-6">
          <span 
            className="text-2xl text-white uppercase tracking-wide"
            style={{ fontFamily: "'Jersey 15', sans-serif" }}
          >
            Youtube link:
          </span>
          {memory.videoUrl && (
            <a 
              href={memory.videoUrl.startsWith('http') ? memory.videoUrl : `https://www.youtube.com/watch?v=${memory.videoUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-white/80 hover:text-white underline mt-1 truncate"
            >
              {memory.videoUrl.startsWith('http') ? memory.videoUrl : `https://www.youtube.com/watch?v=${memory.videoUrl}`}
            </a>
          )}
        </div>

        {/* Center: Play Button */}
        {/*memoryHasVideo && (
          <div className="flex-1 flex items-center justify-center">
            <a
              href={memory.videoUrl?.startsWith('http') ? memory.videoUrl : `https://www.youtube.com/watch?v=${memory.videoUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-20 h-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Play size={40} className="text-black ml-1" fill="currentColor" />
            </a>
          </div>
        )*/}

        {/* Bottom: Question & Response */}
        <div className="mt-auto">
          {/* Question and Response Row */}
          <div className="flex justify-between items-end mb-4">
            {/* Left: Question */}
            <div>
              <span 
                className="text-sm uppercase tracking-widest text-white/70"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
              >
                QUESTION
              </span>
              <h2 
                className="text-4xl text-white mt-1"
                style={{ fontFamily: "'Jersey 15', sans-serif" }}
              >
                {memory.question || 'Question ?'}
              </h2>
            </div>

            {/* Right: Response */}
            <div className="text-right">
              <span 
                className="text-sm uppercase tracking-widest text-white/70"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
              >
                REPONSE
              </span>
              <h2 
                className="text-4xl text-white mt-1"
                style={{ fontFamily: "'Jersey 15', sans-serif" }}
              >
                {memory.title}
              </h2>
            </div>
          </div>

          {/* Description */}
          <div className="text-left">
            <span 
              className="text-xs uppercase tracking-widest text-white/60 block mb-2"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              L art de communiquer a l ere numerique
            </span>
            <p 
              className="text-xs text-white/80 leading-relaxed line-clamp-3"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {memory.description}
            </p>
          </div>

          {/* Category Tag */}
          <div 
            className="mt-4 inline-block px-3 py-1 rounded text-sm"
            style={{ 
              backgroundColor: borderColor + '40',
              color: borderColor,
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {memory.category}
          </div>
        </div>
      </div>
    </div>
  )

  // Render the edit/create form (MEMO style)
  const renderEditView = () => (
    <div className="w-full h-full flex flex-col items-center justify-between" style={{ padding: '30px 50px' }}>
      {/* MEMO Title */}
      <h2 
        className="text-4xl text-[#FF3B30] mb-4 text-center uppercase tracking-wider"
        style={{ fontFamily: "'Jersey 15', sans-serif" }}
      >
        MEMO
      </h2>

      {/* Question Buttons - 2 rows of 3, centered */}
      <div className="flex flex-col items-center gap-2 mb-4 w-full">
        {/* Row 1 */}
        <div className="flex gap-4 justify-center">
          {QUESTION_ORDER.slice(0, 3).map((q) => {
            const color = QUESTION_COLORS[q] || '#888888'
            const isSelected = formData.question === q
            return (
              <button
                key={q}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, question: q }))}
                className="px-5 py-1.5 rounded transition-all cursor-pointer uppercase text-white font-bold tracking-wide text-sm"
                style={{ 
                  backgroundColor: color,
                  fontFamily: "'Jersey 15', sans-serif",
                  border: isSelected ? '3px solid #000' : '3px solid transparent',
                  boxShadow: isSelected ? '0 0 10px rgba(0,0,0,0.3)' : 'none',
                  minWidth: '100px',
                }}
              >
                {q.replace(' ?', '?').toUpperCase()}
              </button>
            )
          })}
        </div>
        {/* Row 2 */}
        <div className="flex gap-4 justify-center">
          {QUESTION_ORDER.slice(3, 6).map((q) => {
            const color = QUESTION_COLORS[q] || '#888888'
            const isSelected = formData.question === q
            return (
              <button
                key={q}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, question: q }))}
                className="px-5 py-1.5 rounded transition-all cursor-pointer uppercase text-white font-bold tracking-wide text-sm"
                style={{ 
                  backgroundColor: color,
                  fontFamily: "'Jersey 15', sans-serif",
                  border: isSelected ? '3px solid #000' : '3px solid transparent',
                  boxShadow: isSelected ? '0 0 10px rgba(0,0,0,0.3)' : 'none',
                  minWidth: '100px',
                }}
              >
                {q.replace(' ?', '?').toUpperCase()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Title Row - Centered */}
      <div className="flex items-center justify-center gap-6 mb-4 w-full">
        <span 
          className="text-xl text-black uppercase tracking-wide whitespace-nowrap"
          style={{ fontFamily: "'Jersey 15', sans-serif" }}
        >
          TITRE :
        </span>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="SANS TITRE"
          className="text-xl bg-transparent border-none outline-none uppercase tracking-wide text-center"
          style={{ 
            fontFamily: "'Jersey 15', sans-serif",
            color: formData.title ? '#000' : '#666',
            minWidth: '200px',
          }}
        />
      </div>

      {/* Lined Notepad Area for Description - Centered */}
      <div 
        className="relative w-full"
        style={{ maxWidth: '85%', height: '180px', flexShrink: 0 }}
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
          className="w-full h-full bg-transparent border-none outline-none resize-none relative z-10 text-base"
          style={{ 
            fontFamily: "'Montserrat', sans-serif",
            color: '#333',
            lineHeight: '2rem',
            paddingTop: '0.25rem',
          }}
        />
        {/* Black Lines */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-start overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i}
              className="w-full flex-shrink-0"
              style={{ 
                height: '2rem',
                borderBottom: '1px solid #000',
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Row: Video URL + Word Count */}
      <div className="flex justify-between items-center w-full mt-4 mb-4" style={{ maxWidth: '85%' }}>
        <div className="flex items-center gap-3">
          <span 
            className="text-lg text-[#FF8000] uppercase tracking-wide whitespace-nowrap font-bold"
            style={{ fontFamily: "'Jersey 15', sans-serif" }}
          >
            VIDEO URL:
          </span>
          <input
            type="text"
            value={formData.videoUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
            placeholder=""
            className="bg-transparent border-none outline-none text-sm"
            style={{ 
              fontFamily: "'Montserrat', sans-serif",
              color: '#333',
              width: '250px',
            }}
          />
        </div>
        <span 
          className="text-lg text-black font-bold"
          style={{ fontFamily: "'Jersey 15', sans-serif" }}
        >
          {formData.description.split(/\s+/).filter(Boolean).length}/400
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-10 justify-center">
        <button
          type="button"
          onClick={() => {
            if (memory.isFilled) {
              setIsEditing(false)
            } else {
              onClose()
            }
          }}
          className="px-6 py-2 bg-white border-2 border-black text-black uppercase tracking-wide cursor-pointer hover:bg-gray-100 transition-colors text-sm"
          style={{ fontFamily: "'Jersey 15', sans-serif" }}
        >
          ANNULER
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!formData.question || !formData.title.trim()}
          className="px-6 py-2 bg-black border-2 border-black text-white uppercase tracking-wide cursor-pointer hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          style={{ fontFamily: "'Jersey 15', sans-serif" }}
        >
          CONFIRMER
        </button>
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
            className="relative h-full" 
            style={{
              backgroundColor: isEditing ? '#D9D9D9' : 'transparent',
              border: isEditing ? '6px solid #000000' : `6px solid ${borderColor}`,
              borderRadius: '16px',
              boxShadow: '0 0 40px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              width: '100%',
              minWidth: '100%',
              display: 'block' 
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
              <X size={24} strokeWidth={3} className="text-white" />
            </motion.button>
            
            {/* Contenu */}
            <div className="w-full h-full">
              {isEditing ? renderEditView() : (memory.isFilled ? renderFilledView() : renderEditView())}
            </div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
}
