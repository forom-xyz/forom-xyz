import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
}

// =============================================================================
// COMPONENT
// =============================================================================

export function HeartFAB() {
  const [heartCount,    setHeartCount]    = useState(0)
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([])

  // Mutable refs – avoids stale-closure problems inside the interval
  const accRef      = useRef(0)        // accumulated visible-tab ms
  const lastTickRef = useRef(Date.now())
  const nextIdRef   = useRef(0)

  // ── Initialise from localStorage ────────────────────────────────────────────
  useEffect(() => {
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
    setFloatingHearts(prev => [...prev, { id, dx }])

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
      className="fixed z-50"
      style={{ bottom: '100px', left: 'calc(50% + 40px)', transform: 'translateX(-50%)' }}
      aria-label={`Heart counter: ${heartCount}`}
    >
      {/* Floating heart particles */}
      <div className="relative">
        <AnimatePresence>
          {floatingHearts.map(({ id, dx }) => (
            <motion.span
              key={id}
              className="absolute pointer-events-none select-none text-base leading-none"
              style={{ bottom: '100%', left: '50%' }}
              initial={{ opacity: 1, x: dx - 8, y: 0, scale: 0.9 }}
              animate={{ opacity: 0, x: dx + (Math.random() * 10 - 5), y: -72, scale: 1.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            >
              ❤️
            </motion.span>
          ))}
        </AnimatePresence>

        {/* Badge */}
        <motion.div
          className="flex flex-col items-center gap-0 select-none"
          style={{ color: 'var(--color-text)' }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 480, damping: 28 }}
        >
          {/* Count – sits above the heart */}
          <motion.span
            key={heartCount}
            className="font-jersey-10 text-2xl tabular-nums leading-none"
            aria-live="polite"
            initial={{ y: -6, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            {heartCount}
          </motion.span>

          {/* Heart icon – pulses on each new heart, twice original size */}
          <motion.span
            className="leading-none text-[2rem]"
            animate={floatingHearts.length > 0 ? { scale: [1, 1.45, 1] } : {}}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            ❤️
          </motion.span>
        </motion.div>
      </div>
    </div>
  )
}
