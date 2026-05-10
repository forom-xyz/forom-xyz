import { memo } from 'react'
import type { Memory } from '../data/memories'
import tokensIcon from '../assets/icons/tokens.svg'

// =============================================================================
// TYPES
// =============================================================================

export interface MemoryBoxProps {
  memory: Memory | null
  borderColor: string
  categoryColor?: string
  tagColor?: string
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
  isRubixView = false,
  onClick,
  onInfoClick,
  customBgColor,
  categoryName,
  tagName,
  categoryColor,
  tagColor,
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
      // Tall rectangles for portrait - scaled down to match screenshot 2 exactly
      if (isCentered) return { width: 'clamp(160px, 45vw, 240px)', height: 'clamp(200px, 25vh, 320px)', minWidth: '160px', minHeight: '200px' };
      if (isSmall)    return { width: 'clamp(60px, 22vw, 160px)', height: 'clamp(80px, 15vh, 200px)', minWidth: '60px', minHeight: '80px' };
      if (isExtraSmall) return { width: 'clamp(40px, 15vw, 100px)', height: 'clamp(60px, 10vh, 140px)', minWidth: '40px', minHeight: '60px' };
      return { width: 'clamp(50px, 12vw, 90px)', height: 'clamp(70px, 10vh, 130px)', minWidth: '50px', minHeight: '70px' };
    } else {
      // Wide rectangles for landscape - scaled down to prevent hiding under header/sidebar
      if (isCentered) return { width: 'clamp(240px, 40vw, 550px)', height: 'clamp(180px, 40vh, 320px)', minWidth: '240px', minHeight: '180px' };
      if (isSmall)    return { width: 'clamp(120px, 20vw, 320px)', height: 'clamp(90px, 18vh, 240px)', minWidth: '120px', minHeight: '90px' };
      if (isExtraSmall) return { width: 'clamp(60px, 10vw, 160px)', height: 'clamp(50px, 10vh, 120px)', minWidth: '60px', minHeight: '50px' };
      return { width: 'clamp(100px, 15vw, 240px)', height: 'clamp(80px, 16vh, 160px)', minWidth: '100px', minHeight: '80px' };
    }
  }

  const dimensions = getDimensions();

  // Hide box if no memory AND no display number
  if (memory === null && displayNumber === null) {
    return <div style={{ ...dimensions, visibility: 'hidden' }} />
  }

  const handleBoxClick = () => {
    if (isCentered && onInfoClick) {
      // Centered box - open modal
      onInfoClick()
    } else if (onClick) {
      // Navigate to this box
      onClick()
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative overflow-hidden flex items-center justify-center transition-transform duration-150 hover:scale-105"
        onClick={handleBoxClick}
        style={{
          border: `10px solid #747474`,
          backgroundColor: customBgColor || '#FFFFFF',
          ...dimensions,
          cursor: (onClick || onInfoClick) ? 'pointer' : 'default',
          borderRadius: '24px',
        }}
      >
        {/* Render text only if Centered and not Rubix View */}
        {isCentered && !isRubixView && (
          <div className="absolute inset-0 flex flex-col justify-between items-center py-[10%]" style={{ zIndex: 10 }}>
            {/* Category block */}
            <span style={{ 
              color: categoryColor || borderColor, 
              fontFamily: "'Jersey 15', sans-serif", 
              fontSize: 'clamp(24px, 4vw, 42px)',
              letterSpacing: '0.05em',
            }}>
              {categoryName || memory?.category}
            </span>

            {/* Token in the middle */}
            <img 
              src={tokensIcon} 
              alt="Token" 
              className="w-[48px] h-[48px] md:w-[64px] md:h-[64px] object-contain drop-shadow-md"
            />

            {/* Tag block */}
            <span style={{ 
              color: tagColor || '#02c39a', 
              fontFamily: "'Jersey 15', sans-serif", 
              fontSize: 'clamp(20px, 3.5vw, 36px)',
              letterSpacing: '0.05em',
            }}>
              {tagName || memory?.question}
            </span>
          </div>
        )}
      </div>
    </div>
  )
})
