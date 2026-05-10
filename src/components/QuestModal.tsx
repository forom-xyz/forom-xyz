import ReactModal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { X, Mail } from 'lucide-react'
import { QUESTION_ORDER, QUESTION_COLORS, CATEGORY_COLORS, getMemory } from '../data/memories'
import type { CategoryType, WhQuestion } from '../data/memories'
import { mixColors } from '../utils/colors'
import type { UserRole } from '../App'
import tokenIcon from '../assets/icons/tokens.svg'

import { useModalStore } from '../stores/useModalStore'

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
  initialWheelIndex?: number | null
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
  categories = ['A', 'B', 'C', 'D', 'E'],
  onCompleteQuest,
  onCancelQuest,
  userRole,
  /* unused props below */
  categoryLabels,
  seasonPhase,
  pixels,
  canCreateQuest,
  onCreateQuest,
  onAcceptQuest,
  initialWheelIndex
}: QuestModalProps) {
  
  // To avoid un-used checks
  void { categoryLabels, seasonPhase, pixels, canCreateQuest, onCreateQuest, onAcceptQuest }
  const [activeTab, setActiveTab] = useState<'community' | 'personal'>('personal')
  const [wheelIndex, setWheelIndex] = useState(0)
  const [boardSelectedId, setBoardSelectedId] = useState<string | null>(null)
  
  // NEW STATES
  const [isRequestMode, setIsRequestMode] = useState(false)
  const [requestText, setRequestText] = useState('')
  const sentRequests = useModalStore(state => state.sentRequests)
  const addSentRequest = useModalStore(state => state.addSentRequest)
  const hasSentRequest = sentRequests.includes(wheelIndex)
  
  const wheelRef = useRef<HTMLDivElement>(null)

  const [winHeight, setWinHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 1080)
  useEffect(() => {
    const handleResize = () => setWinHeight(window.innerHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setIsRequestMode(false)
      setRequestText('')
    } else if (initialWheelIndex !== undefined && initialWheelIndex !== null) {
      setWheelIndex(initialWheelIndex)
    }
  }, [isOpen, initialWheelIndex])

  const wheelQuests = useMemo(() => {
    const arr = Array(100).fill(null)
    // Wheel is empty by request
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
      setBoardSelectedId(acceptedQuestId)
      setActiveTab('community')
    }
  }, [acceptedQuestId])

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
              backgroundColor: isRequestMode ? '#D387FF' : '#FFCA82',
              border: '6px solid white',
              borderRadius: '32px',
              color: 'black',
              overflow: 'hidden',
              transition: 'background-color 0.3s'
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
                backgroundColor: 'black',
                border: '4px solid white',
                cursor: 'pointer',
                boxShadow: 'none',
                transition: 'transform 0.1s, box-shadow 0.1s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#333'
                e.currentTarget.style.transform = 'translateY(2px)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'black'
                e.currentTarget.style.transform = 'none'
              }}
              type="button"
              aria-label="Close modal"
            >
              <X size={24} color="white" strokeWidth={3} />
            </button>

            {/* Left Side Switch Buttons (Info / Quêtes) */}
            {!isRequestMode && (
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
                  backgroundColor: 'transparent',
                  border: '4px solid white',
                  cursor: 'pointer',
                  boxShadow: 'none',
                  transform: activeTab === 'community' ? 'scale(1.1)' : 'none',
                  transition: 'transform 0.1s, box-shadow 0.1s',
                  fontFamily: "'Jersey 15', sans-serif",
                  fontSize: '28px',
                  color: 'white',
                  lineHeight: 1,
                  opacity: activeTab === 'community' ? 1 : 0.7,
                }}
                onMouseOver={(e) => {
                  if (activeTab !== 'community') {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'
                    e.currentTarget.style.opacity = '1'
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== 'community') {
                    e.currentTarget.style.backgroundColor = 'transparent'
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
                  backgroundColor: 'transparent',
                  border: '4px solid black',
                  cursor: 'pointer',
                  boxShadow: 'none',
                  transform: activeTab === 'personal' ? 'scale(1.1)' : 'none',
                  transition: 'transform 0.1s, box-shadow 0.1s',
                  fontFamily: "'Jersey 15', sans-serif",
                  fontSize: '28px',
                  color: 'black',
                  lineHeight: 1,
                  opacity: activeTab === 'personal' ? 1 : 0.7,
                }}
                onMouseOver={(e) => {
                  if (activeTab !== 'personal') {
                    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)'
                    e.currentTarget.style.opacity = '1'
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== 'personal') {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.opacity = '0.7'
                  }
                }}
                aria-label="Quêtes"
              >
                Q
              </button>
            </div>
            )}

            {isRequestMode ? (
              <div className="flex-1 flex flex-col w-full h-full relative items-center" style={{ padding: 'clamp(20px, 4vh, 40px) 0' }}>
                {(() => {
                  const catIdx = Math.floor(wheelIndex / 10)
                  const tagIdx = wheelIndex % 10
                  const currentCategory = categories[catIdx] || 'A'
                  const currentTag = String(tagIdx)
                  const categoryLabel = categoryLabels?.[currentCategory] || currentCategory
                  const tagLabel = questionLabels?.[currentTag] || currentTag
                  
                  const words = requestText.trim().split(/\s+/).filter(Boolean).length
                  const wordCountColor = words === 0 ? '#ef4444' : words < 40 ? '#ef4444' : words < 60 ? '#f97316' : words < 80 ? '#eab308' : '#22c55e'
                  const canSend = words >= 80

                  if (hasSentRequest) {
                    return (
                      <>
                        <div className="absolute top-[24px] right-[24px] z-50 cursor-pointer" onClick={() => setIsRequestMode(false)}>
                          <div style={{ backgroundColor: 'black', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>X</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center mt-[10vh]" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '22px', color: 'black', letterSpacing: '0.05em', gap: '4px' }}>
                          <span>{`[ CATEGORY: ${categoryLabel.toUpperCase()} ]`}</span>
                          <span>{`[ TAG: ${tagLabel.toUpperCase()} ]`}</span>
                        </div>
                        
                        <h1 className="text-black m-0 leading-none text-center font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full" style={{ fontSize: '80px', fontFamily: "'Jersey 15', sans-serif" }}>
                          REQUÊTE ENVOYÉ
                        </h1>

                        <div className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '16px', color: 'black' }}>
                            Allez dans le terminal
                          </span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '16px', color: 'black', fontWeight: 'bold' }}>
                            to V
                          </span>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FFCA82', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                            <span style={{ fontSize: '24px', lineHeight: 1 }}>🪙</span>
                          </div>
                        </div>
                      </>
                    )
                  }

                  return (
                    <>
                      <h1 className="text-black tracking-widest m-0 leading-none text-center font-bold" style={{ fontSize: '100px', fontFamily: "'Jersey 15', sans-serif" }}>
                        REQUÊTE
                      </h1>
                      <div className="flex flex-col items-center mt-4" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '22px', color: 'black', letterSpacing: '0.05em', gap: '4px' }}>
                        <span>{`[ CATEGORY: ${categoryLabel.toUpperCase()} ]`}</span>
                        <span>{`[ TAG: ${tagLabel.toUpperCase()} ]`}</span>
                      </div>
                      <h2 className="text-black m-0 mt-6 mb-[4vh] font-bold text-center" style={{ fontSize: '50px', fontFamily: "'Jersey 15', sans-serif", lineHeight: 1 }}>
                        Idées et demandes
                      </h2>
                      
                      <div 
                        className="flex-1 w-[90%] max-w-[90%] min-w-0 flex box-border" 
                        style={{
                          backgroundColor: 'white',
                          border: '8px solid #7A7A7A',
                          borderRadius: '24px',
                          padding: '24px'
                        }}
                      >
                        <textarea
                          value={requestText}
                          onChange={(e) => {
                            const text = e.target.value;
                            const currentWords = text.trim().split(/\s+/).filter(Boolean).length;
                            if (currentWords <= 100 || text.length < requestText.length) {
                              setRequestText(text);
                            }
                          }}
                          className="w-full h-full min-w-0 text-2xl font-sans resize-none bg-transparent border-none outline-none"
                          style={{ paddingRight: '8px' }}
                        />
                      </div>

                      <div className="w-[90%] max-w-[90%] min-w-0 flex justify-between items-end mt-[4vh] mb-4 font-jersey box-border">
                        {/* Left Cancel Button */}
                        <div className="flex flex-col items-center cursor-pointer" onClick={() => setIsRequestMode(false)}>
                          <div style={{ backgroundColor: 'white', border: '5px solid #FFCA82', borderRadius: '16px', padding: '10px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'transform 0.1s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
                            <span style={{ fontSize: '32px', fontWeight: 'bold', lineHeight: 1 }}>{'<'}</span>
                          </div>
                          <span style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '8px', color: 'black', lineHeight: 1 }}>ANNULER</span>
                        </div>

                        {/* Center Info */}
                        <div className="flex flex-col items-center">
                          <span style={{ fontSize: '28px', color: wordCountColor, marginBottom: '8px', fontWeight: 'bold' }}>
                            {`(${words}/100 mots)`}
                          </span>
                          <span style={{ fontSize: '32px', color: 'white', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                            + 10 XP
                          </span>
                        </div>

                        {/* Right Send Button */}
                        <div 
                          className="flex flex-col items-center" 
                          style={{ cursor: canSend ? 'pointer' : 'not-allowed', opacity: canSend ? 1 : 0.5 }}
                          onClick={() => {
                            if (canSend) {
                              addSentRequest(wheelIndex);
                              setIsRequestMode(false);
                            }
                          }}
                        >
                          <div style={{ backgroundColor: 'white', border: '5px solid #FFCA82', borderRadius: '16px', padding: '10px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'transform 0.1s' }} onMouseOver={e => { if(canSend) e.currentTarget.style.transform = 'scale(1.05)' }} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
                            <span style={{ fontSize: '32px', fontWeight: 'bold', lineHeight: 1 }}>{'>'}</span>
                          </div>
                          <span style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '8px', color: 'black', lineHeight: 1 }}>ENVOYÉ</span>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            ) : (
              <div className="flex-1 overflow-auto flex flex-col font-jersey relative" style={{ padding: 'clamp(16px, 3vh, 40px) clamp(20px, 4vw, 60px)' }}>
              {/* Header */}
              <div className="relative flex justify-center items-center flex-col mt-4 mb-[clamp(8px,2vh,32px)] z-10">
                <h1 className="text-black tracking-widest m-0 leading-none text-center font-bold" style={{ fontSize: '80px', fontFamily: "'Jersey 15', sans-serif" }}>
                  Terminal
                </h1>
                <div style={{
                  position: 'absolute',
                  bottom: '-25px', // adjust Token icon position
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#FFCA82', // Match BG
                  zIndex: 20
                }}>
                  <img src={tokenIcon} alt="Tokens" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
                <div className="flex-1 flex w-full max-w-3xl mx-auto h-full overflow-hidden mt-2 pb-2 px-4" style={{ gap: '2vw' }}>
                  {/* Infinite vertical scroll wheel centered */}
                  <div className={`flex flex-col relative h-full w-full`}>
                    <div className="bg-[#E2E2E2] border-[6px] border-white rounded-[24px] relative flex-1 overflow-hidden flex flex-col">
                        <h3 
                          className="text-center text-[clamp(28px,4vw,50px)] text-black tracking-widest drop-shadow-sm flex-shrink-0 m-0 pt-6 pb-2 leading-none"
                          style={{ fontFamily: "'Jersey 15', sans-serif" }}
                        >
                          Liste des quêtes
                        </h3>

                      {/* Top slot indicator / dummy element (like in image) */}
                      <div className="flex justify-center my-4 opacity-0 pointer-events-none z-20">
                        <div style={{ width: '60%', height: '20px' }}></div>
                      </div>

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
                        {/* Center highlight row simulation - DYNAMIC category/tag on sides, FIXED center text */}
                        {(() => {
                          const catIdx = Math.floor(wheelIndex / 10)
                          const tagIdx = wheelIndex % 10
                          const currentCategory = categories[catIdx] || 'A'
                          const currentTag = String(tagIdx)
                          const categoryColor = CATEGORY_COLORS[currentCategory] || '#888'
                          const tagColor = QUESTION_COLORS[currentTag] || '#888'
                          const categoryLabel = categoryLabels?.[currentCategory] || currentCategory
                          const tagLabel = questionLabels?.[currentTag] || currentTag
                          
                          return (
                            <div className="absolute top-1/2 left-[6%] right-[6%] h-[80px] border-[5px] border-[#7A7A7A] rounded-[16px] z-0" style={{ transform: 'translateY(-50%)', pointerEvents: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', backgroundColor: hasSentRequest ? '#D387FF' : 'white' }}>
                              {/* Three-column balanced layout */}
                              <div className="flex items-center w-full h-full px-4 sm:px-6" style={{ justifyContent: 'space-between' }}>
                                {/* LEFT: Dynamic category label */}
                                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                                  <span style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(20px, 2.5vw, 26px)', color: hasSentRequest ? 'white' : categoryColor, fontWeight: 'bold', letterSpacing: '0.05em', lineHeight: 1.1, textAlign: 'center' }}>
                                    {categoryLabel}
                                  </span>
                                </div>
                                
                                {/* CENTER: Fixed text */}
                                <div style={{ flexShrink: 0, padding: '0 12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                  <span className="uppercase tracking-widest drop-shadow-sm font-bold" style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(24px, 3.5vw, 36px)', lineHeight: 1.1, color: hasSentRequest ? 'white' : 'black' }}>
                                    {hasSentRequest ? 'REQUÊTE ENVOYÉ' : 'FAIT UNE REQUÊTE'}
                                  </span>
                                </div>
                                
                                {/* RIGHT: Dynamic tag label */}
                                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                                  <span style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(20px, 2.5vw, 26px)', color: hasSentRequest ? 'white' : tagColor, fontWeight: 'bold', letterSpacing: '0.05em', lineHeight: 1.1, textAlign: 'center' }}>
                                    {tagLabel}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })()}

                        {/* Items — absolutely positioned */}
                        {(() => {
                          const ITEM_H = winHeight < 800 ? 55 : 70
                          const GAP = winHeight < 800 ? 16 : 24
                          const slots = [-3, -2, -1, 0, 1, 2, 3]

                          return slots.map((offset) => {
                            const isCenter = offset === 0
                            const dist = Math.abs(offset)
                            const topPct = 50
                            const topPx = offset * (ITEM_H + GAP)
                            const inset = isCenter ? '6%' : dist === 1 ? '12%' : dist === 2 ? '20%' : '30%'

                            const realIdx = (((wheelIndex + offset) % 100) + 100) % 100
                            const q = wheelQuests[realIdx]
                            const isAccepted = q ? q.id === acceptedQuestId : false
                            
                            // Visuals
                            const cursor = offset !== 0 ? 'pointer' : 'default'

                            // Default empty styling
                            let bgColor = '#D4D4D4'
                            let borderColor = '#C0C0C0'
                            let borderSize = '4px'
                            
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
                                borderColor = tagColor || catColor || '#C0C0C0'
                                bgColor = q.completed ? (tagColor || catColor || '#888') : '#f5f5f5'
                              }
                            }
                            
                            const boxBorder = `${borderSize} solid ${borderColor}`

                            return (
                              <div
                                key={realIdx}
                                onClick={() => {
                                  if (offset !== 0)
                                    setWheelIndex((((wheelIndex + offset) % 100) + 100) % 100)
                                }}
                                style={{
                                  position: 'absolute',
                                  left: inset,
                                  right: inset,
                                  height: `${isCenter ? 80 : ITEM_H}px`,
                                  top: `calc(${topPct}% + ${topPx}px - ${isCenter ? 40 : (ITEM_H/2)}px)`,
                                  borderRadius: '16px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: q ? 'center' : 'flex-start',
                                  paddingLeft: q ? '0' : '24px',
                                  cursor,
                                  transition: 'all 0.35s cubic-bezier(0.34, 1.35, 0.64, 1)',
                                  opacity: isCenter ? 0 : dist === 1 ? 0.9 : dist === 2 ? 0.6 : 0,
                                  pointerEvents: isCenter || dist > 2 ? 'none' : 'auto',
                                  backgroundColor: bgColor,
                                  border: boxBorder,
                                  zIndex: isCenter ? 5 : 3,
                                  overflow: 'hidden',
                                }}
                              >
                                {isCenter && isAccepted && (
                                  <div style={{
                                    position: 'absolute', inset: 0,
                                    backgroundColor: 'rgba(255,255,255,0.25)',
                                    borderRadius: '8px',
                                    pointerEvents: 'none',
                                  }} />
                                )}
                                {!q ? (
                                  <span style={{ display: 'none' }}></span>
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
                                  </div>
                                )}
                              </div>
                            )
                          })
                        })()}
                      </div>

                      {/* Action buttons (REQUÊTE) */}
                      <div className="flex flex-shrink-0 justify-center items-center pt-2" style={{ zIndex: 20, paddingBottom: '32px' }}>
                          <button
                            onClick={() => setIsRequestMode(true)}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <div style={{
                                width: '64px',
                                height: '50px',
                                backgroundColor: hasSentRequest ? '#B2B2B2' : '#D387FF',
                                border: '4px solid #7A7A7A',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.1s'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                            >
                                <Mail size={28} color="black" />
                            </div>
                            <span style={{
                                fontFamily: "'Jersey 15', sans-serif",
                                fontSize: '24px',
                                color: 'black',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '2px'
                            }}>
                                REQUÊTE
                            </span>
                          </button>
                      </div>
                    </div>
                  </div>

                </div>
              )}
              </div>
            )}
            </motion.div>
          </ReactModal>
      )}
    </AnimatePresence>
  )
}

