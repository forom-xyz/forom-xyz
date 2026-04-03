import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// =============================================================================
// VOXEL HEART SVG
// =============================================================================

/**
 * 2-D pixel-art heart made of coloured SVG rects.
 * Grid layout (9 × 8):
 *   0 = transparent  1 = main red  2 = highlight  3 = shadow
 */
const PIXEL_GRID = [
  [0, 2, 1, 0, 0, 0, 1, 2, 0],
  [2, 2, 1, 1, 0, 1, 1, 1, 1],
  [2, 1, 1, 1, 1, 1, 1, 1, 3],
  [2, 1, 1, 1, 1, 1, 1, 3, 3],
  [0, 2, 1, 1, 1, 1, 3, 3, 0],
  [0, 0, 2, 1, 1, 3, 3, 0, 0],
  [0, 0, 0, 2, 3, 3, 0, 0, 0],
  [0, 0, 0, 0, 3, 0, 0, 0, 0],
] as const

const PIXEL_COLORS: Record<number, string> = {
  1: '#E83030',
  2: '#FF6060',
  3: '#AA0000',
}

function VoxelHeart({ px = 10 }: { px?: number }) {
  const cols = 9
  const rows = 8
  const w = cols * px
  const h = rows * px
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ imageRendering: 'pixelated', display: 'block' }}
      aria-hidden
    >
      {PIXEL_GRID.map((row, r) =>
        row.map((cell, c) =>
          cell !== 0 ? (
            <rect
              key={`${r}-${c}`}
              x={c * px}
              y={r * px}
              width={px}
              height={px}
              fill={PIXEL_COLORS[cell]}
            />
          ) : null
        )
      )}
    </svg>
  )
}

// =============================================================================
// CONSTANTS
// =============================================================================

const STORAGE_KEY_COUNT = 'forom_heart_count'
const STORAGE_KEY_LAST  = 'forom_heart_last_ts'
const HEART_INTERVAL_MS = 60_000 // 1 heart per 60 seconds

// =============================================================================
// HELPERS
// =============================================================================

function loadStorage(): { count: number; lastTs: number } {
  const count  = parseInt(localStorage.getItem(STORAGE_KEY_COUNT) ?? '0', 10)
  const lastTs = parseInt(localStorage.getItem(STORAGE_KEY_LAST)  ?? '0', 10)
  return {
    count:  isNaN(count)  ? 0 : count,
    lastTs: isNaN(lastTs) ? 0 : lastTs,
  }
}

function saveStorage(count: number, lastTs: number) {
  localStorage.setItem(STORAGE_KEY_COUNT, String(count))
  localStorage.setItem(STORAGE_KEY_LAST,  String(lastTs))
}

// =============================================================================
// TYPES
// =============================================================================

interface FloatingHeart {
  id: number
  /** small horizontal drift (-12 .. +12 px) */
  dx: number
  /** random x offset for animation */
  randomX: number
}

interface HeartFABProps {
  /** When true the FAB uses its own fixed positioning (default legacy behaviour).
   *  When false it renders inline so a parent can control placement. */
  fixed?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

export function HeartFAB({ fixed = true }: HeartFABProps) {
  const [heartCount,    setHeartCount]    = useState(0)
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([])

  // Mutable refs – avoids stale-closure problems inside the interval
  const accRef      = useRef(0)        // accumulated visible-tab ms
  const lastTickRef = useRef<number>(0)
  const nextIdRef   = useRef(0)

  // ── Initialise from localStorage ────────────────────────────────────────────
  useEffect(() => {
    lastTickRef.current = Date.now()
    const { count, lastTs } = loadStorage()
    setHeartCount(count)

    // Resume partial progress from previous session
    if (lastTs > 0) {
      const sinceLast = Date.now() - lastTs
      // Only credit the remainder of the current interval, not entire elapsed time
      accRef.current = Math.min(sinceLast % HEART_INTERVAL_MS, HEART_INTERVAL_MS - 1)
    }
  }, [])

  // ── Heart generation ─────────────────────────────────────────────────────────
  const spawnHeart = useCallback(() => {
    const now = Date.now()
    setHeartCount(prev => {
      const next = prev + 1
      saveStorage(next, now)
      return next
    })

    const id = nextIdRef.current++
    const dx = Math.round(Math.random() * 24 - 12)
    const randomX = Math.random() * 10 - 5
    setFloatingHearts(prev => [...prev, { id, dx, randomX }])

    // Remove particle after its animation finishes
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== id))
    }, 1400)
  }, [])

  // ── Timer – only ticks while tab is visible ──────────────────────────────────
  useEffect(() => {
    lastTickRef.current = Date.now()

    const tick = () => {
      if (document.visibilityState !== 'visible') {
        // Don't credit the hidden time; just move the reference forward
        lastTickRef.current = Date.now()
        return
      }

      const now   = Date.now()
      const delta = now - lastTickRef.current
      lastTickRef.current = now
      accRef.current += delta

      if (accRef.current >= HEART_INTERVAL_MS) {
        const count = Math.floor(accRef.current / HEART_INTERVAL_MS)
        accRef.current %= HEART_INTERVAL_MS

        for (let i = 0; i < count; i++) spawnHeart()
      }
    }

    const intervalId = setInterval(tick, 1_000)

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        // Reset tick reference so hidden time is never credited
        lastTickRef.current = Date.now()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [spawnHeart])

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      className={fixed ? "fixed z-50" : "relative z-50"}
      style={fixed ? { bottom: '60px', left: '50%', transform: 'translateX(-50%)' } : {}}
      aria-label={`Heart counter: ${heartCount}`}
    >
      {/* Floating voxel heart particles */}
      <div className="relative flex flex-col items-center">
        <AnimatePresence>
          {floatingHearts.map(({ id, dx, randomX }) => (
            <motion.div
              key={id}
              className="absolute pointer-events-none select-none"
              style={{ bottom: '100%', left: '50%' }}
              initial={{ opacity: 1, x: dx - 11, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, x: dx + randomX, y: -60, scale: 1.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <VoxelHeart px={3} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Count above the heart */}
        <motion.span
          key={heartCount}
          aria-live="polite"
          className="tabular-nums leading-none mb-1"
          style={{
            fontFamily: '"Jersey 15", sans-serif',
            fontSize: '16px',
            color: 'var(--color-text)',
          }}
          initial={{ y: -4, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        >
          {heartCount}
        </motion.span>

        {/* Voxel heart badge */}
        <motion.div
          className="relative select-none cursor-default"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 480, damping: 28 }}
        >
          <motion.div
            animate={floatingHearts.length > 0 ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <VoxelHeart px={5} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
