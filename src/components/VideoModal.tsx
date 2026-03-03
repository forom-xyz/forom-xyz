import Modal from 'react-modal'
import { X, Play } from 'lucide-react'

// =============================================================================
// TYPES
// =============================================================================

export interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoId: string | null
  title: string | null
  description: string | null
  borderColor?: string
  /** Text displayed as the large right-side answer heading */
  answerTitle?: string | null
}

// =============================================================================
// STYLES
// =============================================================================

const overlayStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const getContentStyles = (borderColor: string): React.CSSProperties => ({
  position: 'relative',
  width: '95vw',
  height: '95vh',
  maxWidth: 'none',
  overflow: 'hidden',
  borderRadius: '12px',
  border: `6px solid ${borderColor}`,
  backgroundColor: '#000',
  padding: 0,
  inset: 'auto',
})

// =============================================================================
// COMPONENT
// =============================================================================

export function VideoModal({
  isOpen,
  onClose,
  videoId,
  title,
  description,
  borderColor = '#E5E7EB',
  answerTitle,
}: VideoModalProps) {
  const youtubeUrl = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : null

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={title || 'Video Modal'}
      style={{
        overlay: overlayStyles,
        content: getContentStyles(borderColor),
      }}
      closeTimeoutMS={200}
    >
      {/* ── Base Layer: Video / Thumbnail ── */}
      <div className="absolute inset-0 w-full h-full">
        {videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0`}
            title={title || 'YouTube video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            style={{ border: 'none' }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
            <Play size={64} className="text-zinc-500" />
          </div>
        )}
      </div>

      {/* ── Dark Gradient Overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.0) 55%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* ── UI Overlay ── */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between z-10 pointer-events-none">

        {/* Top Row */}
        <div className="flex justify-between items-start pointer-events-auto">

          {/* Left – Modifier button */}
          <button
            type="button"
            className="px-5 py-2 rounded-full bg-white text-black font-bold text-sm shadow-lg hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            Modifier
          </button>

          {/* Center – YouTube link */}
          <div className="flex flex-col items-center select-text">
            <span className="font-bold text-white text-sm leading-tight">
              Youtube link:
            </span>
            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 text-xs hover:text-white transition-colors underline underline-offset-2 mt-0.5"
              >
                {youtubeUrl}
              </a>
            )}
          </div>

          {/* Right – Close button */}
          <button
            onClick={onClose}
            type="button"
            aria-label="Close modal"
            className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg transition-colors cursor-pointer"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Bottom Row */}
        <div className="flex justify-between items-end w-full pointer-events-auto">

          {/* Bottom Left – Question + title + description */}
          <div className="flex flex-col items-start max-w-[50%]">
            <span className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-1">
              Question
            </span>
            {title && (
              <h2
                className="text-white leading-none mb-2"
                style={{
                  fontFamily: "'Jersey 15', sans-serif",
                  fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                }}
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="text-white/80 text-xs leading-relaxed max-w-[480px]">
                {description}
              </p>
            )}
          </div>

          {/* Bottom Right – Réponse + answerTitle */}
          <div className="flex flex-col items-end text-right">
            <span className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-1">
              Réponse
            </span>
            {answerTitle && (
              <h2
                className="text-white leading-none"
                style={{
                  fontFamily: "'Jersey 15', sans-serif",
                  fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                }}
              >
                {answerTitle}
              </h2>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
