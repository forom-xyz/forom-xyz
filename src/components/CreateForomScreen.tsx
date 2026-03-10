import { useState } from 'react'
import { motion } from 'framer-motion'
import romWht from '../assets/icons/rom_wht.png'

interface CreateForomScreenProps {
  onConfirm: (mission: string) => void
  onBack: () => void
}

export function CreateForomScreen({ onConfirm, onBack }: CreateForomScreenProps) {
  const [mission, setMission] = useState('')

  const canConfirm = mission.trim().length > 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      style={{
        backgroundColor: '#2F2F2F',
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
      {/* Logo with M overlay — layoutId matches ChooseColorScreen for seamless transition */}
      <motion.div
        layoutId="forom-logo"
        style={{
          position: 'relative',
          width: 'clamp(160px, 22vw, 320px)',
          flexShrink: 0,
          aspectRatio: '3240 / 4050',
        }}
      >
        <img
          src={romWht}
          alt="Forom Logo"
          style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
        />
        {/* M starts at center — will animate to right side on next screen */}
        <motion.span
          layoutId="forom-m"
          style={{
            position: 'absolute',
            left: '50%',
            top: '49%',
            transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(20px, 2.6vw, 40px)',
            fontWeight: 900,
            fontFamily: 'Montserrat, sans-serif',
            color: '#0066FF',
            letterSpacing: '0.04em',
            pointerEvents: 'none',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          M
        </motion.span>
      </motion.div>

      {/* Question + Input block */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(20px, 4vh, 48px)',
        width: '100%',
      }}>
        {/* Question */}
        <h2 style={{
          margin: 0,
          fontWeight: 700,
          fontSize: 'clamp(20px, 2.8vw, 42px)',
          letterSpacing: '0.02em',
          textAlign: 'center',
          color: '#ffffff',
        }}>
          Quel est ta mission?
        </h2>

        {/* CLI-style input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(10px, 1.2vw, 20px)',
          width: 'min(86vw, 820px)',
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(22px, 2.8vw, 42px)',
            color: '#ffffff',
            fontWeight: 700,
            flexShrink: 0,
            lineHeight: 1,
          }}>
            {'>'}
          </span>
          <input
            autoFocus
            type="text"
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && canConfirm && onConfirm(mission.trim())}
            maxLength={64}
            placeholder=""
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              borderBottom: '2px solid rgba(255,255,255,0.55)',
              outline: 'none',
              color: '#ffffff',
              fontSize: 'clamp(18px, 2.2vw, 34px)',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 400,
              padding: 'clamp(4px, 0.8vh, 10px) 0',
              caretColor: '#ffffff',
            }}
          />
        </div>
      </div>

      {/* Buttons row — layoutId matches ChooseColorScreen for same vertical position */}
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
            width: 'clamp(52px, 6vw, 76px)',
            height: 'clamp(52px, 6vw, 76px)',
            borderRadius: '999px',
            backgroundColor: '#555555',
            border: 'none',
            cursor: 'pointer',
            color: '#ffffff',
            fontSize: 'clamp(18px, 2vw, 28px)',
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
          onClick={() => canConfirm && onConfirm(mission.trim())}
          disabled={!canConfirm}
          whileHover={canConfirm ? { scale: 1.04 } : {}}
          whileTap={canConfirm ? { scale: 0.96 } : {}}
          style={{
            padding: 'clamp(14px, 2vh, 24px) clamp(52px, 8vw, 120px)',
            borderRadius: '999px',
            backgroundColor: canConfirm ? '#8E579C' : 'rgba(142, 87, 156, 0.35)',
            border: 'none',
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            color: canConfirm ? '#ffffff' : 'rgba(255,255,255,0.4)',
            fontSize: 'clamp(16px, 2vw, 28px)',
            fontWeight: 700,
            letterSpacing: '0.04em',
            transition: 'background-color 0.2s, color 0.2s',
          }}
        >
          Confirmer
        </motion.button>

        {/* Erase */}
        <motion.button
          onClick={() => setMission('')}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          style={{
            width: 'clamp(52px, 6vw, 76px)',
            height: 'clamp(52px, 6vw, 76px)',
            borderRadius: '999px',
            backgroundColor: '#555555',
            border: 'none',
            cursor: 'pointer',
            color: '#ffffff',
            fontSize: 'clamp(16px, 1.8vw, 26px)',
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
