import { motion } from 'framer-motion'

// =============================================================================
// PIXEL WAREHOUSE SVG
// =============================================================================

/**
 * 2-D pixel-art warehouse made of coloured SVG rects.
 * Grid layout (10 × 9):
 *   0 = transparent
 *   1 = dark outline / ground
 *   2 = roof highlight
 *   3 = roof main
 *   4 = wall edge (lighter)
 *   5 = wall main
 *   6 = window
 *   7 = door
 */
const WAREHOUSE_GRID = [
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0], // roof peak
  [0, 1, 3, 2, 2, 2, 2, 3, 1, 0], // roof body
  [1, 3, 2, 2, 2, 2, 2, 2, 3, 1], // roof base
  [1, 4, 5, 5, 5, 5, 5, 5, 4, 1], // wall top
  [1, 5, 6, 6, 5, 5, 6, 6, 5, 1], // window row 1
  [1, 5, 6, 6, 5, 5, 6, 6, 5, 1], // window row 2
  [1, 5, 5, 5, 7, 7, 5, 5, 5, 1], // door row 1
  [1, 5, 5, 5, 7, 7, 5, 5, 5, 1], // door row 2
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // ground
] as const

const WAREHOUSE_COLORS: Record<number, string> = {
  1: '#2D1B00', // dark outline / ground
  2: '#FFE4A0', // roof highlight
  3: '#D4A840', // roof main (golden)
  4: '#E8C060', // wall edge lighter
  5: '#B8860B', // wall main (dark goldenrod)
  6: '#93C5FD', // windows (light blue)
  7: '#5D3A1A', // door (dark brown)
}

export function VoxelWarehouse({ px = 8 }: { px?: number }) {
  const cols = 10
  const rows = 9
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
      {WAREHOUSE_GRID.map((row, r) =>
        row.map((cell, c) =>
          cell !== 0 ? (
            <rect
              key={`${r}-${c}`}
              x={c * px}
              y={r * px}
              width={px}
              height={px}
              fill={WAREHOUSE_COLORS[cell]}
            />
          ) : null
        )
      )}
    </svg>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

interface SettingsFABProps {
  onClick: () => void
  visible?: boolean
}

export function SettingsFAB({ onClick, visible = true }: SettingsFABProps) {
  if (!visible) return null
  return (
    <div className="flex flex-col items-center">
      {/* Label */}
      <span
        className="tabular-nums leading-none mb-1"
        style={{
          fontFamily: '"Jersey 15", sans-serif',
          fontSize: '16px',
          color: 'var(--color-text)',
          opacity: 0.7,
        }}
      >
        ⚙
      </span>

      {/* Pixel warehouse badge */}
      <motion.button
        onClick={onClick}
        className="relative select-none cursor-pointer"
        style={{ background: 'none', border: 'none', padding: 0 }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 480, damping: 28 }}
        aria-label="Settings"
        title="Settings"
      >
        <VoxelWarehouse px={5} />
      </motion.button>
    </div>
  )
}
