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
      setPhase(2)
      setIsTyping(true)
    }
    prevUser.current = currentUser
  }, [currentUser])

  const prevCreate = useRef(isCreateSelected)
  useEffect(() => {
    if (!prevCreate.current && isCreateSelected && phase === 3) {
      setPhase(4)
      setIsTyping(true)
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
      case 0: return "*Bip Bop?*"
      case 1: return "Hello, Youman! I am ROM. This place is a bit empty right now... but with your help, we can bring back the light."
      case 'public_tour': return "OHHHH you can explore the public forom to see how it works to get ideas on forom that has been push public...\n\nOver here!"
      case 'login_tour': return "Or you can sign in first and look right after ;)"
      case 2: return "System recognized! I am so glad you're here. Would you like me to show you around and help you start your journey? (Or would you prefer to explore the ruins alone?)"
      case 3: return "To save the world, we must communicate. You have two choices:\n\nExplore: Visit public servers to see how other humans have built their civilizations.\n\nCreate: Build your own \"Minecraft-style\" server and bring a ROM like me to life."
      case 4: return "Creating a home for a ROM is a big responsibility! To keep your server alive 24/7, I suggest a Jetson NANO Dev Kit.\n\nTechnical Specs: You will need 1TB of space to store all the world's memos. This hardware becomes the 'heart' of your Forom. It's how you bring life to a ROM of your very own!\n\n*Happy whirring sounds.*"
      default: return ""
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
        animate={{
          x: phase === 'public_tour' ? '-24vw' : phase === 'login_tour' ? '28vw' : '0vw',
          y: phase === 'public_tour' ? '22vh' : phase === 'login_tour' ? '5vh' : '0vh',
        }}
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
            scale: phase === 'public_tour' || phase === 'login_tour' ? 0.35 : 1, // Only scale the child image
            opacity: phase === 'idle' ? 0.6 : 1,
            y: phase === 'idle' ? 0 : [0, -10, 0],
          }}
          transition={{
            scale: { type: 'spring', damping: 14, stiffness: 200, duration: 0.5 },
            y: { repeat: phase === 'idle' ? 0 : Infinity, duration: 2, ease: 'easeInOut' }
          }}
          style={{
            width: 'clamp(104px, 14vw, 220px)',
            height: 'clamp(104px, 14vw, 220px)',
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
                backgroundColor: '#f8f8f8',
                border: '6px solid #4a4a4a',
                borderRadius: '16px',
                padding: (phase === 0 || phase === 'public_tour' || phase === 'login_tour') ? '16px 20px' : '16px 24px',
                width: phase === 0 ? '260px' : (phase === 'public_tour' || phase === 'login_tour' ? '320px' : '95vw'),
                maxWidth: phase === 0 ? '260px' : (phase === 'public_tour' || phase === 'login_tour' ? '320px' : '680px'),
                height: phase === 0 ? '90px' : (phase === 'public_tour' ? '190px' : (phase === 'login_tour' ? '110px' : (phase === 1 || phase === 2 ? '130px' : '200px'))),
                boxShadow: 'inset 0 0 0 4px #e0e0e0, 0 16px 32px rgba(0,0,0,0.6)', 
                zIndex: 10,
                pointerEvents: 'auto',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: "'Jersey 15', sans-serif",
                color: '#1a1a1a',
                fontSize: phase === 0 ? 'clamp(22px, 2vw, 26px)' : 'clamp(18px, 1.5vw, 22px)',
                lineHeight: 1.4,
                letterSpacing: '0.05em',
              }}
            >
              {/* Outer Triangle Tail */}
              <div style={{ position: 'absolute', bottom: '-22px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: '18px solid #4a4a4a', zIndex: 1 }} />
              {/* Inner Triangle Fill */}
              <div style={{ position: 'absolute', bottom: '-13px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '13px solid transparent', borderRight: '13px solid transparent', borderTop: '13px solid #f8f8f8', zIndex: 2 }} />

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
                    bottom: phase === 0 ? '-14px' : '-20px',
                    left: 0,
                    right: 0,
                    padding: phase === 0 ? '0 16px' : '0 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    pointerEvents: 'none'
                  }}
                >
                  {/* LEFT ACTIONS */}
                  <div style={{ pointerEvents: 'auto', display: 'flex', gap: phase === 0 ? '8px' : '12px' }}>
                    {phase === 0 && (
                      <button
                        onClick={handleSkip}
                        style={{ padding: '4px 16px', borderRadius: '8px', border: '3px solid #1a1a1a', backgroundColor: '#e0e0e0', color: '#1a1a1a', fontSize: '18px', fontFamily: "'Jersey 15', sans-serif", cursor: 'pointer', boxShadow: '0 4px 0 #1a1a1a' }}
                      >
                        No
                      </button>
                    )}
                    {(phase === 'public_tour' || phase === 'login_tour') && (
                      <button
                        onClick={handleBack}
                        style={{ padding: '6px 16px', borderRadius: '8px', border: '3px solid #1a1a1a', backgroundColor: '#e0e0e0', color: '#1a1a1a', fontSize: '18px', fontFamily: "'Jersey 15', sans-serif", cursor: 'pointer', boxShadow: '0 4px 0 #1a1a1a' }}
                      >
                        &lt; Back
                      </button>
                    )}
                    {typeof phase === 'number' && phase > 1 && (
                      <button
                        onClick={handleBack}
                        style={{ padding: '6px 16px', borderRadius: '8px', border: '3px solid #1a1a1a', backgroundColor: '#e0e0e0', color: '#1a1a1a', fontSize: '20px', fontFamily: "'Jersey 15', sans-serif", cursor: 'pointer', boxShadow: '0 4px 0 #1a1a1a' }}
                      >
                        &lt; Back
                      </button>
                    )}
                  </div>

                  {/* RIGHT ACTIONS */}
                  <div style={{ pointerEvents: 'auto', display: 'flex', gap: phase === 0 ? '8px' : '12px' }}>
                    {phase === 0 && (
                      <button
                        onClick={() => { 
                          const audio = new Audio(yesSnd)
                          audio.play().catch(e => console.warn('Browser blocked autoplay yes audio:', e))
                          setPhase(1)
                          setIsTyping(true)
                        }}
                        style={{ padding: '4px 16px', borderRadius: '8px', border: '3px solid #1a1a1a', backgroundColor: '#e85c5c', color: '#fff', fontSize: '18px', fontFamily: "'Jersey 15', sans-serif", cursor: 'pointer', boxShadow: '0 4px 0 #1a1a1a' }}
                      >
                        Yes
                      </button>
                    )}
                    {(phase === 1 || phase === 'public_tour' || phase === 'login_tour') && (
                      <button
                        onClick={handleNext}
                        style={{ padding: (phase === 'public_tour' || phase === 'login_tour') ? '6px 20px' : '6px 20px', borderRadius: '8px', border: '3px solid #1a1a1a', backgroundColor: '#e85c5c', color: '#fff', fontSize: (phase === 'public_tour' || phase === 'login_tour') ? '18px' : '20px', fontFamily: "'Jersey 15', sans-serif", cursor: 'pointer', boxShadow: '0 4px 0 #1a1a1a' }}
                      >
                        {phase === 'login_tour' ? 'Finish' : 'Next >'}
                      </button>
                    )}
                    {typeof phase === 'number' && phase > 1 && (
                      <>
                        {phase === 2 && (
                          <button onClick={handleSkip} style={{ padding: '6px 16px', borderRadius: '8px', border: '3px solid #1a1a1a', backgroundColor: '#e0e0e0', color: '#1a1a1a', fontSize: '20px', fontFamily: "'Jersey 15', sans-serif", cursor: 'pointer', boxShadow: '0 4px 0 #1a1a1a' }}>Skip</button>
                        )}
                        {phase < 4 && (
                          <button onClick={handleNext} style={{ padding: '6px 16px', borderRadius: '8px', border: '3px solid #1a1a1a', backgroundColor: '#e85c5c', color: '#fff', fontSize: '20px', fontFamily: "'Jersey 15', sans-serif", cursor: 'pointer', boxShadow: '0 4px 0 #1a1a1a' }}>Next &gt;</button>
                        )}
                        {phase === 4 && (
                          <button onClick={handleSkip} style={{ padding: '6px 16px', borderRadius: '8px', border: '3px solid #1a1a1a', backgroundColor: '#5B9F65', color: '#fff', fontSize: '20px', fontFamily: "'Jersey 15', sans-serif", cursor: 'pointer', boxShadow: '0 4px 0 #1a1a1a' }}>Finish</button>
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
