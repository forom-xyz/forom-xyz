import { useState } from 'react'
import { motion } from 'framer-motion'
import chromaPortalIcon from '../assets/icons/chroma_portal.svg'

interface ProfileSetupProps {
  email?: string
  onSubmit: (username: string) => void
  onBack: () => void
  onClose: () => void
}

export function ProfileSetup({ email = 'rom@forom.xyz', onSubmit, onBack, onClose }: ProfileSetupProps) {
  const [username, setUsername] = useState('')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#2b2b2b',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      <img
        src={chromaPortalIcon}
        alt="Chroma portal"
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          width: 'clamp(32px, 4vw, 48px)',
          height: 'clamp(32px, 4vw, 48px)',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px' }}>
        <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '16px' }}>
          Ton pseudonyme
        </h2>

        <input
          type="text"
          placeholder="Sans nom"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            textAlign: 'center',
            fontSize: 'clamp(40px, 8vw, 80px)',
            fontFamily: "'Jersey 15', sans-serif",
            color: 'white',
            width: '100%',
            marginBottom: '40px',
          }}
        />

        <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '8px' }}>
          Signature
        </h3>

        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '14px',
          fontStyle: 'italic',
          opacity: 0.6,
          marginBottom: '60px'
        }}>
          {email}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: 'auto', marginBottom: '60px' }}>
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', border: 'none',
            color: 'white', fontSize: '18px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          {'<'}
        </motion.button>

        <motion.button
          onClick={() => onSubmit(username.trim() || 'Sans nom')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: '#8A2BE2', // Purple pill
            color: 'white',
            border: 'none',
            borderRadius: '999px',
            padding: '16px 48px',
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 8px 16px rgba(138,43,226,0.3)'
          }}
        >
          Confirmer
        </motion.button>

        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', border: 'none',
            color: 'white', fontSize: '18px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          ✕
        </motion.button>
      </div>
    </motion.div>
  )
}
