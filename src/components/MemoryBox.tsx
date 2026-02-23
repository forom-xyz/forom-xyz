import { memo } from 'react'
import { Play, Plus } from 'lucide-react'
import { getMemoryThumbnail, hasVideo } from '../data/memories'
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
  onClick?: () => void
  onInfoClick?: () => void
}

// =============================================================================
// DIMENSION PRESETS (computed once, not on every render)
// =============================================================================

const DIMENSIONS = {
  centered: { width: '17vw', height: '11.5vw', minWidth: '170px', minHeight: '115px' },
  extraSmall: { width: '4vw', height: '2.7vw', minWidth: '40px', minHeight: '27px' },
  small: { width: '7.5vw', height: '5vw', minWidth: '75px', minHeight: '50px' },
  default: { width: '10vw', height: '6.8vw', minWidth: '100px', minHeight: '68px' },
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
  onClick,
  onInfoClick,
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

  const memoryHasVideo = memory ? hasVideo(memory) : false
  const thumbnail = memory ? getMemoryThumbnail(memory) : null
  const title = memory?.title ?? 'Sans titre'
  const question = memory?.question ?? null
  const isFilled = memory?.isFilled ?? false
  const iconSize = isCentered ? 48 : isExtraSmall ? 12 : isSmall ? 20 : 28
  const showThumbnail = memoryHasVideo && thumbnail

  // For centered empty boxes, clicking should open the modal to create a memory
  const handleBoxClick = () => {
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

  // Font size for question text based on size
  const questionFontSize = isCentered 
    ? 'clamp(14px, 1.2vw, 20px)' 
    : isExtraSmall 
      ? 'clamp(6px, 0.5vw, 8px)'
      : isSmall 
        ? 'clamp(8px, 0.8vw, 12px)'
        : 'clamp(10px, 1vw, 14px)'

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative overflow-hidden flex items-center justify-center transition-transform duration-150 hover:scale-105"
        onClick={handleBoxClick}
        style={{
          border: `3px solid ${borderColor}`,
          backgroundColor: isDark ? '#27272a' : '#fefefe',
          ...dimensions,
          cursor: onClick || (isCentered && !isFilled && onInfoClick) ? 'pointer' : 'default',
          borderRadius: '16px',
        }}
      >
        {showThumbnail ? (
          // Thumbnail with play overlay and question text
          <div className="relative w-full h-full">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
              {/* Question text at top for filled memories */}
              {isFilled && question && (
                <span 
                  className="absolute top-2 left-2 right-2 text-white font-bold text-center truncate"
                  style={{ 
                    fontFamily: "'Jersey 15', sans-serif",
                    fontSize: questionFontSize,
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                  }}
                >
                  {question}
                </span>
              )}
              <div 
                className="rounded-full flex items-center justify-center"
                style={{
                  width: iconSize * 1.5,
                  height: iconSize * 1.5,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                }}
              >
                <Play 
                  size={iconSize * 0.6} 
                  className="text-gray-800 ml-0.5" 
                  fill="currentColor"
                />
              </div>
            </div>
          </div>
        ) : (
          // Empty slot with plus sign
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{
              background: isDark 
                ? 'linear-gradient(135deg, #2a2a2e 0%, #1f1f23 100%)'
                : 'linear-gradient(135deg, #fefefe 0%, #f0f0f5 100%)',
            }}
          >
            <Plus 
              size={iconSize} 
              strokeWidth={isCentered ? 2.5 : 2}
              style={{ color: borderColor, opacity: isCentered ? 0.7 : 0.5 }} 
            />
          </div>
        )}
      </div>
      
      {/* Info bar - only for centered items */}
      {isCentered && onInfoClick && (
        <div
          className="w-full flex justify-between items-center mt-2 cursor-pointer select-none hover:opacity-80 transition-opacity"
          onClick={(e) => {
            e.stopPropagation()
            onInfoClick()
          }}
          style={{
            fontFamily: "'Jersey 15', sans-serif",
            color: isDark ? '#ffffff' : '#000000',
            fontSize: '24px',
          }}
        >
          <span>
            {displayNumber !== null && displayNumber !== undefined 
              ? (displayNumber + 1).toString().padStart(2, '0') + '.' 
              : ''}
          </span>
          <span className="truncate ml-2 text-right flex-1">
            {title}
          </span>
        </div>
      )}
    </div>
  )
})
