import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'

// =============================================================================
// TYPES
// =============================================================================

interface SidebarItem {
  id: string
  label: string
  disabled?: boolean
}

interface SidebarProps {
  items: SidebarItem[]
  activeId: string
  onSelect: (id: string) => void
  isDark?: boolean
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Vertical spacing between category items in pixels */
const ITEM_SPACING = 75

/** Horizontal curve intensity for non-active items */
const CURVE_INTENSITY = 12

// =============================================================================
// COMPONENT
// =============================================================================

export function Sidebar({ items, activeId, onSelect, isDark = false }: SidebarProps) {
  const wheelRef = useRef<HTMLDivElement>(null)
  const activeIndex = items.findIndex((item) => item.id === activeId)

  // Handle mouse wheel scrolling for category navigation
  useEffect(() => {
    // Smooth/resistant wheel scrolling: accumulate deltaY and trigger
    // navigation only when a threshold is reached, then apply cooldown.
    const THRESHOLD = 60 // required accumulated delta before action
    const COOLDOWN_MS = 350 // cooldown period to avoid rapid repeats

    let acc = 0
    let cooling = false

    const handleWheel = (e: WheelEvent) => {
      if (!wheelRef.current?.contains(e.target as Node)) return
      e.preventDefault()

      if (cooling) return

      // accumulate vertical deltas only (sidebar is vertical)
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

  return (
    <motion.div
      ref={wheelRef}
      initial={{ opacity: 0, scale: 0.50, x: '-65%', y: '-57.5%' }}
      animate={{ opacity: 1, scale: 0.50, x: '-65%', y: '-57.5%' }}
      whileHover={{ scale: 0.8 }}
      transition={{ duration: 0.3, type: 'spring', damping: 18 }}
      className="fixed left-0 flex items-center z-40"
      style={{ top: '50%', width: '400px', height: '400px', transformOrigin: 'center center' }}
    >
      {/* Decorative Wheel Circle */}
      <div
        className="absolute rounded-full w-full h-full left-0 transition-all duration-300"
        style={{
          border: `3px solid ${isDark ? '#52525b' : '#9ca3af'}`,
          background: isDark 
            ? 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)' 
            : 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
        }}
      />

      {/* Category List */}
      <div
        className="absolute flex flex-col items-start"
        style={{ left: '420px', top: '50%', transform: 'translateY(-50%)' }}
      >
        {items.map((item, index) => {
          const isActive = activeId === item.id
          const relativeIndex = index - activeIndex
          const distanceFromCenter = Math.abs(relativeIndex)

          // Calculate position and styling based on distance from active item
          const y = relativeIndex * ITEM_SPACING
          const xOffset = -distanceFromCenter * distanceFromCenter * CURVE_INTENSITY
          const opacity = distanceFromCenter === 0 ? 1 : distanceFromCenter === 1 ? 0.6 : 0.35

          return (
            <motion.button
              key={item.id}
              onClick={() => onSelect(item.id)}
              animate={{ y, x: xOffset, opacity }}
              transition={{ type: 'spring', damping: 20, stiffness: 150 }}
              className="absolute whitespace-nowrap text-left transition-colors duration-300"
              style={{
                fontFamily: "'Jersey 15', sans-serif",
                fontSize: isActive ? '3rem' : '1.75rem',
                fontWeight: isActive ? 900 : 400,
                fontStyle: isActive ? 'normal' : 'italic',
                color: isActive 
                  ? (isDark ? '#ffffff' : '#000000') 
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
