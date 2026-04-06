import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import chromaPortalIcon from '../assets/icons/chroma_portal.svg'
import foromLogoBlk from '../assets/icons/forom_logo_blk.png'

interface CustomEnrollmentFlowProps {
  onSubmit: (data: { username: string; email: string; color: string; town: string }) => void
  onClose: () => void
}

export function CustomEnrollmentFlow({ onSubmit, onClose }: CustomEnrollmentFlowProps) {
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [town, setTown] = useState('')

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleFinalSubmit = () => {
    onSubmit({
      username: username.trim(),
      email: email.trim(),
      color: selectedColor || 'Social',
      town: town.trim() || 'Quelque part dans l\'univers...'
    })
  }

  const getBackgroundColor = () => {
    switch (step) {
      case 1: return '#2b2b2b'
      case 2: return '#555555'
      case 3: return '#888888'
      case 4: return '#e0e0e0'
      default: return '#2b2b2b'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, backgroundColor: getBackgroundColor() }}
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
        color: step === 4 ? 'black' : 'white',
        overflow: 'hidden',
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

      <AnimatePresence mode="wait">
        {/* STEP 1: Identity */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto', width: '100%', maxWidth: '600px' }}>
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

              <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '16px' }}>
                Ton email
              </h2>

              <input
                type="email"
                placeholder="rom@forom.xyz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  textAlign: 'center',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 'clamp(18px, 4vw, 32px)',
                  fontWeight: 'bold',
                  letterSpacing: '0.05em',
                  color: 'white',
                  width: '100%',
                  marginBottom: '60px',
                  opacity: 0.8
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '60px' }}>
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

              <motion.button
                onClick={handleNext}
                disabled={!username.trim() || !email.trim()}
                whileHover={(username.trim() && email.trim()) ? { scale: 1.05 } : {}}
                whileTap={(username.trim() && email.trim()) ? { scale: 0.95 } : {}}
                style={{
                  background: '#8A2BE2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '16px 48px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: (username.trim() && email.trim()) ? 'pointer' : 'not-allowed',
                  opacity: (username.trim() && email.trim()) ? 1 : 0.5,
                  boxShadow: '0 8px 16px rgba(138,43,226,0.3)'
                }}
              >
                Suivant
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Color */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto', width: '100%', maxWidth: '800px' }}>
              <h2 style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(32px, 5vw, 64px)', letterSpacing: '0.05em', marginBottom: 'clamp(40px, 8vh, 80px)' }}>
                Ta couleur
              </h2>

              <div style={{ display: 'flex', gap: 'clamp(20px, 4vw, 40px)', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 'clamp(40px, 8vh, 80px)' }}>
                {[
                  { id: 'Social', color: '#3b00ff', text: 'Social', textCol: 'white' },
                  { id: 'Créatif', color: '#ffdd44', text: 'Créatif', textCol: 'black' },
                  { id: 'Sécurité', color: '#ff3333', text: 'Sécurité', textCol: 'white' },
                ].map((c) => (
                  <motion.div
                    key={c.id}
                    onClick={() => setSelectedColor(c.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: 'clamp(100px, 15vw, 160px)',
                      height: 'clamp(100px, 15vw, 160px)',
                      borderRadius: '50%',
                      backgroundColor: c.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: selectedColor === c.id ? '4px solid white' : '4px solid transparent',
                      boxShadow: selectedColor === c.id ? `0 0 20px ${c.color}` : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold', fontSize: 'clamp(12px, 1.5vw, 16px)', color: c.textCol }}>
                      {c.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '60px' }}>
              <motion.button
                onClick={handlePrev}
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
                onClick={handleNext}
                disabled={!selectedColor}
                whileHover={selectedColor ? { scale: 1.05 } : {}}
                whileTap={selectedColor ? { scale: 0.95 } : {}}
                style={{
                  background: '#ff8c00',
                  color: 'white',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '16px 48px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: selectedColor ? 'pointer' : 'not-allowed',
                  opacity: selectedColor ? 1 : 0.5,
                  boxShadow: '0 8px 16px rgba(255,140,0,0.3)'
                }}
              >
                Suivant
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
        )}

        {/* STEP 3: Town */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto', width: '100%', maxWidth: '600px' }}>
              <h2 style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(32px, 5vw, 64px)', letterSpacing: '0.05em', marginBottom: 'clamp(40px, 15vh, 120px)' }}>
                Ta Ville
              </h2>

              <input
                type="text"
                placeholder="Quelque part dans l'univers..."
                value={town}
                onChange={(e) => setTown(e.target.value)}
                autoFocus
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  textAlign: 'center',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 'clamp(14px, 2vw, 20px)',
                  fontWeight: 'bold',
                  letterSpacing: '0.1em',
                  color: 'white',
                  width: '100%',
                  marginBottom: 'clamp(40px, 15vh, 120px)'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '60px' }}>
              <motion.button
                onClick={handlePrev}
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
                onClick={handleNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '16px 48px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 16px rgba(16,185,129,0.3)'
                }}
              >
                Suivant
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
        )}

        {/* STEP 4: Welcome */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto', width: '100%', maxWidth: '800px' }}>
              <h2 style={{
                fontFamily: "'Jersey 15', sans-serif",
                fontSize: 'clamp(20px, 3vw, 32px)',
                letterSpacing: '0.1em',
                marginBottom: 'clamp(40px, 8vh, 80px)',
                textTransform: 'uppercase'
              }}>
                BIENVENU À LA MAISON <span style={{ color: '#eab308' }}>{username.trim() || 'SANS NOM'}</span>
              </h2>

              <img
                src={foromLogoBlk}
                alt="FOROM"
                style={{
                  width: 'clamp(200px, 30vw, 400px)',
                  height: 'auto',
                  objectFit: 'contain',
                  marginBottom: 'clamp(40px, 8vh, 80px)'
                }}
              />

              <div style={{
                fontFamily: "'Jersey 15', sans-serif",
                fontSize: 'clamp(24px, 4vw, 40px)',
                color: '#8A2BE2',
                letterSpacing: '0.05em',
                marginBottom: 'clamp(40px, 8vh, 80px)'
              }}>
                Changer le monde un pixel à la fois
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '60px' }}>
              <motion.button
                onClick={handlePrev}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'rgba(0,0,0,0.1)', border: 'none',
                  color: 'black', fontSize: '18px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                {'<'}
              </motion.button>

              <motion.button
                onClick={handleFinalSubmit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: '#000000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '16px 64px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                }}
              >
                Entrée
              </motion.button>

              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'rgba(0,0,0,0.1)', border: 'none',
                  color: 'black', fontSize: '18px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                ✕
              </motion.button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  )
}
