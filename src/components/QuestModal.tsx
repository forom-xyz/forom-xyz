import ReactModal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect, useCallback, useMemo, Fragment } from 'react'
import { X } from 'lucide-react'
import { QUESTION_ORDER, QUESTION_COLORS, CATEGORY_COLORS, getMemory } from '../data/memories'
import type { CategoryType, WhQuestion } from '../data/memories'
import { mixColors } from '../utils/colors'
import type { UserRole } from '../App'

// Category band colors removed because we now use mixColors

// =============================================================================
// TYPES
// =============================================================================

export interface Quest {
  id: string
  title: string
  reward: number
  question: string | null
  category: string
  completed?: boolean
  taken?: boolean
  completedBy?: string
}

export interface QuestModalProps {
  isOpen: boolean
  onClose: () => void
  personalQuests: Quest[]
  acceptedQuestId: string | null
  questionLabels: Record<string, string>
  categoryLabels?: Record<string, string>
  categories?: string[]
  seasonPhase?: 'V1' | 'V2' | 'V3'
  pixels?: number
  canCreateQuest?: boolean
  onCreateQuest: (title: string, reward: number, question: string | null, category: string) => void
  onAcceptQuest: (id: string) => void
  onCompleteQuest: (id: string) => void
  onCancelQuest: (id: string) => void
  userRole?: UserRole
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
    width: '85vw',
    maxWidth: 'none',
    height: '85vh',
    maxHeight: '90vh',
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
  categoryLabels = {},
  onCreateQuest,
  onAcceptQuest,
  onCompleteQuest,
  onCancelQuest,
  seasonPhase = 'V1',
  pixels = 0,
  canCreateQuest = true,
  categories = ['A', 'B', 'C', 'D', 'E'],
  userRole
}: QuestModalProps) {
  const [activeTab, setActiveTab] = useState<'community' | 'personal'>('personal')
  const [newTitle, setNewTitle] = useState('')
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0])
  const [wheelIndex, setWheelIndex] = useState(0)
  const [boardSelectedId, setBoardSelectedId] = useState<string | null>(null)
  const wheelRef = useRef<HTMLDivElement>(null)

  const [winHeight, setWinHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 1080)
  useEffect(() => {
    const handleResize = () => setWinHeight(window.innerHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const wheelQuests = useMemo(() => {
    const arr = Array(100).fill(null)
    personalQuests.forEach(q => {
      const cat = q.category || categories[0]
      const catIdx = categories.indexOf(cat)
      if (catIdx === -1) return
      
      const tagIndex = parseInt(q.question || '0', 10)
      if (!isNaN(tagIndex) && tagIndex >= 0 && tagIndex < 10) {
        arr[catIdx * 10 + tagIndex] = q
      }
    })
    return arr
  }, [personalQuests, categories])

  const wheelAccumulator = useRef(0)

  const handleNativeWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    wheelAccumulator.current += e.deltaY

    if (Math.abs(wheelAccumulator.current) >= 15) {
      setWheelIndex(prev => {
        const delta = wheelAccumulator.current > 0 ? 1 : -1
        return (((prev + delta) % 100) + 100) % 100
      })
      wheelAccumulator.current = 0
    }
  }, [])

  const touchStartY = useRef<number | null>(null)
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.cancelable) e.preventDefault()
    if (touchStartY.current === null) return
    const currentY = e.touches[0].clientY
    const diff = touchStartY.current - currentY
    
    if (Math.abs(diff) > 20) {
      setWheelIndex(prev => {
        const delta = diff > 0 ? 1 : -1
        return (((prev + delta) % 100) + 100) % 100
      })
      touchStartY.current = currentY
    }
  }, [])

  useEffect(() => {
    const el = wheelRef.current
    if (!el) return
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
    }
  }, [handleTouchStart, handleTouchMove, activeTab])

  const isDragging = useRef(false)
  const dragStartY = useRef(0)

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true
    dragStartY.current = e.clientY
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const diff = dragStartY.current - e.clientY
    if (Math.abs(diff) > 20) {
      setWheelIndex(prev => {
        const delta = diff > 0 ? 1 : -1
        return (((prev + delta) % 100) + 100) % 100
      })
      dragStartY.current = e.clientY
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }

  // Auto-switch to quest log and highlight the accepted quest
  useEffect(() => {
    if (acceptedQuestId) {
      setBoardSelectedId(acceptedQuestId) // eslint-disable-line react-hooks/set-state-in-effect
      setActiveTab('community')
    }
  }, [acceptedQuestId])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !selectedQuestion) return // Require tag/question
    
    // In V1, limit is 100. In V2+, we allow "iterations"
    const cost = seasonPhase === 'V1' ? 2 : 1;
    if (pixels < cost) {
      alert(`Vous n'avez pas assez de pixels. (Coût: ${cost}px)`);
      return;
    }

    if (seasonPhase === 'V1' && personalQuests.length >= 100) return

    // Calculate where this new quest will land so we can scroll to it immediately
    const catIdx = categories.indexOf(selectedCategory)
    const tagIndex = parseInt(selectedQuestion || '0', 10)
    const targetIdx = catIdx * 10 + (isNaN(tagIndex) ? 0 : tagIndex)

    onCreateQuest(newTitle, cost, selectedQuestion, selectedCategory)
    setNewTitle('')
    setSelectedQuestion(null)
    
    // Auto-scroll the wheel to the newly created quest's position
    setWheelIndex(targetIdx)
  }

  const centeredQuestId = wheelQuests[wheelIndex]?.id ?? null
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
              backgroundColor: '#FE6C17',
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

            <div className="flex-1 overflow-auto flex flex-col font-jersey" style={{ padding: 'clamp(16px, 3vh, 40px) clamp(20px, 4vw, 60px)' }}>
              {/* Header */}
              <div className="relative flex justify-between items-center mb-[clamp(8px,2vh,32px)]">
                <div className="w-full flex justify-center items-end">
                  <h1 className="flex-shrink-0 text-white tracking-widest m-0 leading-none text-center font-bold uppercase drop-shadow-sm" style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '50px' }}>
                    QUESTS
                  </h1>
                </div>
              </div>

              {/* Content Switching */}
              {activeTab === 'community' ? (
                <div className="flex-1 flex w-full max-w-6xl mx-auto h-full overflow-hidden mt-6 pb-2" style={{ gap: '3%' }}>

                  {/* LEFT: Active quest spotlight */}
                  <div className="flex flex-col relative w-1/2 h-full">
                    <div className="bg-[#D9D9D9] border-[5px] border-black rounded-[24px] p-6 flex flex-col items-center justify-start gap-4 relative flex-1 overflow-hidden">
                      <h3 className="text-center text-[50px] text-white uppercase tracking-widest drop-shadow-sm font-bold flex-shrink-0 m-0 leading-none" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
                        ACTIF
                      </h3>

                      {/* WoW-style quest detail */}
                      <div className="flex-1 flex flex-col items-center justify-start w-full overflow-y-auto pt-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.2) transparent' }}>
                        {(() => {
                          const active = personalQuests.find(q => q.id === boardSelectedId)
                          if (!active) {
                            return (
                              <div className="flex flex-col items-center justify-center gap-4 opacity-50 h-full">
                                <div style={{
                                  width: '80%',
                                  borderRadius: '20px',
                                  backgroundColor: '#E5B58E',
                                  border: '5px dashed rgba(0,0,0,0.3)',
                                  padding: '32px 24px',
                                  textAlign: 'center',
                                }}>
                                  <span style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '28px', color: 'rgba(0,0,0,0.5)' }}>
                                    AUCUNE QUÊTE ACTIVE
                                  </span>
                                </div>
                                <span style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '18px', color: 'rgba(0,0,0,0.4)', textAlign: 'center' }}>
                                  Sélectionne une quête dans le tableau →
                                </span>
                              </div>
                            )
                          }
                          const tagColor = active.question ? (QUESTION_COLORS[active.question] || '#888') : null
                          const tagLabel = active.question ? (questionLabels[active.question] || active.question) : null
                          const qIdx = active.question ? QUESTION_ORDER.indexOf(active.question as WhQuestion) : -1
                          const mem = qIdx >= 0 ? getMemory(active.category as CategoryType, qIdx) : null
                          const descWordCount = (mem?.isFilled && mem?.description) ? mem.description.trim().split(/\s+/).filter(Boolean).length : 0
                          const objectives = [
                            { id: 'video', label: 'Vidéo YouTube', done: !!(mem?.videoUrl) },
                            { id: 'desc', label: `Résumé (${descWordCount}/100 mots)`, done: descWordCount >= 100 },
                            { id: 'src', label: 'Source(s)', done: !!(mem?.sources && mem.sources.length > 0) },
                          ]
                          // Note: objectives are informational only — allDone gates the COMPLÉTER button
                          const allDone = objectives.every(o => o.done)
                          return (
                            <div style={{ width: '90%', display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '8px' }}>
                              {/* Quest header card */}
                              <div style={{
                                backgroundColor: '#FFA639',
                                border: '5px solid black',
                                boxShadow: '0 6px 0px rgba(0,0,0,0.9)',
                                borderRadius: '20px',
                                padding: '20px 24px',
                                display: 'flex', flexDirection: 'column', gap: '10px',
                              }}>
                                {tagLabel && tagColor && (
                                  <div style={{
                                    display: 'inline-flex', alignSelf: 'flex-start',
                                    backgroundColor: tagColor,
                                    borderRadius: '10px', border: '3px solid black',
                                    padding: '4px 20px',
                                    fontFamily: "'Jersey 15', sans-serif", fontSize: '22px',
                                    color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em',
                                  }}>
                                    {tagLabel}
                                  </div>
                                )}
                                <span style={{
                                  fontFamily: "'Jersey 15', sans-serif", fontSize: '32px',
                                  color: 'black', textTransform: 'uppercase',
                                  letterSpacing: '0.05em', lineHeight: 1.2,
                                }}>
                                  {active.title}
                                </span>
                                <div style={{
                                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                                  backgroundColor: 'rgba(0,0,0,0.12)',
                                  borderRadius: '10px', padding: '4px 16px', alignSelf: 'flex-start',
                                }}>
                                  <span style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '22px', color: 'black' }}>
                                    +{active.reward} PX
                                  </span>
                                </div>
                              </div>

                              {/* WoW-style objectives checklist */}
                              <div style={{
                                backgroundColor: 'rgba(0,0,0,0.12)',
                                borderRadius: '16px', border: '3px solid rgba(0,0,0,0.25)',
                                padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px',
                              }}>
                                <span style={{
                                  fontFamily: "'Jersey 15', sans-serif", fontSize: '20px',
                                  color: 'rgba(0,0,0,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em',
                                }}>
                                  OBJECTIFS DE LA QUÊTE:
                                </span>
                                {objectives.map(obj => (
                                  <div key={obj.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                      width: '30px', height: '30px', flexShrink: 0,
                                      borderRadius: '8px',
                                      border: `3px solid ${obj.done ? '#22c55e' : 'rgba(0,0,0,0.3)'}`,
                                      backgroundColor: obj.done ? '#22c55e' : 'rgba(255,255,255,0.5)',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      transition: 'all 0.2s',
                                    }}>
                                      {obj.done && (
                                        <span style={{ color: 'white', fontSize: '18px', lineHeight: 1, fontWeight: 'bold' }}>✓</span>
                                      )}
                                    </div>
                                    <span style={{
                                      fontFamily: "'Jersey 15', sans-serif", fontSize: '24px',
                                      color: obj.done ? '#166534' : 'rgba(0,0,0,0.5)',
                                      textDecoration: obj.done ? 'line-through' : 'none',
                                      letterSpacing: '0.05em',
                                    }}>
                                      {obj.label}
                                    </span>
                                  </div>
                                ))}
                                {allDone && (
                                  <div style={{
                                    marginTop: '4px', padding: '8px 0',
                                    borderTop: '2px solid rgba(22, 163, 74, 0.4)',
                                    fontFamily: "'Jersey 15', sans-serif", fontSize: '22px',
                                    color: '#16a34a', textTransform: 'uppercase',
                                    letterSpacing: '0.1em', textAlign: 'center',
                                  }}>
                                    ✓ PRÊT À COMPLÉTER!
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })()}
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-shrink-0 justify-center items-center" style={{ gap: '20px', paddingBottom: 'max(3%, 24px)' }}>
                        {boardSelectedId ? (
                          <>
                            <button
                              onClick={() => { onCancelQuest(boardSelectedId); setBoardSelectedId(null) }}
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
                            {(() => {
                              const qObj = personalQuests.find(q => q.id === boardSelectedId);
                              const qIdx2 = qObj?.question ? QUESTION_ORDER.indexOf(qObj.question as WhQuestion) : -1;
                              const mem2 = qIdx2 >= 0 ? getMemory(qObj!.category as CategoryType, qIdx2) : null;
                              const descWords2 = (mem2?.isFilled && mem2?.description) ? mem2.description.trim().split(/\s+/).filter(Boolean).length : 0;
                              const isMod = userRole === 'S-MODS' || userRole === 'MODS';
                              const objectivesMet = !!boardSelectedId && !!(mem2?.videoUrl) && descWords2 >= 100 && !!(mem2?.sources && mem2.sources.length > 0);
                              const canComplete = !isMod && objectivesMet;
                              return (
                                <button
                                  onClick={() => {
                                  if (!canComplete) return;
                                  onCompleteQuest(boardSelectedId);
                                  // Auto-scroll wheel to the just-completed quest
                                  const completedQ = personalQuests.find(q => q.id === boardSelectedId);
                                  if (completedQ) {
                                    const catIdx = categories.indexOf(completedQ.category);
                                    const tagIdx = parseInt(completedQ.question || '0', 10);
                                    if (catIdx >= 0 && !isNaN(tagIdx)) setWheelIndex(catIdx * 10 + tagIdx);
                                  }
                                  setBoardSelectedId(null);
                                  setActiveTab('personal');
                                  }}
                                  disabled={!canComplete}
                                  style={{
                                    padding: '12px 40px',
                                    borderRadius: '16px',
                                    backgroundColor: canComplete ? 'white' : 'rgba(255,255,255,0.4)',
                                    color: canComplete ? 'black' : 'rgba(0,0,0,0.4)',
                                    fontSize: '32px',
                                    fontFamily: "'Jersey 15', sans-serif",
                                    border: canComplete ? '4px solid black' : '4px solid rgba(0,0,0,0.2)',
                                    cursor: canComplete ? 'pointer' : 'not-allowed',
                                    boxShadow: canComplete ? '0 4px 0px rgba(0,0,0,1)' : 'none',
                                    transition: 'transform 0.1s, box-shadow 0.1s',
                                    whiteSpace: 'nowrap',
                                  }}
                                  onMouseOver={(e) => {
                                    if (canComplete) {
                                      e.currentTarget.style.transform = 'translateY(2px)'
                                      e.currentTarget.style.boxShadow = '0 2px 0px rgba(0,0,0,1)'
                                    }
                                  }}
                                  onMouseOut={(e) => {
                                    if (canComplete) {
                                      e.currentTarget.style.transform = 'none'
                                      e.currentTarget.style.boxShadow = '0 4px 0px rgba(0,0,0,1)'
                                    }
                                  }}
                                >
                                  {isMod ? 'INTERDIT (MODS)' : 'COMPLÉTER'}
                                </button>
                              )
                            })()}
                          </>
                        ) : (
                          <span style={{
                            fontFamily: "'Jersey 15', sans-serif",
                            fontSize: '20px',
                            color: 'rgba(0,0,0,0.4)',
                            textAlign: 'center',
                          }}>
                            Clique sur une quête dans le tableau
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Taken quests board */}
                  <div className="flex flex-col relative w-1/2 h-full">
                    <div className="bg-[#D9D9D9] border-[5px] border-black rounded-[24px] flex flex-col relative flex-1 overflow-hidden">
                      <h3 className="text-center text-[50px] text-white uppercase tracking-widest drop-shadow-sm font-bold flex-shrink-0 m-0 pt-3 pb-0 leading-none" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
                        TABLEAU
                      </h3>

                      {/* Quest list — only taken quests + completed history */}
                      <div className="flex-1 overflow-y-auto px-5 pb-5 pt-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.2) transparent' }}>
                        {(() => {
                          const takenQuests = personalQuests.filter(q => q.taken && !q.completed)
                          const completedQuests = personalQuests.filter(q => q.completed)
                          if (takenQuests.length === 0 && completedQuests.length === 0) {
                            return (
                              <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
                                <div style={{
                                  borderRadius: '20px',
                                  backgroundColor: '#E5B58E',
                                  border: '5px dashed rgba(0,0,0,0.3)',
                                  padding: '32px 24px',
                                  textAlign: 'center',
                                  width: '80%',
                                }}>
                                  <span style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '26px', color: 'rgba(0,0,0,0.5)' }}>
                                    AUCUNE QUÊTE
                                  </span>
                                </div>
                                <span style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '16px', color: 'rgba(0,0,0,0.4)', textAlign: 'center' }}>
                                  Accepte une quête depuis la roue
                                </span>
                              </div>
                            )
                          }
                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {/* Active taken quests */}
                              {takenQuests.map((q) => {
                                const isSelected = q.id === boardSelectedId
                                const tagColor = q.question ? (QUESTION_COLORS[q.question] || '#888') : null
                                const tagLabel = q.question ? (questionLabels[q.question] || q.question) : null
                                return (
                                  <div
                                    key={q.id}
                                    onClick={() => setBoardSelectedId(isSelected ? null : q.id)}
                                    style={{
                                      borderRadius: '16px',
                                      backgroundColor: isSelected ? '#FFA639' : '#fff',
                                      border: isSelected ? '4px solid black' : '4px solid rgba(0,0,0,0.25)',
                                      boxShadow: isSelected ? '0 4px 0px rgba(0,0,0,0.8)' : '0 2px 0px rgba(0,0,0,0.2)',
                                      padding: '12px 16px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      gap: '12px',
                                      transition: 'all 0.15s cubic-bezier(0.34,1.2,0.64,1)',
                                      transform: isSelected ? 'translateY(-2px)' : 'none',
                                    }}
                                  >
                                    {tagLabel && tagColor && (
                                      <div style={{
                                        backgroundColor: tagColor,
                                        borderRadius: '8px',
                                        border: '2px solid black',
                                        padding: '2px 12px',
                                        fontFamily: "'Jersey 15', sans-serif",
                                        fontSize: '18px',
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        flexShrink: 0,
                                      }}>
                                        {tagLabel}
                                      </div>
                                    )}
                                    <span style={{
                                      fontFamily: "'Jersey 15', sans-serif",
                                      fontSize: '22px',
                                      color: 'black',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.04em',
                                      lineHeight: 1.15,
                                      flex: 1,
                                    }}>
                                      {q.title}
                                    </span>
                                    <span style={{
                                      fontFamily: "'Jersey 15', sans-serif",
                                      fontSize: '17px',
                                      color: 'rgba(0,0,0,0.5)',
                                      flexShrink: 0,
                                    }}>
                                      +{q.reward} PX
                                    </span>
                                  </div>
                                )
                              })}

                              {/* Completed history divider */}
                              {completedQuests.length > 0 && (
                                <>
                                  {takenQuests.length > 0 && (
                                    <div style={{
                                      borderTop: '2px dashed rgba(0,0,0,0.2)',
                                      margin: '4px 0',
                                    }} />
                                  )}
                                  <span style={{
                                    fontFamily: "'Jersey 15', sans-serif",
                                    fontSize: '16px',
                                    color: 'rgba(0,0,0,0.4)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.12em',
                                    paddingLeft: '4px',
                                  }}>
                                    HISTORIQUE
                                  </span>
                                  {completedQuests.map((q) => {
                                    const isSelected = q.id === boardSelectedId
                                    const tagLabel = q.question ? (questionLabels[q.question] || q.question) : null
                                    return (
                                      <div
                                        key={q.id}
                                        onClick={() => setBoardSelectedId(isSelected ? null : q.id)}
                                        style={{
                                          borderRadius: '16px',
                                          backgroundColor: isSelected ? '#e0e0e0' : '#f2f2f2',
                                          border: isSelected ? '4px solid #888' : '4px solid rgba(0,0,0,0.12)',
                                          boxShadow: isSelected ? '0 3px 0px rgba(0,0,0,0.3)' : '0 1px 0px rgba(0,0,0,0.1)',
                                          padding: '12px 16px',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          gap: '12px',
                                          opacity: 0.7,
                                          transition: 'all 0.15s',
                                        }}
                                      >
                                        {/* COMPLETED badge */}
                                        <div style={{
                                          backgroundColor: '#888',
                                          borderRadius: '8px',
                                          border: '2px solid rgba(0,0,0,0.2)',
                                          padding: '2px 10px',
                                          fontFamily: "'Jersey 15', sans-serif",
                                          fontSize: '16px',
                                          color: 'white',
                                          textTransform: 'uppercase',
                                          flexShrink: 0,
                                          letterSpacing: '0.05em',
                                        }}>
                                          ✓ FAIT
                                        </div>
                                        {tagLabel && (
                                          <span style={{
                                            fontFamily: "'Jersey 15', sans-serif",
                                            fontSize: '16px',
                                            color: 'rgba(0,0,0,0.4)',
                                            textTransform: 'uppercase',
                                            flexShrink: 0,
                                          }}>
                                            [{tagLabel}]
                                          </span>
                                        )}
                                        <span style={{
                                          fontFamily: "'Jersey 15', sans-serif",
                                          fontSize: '20px',
                                          color: '#666',
                                          textTransform: 'uppercase',
                                          textDecoration: 'line-through',
                                          letterSpacing: '0.04em',
                                          flex: 1,
                                        }}>
                                          {q.title}
                                        </span>
                                        <span style={{
                                          fontFamily: "'Jersey 15', sans-serif",
                                          fontSize: '15px',
                                          color: 'rgba(0,0,0,0.3)',
                                          flexShrink: 0,
                                        }}>
                                          +{q.reward} PX
                                        </span>
                                      </div>
                                    )
                                  })}
                                </>
                              )}
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex w-full max-w-7xl mx-auto h-full overflow-hidden mt-2 pb-2 px-4" style={{ gap: '2vw' }}>
                  
                  {/* LEFTSIDE: CREATION (Idées) — only for creators/mods/supermods */}
                  {canCreateQuest && (
                  <div className="flex flex-col relative w-1/2 h-full">
                    <div className="bg-[#D9D9D9] border-[5px] border-black rounded-[24px] flex flex-col relative flex-1 min-h-0 overflow-hidden" style={{ padding: 'clamp(8px, 1.5vh, 24px)' }}>
                      {/* Header */}
                      <div className="flex-shrink-0 flex items-center justify-center pb-2">
                        <h3 className="text-center text-[clamp(20px,4vh,50px)] text-black uppercase tracking-widest drop-shadow-sm font-bold m-0 leading-none" style={{ fontFamily: "'Jersey 15', sans-serif", color: 'black' }}>
                          ENVOYER UNE QUÊTE
                        </h3>
                      </div>
                      
                      {/* Inner Content - scaled to fit without scroll */}
                      <div className="flex-1 w-full flex flex-col items-center justify-start pt-1 overflow-hidden" style={{ gap: 'clamp(2px, 0.5vh, 6px)' }}>
                        
                        {/* Top Block: QUESTION_ORDER (Vision, Équipe...) labeled as "TAGS" on the right */}
                        <div className="flex items-center w-[90%] mb-1 mt-2">
                          <span className="font-bold uppercase tracking-widest mr-[10px]" style={{ color: '#000000', fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(10px, 1.5vh, 14px)' }}>X</span>
                          <div className="flex-1 h-[2px]" style={{ backgroundColor: '#000000' }}></div>
                          <span className="font-bold uppercase tracking-widest ml-[10px]" style={{ color: '#000000', fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(10px, 1.5vh, 14px)' }}>TAGS</span>
                        </div>

                        {/* Question tags (Tags) */}
                        <div className="flex flex-wrap justify-center items-center font-bold text-center" style={{ width: '90%', fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(11px, 1.8vh, 16px)', lineHeight: 'clamp(14px, 2.5vh, 24px)' }}>
                          {QUESTION_ORDER.map((tag, i) => {
                            const color = QUESTION_COLORS[tag] || '#888888';
                            const isSelected = selectedQuestion === tag;
                            const label = questionLabels[tag] || tag;
                            return (
                              <Fragment key={tag}>
                                <span
                                  onClick={() => setSelectedQuestion(isSelected ? null : tag)}
                                  className="cursor-pointer transition-all"
                                  style={{
                                    backgroundColor: isSelected ? color : 'transparent',
                                    color: isSelected ? '#FFFFFF' : '#000000',
                                    padding: 'clamp(1px, 0.2vh, 4px) clamp(4px, 0.8vw, 10px)',
                                    borderRadius: '8px',
                                    border: isSelected ? '3px solid #000000' : '3px solid transparent',
                                    margin: '0 2px',
                                    display: 'inline-block',
                                    lineHeight: 1,
                                    transform: isSelected ? 'scale(1.05)' : 'none',
                                    boxShadow: isSelected ? '0 2px 0px rgba(0,0,0,1)' : 'none',
                                  }}
                                >
                                  {label}
                                </span>
                                {i < QUESTION_ORDER.length - 1 && <span className="font-normal px-[2px]" style={{ color: '#000000' }}>|</span>}
                              </Fragment>
                            );
                          })}
                        </div>
                        
                        {/* Bottom Block: categories (Idées, Échange...) labeled as "CATEGORIES" on the left */}
                        <div className="flex items-center w-[90%] mb-1 mt-2">
                          <span className="font-bold uppercase tracking-widest mr-[10px]" style={{ color: '#000000', fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(10px, 1.5vh, 14px)' }}>CATEGORIES</span>
                          <div className="flex-1 h-[2px]" style={{ backgroundColor: '#000000' }}></div>
                          <span className="font-bold uppercase tracking-widest ml-[10px]" style={{ color: '#000000', fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(10px, 1.5vh, 14px)' }}>Y</span>
                        </div>

                        {/* Category selector */}
                        <div className="flex flex-wrap justify-center items-center font-bold text-center" style={{ width: '90%', fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(11px, 1.8vh, 16px)', lineHeight: 'clamp(14px, 2.5vh, 24px)' }}>
                          {categories.map((cat, i) => {
                            const isSelected = selectedCategory === cat;
                            const label = categoryLabels[cat] || cat;
                            return (
                              <Fragment key={cat}>
                                <span
                                  onClick={() => setSelectedCategory(cat)}
                                  className="cursor-pointer transition-all"
                                  style={{
                                    backgroundColor: isSelected ? (CATEGORY_COLORS[cat] || 'rgba(0,0,0,0.4)') : 'transparent',
                                    color: isSelected ? '#FFFFFF' : '#000000',
                                    padding: 'clamp(1px, 0.2vh, 4px) clamp(4px, 0.8vw, 10px)',
                                    borderRadius: '8px',
                                    border: isSelected ? '3px solid #000000' : '3px solid transparent',
                                    margin: '0 2px',
                                    display: 'inline-block',
                                    lineHeight: 1,
                                    transform: isSelected ? 'scale(1.05)' : 'none',
                                    boxShadow: isSelected ? '0 2px 0px rgba(0,0,0,1)' : 'none',
                                  }}
                                >
                                  {label}
                                </span>
                                {i < categories.length - 1 && <span className="font-normal px-[2px]" style={{ color: '#000000' }}>|</span>}
                              </Fragment>
                            );
                          })}
                        </div>

                      <form id="quest-form" onSubmit={handleCreate} className="flex flex-col items-center w-full mt-auto flex-shrink-0 pt-[clamp(2px,0.5vh,6px)] pb-[clamp(2px,0.5vh,6px)]">
                        <input
                          type="text"
                          value={newTitle}
                          onChange={e => setNewTitle(e.target.value)}
                          placeholder="TITRE DE LA QUÊTE"
                          className="text-[clamp(14px,2vh,20px)] text-center text-black font-bold uppercase placeholder:text-black/40"
                          style={{
                            fontFamily: "'Jersey 15', sans-serif",
                            letterSpacing: '0.15em',
                            paddingBottom: 'clamp(2px, 0.3vh, 4px)',
                            marginBottom: 'clamp(2px, 0.5vh, 6px)',
                            width: '90%',
                            background: 'none',
                            border: 'none',
                            borderBottom: '2px solid black',
                            outline: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none',
                            boxShadow: 'none',
                          }}
                          maxLength={40}
                        />
                      </form>
                      </div> {/* End Inner Content */}

                      {/* Envoyer button — flex child, same pb/pt as SÉLECTIONNER for vertical alignment */}
                      <div className="flex flex-shrink-0 flex-col justify-center items-center pt-4" style={{ gap: '8px' }}>
                        {/* Quest count */}
                        <span style={{
                          fontFamily: "'Jersey 15', sans-serif",
                          fontSize: '18px',
                          color: personalQuests.length >= 100 ? '#c0392b' : 'rgba(0,0,0,0.45)',
                          letterSpacing: '0.05em',
                        }}>
                          {personalQuests.length} / 100
                        </span>
                        <button
                          form="quest-form"
                          type="submit"
                          disabled={!newTitle.trim() || !selectedQuestion || (seasonPhase === 'V1' && personalQuests.length >= 100) || pixels < (seasonPhase === 'V1' ? 2 : 1)}
                          style={{
                            padding: '12px 40px',
                            borderRadius: '16px',
                            backgroundColor: (!newTitle.trim() || !selectedQuestion || personalQuests.length >= 100) ? 'rgba(255,255,255,0.4)' : 'white',
                            color: (!newTitle.trim() || !selectedQuestion || personalQuests.length >= 100) ? 'rgba(0,0,0,0.4)' : 'black',
                            fontSize: '32px',
                            fontFamily: "'Jersey 15', sans-serif",
                            border: (!newTitle.trim() || !selectedQuestion || personalQuests.length >= 100) ? '4px solid rgba(0,0,0,0.2)' : '4px solid black',
                            cursor: (!newTitle.trim() || !selectedQuestion || personalQuests.length >= 100) ? 'not-allowed' : 'pointer',
                            boxShadow: (!newTitle.trim() || !selectedQuestion || personalQuests.length >= 100) ? 'none' : '0 4px 0px rgba(0,0,0,1)',
                            transition: 'transform 0.1s, box-shadow 0.1s',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseOver={(e) => {
                            if (newTitle.trim() && selectedQuestion && (seasonPhase !== 'V1' || personalQuests.length < 100)) {
                              e.currentTarget.style.transform = 'translateY(2px)'
                              e.currentTarget.style.boxShadow = '0 2px 0px rgba(0,0,0,1)'
                            }
                          }}
                          onMouseOut={(e) => {
                            if (newTitle.trim() && selectedQuestion && (seasonPhase !== 'V1' || personalQuests.length < 100)) {
                              e.currentTarget.style.transform = 'none'
                              e.currentTarget.style.boxShadow = '0 4px 0px rgba(0,0,0,1)'
                            }
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>
                              {seasonPhase === 'V1' ? (personalQuests.length >= 100 ? 'GRILLE PLEINE' : 'ENVOYER') : 'ITÉRER'}
                            </span>
                            {personalQuests.length < 100 && (
                              <span style={{ color: '#FF4B4B' }}>
                                (-{seasonPhase === 'V1' ? 2 : 1}px)
                              </span>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  )} {/* end canCreateQuest */}

                  {/* RIGHTSIDE: Infinite vertical scroll wheel */}
                  <div className={`flex flex-col relative h-full ${canCreateQuest ? 'w-1/2' : 'w-full'}`}>
                    <div className="bg-[#D9D9D9] border-[5px] border-black rounded-[24px] relative flex-1 overflow-hidden flex flex-col">
                      <h3 className="text-center text-[clamp(24px,3vw,50px)] text-black uppercase tracking-widest drop-shadow-sm font-bold flex-shrink-0 m-0 pt-3 pb-0 leading-none" style={{ fontFamily: "'Jersey 15', sans-serif", color: 'black' }}>
                        LISTE DES QUÊTES
                      </h3>

                      {/* Wheel area */}
                      <div
                        ref={wheelRef}
                        className="flex-1 relative select-none overflow-hidden"
                        style={{ cursor: 'ns-resize', touchAction: 'none' }}
                        onWheel={handleNativeWheel}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
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
                          const ITEM_H = winHeight < 800 ? 50 : 65
                          const GAP = winHeight < 800 ? 6 : 10
                          const slots = [-2, -1, 0, 1, 2]

                          return slots.map((offset) => {
                            const isCenter = offset === 0
                            const dist = Math.abs(offset)
                            const opacity = dist === 0 ? 1 : dist === 1 ? 0.6 : 0.4
                            const topPct = 50
                            const topPx = offset * (ITEM_H + GAP)
                            const inset = isCenter ? '8%' : dist === 1 ? '12%' : '18%'

                            const realIdx = (((wheelIndex + offset) % 100) + 100) % 100
                            const q = wheelQuests[realIdx]
                            const isAccepted = q ? q.id === acceptedQuestId : false
                            const questNum = realIdx + 1
                            
                            // Visuals
                            const boxShadow = isCenter ? '0 4px 0px rgba(0,0,0,0.8)' : 'none'
                            const cursor = offset !== 0 ? 'pointer' : 'default'

                            // Default empty styling
                            let bgColor = '#D9D9D9'
                            let borderColor = 'rgba(0,0,0,0.3)'
                            let borderSize = isCenter ? '4px' : '3px'
                            
                            if (q) {
                              const tagColor = q.question ? QUESTION_COLORS[q.question] : null
                              const catColor = CATEGORY_COLORS[q.category] || null
                              
                              if (tagColor && catColor) {
                                const mixed = mixColors(tagColor, catColor)
                                borderColor = mixed
                                if (q.completed) {
                                  bgColor = mixed
                                } else {
                                  bgColor = '#f5f5f5'
                                }
                              } else {
                                borderColor = tagColor || catColor || 'black'
                                bgColor = q.completed ? (tagColor || catColor || '#888') : '#f5f5f5'
                              }
                              borderSize = isCenter ? '6px' : '4px'
                            }
                            
                            const boxBorder = `${borderSize} solid ${borderColor}`

                            return (
                              <div
                                key={offset}
                                onClick={() => {
                                  if (offset !== 0)
                                    setWheelIndex((((wheelIndex + offset) % 100) + 100) % 100)
                                }}
                                style={{
                                  position: 'absolute',
                                  left: inset,
                                  right: inset,
                                  height: `${ITEM_H}px`,
                                  top: `calc(${topPct}% + ${topPx}px - ${ITEM_H / 2}px)`,
                                  borderRadius: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: q ? 'center' : 'flex-start',
                                  paddingLeft: q ? '0' : '24px',
                                  cursor,
                                  transition: 'all 0.2s cubic-bezier(0.34,1.2,0.64,1)',
                                  opacity: isCenter ? 1 : opacity,
                                  backgroundColor: bgColor,
                                  border: boxBorder,
                                  boxShadow,
                                  zIndex: isCenter ? 5 : 3,
                                  overflow: 'hidden',
                                }}
                              >
                                {/* Accepted glow overlay */}
                                {isCenter && isAccepted && (
                                  <div style={{
                                    position: 'absolute', inset: 0,
                                    backgroundColor: 'rgba(255,255,255,0.25)',
                                    borderRadius: '8px',
                                    pointerEvents: 'none',
                                  }} />
                                )}
                                
                                {!q ? (
                                  <span style={{
                                    fontFamily: "'Jersey 15', sans-serif",
                                    fontSize: isCenter ? '36px' : '28px',
                                    color: 'white',
                                    textShadow: '0px 2px 4px rgba(0,0,0,0.4)',
                                    letterSpacing: '0.05em',
                                    fontWeight: 'bold',
                                    lineHeight: 1,
                                    userSelect: 'none',
                                    position: 'relative',
                                    zIndex: 2,
                                  }}>
                                    {questNum}.
                                  </span>
                                ) : (
                                  <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    width: '100%',
                                    position: 'relative',
                                    zIndex: 2,
                                    padding: '0 16px'
                                  }}>
                                    <span
                                      style={{
                                        fontFamily: "'Jersey 15', sans-serif",
                                        fontSize: isCenter ? '26px' : '22px',
                                        color: q.completed ? 'white' : '#333',
                                        textShadow: q.completed ? '0 2px 4px rgba(0,0,0,0.5)' : 'none',
                                        letterSpacing: '0.05em',
                                        fontWeight: 'bold',
                                        lineHeight: 1.1,
                                        userSelect: 'none',
                                        textAlign: 'center',
                                        width: '100%',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                      }}
                                    >
                                      {q.title}
                                    </span>
                                    <span style={{
                                        fontFamily: "'Jersey 15', sans-serif",
                                        fontSize: isCenter ? '16px' : '13px',
                                        color: q.completed ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.45)',
                                        textShadow: q.completed ? '0 1px 2px rgba(0,0,0,0.5)' : 'none',
                                        letterSpacing: '0.05em',
                                        marginTop: '2px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '100%',
                                      }}>
                                        {q.completed
                                          ? `✓ ${q.completedBy || 'COMPLÉTÉ'}`
                                          : (isCenter ? `#${questNum} • ${q.category}` : q.category)}
                                      </span>
                                  </div>
                                )}
                              </div>
                            )
                          })
                        })()}
                      </div>

                      {/* Action buttons — flex child so wheel 50% is truly centered between title and button */}
                      <div className="flex flex-shrink-0 justify-center items-center pt-4" style={{ gap: '30px', zIndex: 20, paddingBottom: 'max(3%, 24px)' }}>
                        {wheelQuests[wheelIndex]?.completed ? (
                          <div style={{
                            padding: '12px 40px',
                            borderRadius: '16px',
                            backgroundColor: 'rgba(34, 197, 94, 0.25)',
                            color: '#166534',
                            fontSize: '32px',
                            fontFamily: "'Jersey 15', sans-serif",
                            border: '4px solid #22c55e',
                            whiteSpace: 'nowrap',
                          }}>
                            COMPLET ✓
                          </div>
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
