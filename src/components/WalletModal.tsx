import ReactModal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

import carmelImg from '../assets/icons/carmel.png'
import carmelOutchSound from '../assets/sons/carmel_outch.m4a'
import carmelMadSound from '../assets/sons/carmel_mad.m4a'

import type { UserRole } from '../App'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
  pixels: number
  userRole?: UserRole
}

const modalStyles: ReactModal.Styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.72)',
    zIndex: 9998,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  content: {
    position: 'relative',
    inset: 'auto',
    width: '52vw',
    maxWidth: 'none',
    height: 'auto',
    maxHeight: '88vh',
    padding: 0,
    border: 'none',
    background: 'transparent',
    overflow: 'hidden',
    borderRadius: 0,
    boxSizing: 'border-box' as const,
    display: 'flex',
    flexDirection: 'column' as const,
  },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.12, ease: 'easeOut' as const } },
  exit:    { opacity: 0, scale: 0.97, transition: { duration: 0.08, ease: 'easeIn'  as const } },
}

function DonutGauge({
  percentage, color, label, px, size = 140,
}: {
  percentage: number; color: string; label: string; px: number; size?: number
}) {
  const r      = (size - 16) / 2
  const circ   = 2 * Math.PI * r
  const offset = circ * (1 - percentage / 100)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={14} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={14}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Jersey 15', sans-serif", fontSize: 22, fontWeight: 900, color,
        }}>
          {percentage}%
        </div>
      </div>
      <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>
        {label}
      </div>
      <div style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 14, fontWeight: 900, color }}>
        {px} PX
      </div>
    </div>
  )
}

// ─── Monthly activity chart ────────────────────────────────────────────────
const MONTH_LABELS_W = ['J','F','M','A','M','J','J','A','S','O','N','D']
const MONTHLY_DATA_W = MONTH_LABELS_W.map(m => ({ month: m, quests: 0, missions: 0 }))

function MonthlyActivityChart() {
  const maxVal = Math.max(...MONTHLY_DATA_W.flatMap(d => [d.quests, d.missions]), 1)
  const CHART_H = 80
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        {[{ label: 'Quêtes', color: '#E85C5C' }, { label: 'Missions', color: '#3B82F6' }].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: l.color }} />
            <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.45)', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{l.label}</span>
          </div>
        ))}
      </div>
      {/* Bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: CHART_H, borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: 0 }}>
        {MONTHLY_DATA_W.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end', justifyContent: 'center', width: '100%', flex: 1 }}>
              <div style={{ width: '42%', maxWidth: 8, height: Math.max(2, (d.quests   / maxVal) * (CHART_H - 14)), backgroundColor: '#E85C5C', borderRadius: '2px 2px 0 0', flexShrink: 0 }} />
              <div style={{ width: '42%', maxWidth: 8, height: Math.max(2, (d.missions / maxVal) * (CHART_H - 14)), backgroundColor: '#3B82F6', borderRadius: '2px 2px 0 0', flexShrink: 0 }} />
            </div>
            <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.38)', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, lineHeight: 1 }}>{d.month}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ECONOMY = [
  { label: 'S-MODS',   percentage: 90, color: '#C084FC', px: 4500 },
  { label: 'MODS',     percentage: 10, color: '#F59E0B', px: 500  },
  { label: 'CREATOR',  percentage: 0,  color: 'rgba(255,255,255,0.3)', px: 0 },
  { label: 'ASSOCIES', percentage: 0,  color: 'rgba(255,255,255,0.3)', px: 0 },
]

export function WalletModal({ isOpen, onClose, pixels, userRole }: WalletModalProps) {
  const showFullEconomy = userRole === 'S-MODS' || userRole === 'MODS';
  const [carmelTaps, setCarmelTaps] = useState(0);

  const handleCarmelClick = () => {
    const newTaps = carmelTaps + 1;
    setCarmelTaps(newTaps);
    
    if (newTaps >= 10) {
      const audio = new Audio(carmelMadSound);
      audio.play().catch(e => console.error("Audio error:", e));
      setCarmelTaps(0);
    } else {
      const audio = new Audio(carmelOutchSound);
      audio.play().catch(e => console.error("Audio error:", e));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ReactModal
          isOpen={isOpen}
          onRequestClose={onClose}
          style={modalStyles}
          closeTimeoutMS={200}
          contentLabel={showFullEconomy ? "FOROM ECONOMY" : "PORTEFEUILLE"}
          shouldCloseOnOverlayClick
          shouldCloseOnEsc
          ariaHideApp={true}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              backgroundColor: '#007F36',
              border: '8px solid #5C4033',
              borderRadius: '38px',
              color: 'white',
              overflow: 'hidden',
              padding: '40px 44px 36px',
              gap: 28,
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              type="button"
              aria-label="Fermer"
              style={{
                position: 'absolute', top: 20, right: 20, zIndex: 100,
                width: 44, height: 44, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: '#FF4B4B', border: '3px solid black',
                cursor: 'pointer', boxShadow: '0 4px 0px rgba(0,0,0,1)',
              }}
              onMouseOver={e => { e.currentTarget.style.backgroundColor = '#ff3333'; e.currentTarget.style.transform = 'translateY(2px)'; e.currentTarget.style.boxShadow = '0 2px 0px rgba(0,0,0,1)' }}
              onMouseOut={e  => { e.currentTarget.style.backgroundColor = '#FF4B4B'; e.currentTarget.style.transform = 'none';             e.currentTarget.style.boxShadow = '0 4px 0px rgba(0,0,0,1)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {showFullEconomy ? (
              <>
                {/* Header */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(28px, 3.5vw, 52px)', fontWeight: 900, letterSpacing: '0.14em', lineHeight: 1 }}>
                    <span style={{ color: '#FF4B4B' }}>FOROM</span>{' '}
                    <span style={{ color: 'white' }}>ECONOMY</span>
                  </div>
                  <div style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(13px, 1.4vw, 20px)', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>
                    5 000 PX &middot; PHASE <span style={{ color: '#EF4444' }}>1</span>
                  </div>
                </div>

                {/* 4 donut gauges in 2x2 grid */}
                <div style={{
                  position: 'relative',
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: '24px 32px', justifyItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 16,
                  padding: '28px 24px',
                }}>
                  {ECONOMY.map(e => (
                    <DonutGauge key={e.label} label={e.label} percentage={e.percentage} color={e.color} px={e.px} />
                  ))}

                  {/* Carmel Easter Egg */}
                  <div
                    onClick={handleCarmelClick}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                      zIndex: 10,
                      width: 64,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Carmel"
                  >
                    <img 
                      src={carmelImg} 
                      alt="Carmel" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain',
                        transition: 'transform 0.1s ease',
                      }}
                      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.85)'; }}
                      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    />
                  </div>
                </div>

                {/* Mission 1 */}
                <div style={{
                  backgroundColor: 'rgba(0,0,0,0.25)', border: '2px solid rgba(255,255,255,0.1)',
                  borderRadius: 14, padding: '18px 22px',
                }}>
                  <div style={{
                    textAlign: 'center', fontFamily: 'Montserrat, sans-serif',
                    fontSize: 10, fontWeight: 900, letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 18,
                  }}>
                    MISSION 1 &ndash; TRANSFERT DU POUVOIR
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {/* Chateau */}
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>CHATEAU</div>
                      <div style={{
                        width: 66, height: 66, borderRadius: '50%',
                        backgroundColor: '#111', border: '3px solid rgba(255,255,255,0.7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Jersey 15', sans-serif", fontSize: 14, fontWeight: 900, color: 'white',
                        margin: '0 auto',
                      }}>100%</div>
                    </div>
                    {/* Bar */}
                    <div style={{ flex: 1, position: 'relative', height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'visible' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '0%', backgroundColor: '#22C55E', borderRadius: 4 }} />
                      <div style={{
                        position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)',
                        fontFamily: 'Montserrat, sans-serif', fontSize: 8, fontWeight: 800,
                        color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', whiteSpace: 'nowrap',
                      }}>OBJECTIF 50%</div>
                    </div>
                    {/* Communaute */}
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>COMMUNAUTE</div>
                      <div style={{
                        width: 66, height: 66, borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.1)', border: '3px solid rgba(255,255,255,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Jersey 15', sans-serif", fontSize: 14, fontWeight: 900, color: 'rgba(255,255,255,0.4)',
                        margin: '0 auto',
                      }}>0%</div>
                    </div>
                  </div>
                </div>

                {/* Monthly activity chart */}
                <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', border: '2px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 20px' }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10, textAlign: 'center' }}>ACTIVITÉ MENSUELLE</div>
                  <MonthlyActivityChart />
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: '20px' }}>
                 <div style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '0.14em', color: 'white', textTransform: 'uppercase' }}>
                    MON PORTEFEUILLE
                 </div>
                 <div style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(54px, 8vw, 96px)', fontWeight: 900, color: '#FFD700', textShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>
                    {pixels} PX
                 </div>
              </div>
            )}

          </motion.div>
        </ReactModal>
      )}
    </AnimatePresence>
  )
}
