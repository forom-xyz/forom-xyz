import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { CATEGORY_COLORS } from '../data/memories'

// =============================================================================
// TYPES
// =============================================================================

export interface SidebarItem {
  id: string
  label: string
  color?: string
  disabled?: boolean
}

export interface SidebarProps {
  items: SidebarItem[]
  activeId: string
  onSelect: (id: string) => void
  isDark?: boolean
  position?: 'left' | 'right' | 'bottom'
  isEtsForom?: boolean
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Spacing between items in pixels */
const ITEM_SPACING = 75

/** Curve intensity for non-active items */
const CURVE_INTENSITY = 12

// =============================================================================
// COMPONENT
// =============================================================================

export function Sidebar({ items, activeId, onSelect, isDark = false, position = 'left', isEtsForom = false }: SidebarProps) {
  const wheelRef = useRef<HTMLDivElement>(null)
  const activeIndex = items.findIndex((item) => item.id === activeId)

  // Handle mouse wheel scrolling for navigation
  useEffect(() => {
    // Smooth/resistant wheel scrolling: accumulate delta and trigger
    // navigation only when a threshold is reached, then apply cooldown.
    const THRESHOLD = 60 // required accumulated delta before action
    const COOLDOWN_MS = 350 // cooldown period to avoid rapid repeats

    let acc = 0
    let cooling = false

    const handleWheel = (e: WheelEvent) => {
      if (!wheelRef.current?.contains(e.target as Node)) return
      e.preventDefault()

      if (cooling) return

      // for bottom wheel (horizontal visually), we usually take deltaY for standard mouse scroll
      acc += e.deltaY

      if (Math.abs(acc) >= THRESHOLD) {
        const currentIndex = items.findIndex((item) => item.id === activeId)
        if (currentIndex === -1) {
          acc = 0
          return
        }

        const nextIndex = acc > 0
          ? Math.min(currentIndex + 1, items.length - 1)
          : Math.max(currentIndex - 1, 0)

        if (nextIndex !== currentIndex) {
          onSelect(items[nextIndex].id)
        }

        acc = 0
        cooling = true
        setTimeout(() => { cooling = false }, COOLDOWN_MS)
      }
    }

    const wheel = wheelRef.current
    if (wheel) {
      wheel.addEventListener('wheel', handleWheel, { passive: false })
      return () => wheel.removeEventListener('wheel', handleWheel)
    }
  }, [items, activeId, onSelect])

  // Determine fixed positioning CSS
  let containerClassName = "fixed z-40 flex items-center justify-center pointer-events-none"
  let containerStyle: React.CSSProperties = { transformOrigin: 'center center', width: '400px', height: '400px' }
  let listStyle: React.CSSProperties = {}
  let listClassName = "absolute flex pointer-events-auto "

  if (position === 'left') {
    containerStyle = { ...containerStyle, left: '0px', top: '50%' }
    listStyle = { left: '440px', top: '50%', transform: 'translateY(-50%)' }
    listClassName += "flex-col items-start"
  } else if (position === 'right') {
    containerStyle = { ...containerStyle, right: '0px', top: '50%' }
    listStyle = { right: '440px', top: '50%', transform: 'translateY(-50%)' }
    listClassName += "flex-col items-end"
  } else if (position === 'bottom') {
    containerStyle = { ...containerStyle, bottom: '0px', left: '50%' }
    // Text container anchored above the circle. 240px physical from center -> 120px visual from center.
    listStyle = { bottom: '440px', left: '50%', transform: 'translateX(-50%)', width: '800px' } 
    listClassName += "flex-row justify-center items-end gap-12"
  }

  // Initial animation
  let initialAnim = {}
  let targetAnim = {}

  if (position === 'left') {
    initialAnim = { opacity: 0, scale: 0.50, x: '-50%', y: '-50%' }
    targetAnim = { opacity: 1, scale: 0.50, x: '-50%', y: '-50%' }
  } else if (position === 'right') {
    initialAnim = { opacity: 0, scale: 0.50, x: '50%', y: '-50%' }
    targetAnim = { opacity: 1, scale: 0.50, x: '50%', y: '-50%' }
  } else if (position === 'bottom') {
    initialAnim = { opacity: 0, scale: 0.50, x: '-50%', y: '50%' }
    targetAnim = { opacity: 1, scale: 0.50, x: '-50%', y: '50%' }
  }

  return (
    <motion.div
      ref={wheelRef}
      initial={initialAnim}
      animate={targetAnim}
      whileHover={{ scale: 0.8 }}
      transition={{ duration: 0.3, type: 'spring', damping: 18 }}
      className={containerClassName}
      style={containerStyle}
    >
      {/* Decorative Wheel Circle */}
      <div
        className="absolute rounded-full w-full h-full transition-all duration-300 pointer-events-auto"
        style={{
          border: `3px solid ${isDark ? '#52525b' : (isEtsForom ? '#b30022' : '#9ca3af')}`,
          background: isDark 
            ? 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)' 
            : (isEtsForom ? '#E3022C' : 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)'),
        }}
      />

      {/* Item List */}
      <div
        className={listClassName}
        style={listStyle}
      >
        {items.map((item, index) => {
          const isActive = activeId === item.id
          const relativeIndex = index - activeIndex
          const distanceFromCenter = Math.abs(relativeIndex)

          // Calculate position and styling based on distance from active item
          let x = 0
          let y = 0
          
          if (position === 'left') {
            y = relativeIndex * ITEM_SPACING
            x = -distanceFromCenter * distanceFromCenter * CURVE_INTENSITY
          } else if (position === 'right') {
            y = relativeIndex * ITEM_SPACING
            // Push RIGHT (closer to the circle on the right edge)
            x = distanceFromCenter * distanceFromCenter * CURVE_INTENSITY
          } else if (position === 'bottom') {
            x = relativeIndex * ITEM_SPACING * 1.7 // Spread tags further horizontally
            y = distanceFromCenter * distanceFromCenter * CURVE_INTENSITY * 1.8 // Curve them down more sharply around the circle
          }

          const opacity = distanceFromCenter === 0 ? 1 : distanceFromCenter === 1 ? 0.6 : 0.35

          return (
            <motion.button
              key={item.id}
              onClick={() => onSelect(item.id)}
              animate={{ y, x, opacity }}
              transition={{ type: 'spring', damping: 20, stiffness: 150 }}
              className={`absolute whitespace-nowrap transition-colors duration-300 ${position === 'right' ? 'text-right' : position === 'bottom' ? 'text-center' : 'text-left'}`}
              style={{
                fontFamily: "'Jersey 15', sans-serif",
                fontSize: isActive ? '3rem' : '1.75rem',
                fontWeight: isActive ? 900 : 400,
                fontStyle: isActive ? 'normal' : 'italic',
                color: isActive 
                  ? (item.color || CATEGORY_COLORS[item.id] || (isDark ? '#ffffff' : '#000000')) 
                  : (isDark ? '#71717a' : '#9CA3AF'),
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                outline: 'none',
              }}
            >
              {item.label}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
