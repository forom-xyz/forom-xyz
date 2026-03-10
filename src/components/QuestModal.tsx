import ReactModal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { X } from 'lucide-react'
import { QUESTION_ORDER, QUESTION_COLORS, CATEGORY_COLORS } from '../data/memories'

// Category band colors removed because we now use mixColors

// =============================================================================
// TYPES
// =============================================================================

export function mixColors(color1: string, color2: string): string {
  // Simple hex color mixer
  if (!color1 || !color2) return color1 || color2 || '#ffffff';
  
  // Convert hex to rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  
  if (!c1 || !c2) return color1 || color2;
  
  const r = Math.round((c1.r + c2.r) / 2);
  const g = Math.round((c1.g + c2.g) / 2);
  const b = Math.round((c1.b + c2.b) / 2);
  
  const componentToHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export interface Quest {
  id: string
  title: string
  reward: number
  question: string | null
  category: string
}

export interface QuestModalProps {
  isOpen: boolean
  onClose: () => void
  personalQuests: Quest[]
  acceptedQuestId: string | null
  questionLabels: Record<string, string>
  categories?: string[]
  onCreateQuest: (title: string, reward: number, question: string | null, category: string) => void
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
  onCancelQuest,
  categories = ['A', 'B', 'C', 'D', 'E']
}: QuestModalProps) {
  const [activeTab, setActiveTab] = useState<'community' | 'personal'>('personal')
  const [newTitle, setNewTitle] = useState('')
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0])
  const [wheelIndex, setWheelIndex] = useState(0)
  const [boardSelectedId, setBoardSelectedId] = useState<string | null>(null)
  const wheelRef = useRef<HTMLDivElement>(null)

  const wheelQuests = useMemo(() => {
    const arr = Array(100).fill(null)
    const counts: Record<string, number> = {}
    personalQuests.forEach(q => {
      const cat = q.category || categories[0]
      const catIdx = categories.indexOf(cat)
      if (catIdx === -1) return
      
      const count = counts[cat] || 0
      if (count < 10) {
        arr[catIdx * 10 + count] = q
        counts[cat] = count + 1
      }
    })
    return arr
  }, [personalQuests, categories])

  const handleNativeWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWheelIndex(prev => {
      const delta = e.deltaY > 0 ? 1 : -1
      return (((prev + delta) % 100) + 100) % 100
    })
  }, [])

  useEffect(() => {
    const el = wheelRef.current
    if (!el) return
    el.addEventListener('wheel', handleNativeWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleNativeWheel)
  }, [handleNativeWheel, activeTab])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !selectedQuestion) return // Require tag/question
    if (personalQuests.length >= 100) return

    // Calculate where this new quest will land so we can scroll to it immediately
    const catIdx = categories.indexOf(selectedCategory)
    const countInCat = personalQuests.filter(q => (q.category || categories[0]) === selectedCategory).length
    const targetIdx = Math.min(catIdx * 10 + countInCat, catIdx * 10 + 9) // 10 per category now

    onCreateQuest(newTitle, 2.07, selectedQuestion, selectedCategory)
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
                <div className="flex-1 flex w-full max-w-6xl mx-auto h-full overflow-hidden mt-6 pb-2" style={{ gap: '3%' }}>

                  {/* LEFT: Active quest spotlight */}
                  <div className="flex flex-col relative w-1/2 h-full">
                    <div className="bg-[#D9D9D9] border-[5px] border-black rounded-[24px] p-8 flex flex-col items-center justify-start gap-6 relative flex-1 overflow-hidden">
                      <h3 className="text-center text-[50px] text-white uppercase tracking-widest drop-shadow-sm font-bold flex-shrink-0 m-0 leading-none" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
                        ACTIF
                      </h3>

                      {/* Active quest card */}
                      <div className="flex-1 flex flex-col items-center justify-center w-full">
                        {(() => {
                          const active = personalQuests.find(q => q.id === acceptedQuestId)
                          if (!active) {
                            return (
                              <div className="flex flex-col items-center justify-center gap-4 opacity-50">
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
                                  Sélectionne une quête depuis ton tableau
                                </span>
                              </div>
                            )
                          }
                          const tagColor = active.question ? (QUESTION_COLORS[active.question] || '#888') : null
                          const tagLabel = active.question ? (questionLabels[active.question] || active.question) : null
                          return (
                            <div style={{
                              width: '85%',
                              borderRadius: '20px',
                              backgroundColor: '#FFA639',
                              border: '5px solid black',
                              boxShadow: '0 6px 0px rgba(0,0,0,0.9)',
                              padding: '28px 24px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '14px',
                            }}>
                              {tagLabel && (
                                <div style={{
                                  backgroundColor: tagColor!,
                                  borderRadius: '10px',
                                  border: '3px solid black',
                                  padding: '4px 20px',
                                  fontFamily: "'Jersey 15', sans-serif",
                                  fontSize: '22px',
                                  color: 'white',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.08em',
                                }}>
                                  {tagLabel}
                                </div>
                              )}
                              <span style={{
                                fontFamily: "'Jersey 15', sans-serif",
                                fontSize: '32px',
                                color: 'black',
                                textAlign: 'center',
                                lineHeight: 1.2,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                              }}>
                                {active.title}
                              </span>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: 'rgba(0,0,0,0.12)',
                                borderRadius: '10px',
                                padding: '4px 16px',
                              }}>
                                <span style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '22px', color: 'black' }}>
                                  +{active.reward} PX
                                </span>
                              </div>
                            </div>
                          )
                        })()}
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-shrink-0 justify-center items-center" style={{ gap: '20px', paddingBottom: 'max(3%, 24px)' }}>
                        {acceptedQuestId ? (
                          <>
                            <button
                              onClick={() => onCancelQuest(acceptedQuestId)}
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
                              onClick={() => onCompleteQuest(acceptedQuestId)}
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
                            onClick={() => { if (boardSelectedId) onAcceptQuest(boardSelectedId) }}
                            style={{
                              padding: '12px 40px',
                              borderRadius: '16px',
                              backgroundColor: boardSelectedId ? 'white' : 'rgba(255,255,255,0.4)',
                              color: boardSelectedId ? 'black' : 'rgba(0,0,0,0.4)',
                              fontSize: '32px',
                              fontFamily: "'Jersey 15', sans-serif",
                              border: boardSelectedId ? '4px solid black' : '4px solid rgba(0,0,0,0.2)',
                              cursor: boardSelectedId ? 'pointer' : 'not-allowed',
                              boxShadow: boardSelectedId ? '0 4px 0px rgba(0,0,0,1)' : 'none',
                              transition: 'transform 0.1s, box-shadow 0.1s',
                              whiteSpace: 'nowrap',
                            }}
                            onMouseOver={(e) => {
                              if (boardSelectedId) {
                                e.currentTarget.style.transform = 'translateY(2px)'
                                e.currentTarget.style.boxShadow = '0 2px 0px rgba(0,0,0,1)'
                              }
                            }}
                            onMouseOut={(e) => {
                              if (boardSelectedId) {
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

                  {/* RIGHT: All quests board */}
                  <div className="flex flex-col relative w-1/2 h-full">
                    <div className="bg-[#D9D9D9] border-[5px] border-black rounded-[24px] flex flex-col relative flex-1 overflow-hidden">
                      <h3 className="text-center text-[50px] text-white uppercase tracking-widest drop-shadow-sm font-bold flex-shrink-0 m-0 pt-3 pb-0 leading-none" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
                        TABLEAU
                      </h3>

                      {/* Quest list */}
                      <div className="flex-1 overflow-y-auto px-5 pb-5 pt-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.2) transparent' }}>
                        {personalQuests.length === 0 ? (
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
                              Crée des quêtes depuis l'onglet Q
                            </span>
                          </div>
                        ) : (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            {personalQuests.map((q) => {
                              const isActive = q.id === acceptedQuestId
                              const isSelected = q.id === boardSelectedId
                              const tagColor = q.question ? (QUESTION_COLORS[q.question] || '#888') : null
                              const tagLabel = q.question ? (questionLabels[q.question] || q.question) : null
                              return (
                                <div
                                  key={q.id}
                                  onClick={() => setBoardSelectedId(isSelected ? null : q.id)}
                                  style={{
                                    borderRadius: '16px',
                                    backgroundColor: isActive ? '#FFA639' : isSelected ? '#fff' : '#fff',
                                    border: isSelected || isActive ? '4px solid black' : '4px solid rgba(0,0,0,0.25)',
                                    boxShadow: isSelected || isActive ? '0 4px 0px rgba(0,0,0,0.8)' : '0 2px 0px rgba(0,0,0,0.2)',
                                    padding: '10px 14px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px',
                                    transition: 'all 0.15s cubic-bezier(0.34,1.2,0.64,1)',
                                    transform: isSelected ? 'translateY(-2px)' : 'none',
                                    opacity: isActive || isSelected ? 1 : 0.85,
                                  }}
                                >
                                  {tagLabel && tagColor && (
                                    <div style={{
                                      display: 'inline-flex',
                                      alignSelf: 'flex-start',
                                      backgroundColor: tagColor,
                                      borderRadius: '8px',
                                      border: '2px solid black',
                                      padding: '1px 10px',
                                      fontFamily: "'Jersey 15', sans-serif",
                                      fontSize: '16px',
                                      color: 'white',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.06em',
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
                                  }}>
                                    {q.title}
                                  </span>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '17px', color: 'rgba(0,0,0,0.5)' }}>
                                      +{q.reward} PX
                                    </span>
                                    {isActive && (
                                      <span style={{
                                        fontFamily: "'Jersey 15', sans-serif",
                                        fontSize: '15px',
                                        backgroundColor: 'black',
                                        color: '#FFA639',
                                        borderRadius: '6px',
                                        padding: '1px 8px',
                                        letterSpacing: '0.06em',
                                      }}>
                                        ACTIF
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
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
                      
                      {/* Category selector */}
                      <div className="flex flex-wrap justify-center items-center" style={{ gap: '8px', width: '90%', marginBottom: '5%' }}>
                        {categories.map((cat) => {
                          const isSelected = selectedCategory === cat
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedCategory(cat)}
                              className="cursor-pointer uppercase font-bold tracking-wide transition-all"
                              style={{
                                backgroundColor: CATEGORY_COLORS[cat] || 'rgba(255,255,255,0.4)',
                                opacity: isSelected ? 1 : 0.4,
                                color: isSelected ? 'white' : 'black',
                                fontFamily: "'Jersey 15', sans-serif",
                                fontSize: '20px',
                                borderRadius: '8px',
                                padding: '4px 16px',
                                border: isSelected ? '3px solid black' : '3px solid rgba(0,0,0,0.2)',
                                boxShadow: isSelected ? '0 2px 0px rgba(0,0,0,1)' : 'none',
                                transform: isSelected ? 'translateY(-2px)' : 'none',
                              }}
                            >
                              {cat}
                            </button>
                          )
                        })}
                      </div>

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
                      <div className="flex flex-shrink-0 flex-col justify-center items-center pt-4" style={{ paddingBottom: 'max(3%, 24px)', gap: '8px' }}>
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
                          disabled={!newTitle.trim() || personalQuests.length >= 100}
                          style={{
                            padding: '12px 40px',
                            borderRadius: '16px',
                            backgroundColor: (!newTitle.trim() || personalQuests.length >= 100) ? 'rgba(255,255,255,0.4)' : 'white',
                            color: (!newTitle.trim() || personalQuests.length >= 100) ? 'rgba(0,0,0,0.4)' : 'black',
                            fontSize: '32px',
                            fontFamily: "'Jersey 15', sans-serif",
                            border: (!newTitle.trim() || personalQuests.length >= 100) ? '4px solid rgba(0,0,0,0.2)' : '4px solid black',
                            cursor: (!newTitle.trim() || personalQuests.length >= 100) ? 'not-allowed' : 'pointer',
                            boxShadow: (!newTitle.trim() || personalQuests.length >= 100) ? 'none' : '0 4px 0px rgba(0,0,0,1)',
                            transition: 'transform 0.1s, box-shadow 0.1s',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseOver={(e) => {
                            if (newTitle.trim() && personalQuests.length < 100) {
                              e.currentTarget.style.transform = 'translateY(2px)'
                              e.currentTarget.style.boxShadow = '0 2px 0px rgba(0,0,0,1)'
                            }
                          }}
                          onMouseOut={(e) => {
                            if (newTitle.trim() && personalQuests.length < 100) {
                              e.currentTarget.style.transform = 'none'
                              e.currentTarget.style.boxShadow = '0 4px 0px rgba(0,0,0,1)'
                            }
                          }}
                        >
                          {personalQuests.length >= 100 ? 'GRILLE PLEINE' : 'ENVOYER'}
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
                        ref={wheelRef}
                        className="flex-1 relative select-none"
                        style={{ cursor: 'ns-resize' }}
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
                          const slots = [-2, -1, 0, 1, 2]

                          return slots.map((offset) => {
                            const isCenter = offset === 0
                            const dist = Math.abs(offset)
                            const opacity = dist === 0 ? 1 : dist === 1 ? 0.6 : 0.4
                            const topPct = 44
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
                                borderColor = mixColors(tagColor, catColor)
                              } else {
                                borderColor = tagColor || catColor || 'black'
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
                                    fontSize: isCenter ? '42px' : '34px',
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
                                        fontSize: isCenter ? '32px' : '26px',
                                        color: 'white',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
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
                                    {isCenter && (
                                      <span style={{
                                        fontFamily: "'Jersey 15', sans-serif",
                                        fontSize: '18px',
                                        color: 'rgba(255,255,255,0.9)',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                                        letterSpacing: '0.05em',
                                        marginTop: '2px'
                                      }}>
                                        #{questNum} • {q.category}
                                      </span>
                                    )}
                                  </div>
                                )}
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
