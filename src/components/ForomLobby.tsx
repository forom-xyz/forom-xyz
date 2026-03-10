import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import romWht from '../assets/icons/rom_wht.png'
import githubIcon from '../assets/icons/github.png'

const LANGUAGES = [
  { id: 'ar', label: 'مرحبا' },
  { id: 'hi', label: 'स्वागत' },
  { id: 'es', label: 'BIENVENIDO' },
  { id: 'fr', label: 'BIENVENUE' },
  { id: 'en', label: 'WELCOME' },
  { id: 'zh', label: '歡迎' },
]

const N = LANGUAGES.length
const ITEM_H = 72 // px per carousel slot
const VISIBLE = 5  // number of visible slots

function getLang(idx: number) {
  return LANGUAGES[((idx % N) + N) % N]
}

function LanguageCarousel({
  onChange,
}: {
  onChange: (id: string) => void
}) {
  // Start centered on 'fr' (index 3)
  const [center, setCenter] = useState(3)

  const move = useCallback((dir: number) => {
    setCenter(prev => {
      const next = prev + dir
      onChange(getLang(next).id)
      return next
    })
  }, [onChange])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    move(e.deltaY > 0 ? 1 : -1)
  }, [move])

  // Render VISIBLE + 2 extra items (one above, one below) for smooth entry/exit
  const half = Math.floor(VISIBLE / 2) + 1 // 3
  const slots = Array.from({ length: VISIBLE + 2 }, (_, i) => center - half + i)
  const containerH = VISIBLE * ITEM_H

  return (
    <div
      onWheel={handleWheel}
      style={{
        position: 'relative',
        width: '100%',
        height: containerH,
        overflow: 'hidden',
        cursor: 'ns-resize',
        // Fade top and bottom edges
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
      }}
    >
      {slots.map((p) => {
        const dist = p - center // -half … +half
        const lang = getLang(p)
        const isCenter = dist === 0
        const absD = Math.abs(dist)

        return (
          <motion.div
            key={p}
            onClick={() => {
              setCenter(p)
              onChange(lang.id)
            }}
            initial={false}
            animate={{
              y: (dist + half - 1) * ITEM_H,
              opacity: isCenter ? 1 : absD === 1 ? 0.45 : 0.2,
              scale: isCenter ? 1.12 : absD === 1 ? 0.88 : 0.72,
            }}
            transition={{ type: 'spring', stiffness: 340, damping: 30, mass: 0.8 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: ITEM_H,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              color: isCenter ? '#FFD700' : '#888888',
              fontWeight: 900,
              fontSize: isCenter
                ? 'clamp(22px, 3vw, 48px)'
                : absD === 1
                  ? 'clamp(13px, 1.6vw, 24px)'
                  : 'clamp(9px, 1.1vw, 16px)',
              letterSpacing: '0.2em',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              willChange: 'transform, opacity',
            }}
          >
            {lang.label}
          </motion.div>
        )
      })}
    </div>
  )
}

export function ForomLobby({ onConfirm }: { onConfirm: () => void }) {
  const [selectedLanguage, setSelectedLanguage] = useState('fr')
  const [isCreateSelected, setIsCreateSelected] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{
        backgroundColor: '#000000',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'sans-serif',
        color: 'white',
        boxSizing: 'border-box',
        padding: 'clamp(16px, 4vh, 48px) clamp(16px, 3vw, 48px) clamp(16px, 3vh, 36px)',
      }}
    >
      {/* Three columns — fills all available vertical space */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        flex: 1,
        minHeight: 0,
        gap: 'clamp(12px, 2vw, 36px)',
        boxSizing: 'border-box',
        alignItems: 'center',
      }}>

        {/* LEFT: REJOINDRE */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            color: '#E85C5C',
            fontWeight: 900,
            fontSize: 'clamp(13px, 1.6vw, 26px)',
            letterSpacing: '0.25em',
            marginBottom: 'clamp(10px, 2vh, 24px)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>REJOINDRE</div>
          <div style={{
            backgroundColor: '#1A1A1A',
            borderRadius: 'clamp(12px, 1.5vw, 24px)',
            padding: 'clamp(10px, 1.8vw, 28px)',
            width: '100%',
            aspectRatio: '1 / 1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 'clamp(5px, 0.8vw, 12px)',
              width: '100%',
            }}>
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} style={{
                  backgroundColor: '#3A3A3A',
                  borderRadius: 'clamp(6px, 0.7vw, 12px)',
                  aspectRatio: '1 / 1',
                  opacity: 0.7,
                  cursor: 'not-allowed',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 'clamp(10px, 1.1vw, 18px)', opacity: 0.5, userSelect: 'none' }}>🔒</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE: LOGO & LANGUAGE CAROUSEL */}
        <div style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img
            src={romWht}
            alt="Forom Logo"
            style={{
              width: 'clamp(52px, 7vw, 110px)',
              height: 'clamp(52px, 7vw, 110px)',
              objectFit: 'contain',
              marginBottom: 'clamp(24px, 4vh, 56px)',
              flexShrink: 0,
            }}
          />
          <LanguageCarousel onChange={setSelectedLanguage} />

          {/* GitHub icon — same gap as between logo and carousel */}
          <a
            href="https://github.com/Forom-ets/forom"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginTop: 'clamp(24px, 4vh, 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <img
              src={githubIcon}
              alt="GitHub"
              style={{
                width: 'clamp(28px, 3.5vw, 52px)',
                height: 'clamp(28px, 3.5vw, 52px)',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
                opacity: 0.8,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
            />
          </a>
        </div>

        {/* RIGHT: CRÉER */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            color: '#2563EB',
            fontWeight: 900,
            fontSize: 'clamp(13px, 1.6vw, 26px)',
            letterSpacing: '0.25em',
            marginBottom: 'clamp(10px, 2vh, 24px)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>CRÉER</div>
          <div
            onClick={() => setIsCreateSelected(true)}
            style={{
              backgroundColor: isCreateSelected ? '#0d2b5e' : '#1A1A1A',
              borderRadius: 'clamp(12px, 1.5vw, 24px)',
              width: '100%',
              aspectRatio: '1 / 1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: `3px solid ${isCreateSelected ? '#2563EB' : 'transparent'}`,
              boxSizing: 'border-box',
              transition: 'border-color 0.25s, background-color 0.25s',
            }}
          >
            <span style={{ color: 'white', fontSize: 'clamp(28px, 4vw, 64px)', fontWeight: 300, lineHeight: 1 }}>+</span>
          </div>
        </div>

      </div>

      {/* CONFIRMER BUTTON */}
      <div style={{ marginTop: 'clamp(14px, 2.5vh, 36px)', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <button
          onClick={() => { if (isCreateSelected) onConfirm() }}
          disabled={!isCreateSelected}
          style={{
            padding: 'clamp(10px, 1.5vh, 18px) clamp(40px, 5vw, 80px)',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: 'clamp(14px, 1.5vw, 22px)',
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
    </motion.div>
  )
}
