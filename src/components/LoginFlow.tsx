import { useState } from 'react'
import { motion } from 'framer-motion'
import chromaPortalIcon from '../assets/icons/chroma_portal.svg'

interface LoginFlowProps {
  onSubmit: (data: { username: string; password: string }) => void
  onClose: () => void
  error?: string | null
}

export function LoginFlow({ onSubmit, onClose, error }: LoginFlowProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim() && password) {
      onSubmit({ username: username.trim(), password })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, backgroundColor: '#111111' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        overflow: 'hidden',
      }}
    >
      <img
        src={chromaPortalIcon}
        alt="Chroma portal"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          width: 'clamp(32px, 4vw, 48px)',
          height: 'clamp(32px, 4vw, 48px)',
          cursor: 'pointer'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '500px',
          padding: '40px 20px'
        }}
      >
        <h2 style={{
          fontFamily: "'Jersey 15', sans-serif",
          fontSize: 'clamp(40px, 6vw, 64px)',
          letterSpacing: '0.1em',
          marginBottom: '40px',
          color: '#ffffff'
        }}>
          CONNEXION
        </h2>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)' }}>
              Pseudonyme
            </label>
            <input
              type="text"
              placeholder="Ton pseudo"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                outline: 'none',
                textAlign: 'center',
                fontSize: '24px',
                fontFamily: "'JetBrains Mono', monospace",
                color: 'white',
                padding: '16px',
                borderRadius: '12px',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#8A2BE2'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)' }}>
              Mot de passe
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                outline: 'none',
                textAlign: 'center',
                fontSize: '24px',
                fontFamily: "'JetBrains Mono', monospace",
                color: 'white',
                padding: '16px',
                borderRadius: '12px',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#8A2BE2'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', opacity: 0.7, marginTop: '4px', cursor: 'pointer' }}>
              <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} /> Montrer le mot de passe
            </label>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                color: '#ef4444',
                backgroundColor: 'rgba(239,68,68,0.1)',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '14px',
                fontWeight: 'bold',
                border: '1px solid rgba(239,68,68,0.2)'
              }}
            >
              {error}
            </motion.div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '50px', height: '50px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', border: 'none',
                color: 'white', fontSize: '24px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              ✕
            </motion.button>

            <motion.button
              type="submit"
              disabled={!username.trim() || !password}
              whileHover={(username.trim() && password) ? { scale: 1.05 } : {}}
              whileTap={(username.trim() && password) ? { scale: 0.95 } : {}}
              style={{
                background: '#8A2BE2',
                color: 'white',
                border: 'none',
                borderRadius: '999px',
                padding: '16px 64px',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 'bold',
                fontSize: '18px',
                cursor: (username.trim() && password) ? 'pointer' : 'not-allowed',
                opacity: (username.trim() && password) ? 1 : 0.5,
                boxShadow: '0 8px 16px rgba(138,43,226,0.3)'
              }}
            >
              Entrée
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
