import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, type AppLanguage } from '../stores/useAppStore'
import chromaPortalIcon from '../assets/icons/chroma_portal.svg'
import ghostWhtIcon from '../assets/icons/ghost_wht.svg'
import interceptorSnd from '../assets/sons/interceptor.mov'

// Typewriter with optional start delay
function TypewriterText({ text, delayMs = 15, startDelay = 0 }: { text: string; delayMs?: number; startDelay?: number }) {
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

// Info button (reused from LoadingScreen pattern)
function InfoButton({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        width: 'clamp(26px, min(2.8vw, 3.5vh), 38px)',
        height: 'clamp(26px, min(2.8vw, 3.5vh), 38px)',
        borderRadius: '50%',
        border: `2px solid ${isActive ? '#ffffff' : 'rgba(255,255,255,0.4)'}`,
        backgroundColor: isActive ? '#000000' : 'transparent',
        color: isActive ? '#ffffff' : 'rgba(255,255,255,0.4)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'clamp(13px, min(1.4vw, 2vh), 20px)',
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

const TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  fr: {
    title: 'CHOISI TON MOOD',
    couleur: 'COULEUR',
    fantome: 'FANTÔME',
    confirmer: 'Confirmer',
    couleurTitle: 'Couleur',
    fantomeTitle: 'Fantôme',
    couleurText:
      "Le Mode Couleur, c'est notre façon ludique de dire \"connexion\". En devenant visible dans l'univers FOROM, vous choisissez un pseudonyme et une couleur unique qui vous représente. En nous rejoignant, vous pourrez contribuer à n'importe quel forum : public, privé ou même local ! Chaque joueur débute au niveau 0, sans expérience, avec un portefeuille vide de pixels. Le but ? Collaborer avec les forums en y déposant des \"mémoires factuelles\" pour les aider dans leur mission. La mécanique est simple : les modérateurs gèrent un forum et une mission ; ils disposent d'un stock de pixels et créent des quêtes pour récompenser les membres actifs qui les aident à atteindre leurs objectifs.",
    fantomeText:
      "Le mode fantôme est notre équivalent du mode \"incognito\". Vous pouvez naviguer sur les forums publics en l'état, mais vous ne pourrez pas participer à l'évolution du projet. Notre mode fantôme permet à n'importe quel internaute de consulter un forum public soutenu par FOROM. Les utilisateurs en mode fantôme ne peuvent pas cumuler de pixels, monter de niveau ni participer aux efforts collaboratifs des multiples communautés.",
  },
  en: {
    title: 'CHOOSE YOUR MOOD',
    couleur: 'COLOR',
    fantome: 'GHOST',
    confirmer: 'Confirm',
    couleurTitle: 'Color',
    fantomeTitle: 'Ghost',
    couleurText:
      'Color Mode is our fun way of saying "log in". By becoming visible in the FOROM universe, you choose a username and a unique color that represents you. By joining us, you can contribute to any forum: public, private, or even local! Every player starts at level 0, with no experience and an empty pixel wallet. The goal? Collaborate with forums by depositing "factual memories" to help them in their mission. The mechanics are simple: moderators manage a forum and a mission; they have a stock of pixels and create quests to reward active members who help them reach their objectives.',
    fantomeText:
      'Ghost mode is our equivalent of "incognito" mode. You can browse public forums as they are, but you won\'t be able to participate in the project\'s evolution. Our ghost mode allows any internet user to view a public forum supported by FOROM. Users in ghost mode cannot accumulate pixels, level up, or participate in the collaborative efforts of multiple communities.',
  },
  es: {
    title: 'ELIGE TU MODO',
    couleur: 'COLOR',
    fantome: 'FANTASMA',
    confirmer: 'Confirmar',
    couleurTitle: 'Color',
    fantomeTitle: 'Fantasma',
    couleurText:
      'El Modo Color es nuestra forma divertida de decir "iniciar sesión". Al hacerte visible en el universo FOROM, eliges un nombre de usuario y un color único que te represente. Al unirte, podrás contribuir a cualquier foro: público, privado o incluso local. Cada jugador comienza en el nivel 0, sin experiencia, con una billetera de píxeles vacía. ¿El objetivo? Colaborar con los foros depositando "memorias factuales" para ayudarlos en su misión. La mecánica es simple: los moderadores gestionan un foro y una misión; disponen de un stock de píxeles y crean misiones para recompensar a los miembros activos que les ayudan a alcanzar sus objetivos.',
    fantomeText:
      'El modo fantasma es nuestro equivalente al modo "incógnito". Puedes navegar por los foros públicos tal como están, pero no podrás participar en la evolución del proyecto. Nuestro modo fantasma permite a cualquier usuario de internet consultar un foro público apoyado por FOROM. Los usuarios en modo fantasma no pueden acumular píxeles, subir de nivel ni participar en los esfuerzos colaborativos de múltiples comunidades.',
  },
}

interface MoodSelectionProps {
  onGhost: () => void
  onColor: (action: 'login' | 'register') => void
  onBack?: () => void
}



export function MoodSelection({ onGhost, onColor, onBack }: MoodSelectionProps) {
  const { language } = useAppStore()
  const t = TRANSLATIONS[language] || TRANSLATIONS.en
  const [selected, setSelected] = useState<'couleur' | 'fantome' | null>(null)
  const [isSignInOpen, setIsSignInOpen] = useState(false)

  const [colorInfoOpen, setColorInfoOpen] = useState(false)
  const [ghostInfoOpen, setGhostInfoOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Play interceptor sound on mount
  useEffect(() => {
    const audio = new Audio(interceptorSnd)
    audio.volume = 0.4
    audioRef.current = audio
    audio.play().catch((e) => console.warn('Interceptor sound blocked:', e))
    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  const handleConfirm = useCallback(() => {
    if (selected === 'couleur') {
      setIsSignInOpen(true);
    } else if (selected === 'fantome') {
      onGhost();
    }
  }, [selected, onGhost])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSignInOpen) return;

      if (e.code === 'KeyC' || e.key === 'c' || e.key === 'C') {
        setSelected('couleur');
      } else if (e.code === 'KeyG' || e.key === 'g' || e.key === 'G') {
        setSelected('fantome');
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (selected) {
          handleConfirm();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected, isSignInOpen, handleConfirm]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#050505',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        color: 'white',
      }}
    >
      {/* Chroma Portal in top-left */}
      <img
        src={chromaPortalIcon}
        alt="Chroma portal"
        onClick={onBack}
        style={{
          cursor: 'pointer',
          position: 'absolute',
          top: '24px',
          left: '24px',
          width: 'clamp(32px, 4vw, 48px)',
          height: 'clamp(32px, 4vw, 48px)',
          objectFit: 'contain',
        }}
      />

      {/* Title */}
      <h1
        style={{
          fontFamily: "'Jersey 15', sans-serif",
          fontSize: 'clamp(28px, min(5vw, 7vh), 64px)',
          fontWeight: 900,
          letterSpacing: '0.12em',
          margin: 0,
          marginBottom: 'clamp(30px, 5vh, 60px)',
        }}
      >
        {t.title}
      </h1>

      {/* Main content: left info + center selections + right info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '1200px',
          gap: 'clamp(16px, 3vw, 40px)',
          padding: '0 4vw',
          boxSizing: 'border-box',
        }}
      >
        {/* Left info panel — Color explanation */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            minHeight: '300px',
          }}
        >
          <AnimatePresence>
            {colorInfoOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%' }}
              >
                <h3
                  style={{
                    fontFamily: "'Jersey 15', sans-serif",
                    fontSize: 'clamp(12px, min(1.4vw, 2vh), 20px)',
                    fontWeight: 400,
                    letterSpacing: '0.1em',
                    color: '#FFD700',
                    textAlign: 'center',
                    margin: '0 0 12px',
                  }}
                >
                  <TypewriterText text={t.couleurTitle} />
                </h3>
                <p
                  style={{
                    fontFamily: "'BitcountGridSingle-Light', monospace",
                    fontSize: 'clamp(10px, min(1.1vw, 1.4vh), 14px)',
                    color: '#FFD700',
                    lineHeight: 1.6,
                    opacity: 0.9,
                    textAlign: 'justify',
                    margin: 0,
                  }}
                >
                  <TypewriterText text={t.couleurText} />
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center — Couleur + Fantôme vertical stack */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(20px, 3vh, 40px)',
            flexShrink: 0,
          }}
        >
          {/* Couleur */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontFamily: "'Jersey 15', sans-serif",
                fontSize: 'clamp(14px, min(1.6vw, 2.2vh), 22px)',
                letterSpacing: '0.2em',
                color: selected === 'couleur' ? '#FFD700' : 'rgba(255,255,255,0.7)',
              }}
            >
              {t.couleur}
            </span>
            <motion.div
              onClick={() => setSelected('couleur')}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 'clamp(60px, min(8vw, 10vh), 110px)',
                height: 'clamp(60px, min(8vw, 10vh), 110px)',
                cursor: 'pointer',
                borderRadius: '50%',
                border: selected === 'couleur' ? '3px solid #FFD700' : '3px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.3s',
              }}
            >
              <img
                src={chromaPortalIcon}
                alt="Couleur"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </motion.div>
            <InfoButton isActive={colorInfoOpen} onClick={() => setColorInfoOpen(!colorInfoOpen)} />
          </div>

          {/* Fantôme */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontFamily: "'Jersey 15', sans-serif",
                fontSize: 'clamp(14px, min(1.6vw, 2.2vh), 22px)',
                letterSpacing: '0.2em',
                color: selected === 'fantome' ? '#FFD700' : 'rgba(255,255,255,0.7)',
              }}
            >
              {t.fantome}
            </span>
            <motion.div
              onClick={() => setSelected('fantome')}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 'clamp(60px, min(8vw, 10vh), 110px)',
                height: 'clamp(60px, min(8vw, 10vh), 110px)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: selected === 'fantome' ? '3px solid #FFD700' : '3px solid transparent',
                borderRadius: '12px',
                transition: 'border-color 0.3s',
              }}
            >
              <img
                src={ghostWhtIcon}
                alt="Fantôme"
                style={{
                  width: '80%',
                  height: '80%',
                  objectFit: 'contain',
                }}
              />
            </motion.div>
            <InfoButton isActive={ghostInfoOpen} onClick={() => setGhostInfoOpen(!ghostInfoOpen)} />
          </div>
        </div>

        {/* Right info panel — Ghost explanation */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            minHeight: '300px',
          }}
        >
          <AnimatePresence>
            {ghostInfoOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%' }}
              >
                <h3
                  style={{
                    fontFamily: "'Jersey 15', sans-serif",
                    fontSize: 'clamp(12px, min(1.4vw, 2vh), 20px)',
                    fontWeight: 400,
                    letterSpacing: '0.1em',
                    color: '#FFD700',
                    textAlign: 'center',
                    margin: '0 0 12px',
                  }}
                >
                  <TypewriterText text={t.fantomeTitle} />
                </h3>
                <p
                  style={{
                    fontFamily: "'BitcountGridSingle-Light', monospace",
                    fontSize: 'clamp(10px, min(1.1vw, 1.4vh), 14px)',
                    color: '#FFD700',
                    lineHeight: 1.6,
                    opacity: 0.9,
                    textAlign: 'justify',
                    margin: 0,
                  }}
                >
                  <TypewriterText text={t.fantomeText} />
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '20px', marginTop: 'clamp(30px, 5vh, 60px)' }}>
        <motion.button
          onClick={handleConfirm}
          whileHover={selected ? { scale: 1.05 } : {}}
          whileTap={selected ? { scale: 0.95 } : {}}
          style={{
            padding: 'clamp(12px, 1.8vh, 20px) clamp(50px, 8vw, 100px)',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: 'clamp(16px, min(2vw, 2.5vh), 24px)',
            letterSpacing: '0.05em',
            border: 'none',
            cursor: selected ? 'pointer' : 'not-allowed',
            backgroundColor: selected ? '#5B9F65' : 'rgba(91,159,101,0.35)',
            color: selected ? '#ffffff' : 'rgba(255,255,255,0.4)',
            transition: 'background-color 0.3s, color 0.3s',
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          {t.confirmer}
        </motion.button>
      </div>

      {/* Sign-In Modal */}
      <AnimatePresence>
        {isSignInOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSignInOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              zIndex: 10000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
            }}
          >
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              style={{
                fontFamily: "'Jersey 15', sans-serif",
                fontSize: 'clamp(28px, 5vw, 42px)',
                color: 'white',
                margin: 0,
                letterSpacing: '0.1em',
              }}
            >
              Nouveau?
            </motion.h2>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#121212',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px',
                padding: '32px 24px',
                width: '90%',
                maxWidth: '360px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              }}
            >
              <button
                onClick={() => setIsSignInOpen(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                ✕
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', alignItems: 'center', marginTop: '10px' }}>

                {/* Standard Login */}
                <motion.button
                  onClick={() => onColor('login')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '999px',
                    backgroundColor: '#FFFFFF',
                    color: '#6B21A8', // Purple
                    border: 'none',
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                >
                  Connexion
                </motion.button>

                {/* Create Account - Pointing to Enrollment Flow */}
                <motion.button
                  onClick={() => onColor('register')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '999px',
                    backgroundColor: '#FFFFFF',
                    color: '#F97316', // Orange
                    border: 'none',
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                >
                  Créer un compte
                </motion.button>

                {/* Divider */}
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: "'Montserrat', sans-serif" }}>OU</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                </div>

                {/* Discord Fast Connect */}
                <motion.button
                  onClick={() => window.location.href = "https://auth.forom.xyz/source/oauth/login/discord/?next=%2Fapplication%2Fo%2Fauthorize%2F%3Fclient_id%3Dforom-web-app%26response_type%3Dcode%26redirect_uri%3Dhttps%3A%2F%2Fforom.xyz%2Fcallback%26scope%3Dopenid+profile+email+forom_data"}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '999px',
                    backgroundColor: '#5865F2', // Discord Blurple
                    color: '#FFFFFF',
                    border: 'none',
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                  </svg>
                  Continuer avec Discord
                </motion.button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}
