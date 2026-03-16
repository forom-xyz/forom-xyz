import { motion } from 'framer-motion'

// =============================================================================
// PIXEL RUBIKS CUBE SVG
// =============================================================================

function VoxelRubiksCube({ px = 8 }: { px?: number }) {
  const gap = px * 0.2
  const size = px * 3
  const totalW = size * 3 + gap * 4
  const totalH = size * 3 + gap * 4
  
  const colors = [
    ['#FF0000', '#800080', '#0000FF'],
    ['#FFA500', '#FFFFFF', '#00FFFF'],
    ['#FFFF00', '#00FF00', '#008000']
  ]
  
  return (
    <svg
      width={totalW}
      height={totalH}
      viewBox={`0 0 ${totalW} ${totalH}`}
      style={{ imageRendering: 'pixelated', display: 'block' }}
      aria-hidden
    >
      <rect width={totalW} height={totalH} fill="#000000" />
      {colors.map((row, r) => 
        row.map((color, c) => (
          <rect
            key={`${r}-${c}`}
            x={gap + c * (size + gap)}
            y={gap + r * (size + gap)}
            width={size}
            height={size}
            fill={color}
          />
        ))
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
      {/* Pixel Rubiks Cube badge */}
      <motion.button
        onClick={onClick}
        className="relative select-none cursor-pointer flex items-center justify-center p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        style={{ background: 'none', border: 'none' }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 480, damping: 28 }}
        aria-label="Settings"
        title="Settings"
      >
        <VoxelRubiksCube px={4} />
      </motion.button>
    </div>
  )
}
