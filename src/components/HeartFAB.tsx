import { motion } from 'framer-motion'

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

interface HeartFABProps {
  /** When true the FAB uses its own fixed positioning (default legacy behaviour).
   *  When false it renders inline so a parent can control placement. */
  fixed?: boolean
  /** Number of users to display above the heart */
  count?: number
}

// =============================================================================
// COMPONENT
// =============================================================================

export function HeartFAB({ fixed = true, count = 1 }: HeartFABProps) {
  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      className={fixed ? "fixed z-50" : "relative z-50"}
      style={fixed ? { bottom: '60px', left: '50%', transform: 'translateX(-50%)' } : {}}
      aria-label={`Users in initiative: ${count}`}
    >
      <div className="relative flex flex-col items-center">
        {/* Count above the heart */}
        <motion.span
          key={count}
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
          {count}
        </motion.span>

        {/* Voxel heart badge */}
        <motion.div
          className="relative select-none cursor-default"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 480, damping: 28 }}
        >
          <VoxelHeart px={3} />
        </motion.div>
      </div>
    </div>
  )
}
