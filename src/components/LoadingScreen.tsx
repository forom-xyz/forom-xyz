import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import foromLogoBlk from '../assets/icons/forom_logo_blk.png'
import foromLogoWht from '../assets/icons/forom_logo_wht.png'
import bonjourHiSnd from '../assets/sons/bonjourhi.mp3'
import exploromSnd from '../assets/sons/explorom.mp3'

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

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<Phase>('init')
  const [isHovering, setIsHovering] = useState(false)
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!hoverAudioRef.current) {
      hoverAudioRef.current = new Audio(exploromSnd)
      hoverAudioRef.current.loop = true
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
    setTimeout(() => setPhase('logo'),  1100)
    setTimeout(() => setPhase('exit'),  2000)
    setTimeout(onComplete,              2700)
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

            {/* Logo at 25% from top edge */}
            <motion.img 
              src={foromLogoWht} 
              alt="Forom" 
              style={{ position: 'absolute', top: '25vh', left: '50%', x: '-50%', height: 'clamp(40px, 8vw, 100px)', zIndex: 10, pointerEvents: 'none' }} 
            />

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
                    fontSize: 'clamp(100px, 18vw, 280px)', 
                    color: '#ffffff',
                    fontFamily: "'Jersey 15', sans-serif",
                    letterSpacing: '0.15em',
                    lineHeight: 1
                  }}
                >
                  EXPLORE
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
                    fontSize: 'clamp(100px, 18vw, 280px)', 
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
                  {"EXPLORE".split('').map((char, i) => (
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

            {/* Lock in text at 25% from bottom edge */}
            <span style={{ position: 'absolute', bottom: '25vh', left: '50%', transform: 'translateX(-50%)', zIndex: 10, fontSize: 'clamp(14px, 2vw, 20px)', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              LOCK IN, CUT NOISE
            </span>
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
