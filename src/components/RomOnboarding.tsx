import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import romWht from '../assets/icons/rom_wht.png'
import bipbopSnd from '../assets/sons/bipbop.mp3'
import noSnd from '../assets/sons/no.mp3'
import yesSnd from '../assets/sons/yes.mp3'
import backSnd from '../assets/sons/back.mp3'

type OnboardingPhase = 0 | 1 | 'public_tour' | 'login_tour' | 2 | 3 | 4 | 'idle'

interface RomOnboardingProps {
  currentUser: string | null
  isCreateSelected: boolean
  onPhaseChange?: (phase: OnboardingPhase) => void
}

const TypewriterText = ({ text, onComplete }: { text: string, onComplete?: () => void }) => {
  const [displayed, setDisplayed] = useState('')
  const cbRef = useRef(onComplete)

  useEffect(() => {
    cbRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i))
      i++
      if (i > text.length) {
        clearInterval(interval)
        cbRef.current?.()
      }
    }, 40) // Typed character speed
    return () => clearInterval(interval)
  }, [text])

  return <span>{displayed}</span>
}

export function RomOnboarding({ currentUser, isCreateSelected, onPhaseChange }: RomOnboardingProps) {
  const [phase, setPhase] = useState<OnboardingPhase>(0)
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    onPhaseChange?.(phase)
  }, [phase, onPhaseChange])

  // Audio for Phase 0
  useEffect(() => {
    if (phase === 0) {
      const audio = new Audio(bipbopSnd)
      audio.play().catch(e => console.warn('Browser blocked autoplay bipbop audio:', e))
    }
  }, [phase])

  // Phase transitions based on props safely
  const prevUser = useRef(currentUser)
  useEffect(() => {
    if (!prevUser.current && currentUser) {
      window.setTimeout(() => {
        setPhase(2)
        setIsTyping(true)
      }, 0)
    }
    prevUser.current = currentUser
  }, [currentUser])

  const prevCreate = useRef(isCreateSelected)
  useEffect(() => {
    if (!prevCreate.current && isCreateSelected && phase === 3) {
      window.setTimeout(() => {
        setPhase(4)
        setIsTyping(true)
      }, 0)
    }
    prevCreate.current = isCreateSelected
  }, [isCreateSelected, phase])

  const handleSkip = () => {
    const audio = new Audio(noSnd)
    audio.play().catch(e => console.warn('Browser blocked autoplay no audio:', e))
    setPhase('idle')
  }
  const handleNext = () => {
    const audio = new Audio(yesSnd)
    audio.play().catch(e => console.warn('Browser blocked autoplay yes audio:', e))
    
    if (phase === 1) setPhase('public_tour')
    else if (phase === 'public_tour') setPhase('login_tour')
    else if (phase === 'login_tour') setPhase('idle')
    else if (typeof phase === 'number' && phase < 4) setPhase((phase + 1) as OnboardingPhase)
    else if (phase === 4) setPhase('idle')
    
    setIsTyping(true)
  }
  const handleBack = () => {
    const audio = new Audio(backSnd)
    audio.play().catch(e => console.warn('Browser blocked autoplay back audio:', e))

    if (phase === 3) setPhase(2)
    else if (phase === 4) setPhase(3)
    else if (phase === 'public_tour') setPhase(1)
    else if (phase === 'login_tour') setPhase('public_tour')
    
    setIsTyping(true)
  }

  const getPhaseText = () => {
    switch (phase) {
      case 0:
        return 'Bip Bop?'
      case 1:
        return 'Beep boop! Whirrr... Bleep blop doot dwee drrt. Zzzzt pbbbt, doot doot dzzt!'
      case 2:
        return 'Bweeee! Ding ding! Kzzt... bop bop whirrrrr.'
      case 3:
        return 'Dzzt-bweep drrr bap:\n\nBloop: Zzzt whirr bweeeep dzzt.\n\nBeep: Pbbbt "Minecraft" bop-bop ROM kzzt!'
      case 4:
        return 'Beep doot Jetson NANO! Whirrr.\n\nBzt: 1TB boop. Dwee drrt pwede FOROM. Dzzt!\n\n*Whirrrrrr.*'
      case 'public_tour':
        return 'Oooohhh bweeee bloop publico forom dzzt...\n\nBweeeep!'
      case 'login_tour':
        return 'Dzzt sign in pwede boop ;)'
      default:
        return ''
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      position: 'relative',
    }}>

      {/* Unified Golden Snitch Wrapper */}
      <motion.div
        transition={{ type: 'spring', damping: 14, stiffness: 120 }}
        style={{ 
          zIndex: 100, 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center', 
          position: 'relative' 
        }}
      >
        {/* ROM Character */}
        <motion.img
          src={romWht}
          alt="ROM Guardian"
          onClick={() => {
            if (phase === 'idle') {
              setPhase(0)
              setIsTyping(true)
            }
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            width: phase === 'idle' || phase === 0 ? 'clamp(104px, 14vw, 220px)' : 'clamp(36px, 5vw, 77px)',
            height: phase === 'idle' || phase === 0 ? 'clamp(104px, 14vw, 220px)' : 'clamp(36px, 5vw, 77px)',
            opacity: phase === 'idle' ? 0.6 : 1,
            y: phase === 'idle' ? 0 : [0, -10, 0],
          }}
          transition={{
            width: { type: 'spring', damping: 14, stiffness: 200, duration: 0.5 },
            height: { type: 'spring', damping: 14, stiffness: 200, duration: 0.5 },
            scale: { type: 'spring', damping: 14, stiffness: 200, duration: 0.5 },
            y: { repeat: phase === 'idle' ? 0 : Infinity, duration: 2, ease: 'easeInOut' }
          }}
          style={{
            objectFit: 'contain',
            marginBottom: phase !== 'idle' ? '0px' : 'clamp(24px, 4vh, 56px)',
            flexShrink: 0,
            filter: phase !== 'idle' ? 'drop-shadow(0 0 20px rgba(255,255,255,0.6))' : 'none',
            cursor: phase === 'idle' ? 'pointer' : 'default',
          }}
        />

        {/* Pokemon-style Dialogue Box */}
        <AnimatePresence mode="wait">
          {phase !== 'idle' && (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                bottom: '100%',
                marginBottom: phase === 0 ? '16px' : (phase === 'public_tour' || phase === 'login_tour' ? '0px' : '30px'),
                backgroundColor: '#e6e6e6',
                border: '4px solid #4a4a4a',
                borderRadius: '16px',
                padding: '24px 20px 48px 20px',
                width: phase === 0 ? '200px' : '260px',
                maxWidth: phase === 0 ? '200px' : '260px',
                minHeight: phase === 0 ? '90px' : '150px',
                boxShadow: 'inset 0 0 0 3px rgba(255,255,255,0.7), 0 16px 32px rgba(0,0,0,0.6)', 
                zIndex: 10,
                pointerEvents: 'auto',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: "'Bytesize', monospace",
                color: '#1a1a1a',
                fontSize: phase === 0 ? 'clamp(22px, 2vw, 26px)' : 'clamp(14px, 1.4vw, 16px)',
                lineHeight: 1.6,
                letterSpacing: '0.05em',
              }}
            >
              {/* Close X mark */}
              {phase !== 0 && (
                <div onClick={handleSkip} style={{ position: 'absolute', top: -14, right: -10, backgroundColor: '#c5c5c5', border: '3px solid #484848', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                  <span style={{ color: '#e85c5c', fontSize: 16, fontWeight: 900, lineHeight: 1 }}>×</span>
                </div>
              )}

              {/* Outer Triangle Tail */}
              <div style={{ position: 'absolute', bottom: '-22px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: '18px solid #4a4a4a', zIndex: 1 }} />
              {/* Inner Triangle Fill */}
              <div style={{ position: 'absolute', bottom: '-13px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderTop: '13px solid #e6e6e6', zIndex: 2 }} />

              <div style={{ flex: 1, whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', justifyContent: phase === 0 ? 'center' : 'flex-start', alignItems: phase === 0 ? 'center' : 'flex-start', textAlign: phase === 0 ? 'center' : 'left' }}>
                <TypewriterText text={getPhaseText()} onComplete={() => setIsTyping(false)} />
              </div>

              {/* Actions Nav (Absolute Positioned over border) */}
              {!isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: 0,
                    right: 0,
                    padding: '0 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    pointerEvents: 'none'
                  }}
                >
                  {/* LEFT ACTIONS */}
                  <div style={{ pointerEvents: 'auto', display: 'flex', gap: '8px' }}>
                    {phase === 0 && (
                      <button
                        onClick={handleSkip}
                        style={{ padding: '6px 14px', borderRadius: '4px', border: '3px solid #1a1a1a', backgroundColor: '#e0e0e0', color: '#1a1a1a', fontSize: '14px', fontWeight: 900, fontFamily: "'Bytesize', monospace", cursor: 'pointer', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.4)' }}
                      >
                        no
                      </button>
                    )}
                    {(phase === 'public_tour' || phase === 'login_tour' || (typeof phase === 'number' && phase > 1)) && (
                      <button
                        onClick={handleBack}
                        style={{ padding: '6px 14px', borderRadius: '4px', border: '3px solid #1a1a1a', backgroundColor: '#5bc0de', color: '#fff', fontSize: '14px', fontWeight: 900, fontFamily: "'Bytesize', monospace", cursor: 'pointer', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.4)', textShadow: '1px 1px 0 #000' }}
                      >
                        back
                      </button>
                    )}
                  </div>

                  {/* RIGHT ACTIONS */}
                  <div style={{ pointerEvents: 'auto', display: 'flex', gap: '8px' }}>
                    {phase === 0 && (
                      <button
                        onClick={() => { 
                          const audio = new Audio(yesSnd)
                          audio.play().catch(e => console.warn('Browser blocked autoplay yes audio:', e))
                          setPhase(1)
                          setIsTyping(true)
                        }}
                        style={{ padding: '6px 14px', borderRadius: '4px', border: '3px solid #1a1a1a', backgroundColor: '#e85c5c', color: '#fff', fontSize: '14px', fontWeight: 900, fontFamily: "'Bytesize', monospace", cursor: 'pointer', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.4)', textShadow: '1px 1px 0 #000' }}
                      >
                        yes
                      </button>
                    )}
                    {(phase === 1 || phase === 'public_tour' || phase === 'login_tour') && (
                      <button
                        onClick={handleNext}
                        style={{ padding: '6px 14px', borderRadius: '4px', border: '3px solid #1a1a1a', backgroundColor: '#e85c5c', color: '#fff', fontSize: '14px', fontWeight: 900, fontFamily: "'Bytesize', monospace", cursor: 'pointer', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.4)', textShadow: '1px 1px 0 #000' }}
                      >
                        {phase === 'login_tour' ? 'finish' : 'next'}
                      </button>
                    )}
                    {typeof phase === 'number' && phase > 1 && (
                      <>
                        {phase < 4 && (
                          <button onClick={handleNext} style={{ padding: '6px 14px', borderRadius: '4px', border: '3px solid #1a1a1a', backgroundColor: '#e85c5c', color: '#fff', fontSize: '14px', fontWeight: 900, fontFamily: "'Bytesize', monospace", cursor: 'pointer', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.4)', textShadow: '1px 1px 0 #000' }}>next</button>
                        )}
                        {phase === 4 && (
                          <button onClick={handleSkip} style={{ padding: '6px 14px', borderRadius: '4px', border: '3px solid #1a1a1a', backgroundColor: '#5B9F65', color: '#fff', fontSize: '14px', fontWeight: 900, fontFamily: "'Bytesize', monospace", cursor: 'pointer', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.4)', textShadow: '1px 1px 0 #000' }}>finish</button>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
