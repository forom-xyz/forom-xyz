import { useState } from 'react'
import { motion } from 'framer-motion'
import romWht from '../assets/icons/rom_wht.png'

interface ChooseColorScreenProps {
  onConfirm: (color: ForomColor) => void
  onBack: () => void
}

export type ForomColor = 'social' | 'guardien' | 'creation'

const COLORS: { id: ForomColor; label: string; bg: string; text: string }[] = [
  { id: 'social',   label: 'SOCIAL',   bg: '#3333DD', text: '#ffffff' },
  { id: 'guardien', label: 'GUARDIEN', bg: '#EE2222', text: '#ffffff' },
  { id: 'creation', label: 'CRÉATION', bg: '#DDFF55', text: '#ffffff' },
]

// Visual color dot used in UserModal
export const FOROM_COLOR_MAP: Record<ForomColor, { bg: string; label: string }> = {
  social:   { bg: '#3333DD', label: 'SOCIAL'   },
  guardien: { bg: '#EE2222', label: 'GUARDIEN' },
  creation: { bg: '#DDFF55', label: 'CRÉATION' },
}

export function ChooseColorScreen({ onConfirm, onBack }: ChooseColorScreenProps) {
  const [selected, setSelected] = useState<ForomColor | null>(null)

  const canConfirm = selected !== null

  // Match exact size from mission screen
  const imgW = 'clamp(160px, 22vw, 320px)'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      style={{
        backgroundColor: '#585858',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        fontFamily: 'Montserrat, sans-serif',
        color: 'white',
        boxSizing: 'border-box',
        padding: 'clamp(32px, 6vh, 72px) clamp(24px, 6vw, 120px)',
      }}
    >
      {/* Logo — shared layoutId with CreateForomScreen */}
      <motion.div
        layoutId="forom-logo"
        style={{ position: 'relative', width: imgW, aspectRatio: '3240 / 4050', flexShrink: 0 }}
      >
        <img
          src={romWht}
          alt="Forom Logo"
          style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
        />
        {/* F — fades in during transition */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '49%',
            transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(20px, 2.6vw, 40px)',
            fontWeight: 900,
            fontFamily: 'Montserrat, sans-serif',
            color: '#FF0000',
            pointerEvents: 'none',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          F
        </motion.span>
        {/* M — animates from center (mission screen) to right side */}
        <motion.span
          layoutId="forom-m"
          style={{
            position: 'absolute',
            left: '77%',
            top: '49%',
            transform: 'translateY(-50%)',
            fontSize: 'clamp(20px, 2.6vw, 40px)',
            fontWeight: 900,
            fontFamily: 'Montserrat, sans-serif',
            color: '#0066FF',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
          }}
        >
          M
        </motion.span>
      </motion.div>

      {/* Middle section: title + circles grouped so space-between works with 3 children */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(20px, 3vh, 44px)',
        width: '100%',
      }}>
        <h2 style={{
          margin: 0,
          fontWeight: 400,
          fontFamily: "'Jersey 15', sans-serif",
          fontSize: 'clamp(18px, 2.4vw, 36px)',
          letterSpacing: '0.06em',
          textAlign: 'center',
          color: '#ffffff',
        }}>
          Choisi ta couleur
        </h2>

        {/* Color circles */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 'clamp(24px, 5vw, 80px)',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}>
        {COLORS.map(({ id, label, bg, text }) => {
          const isSelected = selected === id
          return (
            <motion.div
              key={id}
              onClick={() => setSelected(id)}
              animate={{
                scale: isSelected ? 1.08 : 1,
                boxShadow: isSelected
                  ? `0 0 0 5px white, 0 0 0 8px ${bg}`
                  : '0 0 0 0px transparent',
              }}
              whileHover={{ scale: isSelected ? 1.08 : 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 340, damping: 26 }}
              style={{
                width: 'clamp(120px, 16vw, 230px)',
                height: 'clamp(120px, 16vw, 230px)',
                borderRadius: '50%',
                backgroundColor: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                userSelect: 'none',
                flexShrink: 0,
              }}
            >
              <span style={{
                color: text,
                fontWeight: 400,
                fontFamily: "'Jersey 15', sans-serif",
                fontSize: 'clamp(13px, 1.6vw, 24px)',
                letterSpacing: '0.12em',
                textAlign: 'center',
                textShadow: id === 'creation' ? '0 1px 3px rgba(0,0,0,0.35)' : 'none',
              }}>
                {label}
              </span>
            </motion.div>
          )
        })}
        </div>
      </div>

      {/* Buttons — shared layoutId with CreateForomScreen */}
      <motion.div
        layoutId="forom-buttons"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(16px, 2.5vw, 36px)',
        }}
      >
        {/* Back */}
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          style={{
            width: 'clamp(52px, 6vw, 72px)',
            height: 'clamp(52px, 6vw, 72px)',
            borderRadius: '999px',
            backgroundColor: '#555555',
            border: 'none',
            cursor: 'pointer',
            color: '#ffffff',
            fontSize: 'clamp(18px, 2vw, 26px)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {'<'}
        </motion.button>

        {/* Confirm */}
        <motion.button
          onClick={() => canConfirm && onConfirm(selected!)}
          disabled={!canConfirm}
          whileHover={canConfirm ? { scale: 1.04 } : {}}
          whileTap={canConfirm ? { scale: 0.96 } : {}}
          style={{
            padding: 'clamp(14px, 2vh, 22px) clamp(52px, 8vw, 110px)',
            borderRadius: '999px',
            backgroundColor: canConfirm ? '#F97316' : 'rgba(249,115,22,0.35)',
            border: 'none',
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            color: canConfirm ? '#ffffff' : 'rgba(255,255,255,0.4)',
            fontSize: 'clamp(16px, 2vw, 26px)',
            fontWeight: 700,
            letterSpacing: '0.04em',
            transition: 'background-color 0.2s, color 0.2s',
          }}
        >
          Confirmer
        </motion.button>

        {/* Erase selection */}
        <motion.button
          onClick={() => setSelected(null)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          style={{
            width: 'clamp(52px, 6vw, 72px)',
            height: 'clamp(52px, 6vw, 72px)',
            borderRadius: '999px',
            backgroundColor: '#555555',
            border: 'none',
            cursor: 'pointer',
            color: '#ffffff',
            fontSize: 'clamp(16px, 1.8vw, 24px)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          ✕
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
