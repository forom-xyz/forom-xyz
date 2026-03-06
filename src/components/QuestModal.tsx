import ReactModal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X } from 'lucide-react'
import { QUESTION_ORDER, QUESTION_COLORS } from '../data/memories'

// =============================================================================
// TYPES
// =============================================================================

export interface Quest {
  id: string
  title: string
  reward: number
  question: string | null
}

export interface QuestModalProps {
  isOpen: boolean
  onClose: () => void
  personalQuests: Quest[]
  acceptedQuestId: string | null
  questionLabels: Record<string, string>
  onCreateQuest: (title: string, reward: number, question: string | null) => void
  onAcceptQuest: (id: string) => void
  onCompleteQuest: (id: string) => void
  onCancelQuest: (id: string) => void
}

// =============================================================================
// STYLES & VARIANTS
// =============================================================================

const modalStyles: ReactModal.Styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    inset: 'auto',
    width: '80vw',
    maxWidth: 'none',
    height: '70vh',
    maxHeight: '70vh',
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
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.12, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.08, ease: 'easeIn' as const },
  },
}

// =============================================================================
// COMPONENT
// =============================================================================

export function QuestModal({ 
  isOpen, 
  onClose,
  personalQuests,
  acceptedQuestId,
  questionLabels,
  onCreateQuest,
  onAcceptQuest,
  onCompleteQuest,
  onCancelQuest
}: QuestModalProps) {
  const [activeTab, setActiveTab] = useState<'community' | 'personal'>('community')
  const [newTitle, setNewTitle] = useState('')
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [wheelIndex, setWheelIndex] = useState(0)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    onCreateQuest(newTitle, 100, selectedQuestion)
    setNewTitle('')
    setSelectedQuestion(null)
  }

  const n = personalQuests.length
  const centeredQuestId = n > 0 ? personalQuests[((wheelIndex % n) + n) % n]?.id ?? null : null
  return (
    <AnimatePresence>
      {isOpen && (
        <ReactModal
          isOpen={isOpen}
          onRequestClose={onClose}
          style={modalStyles}
          closeTimeoutMS={200}
          contentLabel="QUESTS"
          shouldCloseOnOverlayClick={true}
          shouldCloseOnEsc={true}
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
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              backgroundColor: '#FFA639',
              border: '6px solid black',
              borderRadius: '32px',
              color: 'white',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={onClose}
              style={{ 
                position: 'absolute', 
                top: '24px', 
                right: '24px', 
                zIndex: 100,
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FF4B4B',
                border: '3px solid black',
                cursor: 'pointer',
                boxShadow: '0 4px 0px rgba(0,0,0,1)',
                transition: 'transform 0.1s, box-shadow 0.1s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#ff3333'
                e.currentTarget.style.transform = 'translateY(2px)'
                e.currentTarget.style.boxShadow = '0 2px 0px rgba(0,0,0,1)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#FF4B4B'
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 4px 0px rgba(0,0,0,1)'
              }}
              type="button"
              aria-label="Close modal"
            >
              <X size={24} color="white" strokeWidth={3} />
            </button>

            {/* Left Side Switch Buttons (Info / Quêtes) */}
            <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 100, display: 'flex', gap: '16px' }}>
              <button
                onClick={() => setActiveTab('community')}
                style={{ 
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#0066FF',
                  border: '3px solid black',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'community' ? '0 0px 0px rgba(0,0,0,1)' : '0 4px 0px rgba(0,0,0,1)',
                  transform: activeTab === 'community' ? 'translateY(4px)' : 'none',
                  transition: 'transform 0.1s, box-shadow 0.1s',
                  fontFamily: "'Jersey 15', sans-serif",
                  fontSize: '28px',
                  color: 'white',
                  lineHeight: 1,
                  opacity: activeTab === 'community' ? 1 : 0.7,
                }}
                onMouseOver={(e) => {
                  if (activeTab !== 'community') {
                    e.currentTarget.style.backgroundColor = '#3385ff'
                    e.currentTarget.style.transform = 'translateY(2px)'
                    e.currentTarget.style.boxShadow = '0 2px 0px rgba(0,0,0,1)'
                    e.currentTarget.style.opacity = '1'
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== 'community') {
                    e.currentTarget.style.backgroundColor = '#0066FF'
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = '0 4px 0px rgba(0,0,0,1)'
                    e.currentTarget.style.opacity = '0.7'
                  }
                }}
                aria-label="Info"
              >
                I
              </button>

              <button
                onClick={() => setActiveTab('personal')}
                style={{ 
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FFD700',
                  border: '3px solid black',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'personal' ? '0 0px 0px rgba(0,0,0,1)' : '0 4px 0px rgba(0,0,0,1)',
                  transform: activeTab === 'personal' ? 'translateY(4px)' : 'none',
                  transition: 'transform 0.1s, box-shadow 0.1s',
                  fontFamily: "'Jersey 15', sans-serif",
                  fontSize: '28px',
                  color: 'black',
                  lineHeight: 1,
                  opacity: activeTab === 'personal' ? 1 : 0.7,
                }}
                onMouseOver={(e) => {
                  if (activeTab !== 'personal') {
                    e.currentTarget.style.backgroundColor = '#ffe033'
                    e.currentTarget.style.transform = 'translateY(2px)'
                    e.currentTarget.style.boxShadow = '0 2px 0px rgba(0,0,0,1)'
                    e.currentTarget.style.opacity = '1'
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== 'personal') {
                    e.currentTarget.style.backgroundColor = '#FFD700'
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = '0 4px 0px rgba(0,0,0,1)'
                    e.currentTarget.style.opacity = '0.7'
                  }
                }}
                aria-label="Quêtes"
              >
                Q
              </button>
            </div>

            <div className="flex-1 overflow-auto flex flex-col font-jersey" style={{ padding: '40px 60px' }}>
              {/* Header */}
              <div className="relative flex justify-between items-center mb-8">
                <div className="w-full flex justify-center items-end">
                  <h1 className="flex-shrink-0 text-white tracking-widest m-0 leading-none text-center font-bold uppercase drop-shadow-sm" style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '50px' }}>
                    QUESTS
                  </h1>
                </div>
              </div>

              {/* Content Switching */}
              {activeTab === 'community' ? (
                <div className="grid grid-cols-2 gap-16 text-white font-jetbrains text-sm leading-relaxed flex-1 mt-6">
                  {/* Left Column - French */}
                  <div className="space-y-6">
                    <h3 className="font-jersey text-white text-[36px] border-b-2 border-dashed border-white/30 pb-2">Comment ça marche</h3>
                    <p className="text-lg">
                      Les quêtes sont des défis collectifs lancés par la communauté FOROM. Chaque défi accompli contribue à l'évolution de la plateforme et récompense les participants.
                    </p>
                    <ul className="space-y-4 text-base">
                      <li><span className="font-bold text-[#FFD700] text-xl">Défis actifs :</span> Chaque semaine, de nouvelles quêtes sont publiées dans les différentes catégories de la grille. Consultez régulièrement pour ne rien manquer.</li>
                      <li><span className="font-bold text-[#FFD700] text-xl">Gagner des pixels :</span> Compléter une quête vous rapporte des pixels, la monnaie de la plateforme. Plus le défi est complexe, plus la récompense est élevée.</li>
                      <li><span className="font-bold text-[#FFD700] text-xl">Quêtes collaboratives :</span> Certaines quêtes nécessitent la coopération de plusieurs membres. Formez des équipes et cumulez vos efforts pour décrocher les récompenses les plus rares.</li>
                      <li><span className="font-bold text-[#FFD700] text-xl">Classement :</span> Les contributeurs les plus actifs apparaissent dans le classement mensuel et reçoivent des bonus exclusifs en pixels.</li>
                    </ul>
                  </div>

                  {/* Right Column - English */}
                  <div className="space-y-6 text-right">
                    <h3 className="font-jersey text-white text-[36px] border-b-2 border-dashed border-white/30 pb-2">How It Works</h3>
                    <p className="text-lg">
                      Quests are collective challenges launched by the FOROM community. Every completed challenge contributes to the platform's growth and rewards participants.
                    </p>
                    <ul className="space-y-4 text-base">
                      <li><span className="font-bold text-[#FFD700] text-xl">Active Challenges:</span> New quests are published weekly across the grid's categories. Check back regularly so you never miss an opportunity.</li>
                      <li><span className="font-bold text-[#FFD700] text-xl">Earn Pixels:</span> Completing a quest earns you pixels, the platform's currency. The more complex the challenge, the higher the reward.</li>
                      <li><span className="font-bold text-[#FFD700] text-xl">Collaborative Quests:</span> Some quests require cooperation from multiple members. Form teams, combine your efforts, and unlock the rarest rewards together.</li>
                      <li><span className="font-bold text-[#FFD700] text-xl">Leaderboard:</span> The most active contributors appear on the monthly leaderboard and receive exclusive pixel bonuses.</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex w-full max-w-6xl mx-auto h-full overflow-hidden mt-6 pb-2" style={{ gap: '3%' }}>
                  
                  {/* LEFTSIDE: CREATION (Idées) */}
                  <div className="flex flex-col relative w-1/2 h-full">
                    <div className="bg-[#D9D9D9] border-[5px] border-black rounded-[24px] p-8 flex flex-col items-center justify-start gap-8 relative flex-1">
                      <h3 className="text-center text-[50px] text-white uppercase tracking-widest drop-shadow-sm font-bold" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
                        IDÉES
                      </h3>
                      
                      {/* Question tags — same design as MemoryModal */}
                      <div className="flex flex-wrap justify-center items-center" style={{ gap: '5%', width: '80%' }}>
                        {QUESTION_ORDER.map((tag) => {
                          const color = QUESTION_COLORS[tag] || '#888888';
                          const isSelected = selectedQuestion === tag;
                          const label = questionLabels[tag] || tag;
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => setSelectedQuestion(isSelected ? null : tag)}
                              className="cursor-pointer uppercase text-white font-bold tracking-wide shadow-sm transition-transform hover:scale-105"
                              style={{
                                backgroundColor: color,
                                fontFamily: "'Jersey 15', sans-serif",
                                fontSize: '25px',
                                opacity: isSelected ? 1 : 0.6,
                                borderRadius: '12px',
                                padding: '10px 30px',
                                border: '4px solid black',
                                marginBottom: '8px',
                              }}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>

                      <form id="quest-form" onSubmit={handleCreate} className="flex flex-col items-center flex-1 w-full">
                        <div style={{ flex: '1' }} />
                        <input
                          type="text"
                          value={newTitle}
                          onChange={e => setNewTitle(e.target.value)}
                          placeholder="TITRE DE LA QUÊTE"
                          className="text-[30px] text-center text-black uppercase placeholder:text-black/40"
                          style={{
                            fontFamily: "'Jersey 15', sans-serif",
                            letterSpacing: '0.1em',
                            paddingBottom: '6px',
                            width: '80%',
                            background: 'none',
                            border: 'none',
                            borderBottom: '1.5px solid black',
                            outline: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none',
                            boxShadow: 'none',
                          }}
                          maxLength={40}
                        />
                        <div style={{ flex: '2' }} />
                      </form>
                      {/* Envoyer button — flex child, same pb/pt as SÉLECTIONNER for vertical alignment */}
                      <div className="flex flex-shrink-0 justify-center items-center pt-4" style={{ paddingBottom: 'max(3%, 24px)' }}>
                        <button
                          form="quest-form"
                          type="submit"
                          style={{
                            padding: '12px 40px',
                            borderRadius: '16px',
                            backgroundColor: !newTitle.trim() ? 'rgba(255,255,255,0.4)' : 'white',
                            color: !newTitle.trim() ? 'rgba(0,0,0,0.4)' : 'black',
                            fontSize: '32px',
                            fontFamily: "'Jersey 15', sans-serif",
                            border: !newTitle.trim() ? '4px solid rgba(0,0,0,0.2)' : '4px solid black',
                            cursor: !newTitle.trim() ? 'not-allowed' : 'pointer',
                            boxShadow: !newTitle.trim() ? 'none' : '0 4px 0px rgba(0,0,0,1)',
                            transition: 'transform 0.1s, box-shadow 0.1s',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseOver={(e) => {
                            if (newTitle.trim()) {
                              e.currentTarget.style.transform = 'translateY(2px)'
                              e.currentTarget.style.boxShadow = '0 2px 0px rgba(0,0,0,1)'
                            }
                          }}
                          onMouseOut={(e) => {
                            if (newTitle.trim()) {
                              e.currentTarget.style.transform = 'none'
                              e.currentTarget.style.boxShadow = '0 4px 0px rgba(0,0,0,1)'
                            }
                          }}
                        >
                          ENVOYER
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* RIGHTSIDE: Infinite vertical scroll wheel */}
                  <div className="flex flex-col relative w-1/2 h-full">
                    <div className="bg-[#D9D9D9] border-[5px] border-black rounded-[24px] relative flex-1 overflow-hidden flex flex-col">
                      <h3 className="text-center text-[50px] text-white uppercase tracking-widest drop-shadow-sm font-bold flex-shrink-0 m-0 pt-3 pb-0 leading-none" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
                        MISSIONS
                      </h3>

                      {/* Wheel area */}
                      <div
                        className="flex-1 relative select-none"
                        onWheel={(e) => {
                          e.preventDefault()
                          if (n <= 1) return
                          setWheelIndex(prev => prev + (e.deltaY > 0 ? 1 : -1))
                        }}
                        style={{ cursor: n > 1 ? 'ns-resize' : 'default' }}
                      >
                        {/* Center highlight line removed per user request */}

                        {/* Top fade */}
                        <div className="absolute inset-x-0 top-0 h-1/3 pointer-events-none" style={{
                          background: 'linear-gradient(to bottom, #D9D9D9 0%, transparent 100%)',
                          zIndex: 10,
                        }} />
                        {/* Bottom fade */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none" style={{
                          background: 'linear-gradient(to top, #D9D9D9 0%, transparent 100%)',
                          zIndex: 10,
                        }} />

                        {/* Items — absolutely positioned, center slot exactly matches highlight strip */}
                        {(() => {
                          const ITEM_H = 80
                          const GAP = 14
                          const slots = n === 0
                            ? [-1, 0, 1]
                            : n === 1 ? [0] : n === 2 ? [-1, 0, 1] : [-2, -1, 0, 1, 2]

                          return slots.map((offset) => {
                            const isCenter = offset === 0
                            const dist = Math.abs(offset)
                            const opacity = dist === 0 ? 1 : dist === 1 ? 0.55 : 0.25
                            // center is at 50%; others are stacked above/below with fixed px offset
                            const topPct = 44
                            const topPx = offset * (ITEM_H + GAP)
                            // center item fills exactly the highlight strip (left/right 8%)
                            // outer items are slightly narrower for visual depth
                            const inset = isCenter ? '8%' : dist === 1 ? '12%' : '18%'

                            if (n === 0) {
                              return (
                                <div
                                  key={offset}
                                  style={{
                                    position: 'absolute',
                                    left: inset,
                                    right: inset,
                                    height: `${ITEM_H}px`,
                                    top: `calc(${topPct}% + ${topPx}px - ${ITEM_H / 2}px)`,
                                    borderRadius: '20px',
                                    backgroundColor: '#E5B58E',
                                    border: '5px solid rgba(120,120,120,0.4)',
                                    opacity: isCenter ? 0.7 : 0.35,
                                    transition: 'all 0.2s',
                                    zIndex: isCenter ? 5 : 3,
                                  }}
                                />
                              )
                            }

                            const idx = ((((wheelIndex + offset) % n) + n) % n)
                            const q = personalQuests[idx]
                            const isAccepted = q?.id === acceptedQuestId

                            return (
                              <div
                                key={offset}
                                onClick={() => offset !== 0 && setWheelIndex(prev => prev + offset)}
                                style={{
                                  position: 'absolute',
                                  left: inset,
                                  right: inset,
                                  height: `${ITEM_H}px`,
                                  top: `calc(${topPct}% + ${topPx}px - ${ITEM_H / 2}px)`,
                                  borderRadius: '20px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: offset !== 0 ? 'pointer' : 'default',
                                  transition: 'all 0.2s cubic-bezier(0.34,1.2,0.64,1)',
                                  opacity,
                                  backgroundColor: isCenter && isAccepted ? '#FFA639' : isCenter ? '#fff' : '#E5B58E',
                                  border: isCenter ? '5px solid black' : '5px solid rgba(120,120,120,0.4)',
                                  boxShadow: isCenter ? '0 4px 0px rgba(0,0,0,0.8)' : 'none',
                                  zIndex: isCenter ? 5 : 3,
                                }}
                              >
                                <span
                                  className="truncate px-4"
                                  style={{
                                    fontFamily: "'Jersey 15', sans-serif",
                                    fontSize: '26px',
                                    color: isCenter ? 'black' : 'rgba(0,0,0,0.7)',
                                    width: '100%',
                                    textAlign: 'center',
                                    display: 'block',
                                  }}
                                >
                                  {q.question ? `${questionLabels[q.question] || q.question}: ` : ''}{q.title}
                                </span>
                              </div>
                            )
                          })
                        })()}
                      </div>

                      {/* Action buttons — flex child so wheel 50% is truly centered between title and button */}
                      <div className="flex flex-shrink-0 justify-center items-center pt-4" style={{ gap: '30px', zIndex: 20, paddingBottom: 'max(3%, 24px)' }}>
                        {centeredQuestId === acceptedQuestId && acceptedQuestId !== null ? (
                          <>
                            <button
                              onClick={() => onCancelQuest(acceptedQuestId!)}
                              style={{
                                padding: '12px 40px',
                                borderRadius: '16px',
                                backgroundColor: '#444',
                                color: 'white',
                                fontSize: '32px',
                                fontFamily: "'Jersey 15', sans-serif",
                                border: '4px solid black',
                                cursor: 'pointer',
                                boxShadow: '0 4px 0px rgba(0,0,0,1)',
                                transition: 'transform 0.1s, box-shadow 0.1s',
                                whiteSpace: 'nowrap',
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(2px)'
                                e.currentTarget.style.boxShadow = '0 2px 0px rgba(0,0,0,1)'
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'none'
                                e.currentTarget.style.boxShadow = '0 4px 0px rgba(0,0,0,1)'
                              }}
                            >
                              ANNULER
                            </button>
                            <button
                              onClick={() => onCompleteQuest(acceptedQuestId!)}
                              style={{
                                padding: '12px 40px',
                                borderRadius: '16px',
                                backgroundColor: 'white',
                                color: 'black',
                                fontSize: '32px',
                                fontFamily: "'Jersey 15', sans-serif",
                                border: '4px solid black',
                                cursor: 'pointer',
                                boxShadow: '0 4px 0px rgba(0,0,0,1)',
                                transition: 'transform 0.1s, box-shadow 0.1s',
                                whiteSpace: 'nowrap',
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(2px)'
                                e.currentTarget.style.boxShadow = '0 2px 0px rgba(0,0,0,1)'
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'none'
                                e.currentTarget.style.boxShadow = '0 4px 0px rgba(0,0,0,1)'
                              }}
                            >
                              COMPLÉTER
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => { if (centeredQuestId) onAcceptQuest(centeredQuestId) }}
                            style={{
                              padding: '12px 40px',
                              borderRadius: '16px',
                              backgroundColor: centeredQuestId ? 'white' : 'rgba(255,255,255,0.4)',
                              color: centeredQuestId ? 'black' : 'rgba(0,0,0,0.4)',
                              fontSize: '32px',
                              fontFamily: "'Jersey 15', sans-serif",
                              border: centeredQuestId ? '4px solid black' : '4px solid rgba(0,0,0,0.2)',
                              cursor: centeredQuestId ? 'pointer' : 'not-allowed',
                              boxShadow: centeredQuestId ? '0 4px 0px rgba(0,0,0,1)' : 'none',
                              transition: 'transform 0.1s, box-shadow 0.1s',
                              whiteSpace: 'nowrap',
                            }}
                            onMouseOver={(e) => {
                              if (centeredQuestId) {
                                e.currentTarget.style.transform = 'translateY(2px)'
                                e.currentTarget.style.boxShadow = '0 2px 0px rgba(0,0,0,1)'
                              }
                            }}
                            onMouseOut={(e) => {
                              if (centeredQuestId) {
                                e.currentTarget.style.transform = 'none'
                                e.currentTarget.style.boxShadow = '0 4px 0px rgba(0,0,0,1)'
                              }
                            }}
                          >
                            SÉLECTIONNER
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </motion.div>
        </ReactModal>
      )}
    </AnimatePresence>
  )
}
