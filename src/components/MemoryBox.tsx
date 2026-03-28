import { memo } from 'react'
import { QUESTION_COLORS } from '../data/memories'
import type { Memory } from '../data/memories'

// =============================================================================
// TYPES
// =============================================================================

export interface MemoryBoxProps {
  memory: Memory | null
  borderColor: string
  displayNumber?: number | null
  isCentered?: boolean
  isSmall?: boolean
  isExtraSmall?: boolean
  isDark?: boolean
  isLocked?: boolean
  isRubixView?: boolean
  onClick?: () => void
  onInfoClick?: () => void
  questionLabels?: Record<string, string>
  customBgColor?: string
}

// =============================================================================
// DIMENSION PRESETS (computed once, not on every render)
// =============================================================================

const DIMENSIONS = {
  centered: { width: 'clamp(100px, min(35vw, 35vh), 400px)', height: 'clamp(100px, min(35vw, 35vh), 400px)', minWidth: '100px', minHeight: '100px' },
  default: { width: 'clamp(60px, min(15vw, 15vh), 180px)', height: 'clamp(60px, min(15vw, 15vh), 180px)', minWidth: '60px', minHeight: '60px' },
  small: { width: 'clamp(20px, min(5.5vw, 6vh), 120px)', height: 'clamp(20px, min(5.5vw, 6vh), 120px)', minWidth: '20px', minHeight: '20px' },
  extraSmall: { width: 'clamp(15px, min(4vw, 4vh), 80px)', height: 'clamp(15px, min(4vw, 4vh), 80px)', minWidth: '15px', minHeight: '15px' },
} as const

// =============================================================================
// COMPONENT
// =============================================================================

export const MemoryBox = memo(function MemoryBox({
  memory,
  borderColor,
  displayNumber,
  isCentered = false,
  isSmall = false,
  isExtraSmall = false,
  isDark = false,
  isLocked = false,
  isRubixView = false,
  onClick,
  onInfoClick,
  questionLabels = {},
  customBgColor,
}: MemoryBoxProps) {
  // Get dimensions from presets
  const dimensions = isCentered 
    ? DIMENSIONS.centered 
    : isExtraSmall 
      ? DIMENSIONS.extraSmall 
      : isSmall 
        ? DIMENSIONS.small 
        : DIMENSIONS.default

  // Hide box if no memory AND no display number
  if (memory === null && displayNumber === null) {
    return <div style={{ ...dimensions, visibility: 'hidden' }} />
  }

  const title = memory?.title ?? 'Sans titre'
  const question = memory?.question ?? null
  const isFilled = memory?.isFilled ?? false

  // For centered empty boxes, clicking should open the modal to create a memory
  const handleBoxClick = () => {
    if (isLocked) return
    if (isCentered && !isFilled && onInfoClick) {
      // Empty centered box - open modal to create memory
      onInfoClick()
    } else if (onClick) {
      // Navigate to this box
      onClick()
    }
    if (isFilled && onInfoClick) {
      // Filled box - open modal to view memory
      onInfoClick()
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative overflow-hidden flex items-center justify-center transition-transform duration-150 hover:scale-105"
        onClick={handleBoxClick}
        style={{
          border: `3px solid ${isLocked ? (isDark ? '#444' : '#d1d5db') : borderColor}`,
          backgroundColor: customBgColor ? customBgColor : (isDark ? '#27272a' : '#fefefe'),
          ...dimensions,
          cursor: isLocked ? 'not-allowed' : (onClick || (isCentered && !isFilled && onInfoClick) ? 'pointer' : 'default'),
          borderRadius: '16px',
          opacity: isLocked ? 0.55 : 1,
        }}
      >
        {isLocked && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10, borderRadius: '13px',
          }}>
            <span style={{ fontSize: isCentered ? 'clamp(24px, 4vw, 48px)' : isSmall ? 'clamp(12px, 2vw, 22px)' : isExtraSmall ? 'clamp(10px, 1.5vw, 13px)' : 'clamp(16px, 3vw, 30px)', userSelect: 'none' }}>🔒</span>
          </div>
        )}
        {isFilled ? (
          // Filled memory display (no thumbnail)
          <div className="absolute inset-0 w-full h-full flex flex-col pt-3" style={{ zIndex: 3 }}>
            {/* Dark overlay only for non-centered items (if not using custom background) */}
            {!isCentered && !customBgColor && (
              <div className="absolute inset-0 bg-black/10" style={{ zIndex: -1 }} />
            )}
            
            {/* Title — centered in the box */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
              <span
                className={`text-center font-bold uppercase w-full ${customBgColor ? 'text-white' : (isDark ? 'text-white' : 'text-black')}`}
                style={{
                  fontFamily: "'Jersey 15', sans-serif",
                  fontSize: isCentered ? 'clamp(18px, 3vw, 36px)' : isSmall ? 'clamp(9px, 1.2vw, 15px)' : isExtraSmall ? 'clamp(7px, 0.9vw, 9px)' : 'clamp(12px, 1.8vw, 20px)',
                  lineHeight: 1.05,
                  wordBreak: 'break-word',
                  textShadow: customBgColor ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none',
                }}
              >
                {title}
              </span>
            </div>

            {/* Badge — pinned to bottom center */}
            {question && !isRubixView && (
              <div style={{ paddingBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                <span
                  className="flex items-center justify-center font-bold text-white uppercase shadow-sm"
                  style={{
                    fontFamily: "'Jersey 15', sans-serif",
                    fontSize: isCentered ? 'clamp(12px, 2vw, 22px)' : isSmall ? 'clamp(8px, 1vw, 12px)' : isExtraSmall ? '8px' : 'clamp(10px, 1.5vw, 16px)',
                    backgroundColor: question ? (QUESTION_COLORS[question] || borderColor) : borderColor,
                    padding: isCentered ? '6px 24px' : '2px 10px',
                    borderRadius: isCentered ? '12px' : '4px',
                    border: isCentered ? '3px solid #111' : `2px solid ${borderColor}`,
                    letterSpacing: isCentered ? '1px' : 'normal',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {questionLabels[question] || question}
                </span>
              </div>
            )}
          </div>
        ) : (
          // Empty slot with frame number
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{
              background: isDark 
                ? 'linear-gradient(135deg, #2a2a2e 0%, #1f1f23 100%)'
                : 'linear-gradient(135deg, #fefefe 0%, #f0f0f5 100%)',
            }}
          >
            <span
              style={{
                fontFamily: "'Jersey 15', sans-serif",
                fontSize: isCentered ? 'clamp(60px, 12vw, 120px)' : isSmall ? 'clamp(24px, 4vw, 48px)' : isExtraSmall ? 'clamp(12px, 2vw, 24px)' : 'clamp(36px, 6vw, 72px)',
                color: borderColor,
                opacity: isCentered ? 0.6 : 0.4,
                lineHeight: 1
              }}
            >
              {displayNumber !== null && displayNumber !== undefined ? (displayNumber + 1).toString().padStart(2, '0') : ''}
            </span>
          </div>
        )}
      </div>
      
    </div>
  )
})
