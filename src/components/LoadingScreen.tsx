import { useState, useEffect, useRef, useCallback } from 'react'
import { useAppStore, type AppLanguage } from '../stores/useAppStore'
import { motion, AnimatePresence } from 'framer-motion'
import foromLogoBlk from '../assets/icons/forom_logo_blk.png'
import foromLogoWht from '../assets/icons/forom_logo_wht.png'
import macLauncherIcon from '../assets/icons/mac_launcher.svg'
import linuxLauncherIcon from '../assets/icons/linux_launcher.svg'
import winLauncherIcon from '../assets/icons/win_launcher.svg'
import bonjourHiSnd from '../assets/sons/bonjourhi.mp3'
import mantisseSnd from '../assets/sons/explore.mp3'

function TypewriterText({ text, delayMs = 15, startDelay = 0 }: { text: string, delayMs?: number, startDelay?: number }) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    let i = 0
    let intervalId: ReturnType<typeof setInterval> | null = null
    setDisplayed('')
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setDisplayed(text.slice(0, i))
        i++
        if (i > text.length && intervalId) clearInterval(intervalId)
      }, delayMs)
    }, startDelay)
    return () => {
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [text, delayMs, startDelay])
  return <span style={{ whiteSpace: 'pre-wrap' }}>{displayed}</span>
}

function InfoButton({ isActive, onClick }: { isActive: boolean, onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        width: 'clamp(28px, min(3vw, 4vh), 42px)',
        height: 'clamp(28px, min(3vw, 4vh), 42px)',
        borderRadius: '50%',
        border: `2px solid ${isActive ? '#ffffff' : 'rgba(255,255,255,0.4)'}`,
        backgroundColor: isActive ? '#000000' : 'transparent',
        color: isActive ? '#ffffff' : 'rgba(255,255,255,0.4)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'clamp(14px, min(1.6vw, 2.2vh), 22px)',
        fontFamily: "'Times New Roman', serif",
        fontWeight: 700,
        fontStyle: 'italic',
        padding: 0,
        transition: 'all 0.3s ease',
        flexShrink: 0,
      }}
    >
      i
    </motion.button>
  )
}

const LANGUAGES = [
  { id: 'en', label: 'WELCOME' },
  { id: 'fr', label: 'BIENVENUE' },
  { id: 'es', label: 'BIENVENIDO' },
]

const N = LANGUAGES.length
// We now calculate item height dynamically to fit smaller screens.

function getLang(idx: number) {
  return LANGUAGES[((idx % N) + N) % N]
}

function LanguageCarousel({
  onChange,
  initialLang,
}: {
  onChange: (id: string) => void
  initialLang: string
}) {
  const initialIndex = LANGUAGES.findIndex(l => l.id === initialLang)
  const [center, setCenter] = useState(initialIndex >= 0 ? initialIndex : 0)

  // Dynamically calculate slot height based on window height to prevent overlap on short screens
  const [itemH, setItemH] = useState(72)
  useEffect(() => {
    const updateH = () => setItemH(Math.max(35, Math.min(72, window.innerHeight * 0.08)))
    updateH()
    window.addEventListener('resize', updateH)
    return () => window.removeEventListener('resize', updateH)
  }, [])

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

  const VISIBLE = 3
  const half = Math.floor(VISIBLE / 2) + 1
  const slots = Array.from({ length: VISIBLE + 2 }, (_, i) => center - half + i)
  const containerH = VISIBLE * itemH

  return (
    <div
      onWheel={handleWheel}
      style={{
        position: 'relative',
        width: '100%',
        height: containerH,
        overflow: 'hidden',
        cursor: 'ns-resize',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
        pointerEvents: 'auto'
      }}
    >
      {slots.map((p) => {
        const dist = p - center
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
              y: (dist + half - 1) * itemH,
              opacity: isCenter ? 1 : absD === 1 ? 0.45 : 0.2,
              scale: isCenter ? 1.12 : absD === 1 ? 0.88 : 0.72,
            }}
            transition={{ type: 'spring', stiffness: 340, damping: 30, mass: 0.8 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: itemH,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              color: isCenter ? '#FFD700' : '#888888',
              fontWeight: 900,
              fontSize: isCenter
                ? 'clamp(22px, min(3vw, 5vh), 48px)'
                : absD === 1
                  ? 'clamp(13px, min(1.6vw, 3vh), 24px)'
                  : 'clamp(9px, min(1.1vw, 2vh), 16px)',
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

const generateStars = (count: number, maxSize: number, maxOpacity: number) => {
  return Array.from({ length: count })
    .map(() => `${Math.floor(Math.random() * 110)}vw ${Math.floor(Math.random() * 110)}vh 0 ${Math.random() * maxSize}px rgba(255,255,255,${Math.random() * maxOpacity + 0.1})`)
    .join(', ')
}

const starsSml = generateStars(150, 1.5, 0.4)
const starsMed = generateStars(100, 2.5, 0.6)
const starsLrg = generateStars(40, 4, 0.9)

interface LoadingScreenProps {
  onComplete: () => void
}

// ─── Timeline ────────────────────────────────────────────────────────────────
//  0.00s  full white screen
//  0.00s  black wipe top → bottom (0.55s)
//  0.70s  white half sweeps right → center  → split bg
//  1.10s  logo fades in, one heartbeat pulse, fades out
//  2.00s  full white overlay fades in
//  2.70s  onComplete
// ─────────────────────────────────────────────────────────────────────────────

type Phase = 'init' | 'blackwipe' | 'split' | 'logo' | 'exit'

const TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  fr: {
    topLeftTitle: "Une nouvelle façon d’archiver",
    topLeftText: "Forom n’est ni une application, ni un réseau social classique. C’est un jeu social dont vous pouvez devenir propriétaire, si vous en avez la curiosité. Nous sommes une initiative open-source convaincue qu’imposer un modèle unique et utilisé des centre de données, comme les FANG+*, est l’une des pires solutions pour l’humanité.",
    bottomLeftTitle: "Votre savoir collectif, votre robot.",
    bottomLeftText: "Imaginez que nous vous donnons un kit de départ pour construire un château de données. Nous vous fournissons un moteur simplifié et une mécanique ludique : à vous d’inventer les pièces manquantes pour partir à la conquête de l’espace et accomplir votre mission pour sauver le monde. Après un an, votre ROM personnel viendra vous soutenir pour résoudre les problèmes logiques que vous et votre communauté aurez créés.",
    topRightTitle: "Communautés fermées",
    topRightText: "• Une modération efficace : en contrôlant l’accès (par invitation ou acceptation), on limite les bots, le spam et les comportements toxiques.\n\n• Un espace sécurisé : les membres se sentent plus libres de s’exprimer, de partager et de collaborer sans crainte d’être submergés par du contenu indésirable.\n\n• Une meilleure qualité d’échange : moins de bruit, plus de pertinence, et une véritable construction collective.",
    bottomRightTitle: "L’auto-hébergement",
    bottomRightText: "Forom va plus loin : en combinant la logique des communautés fermées avec l’auto-hébergement local, vous reprenez le contrôle total de votre espace. Vous créez un \"château de données\" qui vous appartient, où la modération est transparente, où les règles sont définies par le groupe, et où le savoir collectif reste entre vos mains, sans dépendre d’un tiers, sans alimenter des centres de données énergivores, et sans risquer de voir votre espace modifié ou supprimé du jour au lendemain.",
    pourquoi: "POURQUOI?",
    comment: "COMMENT?",
    lockIn: "LOCK IN, CUT NOISE",
    exploreHint: "'' Gardez vos cookies, restez local ''",
    explore: "EXPLORER",
    catchphrase: "Changer le monde un pixel à la fois.",
  },
  en: {
    topLeftTitle: "A new way to archive",
    topLeftText: "Forom is neither an app nor a classic social network. It's a social game you can own, if you have the curiosity. We are an open-source initiative convinced that imposing a single model using massive data centers, like the FANG+*, is one of the worst solutions for humanity.",
    bottomLeftTitle: "Your collective knowledge, your robot.",
    bottomLeftText: "Imagine we give you a starter kit to build a data castle. We provide a simplified engine and game mechanics: it's up to you to invent the missing pieces to conquer space and accomplish your mission to save the world. After a year, your personal ROM will come to support you in solving the logical problems you and your community have created.",
    topRightTitle: "Closed communities",
    topRightText: "• Effective moderation: by controlling access (via invite or acceptance), bots, spam, and toxic behavior are limited.\n\n• A secure space: members feel freer to express themselves, share, and collaborate without fear of being overwhelmed by unwanted content.\n\n• Better quality of exchange: less noise, more relevance, and true collective construction.",
    bottomRightTitle: "Self-hosting",
    bottomRightText: "Forom goes further: by combining the logic of closed communities with local self-hosting, you regain total control of your space. You create a \"data castle\" that belongs to you, where moderation is transparent, rules are defined by the group, and collective knowledge remains in your hands, without depending on a third party, without feeding energy-intensive data centers, and without risking your space being modified or deleted overnight.",
    pourquoi: "WHY?",
    comment: "HOW?",
    lockIn: "LOCK IN, CUT NOISE",
    exploreHint: "'' Keep your cookies, stay local ''",
    explore: "EXPLORE",
    catchphrase: "Change the world one pixel at the time.",
  },
  es: {
    topLeftTitle: "Una nueva forma de archivar",
    topLeftText: "Forom no es una aplicación ni una red social clásica. Es un juego social del que puedes ser propietario, si tienes la curiosidad. Somos una iniciativa de código abierto convencida de que imponer un modelo único utilizando centros de datos masivos, como los FANG+*, es una de las peores soluciones para la humanidad.",
    bottomLeftTitle: "Tu conocimiento colectivo, tu robot.",
    bottomLeftText: "Imagina que te damos un kit de inicio para construir un castillo de datos. Proporcionamos un motor simplificado y mecánicas de juego: depende de ti inventar las piezas que faltan para conquistar el espacio y cumplir tu misión de salvar el mundo. Después de un año, tu ROM personal vendrá a apoyarte para resolver los problemas lógicos que tú y tu comunidad hayan creado.",
    topRightTitle: "Comunidades cerradas",
    topRightText: "• Moderación eficaz: al controlar el acceso (por invitación o aceptación), se limitan los bots, el spam y el comportamiento tóxico.\n\n• Un espacio seguro: los miembros se sienten más libres de expresarse, compartir y colaborar sin temor a ser abrumados por contenido no deseado.\n\n• Mejor calidad de intercambio: menos ruido, más relevancia y verdadera construcción colectiva.",
    bottomRightTitle: "Autoalojamiento",
    bottomRightText: "Forom va más allá: al combinar la lógica de las comunidades cerradas con el autoalojamiento local, recuperas el control total de tu espacio. Creas un \"castillo de datos\" que te pertenece, donde la moderación es transparente, las reglas son definidas por el grupo y el conocimiento colectivo permanece en tus manos, sin depender de terceros, sin alimentar centros de datos que consumen mucha energía y sin riesgo de que tu espacio se modifique o elimine.",
    pourquoi: "¿POR QUÉ?",
    comment: "¿CÓMO?",
    lockIn: "LOCK IN, CUT NOISE",
    exploreHint: "'' Guarda tus cookies, mantente local ''",
    explore: "EXPLORAR",
    catchphrase: "Cambiar el mundo un píxel a la vez.",
  }
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { language, setLanguage } = useAppStore()
  const t = TRANSLATIONS[language] || TRANSLATIONS.en
  const [phase, setPhase] = useState<Phase>('init')
  const [isHovering, setIsHovering] = useState(false)
  const [leftInfoOpen, setLeftInfoOpen] = useState(false)
  const [rightInfoOpen, setRightInfoOpen] = useState(false)
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!hoverAudioRef.current) {
      hoverAudioRef.current = new Audio(mantisseSnd)
      hoverAudioRef.current.loop = true
      hoverAudioRef.current.volume = 0.5
    }
  }, [])

  useEffect(() => {
    const audio = hoverAudioRef.current
    if (!audio) return

    if (isHovering && phase === 'init') {
      audio.play().catch(e => console.warn('Hover audio blocked:', e))
    } else {
      audio.pause()
      audio.currentTime = 0
    }

    // Cleanup on unmount
    return () => {
      audio.pause()
    }
  }, [isHovering, phase])

  const handleInit = () => {
    setPhase('blackwipe')
    setTimeout(() => {
      const audio = new Audio(bonjourHiSnd)
      audio.play().catch(e => console.warn('Audio autoplay prevented by browser', e))
    }, 600)
    setTimeout(() => setPhase('split'), 700)
    setTimeout(() => setPhase('logo'), 1100)
    setTimeout(() => setPhase('exit'), 2000)
    setTimeout(onComplete, 2700)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: '#0a0a0a', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>

      {/* ── 0. Init Phase: User Interaction to start ── */}
      <AnimatePresence>
        {phase === 'init' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'absolute', inset: 0,
              backgroundColor: '#050505', zIndex: 50,
              overflow: 'hidden'
            }}
          >
            {/* Deep Space Starfield */}
            <div style={{ position: 'absolute', inset: '-10%', pointerEvents: 'none' }}>
              <motion.div
                animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '1px', boxShadow: starsSml }}
              />
              <motion.div
                animate={{ x: [0, -20, 0], y: [0, 40, 0] }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '1px', boxShadow: starsMed, borderRadius: '50%' }}
              />
              <motion.div
                animate={{ x: [0, 15, 0], y: [0, -15, 0] }}
                transition={{ duration: 75, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '1px', boxShadow: starsLrg, borderRadius: '50%' }}
              />
            </div>

            {/* Language Carousel at top */}
            <div style={{ position: 'absolute', top: '1vh', left: '0', right: '0', zIndex: 10, display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 'clamp(300px, 40vw, 600px)' }}>
                <LanguageCarousel onChange={(id) => setLanguage(id as AppLanguage)} initialLang={language} />
              </div>
            </div>

            {/* --- SIDE TEXT PANELS --- */}
            {/* Left Side */}
            <div style={{ position: 'absolute', left: '3vw', top: '6vh', bottom: '6vh', width: '28vw', zIndex: 10, pointerEvents: 'none', color: 'white' }}>
              {/* Top Left */}
              <AnimatePresence>
                {leftInfoOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4 }}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
                  >
                    <h3 style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(12px, min(1.5vw, 2vh), 22px)', fontWeight: 400, letterSpacing: '0.05em', textAlign: 'left', margin: 0, marginBottom: '8px', color: '#FFD700' }}>
                      <TypewriterText text={t.topLeftTitle + ' ▲'} />
                    </h3>
                    <p style={{ fontFamily: "'BitcountGridSingle-Light', monospace", fontSize: 'clamp(10px, min(1.2vw, 1.6vh), 16px)', color: '#FFD700', lineHeight: 1.5, opacity: 0.9, textAlign: 'justify', margin: 0 }}>
                      <TypewriterText text={t.topLeftText} />
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Middle Left — Info Button + POURQUOI */}
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 1.5vw, 18px)', pointerEvents: 'auto' }}>
                <InfoButton isActive={leftInfoOpen} onClick={() => setLeftInfoOpen(!leftInfoOpen)} />
                <span style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(20px, min(2.5vw, 3.5vh), 36px)', letterSpacing: '0.1em', color: '#EF4444' }}>{t.pourquoi}</span>
              </div>

              {/* Bottom Left */}
              <AnimatePresence>
                {leftInfoOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
                  >
                    <p style={{ fontFamily: "'BitcountGridSingle-Light', monospace", fontSize: 'clamp(10px, min(1.2vw, 1.6vh), 16px)', color: '#FFD700', lineHeight: 1.5, opacity: 0.9, textAlign: 'justify', margin: 0 }}>
                      <TypewriterText text={t.bottomLeftText} startDelay={2000} />
                    </p>
                    <h3 style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(12px, min(1.5vw, 2vh), 22px)', fontWeight: 400, letterSpacing: '0.05em', textAlign: 'center', margin: 0, marginTop: '8px', color: '#FFD700' }}>
                      <TypewriterText text={t.bottomLeftTitle + ' ♥'} startDelay={2000} />
                    </h3>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Side */}
            <div style={{ position: 'absolute', right: '3vw', top: '6vh', bottom: '6vh', width: '28vw', zIndex: 10, pointerEvents: 'none', color: 'white' }}>
              {/* Top Right */}
              <AnimatePresence>
                {rightInfoOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4 }}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
                  >
                    <h3 style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(12px, min(1.5vw, 2vh), 22px)', fontWeight: 400, letterSpacing: '0.05em', textAlign: 'right', margin: 0, marginBottom: '8px', color: '#FFD700' }}>
                      <TypewriterText text={t.topRightTitle + ' ▲'} />
                    </h3>
                    <p style={{ fontFamily: "'BitcountGridSingle-Light', monospace", fontSize: 'clamp(10px, min(1.2vw, 1.6vh), 16px)', color: '#FFD700', lineHeight: 1.5, opacity: 0.9, textAlign: 'justify', margin: 0 }}>
                      <TypewriterText text={t.topRightText} />
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Middle Right — COMMENT + Info Button */}
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 1.5vw, 18px)', pointerEvents: 'auto' }}>
                <span style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(20px, min(2.5vw, 3.5vh), 36px)', letterSpacing: '0.1em', color: '#3B82F6' }}>{t.comment}</span>
                <InfoButton isActive={rightInfoOpen} onClick={() => setRightInfoOpen(!rightInfoOpen)} />
              </div>

              {/* Bottom Right */}
              <AnimatePresence>
                {rightInfoOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
                  >
                    <p style={{ fontFamily: "'BitcountGridSingle-Light', monospace", fontSize: 'clamp(10px, min(1.2vw, 1.6vh), 16px)', color: '#FFD700', lineHeight: 1.5, opacity: 0.9, textAlign: 'justify', margin: 0 }}>
                      <TypewriterText text={t.bottomRightText} startDelay={2000} />
                    </p>
                    <h3 style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(12px, min(1.5vw, 2vh), 22px)', fontWeight: 400, letterSpacing: '0.05em', textAlign: 'center', margin: 0, marginTop: '8px', color: '#FFD700' }}>
                      <TypewriterText text={t.bottomRightTitle + ' ♥'} startDelay={2000} />
                    </h3>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* EXPLORE Text Button */}
            <motion.button
              onClick={handleInit}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
              whileTap={{ scale: 0.95 }}
              style={{
                position: 'absolute', top: '50%', left: '50%', x: '-50%', y: '-50%',
                background: 'transparent', border: 'none', cursor: 'pointer', padding: '0', zIndex: 10,
                filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.8))'
              }}
            >
              <div style={{ position: 'relative' }}>
                {/* White Text (Default) */}
                <motion.span
                  animate={{ opacity: isHovering ? 0 : 1, scale: isHovering ? 1.05 : 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'block',
                    fontSize: 'clamp(24px, min(7vw, 11vh), 150px)',
                    color: '#ffffff',
                    fontFamily: "'Jersey 15', sans-serif",
                    letterSpacing: '0.15em',
                    lineHeight: 1
                  }}
                >
                  {t.explore}
                </motion.span>

                {/* Rainbow Text (Hovered) */}
                <motion.span
                  animate={{
                    opacity: isHovering ? 1 : 0,
                    scale: isHovering ? 1.05 : 1,
                    backgroundPosition: isHovering ? ["0% 50%", "200% 50%"] : "0% 50%",
                  }}
                  transition={{
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 },
                    backgroundPosition: { duration: 1.5, repeat: Infinity, ease: 'linear' }
                  }}
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    fontSize: 'clamp(24px, min(7vw, 11vh), 150px)',
                    fontFamily: "'Jersey 15', sans-serif",
                    letterSpacing: '0.15em',
                    lineHeight: 1,
                    backgroundImage: 'linear-gradient(90deg, #ff0000, #ff9900, #ffff00, #33ff00, #0099ff, #6633ff, #ff0000)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    display: 'flex', justifyContent: 'center'
                  }}
                >
                  {t.explore.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: 0 }}
                      animate={isHovering ? { y: [0, -16, 0] } : { y: 0 }}
                      transition={isHovering ? { duration: 0.6, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' } : { duration: 0 }}
                      style={{ display: 'inline-block', whiteSpace: 'pre' }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.span>
              </div>
            </motion.button>

            {/* Catchphrase below EXPLORE */}
            <div style={{
              position: 'absolute',
              top: 'calc(50% + clamp(30px, min(5vw, 7vh), 90px))',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              whiteSpace: 'nowrap',
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 'clamp(10px, min(1.3vw, 1.8vh), 16px)',
                color: '#FFD700',
                letterSpacing: '0.08em',
                fontWeight: 600,
              }}>
                {t.catchphrase}
              </span>
            </div>

            {/* ── Download Launcher Buttons ── */}
            <div style={{
              position: 'absolute',
              top: '32%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'clamp(6px, 1vh, 14px)',
              pointerEvents: 'auto',
            }}>
              {/* TÉLÉCHARGER header */}
              <span style={{
                fontFamily: "'Jersey 15', sans-serif",
                fontSize: 'clamp(12px, min(1.8vw, 2.5vh), 22px)',
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.7)',
              }}>
                TÉLÉCHARGER
              </span>

              {/* Icons row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(24px, 4vw, 60px)' }}>
                {([
                  { label: 'MAC', href: '/downloads/ForomInstaller.dmg', filename: 'ForomInstaller.dmg', color: '#EF4444', icon: macLauncherIcon },
                  { label: 'LINUX', href: '/downloads/ForomInstaller.AppImage', filename: 'ForomInstaller.AppImage', color: '#22C55E', icon: linuxLauncherIcon },
                  { label: 'WIN', href: '/downloads/ForomInstaller.exe', filename: 'ForomInstaller.exe', color: '#3B82F6', icon: winLauncherIcon },
                ] as const).map(({ label, href, filename, color, icon }) => (
                  <motion.a
                    key={label}
                    href={href}
                    download={filename}
                    whileHover={{ scale: 1.15, y: -4 }}
                    whileTap={{ scale: 0.92 }}
                    title={`Download for ${label}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 'clamp(4px, 0.7vh, 8px)',
                      cursor: 'pointer',
                      textDecoration: 'none',
                    }}
                  >
                    {/* OS-specific launcher icon */}
                    <img
                      src={icon}
                      alt={`${label} launcher`}
                      style={{
                        width: 'clamp(28px, min(4vw, 5vh), 52px)',
                        height: 'clamp(28px, min(4vw, 5vh), 52px)',
                        objectFit: 'contain',
                      }}
                    />
                    {/* OS label */}
                    <span style={{
                      fontFamily: "'Jersey 15', sans-serif",
                      fontSize: 'clamp(11px, min(1.4vw, 2vh), 18px)',
                      letterSpacing: '0.12em',
                      color,
                      fontWeight: 600,
                    }}>
                      {label}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Logo near LOCK IN */}
            <motion.img
              src={foromLogoWht}
              alt="Forom"
              style={{ position: 'absolute', bottom: '15vh', left: '50%', transform: 'translateX(-50%)', height: 'clamp(50px, min(30vw, 25vh), 340px)', zIndex: 10, pointerEvents: 'none' }}
            />

            {/* Lock in text at 8% from bottom edge */}
            <div style={{ position: 'absolute', bottom: '8vh', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: 'clamp(10px, 1.5vw, 14px)', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                {t.lockIn}
              </span>
              <span style={{ fontSize: 'clamp(8px, 1.2vw, 11px)', color: 'rgba(255,255,255,0.25)', fontFamily: 'Montserrat, sans-serif' }}>
                {t.exploreHint}
              </span>

              {/* Spinning Track Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: isHovering ? 0.9 : 0.3, transition: 'opacity 0.4s ease', marginTop: '4px' }}>
                <motion.svg 
                  viewBox="0 0 24 24" width="10" height="10"
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <circle cx="12" cy="12" r="11" fill="#111" stroke="#555" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4.5" fill="#EF4444" />
                  <circle cx="12" cy="12" r="1.5" fill="#111" />
                </motion.svg>
                <span style={{ fontSize: 'clamp(8px, 1.2vw, 11px)', color: '#fff', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}>
                  Tricot the Wiz - Explore
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. Black wipe: scans top → bottom over initial white ── */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.6, 1] }}
        style={{
          position: 'absolute', inset: 0,
          backgroundColor: '#0a0a0a',
          transformOrigin: 'top center',
          zIndex: 1, willChange: 'transform',
        }}
      />

      {/* ── 2. White half: sweeps in from right → stops at center ── */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: phase === 'split' || phase === 'logo' ? '0%' : '100%' }}
        transition={{ duration: 0.36, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%',
          backgroundColor: '#ffffff',
          zIndex: 2, willChange: 'transform',
        }}
      />

      {/* ── 3. Logo: appears on split bg, one heartbeat, fades out ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={
          phase === 'logo'
            ? { opacity: [0, 1, 1, 1, 0], scale: [0.95, 1, 1.07, 1, 0.95] }
            : { opacity: 0, scale: 0.95 }
        }
        transition={
          phase === 'logo'
            ? { duration: 0.9, ease: 'easeInOut', times: [0, 0.15, 0.5, 0.78, 1] }
            : { duration: 0.2 }
        }
        style={{
          position: 'absolute',
          width: 'clamp(140px, 22vw, 300px)',
          height: 'clamp(140px, 22vw, 300px)',
          zIndex: 10, willChange: 'opacity, transform',
        }}
      >
        {/* white logo — visible on dark left half */}
        <img src={foromLogoWht} alt="" draggable={false} style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'contain', clipPath: 'inset(0 50% 0 0)',
        }} />
        {/* black logo — visible on white right half */}
        <img src={foromLogoBlk} alt="FOROM" draggable={false} style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'contain', clipPath: 'inset(0 0 0 50%)',
        }} />
      </motion.div>

      {/* ── 4. Black exit overlay: fades in → full black → app ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'exit' ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0,
          backgroundColor: '#0a0a0a',
          zIndex: 20, willChange: 'opacity',
        }}
      />

    </div>
  )
}
