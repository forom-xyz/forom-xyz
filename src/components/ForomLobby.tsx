import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import romWht from '../assets/icons/rom_wht.png'
import foromLogoWht from '../assets/icons/forom_logo_wht.png'
import githubIcon from '../assets/icons/github.png'
import chromaNotesIcon from '../assets/icons/chroma_notes.svg'
import userIcon from '../assets/icons/user.png'

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

export function ForomLobby({ onConfirm, onSkip, onSignIn, currentUser }: { onConfirm: () => void; onSkip?: () => void; onSignIn?: (username: string) => void; currentUser?: string | null }) {
  const [isCreateSelected, setIsCreateSelected] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showDevLogin, setShowDevLogin] = useState(false)

  const [joinKey, setJoinKey] = useState('')
  const [joinStep, setJoinStep] = useState<'idle' | 'color' | 'rule'>('idle')
  const [joinColor, setJoinColor] = useState<string | null>(null)
  const [joinRule, setJoinRule] = useState('')

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'xylo' && password === 'colors') {
      onSignIn?.(username)
      setIsSignInOpen(false)
    } else {
      alert('Invalid credentials')
    }
  }

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
        position: 'relative',
      }}
    >
      {/* SKIP TO FOROM */}
      {onSkip && !isSignInOpen && (
        <button
          onClick={onSkip}
          className="absolute z-50 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform"
          style={{
            top: '32px',
            left: '32px',
            width: '48px',
            height: '48px',
            background: 'none',
            border: 'none',
            padding: 0
          }}
          title={currentUser ? "Consulter le FOROM" : "Consulter le FOROM (Fantôme)"}
        >
          <img src={chromaNotesIcon} alt="Return to Forom" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </button>
      )}

      {/* SIGN IN TOGGLE */}
      {!isSignInOpen && !currentUser && (
        <button
          onClick={() => setIsSignInOpen(true)}
          className="absolute z-50 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform"
          style={{
            top: '32px',
            right: '32px',
            width: '48px',
            height: '48px',
            background: 'none',
            border: 'none',
            padding: 0,
            filter: 'brightness(0) invert(1)'
          }}
          title="Sign In"
        >
          <img src={userIcon} alt="Sign In" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </button>
      )}

      {/* SIGN IN MODAL */}
      {isSignInOpen && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.92)',
          zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: '#111', padding: '40px 36px 32px', borderRadius: '20px',
            display: 'flex', flexDirection: 'column', gap: '14px', width: 'min(90vw, 360px)',
            border: '1px solid rgba(255,255,255,0.12)', position: 'relative',
          }}>
            {/* Close */}
            <button
              onClick={() => { setIsSignInOpen(false); setShowDevLogin(false) }}
              style={{ position: 'absolute', top: '14px', right: '18px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '24px', cursor: 'pointer', lineHeight: 1 }}
            >×</button>

            <h2 style={{ margin: '0 0 6px', fontSize: '20px', textAlign: 'center', fontWeight: 700, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Jersey 15', sans-serif" }}>Se connecter</h2>

            {!showDevLogin ? (
              <>
                {/* OAuth provider buttons */}
                {([
                  { id: 'google',    label: 'Google',         bg: '#fff',    fg: '#111',    border: '#ddd',  soon: false },
                  { id: 'discord',   label: 'Discord',        bg: '#5865F2', fg: '#fff',    border: '#5865F2', soon: false },
                  { id: 'microsoft', label: 'Microsoft',      bg: '#00A4EF', fg: '#fff',    border: '#00A4EF', soon: false },
                  { id: 'meta',      label: 'Meta',           bg: '#0467DF', fg: '#fff',    border: '#0467DF', soon: false },
                  { id: 'x',         label: 'X',              bg: '#000',    fg: '#fff',    border: '#555',  soon: false },
                  { id: 'apple',     label: 'Apple',          bg: '#000',    fg: '#fff',    border: '#555',  soon: false },
                  { id: 'ets',       label: 'ETS — Authentik',bg: '#1a1a1a', fg: '#6CB4E4', border: '#6CB4E4', soon: true  },
                ] as const).map(p => (
                  <button
                    key={p.id}
                    disabled
                    title={p.soon ? 'Bientôt disponible' : 'Bientôt disponible — OAuth2 / JWT à venir'}
                    style={{
                      position: 'relative',
                      padding: '11px 18px',
                      borderRadius: '10px',
                      border: `1px solid ${p.border}`,
                      backgroundColor: p.bg,
                      color: p.fg,
                      fontSize: '14px',
                      fontWeight: 600,
                      fontFamily: 'Montserrat, sans-serif',
                      cursor: 'not-allowed',
                      opacity: 0.6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {p.label}
                    <span style={{ marginLeft: 'auto', fontSize: '10px', opacity: 0.7, fontStyle: 'italic', fontWeight: 400 }}>
                      {p.soon ? '✦ bientôt' : 'bientôt'}
                    </span>
                  </button>
                ))}

                {/* Dev login toggle */}
                <button
                  onClick={() => setShowDevLogin(true)}
                  style={{ marginTop: '4px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', fontSize: '11px', cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.05em' }}
                >dev</button>
              </>
            ) : (
              /* Developer login (xylo only) */
              <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.35)', textAlign: 'center', fontFamily: 'monospace' }}>accès développeur</p>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#222', color: 'white', outline: 'none', fontSize: '14px' }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#222', color: 'white', outline: 'none', fontSize: '14px' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setShowDevLogin(false)}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#333', color: 'white', cursor: 'pointer', fontSize: '14px' }}
                  >Retour</button>
                  <button type="submit"
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#2563EB', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}
                  >Connexion</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* KEY JOIN MODAL */}
      {joinStep !== 'idle' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.92)',
          zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '40px'
        }}>
          {joinStep === 'color' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
              <h2 style={{ margin: 0, fontWeight: 400, fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(24px, 3vw, 42px)', letterSpacing: '0.06em', textAlign: 'center', color: 'white' }}>
                Choisi ta couleur Forom
              </h2>
              <div style={{ display: 'flex', gap: '30px' }}>
                {[
                  { id: 'social', label: 'SOCIAL', bg: '#3333DD' },
                  { id: 'creation', label: 'CRÉATION', bg: '#FFD700' },
                  { id: 'guardien', label: 'GUARDIEN', bg: '#EE2222' }
                ].map(c => (
                  <div
                    key={c.id}
                    onClick={() => { setJoinColor(c.id); setJoinStep('rule'); }}
                    style={{ width: 'clamp(100px, 12vw, 160px)', height: 'clamp(100px, 12vw, 160px)', borderRadius: '50%', backgroundColor: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', border: joinColor === c.id ? `4px solid white` : 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = `0 0 0 4px white, 0 0 0 6px ${c.bg}` }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <span style={{ color: '#fff', fontWeight: 400, fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(14px, 1.8vw, 22px)', letterSpacing: '0.12em', textAlign: 'center' }}>
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {joinStep === 'rule' && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', width: 'min(90vw, 800px)' }}>
              <h2 style={{ margin: 0, fontWeight: 400, fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(20px, 2.5vw, 36px)', letterSpacing: '0.04em', textAlign: 'center', color: 'white' }}>
                Quelle est ta règle fondamentale pour ce FOROM ?
              </h2>
              <input
                autoFocus
                type="text"
                value={joinRule}
                onChange={e => setJoinRule(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && joinRule.trim()) {
                    setJoinStep('idle')
                    // Proceed to transition to lobby
                  }
                }}
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid rgba(255,255,255,0.6)', outline: 'none', color: '#fff', fontSize: 'clamp(16px, 2vw, 28px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 400, padding: '10px 0', textAlign: 'center', caretColor: '#fff' }}
                placeholder="Règle..."
              />
              <button
                onClick={() => {
                  if (joinRule.trim()) {
                    console.log('Friend joined Forom with rule:', joinRule, 'and color:', joinColor)
                    setJoinStep('idle')
                  }
                }}
                style={{ padding: '12px 36px', borderRadius: '999px', backgroundColor: '#555555', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 'clamp(16px, 1.8vw, 24px)', fontWeight: 'bold' }}
              >
                Rejoindre le FOROM
              </button>
            </motion.div>
          )}
          
          <button 
            onClick={() => setJoinStep('idle')} 
            style={{ position: 'absolute', top: '30px', right: '30px', background: 'transparent', border: 'none', color: 'white', fontSize: '40px', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      )}

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
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(6px, 1vh, 14px)',
            boxSizing: 'border-box',
          }}>

            {/*
              PUBLICIZATION RULES (future enforcement):
              A forom can only become public when ALL of the following are true:
                1. It has its 8 supermoderators assigned
                2. All 3 season phases (V1 → V2 → V3) are completed
                3. It has existed for at least 1 year
                4. NOT all supermoderators are currently active
                   (at least one must have departed — ensures the community
                    has proven it can survive supermod turnover before going public)
            */}

            {/* ── PUBLIC ───────────────────────────────────────── */}
            {/* The main FOROM is the only public forom at launch. */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: 'clamp(8px, 0.8vw, 11px)', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>Public</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'clamp(5px, 0.8vw, 12px)' }}>
              {/* Slot 0 — the main FOROM (public, hardcoded) */}
              <div
                onClick={() => onSkip?.()}
                title="FOROM — Sauver les communautés"
                style={{
                  backgroundColor: '#000000',
                  borderRadius: 'clamp(6px, 0.7vw, 12px)',
                  aspectRatio: '1 / 1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(255,255,255,0.25)',
                  transition: 'border-color 0.2s, transform 0.15s',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFD700'; e.currentTarget.style.transform = 'scale(1.06)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'scale(1)' }}
              >
                <img src={foromLogoWht} alt="FOROM" style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
              </div>
              {/* Public slots 1–9 — locked until other foroms qualify */}
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i + 1} style={{
                  backgroundColor: '#3A3A3A',
                  borderRadius: 'clamp(6px, 0.7vw, 12px)',
                  aspectRatio: '1 / 1',
                  opacity: 0.7,
                  cursor: 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 'clamp(10px, 1.1vw, 18px)', opacity: 0.5, userSelect: 'none' }}>🔒</span>
                </div>
              ))}
            </div>

            {/* ── DIVIDER ──────────────────────────────────────── */}
            <div style={{ margin: 'clamp(2px, 0.5vh, 8px) 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.18)' }} />
            </div>

            {/* ── PRIVÉ ─────────────────────────────────────── */}
            {/* Private foroms — only visible once logged in */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: 'clamp(8px, 0.8vw, 11px)', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>Privé</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'clamp(5px, 0.8vw, 12px)' }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} style={{
                  backgroundColor: '#3A3A3A',
                  borderRadius: 'clamp(6px, 0.7vw, 12px)',
                  aspectRatio: '1 / 1',
                  opacity: 0.7,
                  cursor: 'not-allowed',
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
          <LanguageCarousel onChange={() => {}} />

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

          {/* CONNECT WITH A KEY */}
          <div style={{ marginTop: 'clamp(16px, 3vh, 32px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span style={{ fontSize: 'clamp(10px, 1.1vw, 15px)', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Connect with a Key</span>
            <input 
              type="text" 
              value={joinKey}
              onChange={e => setJoinKey(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && joinKey.trim().length > 0) {
                  setJoinStep('color')
                }
              }}
              placeholder="FRM-XXXX-XXXX"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', padding: '6px 12px', color: '#fff', fontSize: 'clamp(12px, 1.4vw, 18px)', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center', width: 'clamp(140px, 16vw, 200px)', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#FFD700'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
            />
          </div>
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
            onClick={() => {
              if (currentUser) {
                setIsCreateSelected(true)
              } else {
                setIsSignInOpen(true)
              }
            }}
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
            {currentUser ? (
              <span style={{ color: 'white', fontSize: 'clamp(28px, 4vw, 64px)', fontWeight: 300, lineHeight: 1 }}>+</span>
            ) : (
              <span style={{ fontSize: 'clamp(32px, 5vw, 72px)', opacity: 0.5, userSelect: 'none' }}>🔒</span>
            )}
          </div>
        </div>

      </div>

      {/* CONFIRMER BUTTON */}
      <div style={{ marginTop: 'clamp(14px, 2.5vh, 36px)', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <button
          onClick={() => { if (isCreateSelected && currentUser) onConfirm() }}
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
