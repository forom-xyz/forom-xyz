import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import foromLogoBlk from '../assets/icons/forom_logo_blk.png'
import foromLogoWht from '../assets/icons/forom_logo_wht.png'

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

type Phase = 'blackwipe' | 'split' | 'logo' | 'exit'

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<Phase>('blackwipe')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('split'), 700)
    const t2 = setTimeout(() => setPhase('logo'),  1100)
    const t3 = setTimeout(() => setPhase('exit'),  2000)
    const t4 = setTimeout(onComplete,              2700)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [onComplete])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: '#0a0a0a', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>

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
