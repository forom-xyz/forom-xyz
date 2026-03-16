import { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { CATEGORY_COLORS } from '../data/memories'

// =============================================================================
// TYPES
// =============================================================================

export interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (categoryLabels: Record<string, string>, questionLabels: Record<string, string>) => void
  currentCategoryLabels: Record<string, string>
  currentQuestionLabels: Record<string, string>
  categories: readonly string[]
  questionOrder: readonly string[]
  questionColors: Record<string, string>
}

// =============================================================================
// STYLES
// =============================================================================

const customStyles: Modal.Styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    inset: 'auto',
    width: 'min(90vw, 1100px)',
    height: 'min(94vh, 880px)',
    padding: 0,
    border: 'none',
    background: 'transparent',
    overflow: 'hidden',
    borderRadius: 0,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
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

export function SettingsModal({
  isOpen,
  onClose,
  onSave,
  currentCategoryLabels,
  currentQuestionLabels,
  categories,
  questionOrder,
  questionColors,
}: SettingsModalProps) {
  const [localCategoryLabels, setLocalCategoryLabels] = useState<Record<string, string>>({})
  const [localQuestionLabels, setLocalQuestionLabels] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      setLocalCategoryLabels({ ...currentCategoryLabels }) // eslint-disable-line react-hooks/set-state-in-effect
      setLocalQuestionLabels({ ...currentQuestionLabels })  
    }
  }, [isOpen, currentCategoryLabels, currentQuestionLabels])

  // Check if any changes were made
  const hasChanges = Object.keys(localCategoryLabels).some(k => localCategoryLabels[k] !== currentCategoryLabels[k]) ||
                     Object.keys(localQuestionLabels).some(k => localQuestionLabels[k] !== currentQuestionLabels[k])

  const handleConfirm = () => {
    if (hasChanges) {
      onSave(localCategoryLabels, localQuestionLabels)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          style={customStyles}
          closeTimeoutMS={200}
          shouldCloseOnOverlayClick={true}
          shouldCloseOnEsc={true}
          ariaHideApp={false}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ 
              width: '100%',
              height: '100%',
              backgroundColor: '#D9D9D9',
              border: '6px solid #EF4444',
              borderRadius: '32px',
              fontFamily: "'Jersey 15', sans-serif",
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{ 
                position: 'absolute', 
                top: '16px', 
                right: '16px', 
                zIndex: 100,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FF4B4B',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ff3333'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF4B4B'}
            >
              <X size={22} color="white" strokeWidth={3} />
            </button>

            {/* Header */}
            <h2 style={{ 
              fontSize: 'clamp(24px, 3.5vw, 44px)', 
              color: 'black', 
              textAlign: 'center', 
              margin: '0',
              padding: 'clamp(10px, 1.5vh, 20px) 60px clamp(6px, 1vh, 14px)',
              textTransform: 'uppercase', 
              letterSpacing: '4px',
              flexShrink: 0,
            }}>
              PARAMÈTRES
            </h2>

            {/* Column Headers */}
            <div style={{
              display: 'flex',
              gap: 'clamp(16px, 3vw, 48px)',
              padding: '0 clamp(16px, 3vw, 48px)',
              flexShrink: 0,
            }}>
              {(['CATÉGORIES', 'QUESTIONS & TAGS'] as const).map(title => (
                <div key={title} style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: 'clamp(14px, 2vw, 28px)', 
                    textAlign: 'center', 
                    color: 'black',
                    margin: '0',
                    paddingBottom: 'clamp(4px, 0.6vh, 10px)',
                    borderBottom: '3px dashed rgba(0,0,0,0.2)', 
                  }}>
                    {title}
                  </h3>
                </div>
              ))}
            </div>

            {/* Content Body — no scroll, rows fill available height evenly */}
            <div style={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              gap: 'clamp(16px, 3vw, 48px)',
              padding: 'clamp(6px, 1vh, 16px) clamp(16px, 3vw, 48px)',
              overflow: 'hidden',
            }}>
              
              {/* Left Column: Categories */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(3px, 0.6vh, 8px)', minHeight: 0 }}>
                {categories.map(cat => (
                  <div key={cat} style={{ 
                    flex: 1,
                    minHeight: 0,
                    display: 'flex', 
                    alignItems: 'center', 
                    backgroundColor: 'rgba(255,255,255,0.7)', 
                    padding: '0 clamp(8px, 1vw, 16px)', 
                    borderRadius: '12px', 
                    border: '3px solid black', 
                    gap: 'clamp(8px, 1vw, 14px)',
                  }}>
                    <div style={{ 
                      width: 'clamp(18px, 2vw, 30px)', 
                      height: 'clamp(18px, 2vw, 30px)', 
                      borderRadius: '6px', 
                      border: '2px solid black', 
                      backgroundColor: CATEGORY_COLORS[cat] || '#888',
                      flexShrink: 0,
                    }} />
                    <input
                      type="text"
                      value={localCategoryLabels[cat] || ''}
                      onChange={e => setLocalCategoryLabels(prev => ({ ...prev, [cat]: e.target.value }))}
                      style={{ 
                        flex: 1, 
                        border: 'none', 
                        outline: 'none', 
                        background: 'transparent', 
                        fontFamily: "'Montserrat', sans-serif", 
                        fontSize: 'clamp(11px, 1.4vw, 18px)', 
                        fontWeight: 'bold', 
                        color: 'black',
                        width: '100%',
                        minWidth: 0,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Right Column: Questions & Tags */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(3px, 0.6vh, 8px)', minHeight: 0 }}>
                {questionOrder.map(q => {
                  const color = questionColors[q] || '#888'
                  return (
                    <div key={q} style={{ 
                      flex: 1,
                      minHeight: 0,
                      display: 'flex', 
                      alignItems: 'center', 
                      backgroundColor: 'rgba(255,255,255,0.7)', 
                      padding: '0 clamp(8px, 1vw, 16px)', 
                      borderRadius: '12px', 
                      border: '3px solid black', 
                      gap: 'clamp(8px, 1vw, 14px)',
                    }}>
                      <div style={{ 
                        width: 'clamp(18px, 2vw, 30px)', 
                        height: 'clamp(18px, 2vw, 30px)', 
                        borderRadius: '6px', 
                        border: '2px solid black', 
                        backgroundColor: color,
                        flexShrink: 0,
                      }} />
                      <input
                        type="text"
                        value={localQuestionLabels[q] || ''}
                        onChange={e => setLocalQuestionLabels(prev => ({ ...prev, [q]: e.target.value }))}
                        style={{ 
                          flex: 1, 
                          border: 'none', 
                          outline: 'none', 
                          background: 'transparent', 
                          fontFamily: "'Montserrat', sans-serif", 
                          fontSize: 'clamp(11px, 1.4vw, 18px)', 
                          fontWeight: 'bold', 
                          color: 'black',
                          width: '100%',
                          minWidth: 0,
                        }}
                      />
                    </div>
                  )
                })}
              </div>

            </div>

            {/* Actions Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              padding: 'clamp(8px, 1.2vh, 20px) 24px clamp(12px, 1.6vh, 24px)',
              flexShrink: 0,
            }}>
              <button
                onClick={onClose}
                style={{ 
                  padding: 'clamp(6px, 0.8vh, 12px) clamp(20px, 2.5vw, 40px)', 
                  borderRadius: '14px', 
                  backgroundColor: '#444', 
                  color: 'white', 
                  fontSize: 'clamp(18px, 2.2vw, 30px)', 
                  fontFamily: "'Jersey 15', sans-serif", 
                  border: '4px solid black', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 0px rgba(0,0,0,1)',
                }}
              >
                ANNULER
              </button>
              <button
                onClick={handleConfirm}
                disabled={!hasChanges}
                style={{ 
                  padding: 'clamp(6px, 0.8vh, 12px) clamp(20px, 2.5vw, 40px)', 
                  borderRadius: '14px', 
                  backgroundColor: hasChanges ? 'white' : 'rgba(255,255,255,0.4)', 
                  color: hasChanges ? 'black' : 'rgba(0,0,0,0.4)', 
                  fontSize: 'clamp(18px, 2.2vw, 30px)', 
                  fontFamily: "'Jersey 15', sans-serif", 
                  border: hasChanges ? '4px solid black' : '4px solid rgba(0,0,0,0.2)', 
                  cursor: hasChanges ? 'pointer' : 'not-allowed',
                  boxShadow: hasChanges ? '0 4px 0px rgba(0,0,0,1)' : 'none',
                  transform: hasChanges ? 'translateY(-2px)' : 'none',
                }}
              >
                CONFIRMER
              </button>
            </div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  )
}


