import { memo } from 'react'
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
  customBgColor?: string
  categoryName?: string
  tagName?: string
  isPortrait?: boolean
}

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
  customBgColor,
  categoryName,
  tagName,
  isPortrait = false,
}: MemoryBoxProps) {
  // Get dimensions dynamically based on mode format
  const getDimensions = () => {
    // Escape hatch for Rubix View to keep the small rigid grid squares (legacy sizes)
    if (isRubixView) {
      if (isCentered) return { width: 'clamp(100px, min(35vw, 35vh), 400px)', height: 'clamp(100px, min(35vw, 35vh), 400px)', minWidth: '100px', minHeight: '100px' };
      if (isSmall)    return { width: 'clamp(20px, min(5.5vw, 6vh), 120px)', height: 'clamp(20px, min(5.5vw, 6vh), 120px)', minWidth: '20px', minHeight: '20px' };
      if (isExtraSmall) return { width: 'clamp(15px, min(4vw, 4vh), 80px)', height: 'clamp(15px, min(4vw, 4vh), 80px)', minWidth: '15px', minHeight: '15px' };
      return { width: 'clamp(60px, min(15vw, 15vh), 180px)', height: 'clamp(60px, min(15vw, 15vh), 180px)', minWidth: '60px', minHeight: '60px' };
    }

    if (isPortrait) {
      if (isCentered) return { width: 'clamp(150px, 35vw, 400px)', height: 'clamp(150px, 35vw, 400px)', minWidth: '150px', minHeight: '150px' };
      if (isSmall)    return { width: 'clamp(60px, 12vw, 150px)', height: 'clamp(60px, 12vw, 150px)', minWidth: '60px', minHeight: '60px' };
      if (isExtraSmall) return { width: 'clamp(30px, 7vw, 90px)', height: 'clamp(30px, 7vw, 90px)', minWidth: '30px', minHeight: '30px' };
      return { width: 'clamp(90px, 18vw, 240px)', height: 'clamp(90px, 18vw, 240px)', minWidth: '90px', minHeight: '90px' };
    } else {
      if (isCentered) return { width: 'clamp(150px, 38vmin, 450px)', height: 'clamp(150px, 38vmin, 450px)', minWidth: '150px', minHeight: '150px' };
      if (isSmall)    return { width: 'clamp(50px, 12vmin, 160px)', height: 'clamp(50px, 12vmin, 160px)', minWidth: '50px', minHeight: '50px' };
      if (isExtraSmall) return { width: 'clamp(30px, 8vmin, 100px)', height: 'clamp(30px, 8vmin, 100px)', minWidth: '30px', minHeight: '30px' };
      return { width: 'clamp(90px, 22vmin, 280px)', height: 'clamp(90px, 22vmin, 280px)', minWidth: '90px', minHeight: '90px' };
    }
  }

  const dimensions = getDimensions();

  // Hide box if no memory AND no display number
  if (memory === null && displayNumber === null) {
    return <div style={{ ...dimensions, visibility: 'hidden' }} />
  }

  const title = memory?.title ?? 'Sans titre'
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
          border: `3px solid ${isLocked ? (isDark ? '#444' : '#d1d5db') : (isDark ? '#FFFFFF' : '#000000')}`,
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
          // Filled memory display
          <div className="absolute inset-0 w-full h-full flex flex-col" style={{ zIndex: 3 }}>
            {/* Dark overlay only for non-centered items (if not using custom background) */}
            {!isCentered && !customBgColor && (
              <div className="absolute inset-0 bg-black/10" style={{ zIndex: -1 }} />
            )}
            
            {/* Render text only if Centered and not Rubix View */}
            {isCentered && !isRubixView && (
              <div className="absolute inset-0 flex flex-col justify-between items-center py-[8%]" style={{ zIndex: 10 }}>
                {/* Category block */}
                <span style={{ 
                  color: '#DADADA', 
                  fontFamily: "'Jersey 15', sans-serif", 
                  fontSize: 'clamp(14px, 2.5vw, 24px)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>
                  {categoryName || memory?.category}
                </span>

                {/* Main Title block */}
                <span
                  className={`text-center font-bold uppercase w-full ${customBgColor ? 'text-white' : (isDark ? 'text-white' : 'text-black')}`}
                  style={{
                    fontFamily: "'Jersey 15', sans-serif",
                    fontSize: 'clamp(18px, 3.5vw, 42px)',
                    lineHeight: 1.05,
                    wordBreak: 'break-word',
                    textShadow: customBgColor ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none',
                    padding: '0 10px'
                  }}
                >
                  {title}
                </span>

                {/* Tag block */}
                <span style={{ 
                  color: '#DADADA', 
                  fontFamily: "'Jersey 15', sans-serif", 
                  fontSize: 'clamp(14px, 2.5vw, 24px)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>
                  {tagName || memory?.question}
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
