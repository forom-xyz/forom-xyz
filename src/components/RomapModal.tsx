import ReactModal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, CheckCircle2 } from 'lucide-react'

// =============================================================================
// TYPES
// =============================================================================

export interface RomapModalProps {
  isOpen: boolean
  onClose: () => void
  /** 1 = V1 active (phases 2,3 locked), 2 = V2 active (phase 1 done), 3 = V3 active */
  currentPhase?: 1 | 2 | 3
}

type PhaseStatus = 'completed' | 'active' | 'locked'

// =============================================================================
// HELPERS
// =============================================================================

function getStatus(phaseNum: 1 | 2 | 3, currentPhase: 1 | 2 | 3): PhaseStatus {
  if (phaseNum < currentPhase) return 'completed'
  if (phaseNum === currentPhase) return 'active'
  return 'locked'
}

const PHASE_COLORS = {
  1: { primary: '#EF4444', dim: 'rgba(239,68,68,0.10)', glow: 'rgba(239,68,68,0.25)' },
  2: { primary: '#22C55E', dim: 'rgba(34,197,94,0.10)',  glow: 'rgba(34,197,94,0.25)'  },
  3: { primary: '#3B82F6', dim: 'rgba(59,130,246,0.10)', glow: 'rgba(59,130,246,0.25)' },
} as const

// =============================================================================
// MODAL STYLES
// =============================================================================

const modalStyles: ReactModal.Styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.82)',
    zIndex: 9998,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  content: {
    position: 'relative',
    inset: 'auto',
    width: 'min(92vw, 780px)',
    height: 'min(90vh, 760px)',
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
  hidden:  { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.13, ease: 'easeOut' as const } },
  exit:    { opacity: 0, scale: 0.96, transition: { duration: 0.09, ease: 'easeIn'  as const } },
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/** Inline replica of the RomapLogo SVG defined in Header.tsx */
function RomapLogoMini({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }} aria-hidden="true">
      <circle cx="18" cy="50" r="18" fill="#000000" />
      <circle cx="82" cy="50" r="18" fill="#000000" />
      <ellipse cx="50" cy="50" rx="36" ry="42" fill="#000000" />
      <circle cx="18" cy="50" r="8" fill="#FF0000" />
      <circle cx="82" cy="50" r="8" fill="#0066FF" />
      <ellipse cx="50" cy="50" rx="26" ry="32" fill="#FFCC00" />
    </svg>
  )
}

function StatusBadge({ status, color }: { status: PhaseStatus; color: string }) {
  if (status === 'locked') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '3px 10px', borderRadius: 20,
        border: '1.5px solid rgba(255,255,255,0.12)',
        backgroundColor: 'rgba(255,255,255,0.05)',
      }}>
        <Lock size={9} color="rgba(255,255,255,0.3)" />
        <span style={{
          fontFamily: 'Montserrat, sans-serif', fontSize: 9, fontWeight: 800,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
        }}>
          VERROUILLÉE
        </span>
      </div>
    )
  }

  if (status === 'completed') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '3px 10px', borderRadius: 20,
        border: `1.5px solid ${color}`,
        backgroundColor: `${color}22`,
      }}>
        <CheckCircle2 size={9} color={color} />
        <span style={{
          fontFamily: 'Montserrat, sans-serif', fontSize: 9, fontWeight: 800,
          letterSpacing: '0.14em', textTransform: 'uppercase', color,
        }}>
          COMPLÉTÉE
        </span>
      </div>
    )
  }

  // active
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20,
      border: `1.5px solid ${color}`,
      backgroundColor: `${color}2A`,
    }}>
      <motion.div
        style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: color }}
        animate={{ boxShadow: [`0 0 4px ${color}`, `0 0 10px ${color}`, `0 0 4px ${color}`] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span style={{
        fontFamily: 'Montserrat, sans-serif', fontSize: 9, fontWeight: 800,
        letterSpacing: '0.14em', textTransform: 'uppercase', color,
      }}>
        EN COURS
      </span>
    </div>
  )
}

// A single info row inside a phase card
function InfoRow({
  emoji, label, text, color, isLocked,
}: {
  emoji: string; label: string; text: string; color: string; isLocked: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <span style={{ fontSize: 12, flexShrink: 0, paddingTop: 1 }}>{emoji}</span>
      <div style={{
        fontFamily: 'Montserrat, sans-serif', fontSize: 9, fontWeight: 800,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: isLocked ? 'rgba(255,255,255,0.22)' : color,
        flexShrink: 0, minWidth: 84, paddingTop: 2,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'Montserrat, sans-serif', fontSize: 11, fontWeight: 500, lineHeight: 1.45,
        color: isLocked ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.88)',
      }}>
        {text}
      </div>
    </div>
  )
}

interface PhaseCardProps {
  phaseNum: 1 | 2 | 3
  status: PhaseStatus
  dot: string       // emoji dot: 🔴 🟢 🔵
  title: string
  generation: string
  goal: string
  economy: string
  requirement: string
  reward: string
  extraTeam?: string
}

function PhaseCard({
  phaseNum, status, dot, title, generation,
  goal, economy, requirement, reward, extraTeam,
}: PhaseCardProps) {
  const colors  = PHASE_COLORS[phaseNum]
  const isLocked    = status === 'locked'
  const isCompleted = status === 'completed'

  const borderColor = isLocked ? 'rgba(255,255,255,0.09)' : colors.primary
  const bgColor     = isLocked ? 'rgba(255,255,255,0.025)' : colors.dim

  return (
    <motion.div
      initial={false}
      animate={{ opacity: isLocked ? 0.40 : 1 }}
      transition={{ duration: 0.35 }}
      style={{
        position: 'relative',
        borderRadius: 14,
        border: `2px solid ${borderColor}`,
        backgroundColor: bgColor,
        padding: '14px 18px 14px 22px',
        filter: isLocked ? 'grayscale(0.65)' : 'none',
        boxShadow: isLocked ? 'none' : `0 0 18px ${colors.glow}`,
        overflow: 'hidden',
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
        backgroundColor: isLocked ? 'rgba(255,255,255,0.12)' : colors.primary,
        borderRadius: '14px 0 0 14px',
      }} />

      {/* Top row: phase label + badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>{dot}</span>
          <div>
            <div style={{
              fontFamily: "'Jersey 15', sans-serif",
              fontSize: 16, letterSpacing: '0.08em',
              color: isLocked ? 'rgba(255,255,255,0.38)' : 'white',
            }}>
              PHASE {phaseNum} — {title.toUpperCase()}
            </div>
            <div style={{
              fontFamily: 'Montserrat, sans-serif', fontSize: 8, fontWeight: 800,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: isLocked ? 'rgba(255,255,255,0.22)' : colors.primary,
              marginTop: 1,
            }}>
              {generation}
            </div>
          </div>
        </div>
        <StatusBadge status={status} color={colors.primary} />
      </div>

      {/* Info rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <InfoRow emoji="🎯" label="Objectif" text={goal}        color={colors.primary} isLocked={isLocked} />
        <InfoRow emoji="💰" label="Économie"  text={economy}     color={colors.primary} isLocked={isLocked} />
        <InfoRow emoji="📋" label="Condition" text={requirement}  color={colors.primary} isLocked={isLocked} />
        {extraTeam && (
          <InfoRow emoji="👥" label="Équipe"   text={extraTeam}   color={colors.primary} isLocked={isLocked} />
        )}
        <InfoRow emoji="🏆" label="Récompense" text={reward}     color={colors.primary} isLocked={isLocked} />
      </div>

      {/* Completed diagonal stripe overlay */}
      {isCompleted && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 14,
          background: `repeating-linear-gradient(
            135deg,
            transparent 0px, transparent 12px,
            rgba(255,255,255,0.025) 12px, rgba(255,255,255,0.025) 14px
          )`,
        }} />
      )}

      {/* Lock icon for locked phases */}
      {isLocked && (
        <div style={{
          position: 'absolute', top: 13, right: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Lock size={16} color="rgba(255,255,255,0.18)" />
        </div>
      )}
    </motion.div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function RomapModal({ isOpen, onClose, currentPhase = 1 }: RomapModalProps) {
  const phase1Status = getStatus(1, currentPhase)
  const phase2Status = getStatus(2, currentPhase)
  const phase3Status = getStatus(3, currentPhase)

  return (
    <AnimatePresence>
      {isOpen && (
        <ReactModal
          isOpen={isOpen}
          onRequestClose={onClose}
          style={modalStyles}
          closeTimeoutMS={200}
          contentLabel="ROMAP"
          shouldCloseOnOverlayClick
          shouldCloseOnEsc
          ariaHideApp={false}
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
              boxSizing: 'border-box',
              backgroundColor: '#0D0D1C',
              border: '7px solid #1C1C38',
              borderRadius: '34px',
              color: 'white',
              overflow: 'hidden',
            }}
          >
            {/* Ambient top glow */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'radial-gradient(ellipse 70% 30% at 50% 0%, rgba(59,130,246,0.07) 0%, transparent 70%)',
              borderRadius: '28px',
            }} />

            {/* ── Close Button ── */}
            <button
              onClick={onClose}
              type="button"
              aria-label="Fermer"
              style={{
                position: 'absolute', top: 18, right: 18, zIndex: 100,
                width: 44, height: 44, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: '#FF4B4B', border: '3px solid black',
                cursor: 'pointer', boxShadow: '0 4px 0px rgba(0,0,0,1)',
                flexShrink: 0,
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* ── Header ── */}
            <div style={{ textAlign: 'center', padding: '26px 68px 10px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 7 }}>
                <RomapLogoMini size={34} />
                <div style={{
                  fontFamily: "'Jersey 15', sans-serif",
                  fontSize: 'clamp(22px, 3vw, 36px)',
                  fontWeight: 900, letterSpacing: '0.1em', lineHeight: 1,
                }}>
                  <span style={{ color: '#EF4444' }}>RO</span>
                  <span style={{ color: '#22C55E' }}>M</span>
                  <span style={{ color: '#3B82F6' }}>AP</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.62em' }}> — How to unlock ROM...</span>
                </div>
              </div>
              <div style={{
                fontFamily: 'Montserrat, sans-serif', fontSize: 10, fontWeight: 600,
                letterSpacing: '0.13em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.38)',
              }}>
                ROM awakens when the community is&nbsp;
                <span style={{ color: '#EF4444' }}>united</span>,&nbsp;
                <span style={{ color: '#22C55E' }}>wealthy</span>&nbsp;&amp;&nbsp;
                <span style={{ color: '#3B82F6' }}>organized</span>
              </div>
            </div>

            {/* ── Divider ── */}
            <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.07)', margin: '12px 26px 0', flexShrink: 0 }} />

            {/* ── Phase Cards (scrollable) ── */}
            <div
              style={{
                flex: 1, minHeight: 0,
                overflowY: 'auto', overflowX: 'hidden',
                padding: '16px 26px 26px',
                display: 'flex', flexDirection: 'column', gap: 12,
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.15) transparent',
              }}
            >
              {/* ─ Phase 1 ─ */}
              <PhaseCard
                phaseNum={1}
                status={phase1Status}
                dot="🔴"
                title="The Foundations"
                generation="V1 Generation"
                goal="Fill the 10×10 grid entirely with 100 foundational memos."
                economy="Quests cost 2 PX · Reward 2 PX"
                requirement="Transfer at least 1⁄9 of the purchasing power to the community reserve."
                reward="V1 grid archived · Right-side archive menu unlocked · Phase 2 unlocked"
              />

              {/* ─ Phase 2 ─ */}
              <PhaseCard
                phaseNum={2}
                status={phase2Status}
                dot="🟢"
                title="The Iteration"
                generation="V2 Generation"
                goal="Rewrite, iterate, and improve the 100 memos to create V2."
                economy="Values double (×2) · Quests cost 4 PX · Reward 4 PX"
                requirement="Community treasury must reach 1⁄4 of the global purchasing power in PX."
                reward="V2 archived in the lateral menu · Phase 3 unlocked"
              />

              {/* ─ Phase 3 ─ */}
              <PhaseCard
                phaseNum={3}
                status={phase3Status}
                dot="🔵"
                title="The Awakening"
                generation="V3 Generation & Deployment"
                goal="Forge the definitive V3 version of the 100 memos."
                economy="Values quadruple (×4) · Quests cost 8 PX · Reward 8 PX"
                requirement="The Ritual: 1 250 PX (Mods) + 1 250 PX (Community) → activate the core."
                extraTeam="9 Super Mods · 25 Mods · 75 Creators · 500 Associates"
                reward="+5 000 PX injected · Forom becomes PUBLIC · ROM (AI trained on 300 memos) goes ONLINE ✨"
              />
            </div>
          </motion.div>
        </ReactModal>
      )}
    </AnimatePresence>
  )
}
