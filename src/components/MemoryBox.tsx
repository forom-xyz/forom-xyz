import { memo } from 'react'
import { Plus } from 'lucide-react'
import { getMemoryThumbnail, hasVideo, QUESTION_COLORS } from '../data/memories'
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
  questionLabels?: Record<string, string>
}

// =============================================================================
// DIMENSION PRESETS (computed once, not on every render)
// =============================================================================

const DIMENSIONS = {
  centered: { width: '560px', height: '315px', minWidth: '560px', minHeight: '315px' },
  default: { width: '240px', height: '135px', minWidth: '240px', minHeight: '135px' },
  small: { width: '160px', height: '90px', minWidth: '160px', minHeight: '90px' },
  extraSmall: { width: '80px', height: '45px', minWidth: '80px', minHeight: '45px' },
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
  questionLabels = {},
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
        {showThumbnail || isFilled ? (
          // Thumbnail with play overlay and question text
          <div className="absolute inset-0 w-full h-full bg-black">
            {showThumbnail && (
              <img
                src={thumbnail}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: isCentered ? 0.85 : 0.5, zIndex: 1 }}
                loading="lazy"
              />
            )}
            {/* Dark overlay only for non-centered items */}
            {!isCentered && (
              <div className="absolute inset-0 bg-black/40" style={{ zIndex: 2 }} />
            )}
            {/* Centered layout: badge top, title middle */}
            <div className="absolute inset-0 w-full h-full" style={{ zIndex: 3 }}>
              {/* Badge — pinned to top center */}
              {isFilled && question && (
                <div style={{ position: 'absolute', top: isCentered ? '10%' : '5%', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
                  <span
                    className="flex items-center justify-center font-bold text-white uppercase shadow-lg"
                    style={{
                      fontFamily: "'Jersey 15', sans-serif",
                      fontSize: isCentered ? '22px' : isSmall ? '12px' : isExtraSmall ? '8px' : '16px',
                      backgroundColor: question ? (QUESTION_COLORS[question] || borderColor) : borderColor,
                      padding: isCentered ? '8px 36px' : '2px 10px',
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
              {/* Title — pinned to absolute center of the box */}
              {isFilled && isCentered && (
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', padding: '0 24px' }}>
                  <span
                    className="text-white text-center font-bold uppercase w-full"
                    style={{
                      fontFamily: "'Jersey 15', sans-serif",
                      fontSize: '52px',
                      lineHeight: 1.1,
                      textShadow: '2px 2px 8px rgba(0,0,0,0.95)',
                    }}
                  >
                    {title}
                  </span>
                </div>
              )}
              {/* Title for non-centered items */}
              {isFilled && !isCentered && (
                <div style={{ position: 'absolute', bottom: '8px', left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: '0 8px' }}>
                  <span
                    className="text-white text-center font-bold uppercase w-full"
                    style={{
                      fontFamily: "'Jersey 15', sans-serif",
                      fontSize: isSmall ? '24px' : isExtraSmall ? '14px' : '32px',
                      lineHeight: 1.1,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
                    }}
                  >
                    {title}
                  </span>
                </div>
              )}
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
          className="w-full flex justify-start items-center mt-2 cursor-pointer select-none hover:opacity-80 transition-opacity"
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
          {/* Removed the external bottom title text since it is now centered inside the thumbnail box! */}
        </div>
      )}
    </div>
  )
})
