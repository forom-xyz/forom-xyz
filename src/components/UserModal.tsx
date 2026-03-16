import ReactModal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'
import userIcon from '../assets/icons/user.png'
import type { ForomColor } from '../utils/foromColors'

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  pixels: number
  level: number
  title: string
  xp: number
  isDarkMode?: boolean
  foromColor?: ForomColor | null
  mission?: string
  currentUser?: string | null
  isSuperModerator?: boolean
  inVault?: number
  foromRules?: string[]
  foromFriendKeys?: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// ReactModal container styles
// ─────────────────────────────────────────────────────────────────────────────
const modalStyles: ReactModal.Styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    inset: 'auto',
    width: '80vw',
    height: '80vh',
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

const variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.12, ease: 'easeOut' as const } },
  exit:    { opacity: 0, scale: 0.97, transition: { duration: 0.08, ease: 'easeIn'  as const } },
}

// ─────────────────────────────────────────────────────────────────────────────
// MonthlyActivityChart — 12-column bar chart (quests vs missions per month)
// ─────────────────────────────────────────────────────────────────────────────
const MONTH_LABELS = ['J','F','M','A','M','J','J','A','S','O','N','D']

// Placeholder data — all zeros until a real API feeds this
const MONTHLY_DATA = MONTH_LABELS.map(m => ({ month: m, quests: 0, missions: 0 }))

function MonthlyActivityChart({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const maxVal = Math.max(...MONTHLY_DATA.flatMap(d => [d.quests, d.missions]), 1)
  const CHART_H = 72
  const textColor = theme === 'light' ? 'rgba(0,0,0,0.38)' : 'rgba(255,255,255,0.38)'
  const border    = theme === 'light' ? 'rgba(0,0,0,0.1)'  : 'rgba(255,255,255,0.1)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        {[{ label: 'Quêtes', color: '#E85C5C' }, { label: 'Missions', color: '#3B82F6' }].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: 1, backgroundColor: l.color }} />
            <span style={{ fontSize: 7, color: textColor, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{l.label}</span>
          </div>
        ))}
      </div>
      {/* Bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: CHART_H, borderBottom: `1px solid ${border}`, paddingBottom: 0 }}>
        {MONTHLY_DATA.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end', justifyContent: 'center', width: '100%', flex: 1 }}>
              <div style={{ width: '42%', maxWidth: 7, height: Math.max(2, (d.quests  / maxVal) * (CHART_H - 14)), backgroundColor: '#E85C5C', borderRadius: '2px 2px 0 0', flexShrink: 0 }} />
              <div style={{ width: '42%', maxWidth: 7, height: Math.max(2, (d.missions / maxVal) * (CHART_H - 14)), backgroundColor: '#3B82F6', borderRadius: '2px 2px 0 0', flexShrink: 0 }} />
            </div>
            <div style={{ fontSize: 7, color: textColor, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, lineHeight: 1 }}>{d.month}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CircleGauge — SVG donut gauge for economy distribution
// ─────────────────────────────────────────────────────────────────────────────
function CircleGauge({
  percentage,
  color,
  label,
  px,
}: {
  percentage: number
  color: string
  label: string
  px: number
}) {
  const r    = 32
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - percentage / 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ position: 'relative', width: 84, height: 84 }}>
        <svg width={84} height={84} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={42} cy={42} r={r}
            fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={9}
          />
          <circle
            cx={42} cy={42} r={r}
            fill="none" stroke={color} strokeWidth={9}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 900, color,
          fontFamily: "'Jersey 15', sans-serif",
        }}>
          {percentage}%
        </div>
      </div>
      <div style={{
        fontSize: 9, color: '#555',
        fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        {label}
      </div>
      <div style={{ fontSize: 12, color, fontFamily: "'Jersey 15', sans-serif", fontWeight: 900 }}>
        {px} PX
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────────────────────────────────────
type RoleTab = 'S-MODS' | 'MODS' | 'CREATOR' | 'ASSOCIES'

const NPC_NAMES = ['BOROM', 'DOROM', 'GOROM', 'HOROM', 'JOROM', 'KOROM', 'LOROM', 'MOROM']

const TABS: { id: RoleTab; label: string; max: number | string }[] = [
  { id: 'S-MODS',   label: 'S-MODS',   max: 9   },
  { id: 'MODS',     label: 'MODS',     max: 50  },
  { id: 'CREATOR',  label: 'CREATOR',  max: 150 },
  { id: 'ASSOCIES', label: 'ASSOCIES', max: '1k' },
]

// Economy distribution at Phase 1:
//   4 500 PX to 9 S-MODs (90%)
//     500 PX SOS fund counted under MODs (10%)
//       0 PX for CREATOR / ASSOCIES
const ECONOMY = [
  { label: 'S-MODS',   percentage: 90, color: '#C084FC', px: 4500 },
  { label: 'MODS',     percentage: 10, color: '#F59E0B', px: 500  },
  { label: 'CREATOR',  percentage: 0,  color: '#9CA3AF', px: 0    },
  { label: 'ASSOCIES', percentage: 0,  color: '#9CA3AF', px: 0    },
]

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export function UserModal({
  isOpen,
  onClose,
  pixels,
  level,
  title,
  xp,
  foromColor,
  mission,
  currentUser,
  isSuperModerator,
  inVault = 0,
  foromFriendKeys = [],
}: UserModalProps) {
  void xp
  void foromColor

  const [activeTab, setActiveTab] = useState<RoleTab>('S-MODS')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyKey = useCallback((key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 1800)
    })
  }, [])

  const displayName  = currentUser ? currentUser.toUpperCase() : 'XYLO'
  const lobbyName    = displayName + ' LOBBY'
  const userRole     = isSuperModerator ? 'SUPERMODS' : 'CITOYEN'
  const levelTitle   = level === 0 ? 'CITOYEN' : title.toUpperCase()
  const missionLabel = mission || 'SAUVER LES COMMUNAUTES'

  const supermods = [
    { id: 1, name: displayName, quests: 0, pixels, missions: 0, level, isBot: false, key: null as string | null },
    ...NPC_NAMES.map((name, i) => ({
      id: i + 2,
      name,
      quests: 0,
      pixels: 500,
      missions: 0,
      level: 0,
      isBot: true,
      key: foromFriendKeys[i] ?? null,
    })),
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <ReactModal
          isOpen={isOpen}
          onRequestClose={onClose}
          style={modalStyles}
          closeTimeoutMS={200}
          contentLabel="LOBBY DASHBOARD"
          shouldCloseOnOverlayClick
          shouldCloseOnEsc
          ariaHideApp={true}
        >
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#D9D9D9',
              border: '6px solid black',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 8px 0px rgba(0,0,0,1)',
              boxSizing: 'border-box',
            }}
          >
            {/* Responsive CSS */}
            <style>{`
              .ld-grid {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                grid-template-areas: "left center right";
                flex: 1;
                min-height: 0;
                overflow: hidden;
              }
              @media (orientation: portrait), (max-aspect-ratio: 1/1) {
                .ld-grid {
                  grid-template-columns: 1fr !important;
                  grid-template-areas: "center" "left" "right" !important;
                  overflow-y: auto !important;
                  overflow-x: hidden;
                }
                .ld-panel-left,
                .ld-panel-center { overflow-y: visible !important; }
                .ld-panel-right  { min-height: 420px; }
              }
              .ld-panel-left::-webkit-scrollbar,
              .ld-panel-center::-webkit-scrollbar { width: 3px; }
              .ld-panel-left::-webkit-scrollbar-thumb,
              .ld-panel-center::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 2px; }
              .ld-members::-webkit-scrollbar { width: 3px; }
              .ld-members::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); border-radius: 2px; }
            `}</style>

            {/* Close button */}
            <button
              onClick={onClose}
              type="button"
              aria-label="Fermer"
              style={{
                position: 'absolute', top: 14, right: 20, zIndex: 100,
                width: 40, height: 40, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: '#FF4B4B', border: '3px solid black',
                cursor: 'pointer', boxShadow: '0 4px 0px rgba(0,0,0,1)',
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = '#ff3333'
                e.currentTarget.style.transform = 'translateY(2px)'
                e.currentTarget.style.boxShadow = '0 2px 0px rgba(0,0,0,1)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = '#FF4B4B'
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 4px 0px rgba(0,0,0,1)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* 3-column grid */}
            <div className="ld-grid">

              {/* LEFT — Economy and Supermods view */}
              <div
                className="ld-panel-left"
                style={{
                  gridArea: 'left',
                  backgroundColor: '#d0d0d0',
                  padding: '24px 18px',
                  display: 'flex', flexDirection: 'column', gap: 14,
                  overflowY: 'auto',
                }}
              >
                {/* Coffers row */}
                <div style={{ display: 'flex', gap: 10 }}>

                  {/* COFFRE CACHEE — locked until community completes 3 phases + 1 yr + 1 000 assoc */}
                  <div style={{
                    flex: 1,
                    backgroundColor: '#7C3AED', border: '4px solid #111',
                    borderRadius: 10, padding: '10px 12px', textAlign: 'center',
                    position: 'relative', overflow: 'hidden',
                    boxShadow: '0 3px 0px rgba(0,0,0,0.7)',
                  }}>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.85)', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>
                      COFFRE CACHEE
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: 'white', fontFamily: "'Jersey 15', sans-serif", textDecoration: 'line-through', opacity: 0.6 }}>
                      {inVault} PX
                    </div>
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                      <div style={{
                        position: 'absolute', top: '50%', left: '4%', right: '4%',
                        height: 2, backgroundColor: 'rgba(255,255,255,0.45)',
                        transform: 'rotate(-7deg) translateY(-50%)',
                      }} />
                    </div>
                  </div>

                  {/* COFFRE SOS — needs min 50 votes from MODs/S-MODs to release */}
                  <div style={{
                    flex: 1,
                    backgroundColor: '#EA580C', border: '4px solid #111',
                    borderRadius: 10, padding: '10px 12px', textAlign: 'center',
                    boxShadow: '0 3px 0px rgba(0,0,0,0.7)',
                  }}>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.9)', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>
                      COFFRE SOS
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>
                      500 PX
                    </div>
                  </div>
                </div>

                {/* FOROM ECONOMY + PHASE */}
                <div style={{
                  backgroundColor: '#78350F', border: '4px solid #111',
                  borderRadius: 10, padding: '12px 14px',
                  boxShadow: '0 3px 0px rgba(0,0,0,0.7)',
                }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.65)', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>
                    FOROM ECONOMY PHASE
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <div style={{ fontSize: 26, fontWeight: 900, color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>
                      5 000 PX
                    </div>
                    <div style={{ fontSize: 30, fontWeight: 900, color: '#EF4444', fontFamily: "'Jersey 15', sans-serif" }}>
                      1
                    </div>
                  </div>
                </div>

                {/* Role wealth distribution — 4 circle gauges */}
                <div style={{
                  backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 8, padding: '14px 8px',
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, justifyItems: 'center',
                }}>
                  {ECONOMY.map(e => (
                    <CircleGauge key={e.label} {...e} />
                  ))}
                </div>

                {/* Monthly activity chart */}
                <div style={{ backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 8, padding: '10px 10px 8px' }}>
                  <div style={{ fontSize: 8, color: 'rgba(0,0,0,0.35)', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>ACTIVITÉ MENSUELLE</div>
                  <MonthlyActivityChart theme="light" />
                </div>

                {/* Mission 1 — visible to supermods only */}
                {isSuperModerator && (
                  <div style={{
                    backgroundColor: '#1c1c1c', border: '3px solid #333',
                    borderRadius: 10, padding: '14px 16px',
                    marginTop: 'auto',
                  }}>
                    <div style={{
                      fontSize: 10, fontFamily: 'Montserrat, sans-serif', fontWeight: 900,
                      color: 'white', letterSpacing: '0.08em', textTransform: 'uppercase',
                      textAlign: 'center', marginBottom: 14,
                    }}>
                      MISSION 1 - TRANSFERT DU POUVOIR
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>CHATEAU</div>
                        <div style={{
                          width: 54, height: 54, borderRadius: '50%',
                          backgroundColor: '#111', border: '3px solid white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 900, color: 'white',
                          fontFamily: "'Jersey 15', sans-serif", margin: '0 auto',
                        }}>100%</div>
                      </div>
                      <div style={{ flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2 }} />
                      <div style={{ textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>COMMUNAUTE</div>
                        <div style={{
                          width: 54, height: 54, borderRadius: '50%',
                          backgroundColor: '#d4d4d4', border: '3px solid white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 900, color: '#111',
                          fontFamily: "'Jersey 15', sans-serif", margin: '0 auto',
                        }}>0%</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CENTER — User Profile */}
              <div
                className="ld-panel-center"
                style={{
                  gridArea: 'center',
                  backgroundColor: '#e8e8e8',
                  padding: '32px 24px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                  borderLeft: '1px solid rgba(0,0,0,0.08)',
                  borderRight: '1px solid rgba(0,0,0,0.08)',
                  overflowY: 'auto',
                }}
              >
                <div style={{ fontSize: 11, color: '#C084FC', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  {userRole}
                </div>

                <div style={{ fontSize: 24, fontWeight: 900, color: '#111', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Jersey 15', sans-serif", textAlign: 'center' }}>
                  {lobbyName}
                </div>

                <div style={{
                  width: 100, height: 100, borderRadius: '50%',
                  backgroundColor: '#111', border: '5px solid #111',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', boxShadow: '0 4px 0px rgba(0,0,0,0.6)',
                }}>
                  <img src={userIcon} alt="" style={{ width: '65%', height: '65%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                </div>

                <div style={{ fontSize: 52, fontWeight: 900, color: '#111', lineHeight: 1, fontFamily: "'Jersey 15', sans-serif" }}>
                  {level}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <div style={{ fontSize: 11, color: '#666', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    NIVEAU {levelTitle}
                  </div>
                  <div style={{ fontSize: 10, color: '#999', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {missionLabel}
                  </div>
                </div>

                <div style={{ width: '70%', height: 1, backgroundColor: 'rgba(0,0,0,0.12)' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                    <div style={{ fontSize: 9, color: '#777', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      - QUETES -
                    </div>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', backgroundColor: '#E85C5C',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontWeight: 900, color: 'white',
                      fontFamily: "'Jersey 15', sans-serif",
                      border: '3px solid #111', boxShadow: '0 2px 0px rgba(0,0,0,0.5)',
                    }}>0</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <div style={{ fontSize: 11, color: '#555', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>PORTE</div>
                    <div style={{ fontSize: 9,  color: '#888', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>FEUILLE</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                    <div style={{ fontSize: 9, color: '#777', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      + MISSIONS +
                    </div>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', backgroundColor: '#3B82F6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontWeight: 900, color: 'white',
                      fontFamily: "'Jersey 15', sans-serif",
                      border: '3px solid #111', boxShadow: '0 2px 0px rgba(0,0,0,0.5)',
                    }}>0</div>
                  </div>
                </div>

                <div style={{ width: '100%', marginTop: 'auto', paddingTop: 12 }}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%', backgroundColor: '#22C55E',
                      border: '4px solid #111', borderRadius: 10,
                      padding: '16px 0', textAlign: 'center',
                      cursor: 'pointer', boxSizing: 'border-box',
                      boxShadow: '0 4px 0px rgba(0,0,0,0.7)',
                    }}
                  >
                    <div style={{ fontSize: 28, fontWeight: 900, color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>
                      {pixels} PX
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* RIGHT — Database / Leaderboard */}
              <div
                className="ld-panel-right"
                style={{
                  gridArea: 'right',
                  backgroundColor: '#1a1a1a',
                  display: 'flex', flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '20px 18px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'white', letterSpacing: '0.12em', fontFamily: "'Jersey 15', sans-serif", marginBottom: 12 }}>
                    DATABASE
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {TABS.map(tab => {
                      const current  = tab.id === 'S-MODS' ? 1 : 0
                      const isActive = activeTab === tab.id
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          style={{
                            padding: '4px 10px', borderRadius: 4, border: 'none',
                            cursor: 'pointer', fontSize: 10,
                            fontFamily: 'Montserrat, sans-serif', fontWeight: 700, letterSpacing: '0.06em',
                            backgroundColor: isActive ? 'white' : 'transparent',
                            color: isActive ? '#111' : 'rgba(255,255,255,0.4)',
                            transition: 'all 0.12s', whiteSpace: 'nowrap',
                          }}
                        >
                          {tab.label} {current}/{tab.max}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '24px 1fr 28px 60px 28px 120px',
                  padding: '7px 18px', gap: 4,
                  borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0,
                }}>
                  {(['ID', 'NOM', 'QUETES', 'PIXEL', 'MISSIONS', 'NIVEAU'] as const).map((h, i) => (
                    <div key={h} style={{
                      fontSize: 9, color: 'rgba(255,255,255,0.3)',
                      fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      textAlign: i === 3 ? 'center' : 'left',
                    }}>
                      {h}
                    </div>
                  ))}
                </div>

                <div className="ld-members" style={{ flex: 1, overflowY: 'auto' }}>
                  {activeTab === 'S-MODS' ? (
                    supermods.map(member => {
                      const isMe = member.name.toLowerCase() === currentUser?.toLowerCase()
                      return (
                        <div
                          key={member.id}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '24px 1fr 28px 60px 28px 120px',
                            padding: '7px 18px', gap: 4,
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            alignItems: 'center',
                            backgroundColor: isMe ? 'rgba(234,179,8,0.18)' : 'transparent',
                            transition: 'background-color 0.12s', cursor: 'default',
                          }}
                          onMouseEnter={e => { if (!isMe) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)' }}
                          onMouseLeave={e => { if (!isMe) e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                          <div style={{ color: isMe ? '#EAB308' : 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 700 }}>
                            {member.id}.
                          </div>
                          <div style={{
                            color: isMe ? '#EAB308' : 'rgba(255,255,255,0.9)',
                            fontSize: 13, fontWeight: isMe ? 900 : 700,
                            fontFamily: "'Jersey 15', sans-serif",
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {member.name}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{
                              width: 20, height: 20, borderRadius: '50%', backgroundColor: '#E85C5C',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 10, fontWeight: 900, color: 'white',
                            }}>
                              {member.quests}
                            </div>
                          </div>
                          <div style={{ color: '#22C55E', fontSize: 13, fontWeight: 900, textAlign: 'center', fontFamily: "'Jersey 15', sans-serif" }}>
                            {member.pixels}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{
                              width: 20, height: 20, borderRadius: '50%', backgroundColor: '#3B82F6',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 10, fontWeight: 900, color: 'white',
                            }}>
                              {member.missions}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
                            {member.key ? (
                              <button
                                onClick={() => copyKey(member.key!)}
                                title={`Copier: ${member.key}`}
                                style={{
                                  fontFamily: "'JetBrains Mono', monospace",
                                  fontSize: 9,
                                  backgroundColor: copiedKey === member.key ? '#22C55E' : '#2a2a2a',
                                  color: copiedKey === member.key ? 'white' : '#FFD700',
                                  border: `1px solid ${copiedKey === member.key ? '#22C55E' : '#444'}`,
                                  borderRadius: 4,
                                  padding: '2px 6px',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '100%',
                                  transition: 'background-color 0.2s, color 0.2s',
                                  flexShrink: 0,
                                }}
                              >
                                {copiedKey === member.key ? '✓ Copié' : `🔑 ${member.key}`}
                              </button>
                            ) : (
                              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>{member.level}</span>
                            )}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      height: '100%', padding: '48px 0',
                      color: 'rgba(255,255,255,0.25)',
                      fontFamily: "'Jersey 15', sans-serif", fontSize: 18, letterSpacing: '0.1em',
                    }}>
                      BIENTOT DISPONIBLE
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        </ReactModal>
      )}
    </AnimatePresence>
  )
}
