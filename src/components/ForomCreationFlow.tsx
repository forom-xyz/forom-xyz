import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import romWht from '../assets/icons/rom_wht.png'
import foromLogoWht from '../assets/icons/forom_logo_wht.png'
import foromLogoBlk from '../assets/icons/forom_logo_blk.png'
import type { ForomColor } from './ChooseColorScreen'

type Step = 'mission' | 'color' | 'friends' | 'rules' | 'welcome'

const COLOR_DEFS: { id: ForomColor; label: string; circleLabel: string; bg: string; border: string }[] = [
  { id: 'social',   label: 'SOCIAL',    circleLabel: 'SOCIAL',    bg: '#3333DD', border: '#3333DD' },
  { id: 'guardien', label: 'GUARDIEN',  circleLabel: 'GUARDIENS', bg: '#EE2222', border: '#EE2222' },
  { id: 'creation', label: 'CRÉATION',  circleLabel: 'CRÉATION',  bg: '#DDFF55', border: '#DDFF55' },
]

const ROM_TEXT = `Mais qui est ROM ? Ou plutôt, qui deviendra-t-il ? Car c'est à vous d'en décider dès maintenant et au fil du temps. Ces 10 règles fondamentales constitueront la base logique de votre robot communautaire ; elles sont donc primordiales. Je dirais même que c'est la décision la plus importante de votre aventure, mais ne paniquez pas : en tant que créateurs, vous aurez toujours le pouvoir de les modifier.

Bien que ROM soit un système RAG logique nécessitant peu de ressources, il a tout de même besoin de données et d'une grille structurelle pour être capable d'identifier des corrélations à long terme. C'est ici que l'outil prend tout son sens : en organisant l'information sous la forme d'une grille interactive, ROM vise à remplacer la passivité du doom scrolling par un véritable engagement.

Il s'agit d'un projet open-source conçu pour aider les communautés à raffiner et dynamiser le transfert de connaissances. La beauté de ce système réside dans le fait que chaque ROM est unique et que chaque membre de la communauté est propriétaire du petit robot qu'il développe, créant ainsi un écosystème d'apprentissage sur mesure.`

const FOROM_TEXT = `Chez FOROM, nous ne croyons pas qu'imposer un modèle unique soit la meilleure solution pour le futur de l'humanité. Nous croyons plutôt en la nécessité d'impliquer la communauté elle-même dans la construction de son propre assistant virtuel. D'ailleurs, nous considérons l'IA comme un outil, et non comme une fin en soi.

FOROM est un projet open-source où chaque utilisateur reste propriétaire de ses données, laissant ainsi le libre choix aux communautés de monétiser ou non leurs informations.

C'est précisément avec cette philosophie en tête que la plateforme a été conçue : offrir un espace collaboratif sain, pensé notamment pour faciliter le partage de connaissances entre étudiants. Pour contrer la passivité du doom scrolling générée par les fils d'actualité traditionnels, FOROM s'appuie sur une grille interactive. Cette architecture redonne le contrôle à l'utilisateur ; elle encourage une exploration active et ciblée de l'information, transformant la consommation de contenu en une véritable démarche d'apprentissage communautaire.`

/** The user's category gets 2 friend slots (they fill the 3rd); others get 3 */
function slotCount(categoryId: ForomColor, userColor: ForomColor) {
  return categoryId === userColor ? 2 : 3
}

interface ForomCreationFlowProps {
  onComplete: (mission: string, color: ForomColor) => void
  onBack: () => void
}

export function ForomCreationFlow({ onComplete, onBack }: ForomCreationFlowProps) {
  const [step, setStep]                     = useState<Step>('mission')
  const [mission, setMission]               = useState('')
  const [selected, setSelected]             = useState<ForomColor | null>(null)
  const [confirmedColor, setConfirmedColor] = useState<ForomColor | null>(null)
  const [friends, setFriends]               = useState<Record<ForomColor, string[]>>({
    social:   ['', '', ''],
    guardien: ['', '', ''],
    creation: ['', '', ''],
  })
  const [rules, setRules] = useState<string[]>(Array(10).fill(''))
  const [isExiting, setIsExiting] = useState(false)

  const isMission = step === 'mission'
  const isColor   = step === 'color'
  const isFriends = step === 'friends'
  const isRules   = step === 'rules'
  const isWelcome = step === 'welcome'

  const allFriendsFilled = confirmedColor !== null && COLOR_DEFS.every(({ id }) =>
    friends[id].slice(0, slotCount(id, confirmedColor)).every(s => s.trim().length > 0)
  )

  const allRulesFilled = rules.every(r => r.trim().length > 0)

  const canConfirm =
    isMission ? mission.trim().length > 0 :
    isColor   ? selected !== null :
    isFriends ? allFriendsFilled :
    allRulesFilled

  const handleConfirm = () => {
    if (isMission && mission.trim()) {
      setStep('color')
    } else if (isColor && selected) {
      setConfirmedColor(selected)
      setStep('friends')
    } else if (isFriends && confirmedColor && allFriendsFilled) {
      setStep('rules')
    } else if (isRules && allRulesFilled && confirmedColor) {
      setStep('welcome')
    }
  }

  const handleBack = () => {
    if (isMission)      onBack()
    else if (isColor)   setStep('mission')
    else if (isFriends) setStep('color')
    else if (isRules)   setStep('friends')
    else if (isWelcome) setStep('rules')
  }

  const handleErase = () => {
    if (isMission)      setMission('')
    else if (isColor)   setSelected(null)
    else if (isFriends) setFriends({ social: ['','',''], guardien: ['','',''], creation: ['','',''] })
    else if (isRules)   setRules(Array(10).fill(''))
  }

  const setFriendName = (color: ForomColor, idx: number, val: string) => {
    setFriends(prev => {
      const arr = [...prev[color]]
      arr[idx] = val
      return { ...prev, [color]: arr }
    })
  }

  const PAD       = isRules
    ? 'clamp(24px, 4vh, 56px) clamp(200px, 36vw, 560px)'
    : isWelcome
    ? '0px'
    : isFriends
    ? 'clamp(24px, 4vh, 56px) clamp(20px, 4vw, 80px)'
    : 'clamp(32px, 6vh, 72px) clamp(24px, 6vw, 120px)'
  const LOGO_W    = isRules ? 'clamp(160px, 22vw, 340px)' : 'clamp(120px, 16vw, 240px)'
  const BTN_SIZE  = 'clamp(52px, 6vw, 76px)'
  const BTN_FS    = 'clamp(18px, 2vw, 28px)'
  const LETTER_FS = 'clamp(20px, 2.6vw, 40px)'

  const confirmActiveBg   = isMission ? '#8E579C' : isRules ? '#111111'  : '#F97316'
  const confirmInactiveBg = isMission ? 'rgba(142,87,156,0.35)' : isRules ? 'rgba(17,17,17,0.4)' : 'rgba(249,115,22,0.35)'
  const confirmLabel      = isRules ? 'Créer' : 'Confirmer'

  const letterStyle = (visible: boolean, extra: React.CSSProperties): React.CSSProperties => ({
    position: 'absolute',
    fontSize: LETTER_FS,
    fontWeight: 900,
    fontFamily: 'Montserrat, sans-serif',
    pointerEvents: 'none',
    lineHeight: 1,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.3s',
    ...extra,
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, backgroundColor: isWelcome ? '#D9D9D9' : isMission ? '#2F2F2F' : isRules ? '#878787' : '#585858' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      style={{
        width: '100vw', height: '100vh',
        position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
        overflow: 'hidden', fontFamily: 'Montserrat, sans-serif', color: 'white',
        boxSizing: 'border-box', padding: PAD,
      }}
    >
      {/* ── LOGO ── */}
      <div style={{ position: 'relative', width: LOGO_W, flexShrink: 0, aspectRatio: isRules ? 'auto' : '3240 / 4050', overflow: 'visible' }}>
        <img
          src={isRules ? foromLogoWht : romWht}
          alt="Forom Logo"
          style={{ width: '100%', height: isRules ? 'auto' : '100%', objectFit: 'contain', display: 'block' }}
        />

        {/* Center M — mission only */}
        <span style={letterStyle(isMission, { left: '50%', top: '49%', transform: 'translate(-50%,-50%)', color: '#0066FF' })}>M</span>

        {/* Center F — color only */}
        <span style={letterStyle(isColor, { left: '50%', top: '49%', transform: 'translate(-50%,-50%)', color: '#FF0000' })}>F</span>

        {/* Right-ear M — color only */}
        <span style={letterStyle(isColor, { left: '77%', top: '49%', transform: 'translateY(-50%)', color: '#0066FF' })}>M</span>

        {/* Outside-left F — friends only */}
        <span style={letterStyle(isFriends, { left: '-18%', top: '42%', transform: 'translate(-100%,-50%)', color: '#FF0000' })}>F</span>

        {/* Outside-right M — friends only */}
        <span style={letterStyle(isFriends, { left: '118%', top: '42%', transform: 'translateY(-50%)', color: '#0066FF' })}>M</span>
      </div>      {/* Rules step: mission name shown under logo */}
      {isRules && (
        <p style={{ margin: 0, fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(13px, 1.4vw, 22px)', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em', textAlign: 'center' }}>
          {mission.toUpperCase()}
        </p>
      )}
      {/* Rules step: title placed here so it sits at true vertical center */}
      {isRules && (
        <h2 style={{
          margin: 0,
          fontFamily: "'Jersey 15', sans-serif",
          fontWeight: 400,
          fontSize: 'clamp(15px, 1.8vw, 28px)',
          letterSpacing: '0.04em',
          textAlign: 'center',
          color: '#ffffff',
          flexShrink: 0,
        }}>
          Quels sont vos 10 règles fondamentales de votre ROM?
        </h2>
      )}
      {/* ── MIDDLE ── */}
      <div style={{ width: '100%', position: 'relative', flex: 1, display: 'flex', alignItems: 'center', minHeight: 0 }}>
        <AnimatePresence mode="wait">

          {isMission && (
            <motion.div key="mission" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(20px, 4vh, 48px)' }}>
              <h2 style={{ margin: 0, fontWeight: 700, fontSize: 'clamp(20px, 2.8vw, 42px)', letterSpacing: '0.02em', textAlign: 'center' }}>
                Quel est ta mission?
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 1.2vw, 20px)', width: 'min(86vw, 820px)' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(22px, 2.8vw, 42px)', fontWeight: 700, flexShrink: 0, lineHeight: 1 }}>{'>'}</span>
                <input autoFocus type="text" value={mission} maxLength={64}
                  onChange={(e) => setMission(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && canConfirm && handleConfirm()}
                  style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: '2px solid rgba(255,255,255,0.55)', outline: 'none', color: '#fff', fontSize: 'clamp(18px, 2.2vw, 34px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 400, padding: 'clamp(4px,0.8vh,10px) 0', caretColor: '#fff' }}
                />
              </div>
            </motion.div>
          )}

          {isColor && (
            <motion.div key="color" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(20px, 3vh, 44px)' }}>
              <h2 style={{ margin: 0, fontWeight: 400, fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(18px, 2.4vw, 36px)', letterSpacing: '0.06em', textAlign: 'center' }}>
                Choisi ta couleur
              </h2>
              <div style={{ display: 'flex', gap: 'clamp(24px, 5vw, 80px)', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                {COLOR_DEFS.map(({ id, label, bg }) => {
                  const isSel = selected === id
                  return (
                    <motion.div key={id} onClick={() => setSelected(id)}
                      animate={{ scale: isSel ? 1.08 : 1, boxShadow: isSel ? `0 0 0 5px white, 0 0 0 8px ${bg}` : '0 0 0 0px transparent' }}
                      whileHover={{ scale: isSel ? 1.08 : 1.04 }} whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 340, damping: 26 }}
                      style={{ width: 'clamp(120px, 16vw, 230px)', height: 'clamp(120px, 16vw, 230px)', borderRadius: '50%', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', userSelect: 'none', flexShrink: 0 }}>
                      <span style={{ color: '#fff', fontWeight: 400, fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(13px, 1.6vw, 24px)', letterSpacing: '0.12em', textAlign: 'center', textShadow: id === 'creation' ? '0 1px 3px rgba(0,0,0,0.4)' : 'none' }}>
                        {label}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {isFriends && confirmedColor && (
            <motion.div key="friends" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(14px, 2vh, 26px)' }}>
              <h2 style={{ margin: 0, fontWeight: 700, fontSize: 'clamp(16px, 2vw, 32px)', letterSpacing: '0.04em', textAlign: 'center' }}>
                Qui sont tes 8 amies?
              </h2>
              <div style={{ display: 'flex', gap: 'clamp(16px, 3.5vw, 60px)', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
                {COLOR_DEFS.map(({ id, circleLabel, border }) => {
                  const slots = slotCount(id, confirmedColor)
                  const isUserColor = id === confirmedColor
                  return (
                    <div key={id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.2vh, 16px)', flexShrink: 0 }}>
                      <span style={{ fontWeight: 900, fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(11px, 1.3vw, 20px)', letterSpacing: '0.12em', color: '#fff', textAlign: 'center' }}>
                        {circleLabel}
                      </span>
                      <div style={{
                        width: 'clamp(150px, 19vw, 280px)', height: 'clamp(150px, 19vw, 280px)',
                        borderRadius: '50%',
                        border: `clamp(4px, 0.5vw, 7px) solid ${border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, boxSizing: 'border-box',
                        opacity: isUserColor ? 0.7 : 1,
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1vh, 14px)', width: '70%' }}>
                          {Array.from({ length: slots }).map((_, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                              <span style={{ fontWeight: 700, fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(13px, 1.5vw, 22px)', color: '#fff', flexShrink: 0, lineHeight: 1 }}>
                                {i + 1}.
                              </span>
                              <input type="text" maxLength={32}
                                value={friends[id][i]}
                                onChange={(e) => setFriendName(id, i, e.target.value)}
                                style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: '1.5px solid rgba(255,255,255,0.4)', outline: 'none', color: '#fff', fontSize: 'clamp(12px, 1.3vw, 20px)', fontFamily: 'Montserrat, sans-serif', fontWeight: 500, padding: '1px 0', caretColor: '#fff', width: 0, minWidth: 0 }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {isRules && (
            <motion.div key="rules" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2vh, 24px)' }}>
              {/* 2-column grid: left col rules 1-5, right col rules 6-10 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(10px, 1.5vh, 20px) clamp(32px, 6vw, 100px)', width: 'min(92vw, 860px)' }}>
                {rules.map((val, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(13px, 1.4vw, 22px)', color: '#fff', flexShrink: 0, lineHeight: 1 }}>
                      {i + 1}.
                    </span>
                    <input
                      type="text"
                      maxLength={80}
                      value={val}
                      onChange={(e) => {
                        const next = [...rules]
                        next[i] = e.target.value
                        setRules(next)
                      }}
                      style={{
                        flex: 1, background: 'transparent', border: 'none',
                        borderBottom: '1.5px solid rgba(0,0,0,0.35)',
                        outline: 'none', color: '#fff',
                        fontSize: 'clamp(12px, 1.3vw, 20px)',
                        fontFamily: "'Jersey 15', sans-serif",
                        fontWeight: 400,
                        padding: '2px 0', caretColor: '#fff', width: 0, minWidth: 0,
                      }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── ROM LEFT PANEL (rules step only) ── */}
      {isRules && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: 'clamp(180px, 36vw, 560px)',
          paddingTop: 'clamp(20px, 3.5vh, 52px)',
          paddingBottom: 'clamp(20px, 3.5vh, 52px)',
          paddingLeft: '3vw',
          paddingRight: 'clamp(12px, 1.5vw, 24px)',
          boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 1.8vh, 24px)', justifyContent: 'center',
          overflow: 'hidden', pointerEvents: 'none',
        }}>
          <div style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(28px, 3.6vw, 58px)', lineHeight: 1, letterSpacing: '0.04em', textAlign: 'center' }}>
            <span style={{ color: '#FFD700' }}>R</span>
            <span style={{ color: '#FFFFFF' }}>O</span>
            <span style={{ color: '#3355FF' }}>M</span>
          </div>
          <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(9px, 0.9vw, 14px)', lineHeight: 1.75, color: '#ffffff', whiteSpace: 'pre-wrap', textAlign: 'justify' }}>
            {ROM_TEXT}
          </p>
        </div>
      )}

      {/* ── FOR RIGHT PANEL (rules step only) ── */}
      {isRules && (
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0,
          width: 'clamp(180px, 36vw, 560px)',
          paddingTop: 'clamp(20px, 3.5vh, 52px)',
          paddingBottom: 'clamp(20px, 3.5vh, 52px)',
          paddingRight: '3vw',
          paddingLeft: 'clamp(12px, 1.5vw, 24px)',
          boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 1.8vh, 24px)', justifyContent: 'center',
          overflow: 'hidden', pointerEvents: 'none',
        }}>
          <div style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(28px, 3.6vw, 58px)', lineHeight: 1, letterSpacing: '0.04em', textAlign: 'center' }}>
            <span style={{ color: '#EE2222' }}>F</span>
            <span style={{ color: '#FFFFFF' }}>O</span>
            <span style={{ color: '#FFD700' }}>R</span>
          </div>
          <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(9px, 0.9vw, 14px)', lineHeight: 1.75, color: '#ffffff', whiteSpace: 'pre-wrap', textAlign: 'justify' }}>
            {FOROM_TEXT}
          </p>
        </div>
      )}

      {/* ── BUTTONS (hidden on welcome) ── */}
      {!isWelcome && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 2.5vw, 36px)', flexShrink: 0 }}>
        <motion.button onClick={handleBack} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          style={{ width: BTN_SIZE, height: BTN_SIZE, borderRadius: '999px', backgroundColor: '#555555', border: 'none', cursor: 'pointer', color: '#fff', fontSize: BTN_FS, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {'<'}
        </motion.button>

        <motion.button onClick={handleConfirm} disabled={!canConfirm}
          whileHover={canConfirm ? { scale: 1.04 } : {}} whileTap={canConfirm ? { scale: 0.96 } : {}}
          animate={{ backgroundColor: canConfirm ? confirmActiveBg : confirmInactiveBg }}
          transition={{ duration: 0.35 }}
          style={{ padding: 'clamp(14px, 2vh, 24px) clamp(52px, 8vw, 120px)', borderRadius: '999px', border: 'none', cursor: canConfirm ? 'pointer' : 'not-allowed', color: canConfirm ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: 'clamp(16px, 2vw, 28px)', fontWeight: 700, letterSpacing: '0.04em', transition: 'color 0.2s' }}>
          {confirmLabel}
        </motion.button>

        <motion.button onClick={handleErase} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          style={{ width: BTN_SIZE, height: BTN_SIZE, borderRadius: '999px', backgroundColor: '#555555', border: 'none', cursor: 'pointer', color: '#fff', fontSize: 'clamp(16px, 1.8vw, 26px)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          ✕
        </motion.button>
      </div>
      )}

      {/* ── WELCOME OVERLAY ── */}
      <AnimatePresence>
        {isWelcome && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0, zIndex: 10,
              backgroundColor: '#D9D9D9',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'space-between',
              padding: 'clamp(32px, 5vh, 72px) clamp(24px, 6vw, 120px)',
              boxSizing: 'border-box', color: '#111111',
            }}
          >
            {/* Title */}
            <h1 style={{
              margin: 0,
              fontFamily: "'Jersey 15', sans-serif",
              fontWeight: 400,
              fontSize: 'clamp(16px, 1.8vw, 28px)',
              letterSpacing: '0.1em',
              color: '#111111',
              textAlign: 'center',
            }}>
              BIENVENU À LA MAISON
            </h1>

            {/* Center: logo + tagline */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(18px, 3vh, 42px)' }}>
              <img
                src={foromLogoBlk}
                alt="FOROM"
                style={{ width: 'clamp(180px, 26vw, 400px)', height: 'auto' }}
              />
              <p style={{
                margin: 0,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 'clamp(11px, 1.1vw, 16px)',
                color: '#555555',
                letterSpacing: '0.02em',
                textAlign: 'center',
              }}>
                Ici, on manges pas vos cookies ;)
              </p>
            </div>

            {/* Entrée button */}
            <motion.button
              onClick={() => setIsExiting(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: 'clamp(14px, 2vh, 22px) clamp(60px, 10vw, 140px)',
                borderRadius: '999px', border: 'none', cursor: 'pointer',
                backgroundColor: '#111111', color: '#fff',
                fontSize: 'clamp(16px, 2vw, 28px)',
                fontWeight: 700,
                fontFamily: "'Jersey 15', sans-serif",
                letterSpacing: '0.06em',
              }}
            >
              Entrée
            </motion.button>

            {/* Black fade-out on exit */}
            <AnimatePresence>
              {isExiting && (
                <motion.div
                  key="exitblackout"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.75, ease: 'easeInOut' }}
                  onAnimationComplete={() => confirmedColor && onComplete(mission.trim(), confirmedColor)}
                  style={{ position: 'absolute', inset: 0, backgroundColor: '#000000', zIndex: 20 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
