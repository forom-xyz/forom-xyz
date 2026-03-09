import { useState } from 'react'
import { motion } from 'framer-motion'
import romWht from '../assets/icons/rom_wht.png'

const LANGUAGES = [
  { id: 'ar', label: 'مرحبا' },
  { id: 'hi', label: 'स्वागत' },
  { id: 'es', label: 'BIENVENIDO' },
  { id: 'fr', label: 'BIENVENUE' },
  { id: 'en', label: 'WELCOME' },
  { id: 'zh', label: '歡迎' },
]

export function ForomLobby({ onConfirm }: { onConfirm: () => void }) {
  const [selectedLanguage, setSelectedLanguage] = useState('fr')
  const [isCreateSelected, setIsCreateSelected] = useState(false)

  return (
    <div style={{
      backgroundColor: '#000000',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      fontFamily: 'sans-serif',
      color: 'white',
      boxSizing: 'border-box',
    }}>
      {/* Three columns */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '75%',
        maxWidth: '1200px',
        padding: '0 40px',
        gap: '32px',
        boxSizing: 'border-box',
      }}>

        {/* LEFT: REJOINDRE */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            color: '#E85C5C',
            fontWeight: 900,
            fontSize: '22px',
            letterSpacing: '0.25em',
            marginBottom: '24px',
            textTransform: 'uppercase',
          }}>REJOINDRE</div>
          <div style={{
            backgroundColor: '#1A1A1A',
            borderRadius: '20px',
            padding: '24px',
            flex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '10px',
              width: '100%',
            }}>
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} style={{
                  backgroundColor: '#3A3A3A',
                  borderRadius: '10px',
                  aspectRatio: '1',
                  opacity: 0.7,
                  cursor: 'not-allowed',
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE: LOGO & LANGUAGE WHEEL */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: '0px',
        }}>
          <img src={romWht} alt="Forom Logo" style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '32px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.id
              return (
                <motion.div
                  key={lang.id}
                  onClick={() => setSelectedLanguage(lang.id)}
                  animate={{ scale: isSelected ? 1.15 : 1, opacity: isSelected ? 1 : 0.4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  style={{
                    color: isSelected ? '#FFD700' : '#888888',
                    fontWeight: 900,
                    fontSize: isSelected ? '32px' : '16px',
                    letterSpacing: '0.2em',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                    userSelect: 'none',
                  }}
                >
                  {lang.label}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* RIGHT: CRÉER */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            color: '#2563EB',
            fontWeight: 900,
            fontSize: '22px',
            letterSpacing: '0.25em',
            marginBottom: '24px',
            textTransform: 'uppercase',
          }}>CRÉER</div>
          <div
            onClick={() => setIsCreateSelected(true)}
            style={{
              backgroundColor: isCreateSelected ? '#222222' : '#1A1A1A',
              borderRadius: '20px',
              flex: 1,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: `4px solid ${isCreateSelected ? '#2563EB' : 'transparent'}`,
              boxSizing: 'border-box',
              transition: 'border-color 0.2s, background-color 0.2s',
            }}
          >
            <span style={{ color: 'white', fontSize: '56px', fontWeight: 300, lineHeight: 1 }}>+</span>
          </div>
        </div>

      </div>

      {/* CONFIRMER BUTTON */}
      <div style={{ marginTop: '36px', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={() => { if (isCreateSelected) onConfirm() }}
          disabled={!isCreateSelected}
          style={{
            padding: '16px 64px',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: '20px',
            letterSpacing: '0.05em',
            border: 'none',
            cursor: isCreateSelected ? 'pointer' : 'not-allowed',
            backgroundColor: isCreateSelected ? '#5B9F65' : 'rgba(91,159,101,0.35)',
            color: isCreateSelected ? '#ffffff' : 'rgba(255,255,255,0.4)',
            transition: 'background-color 0.2s, color 0.2s',
          }}
        >
          Confirmer
        </button>
      </div>
    </div>
  )
}
