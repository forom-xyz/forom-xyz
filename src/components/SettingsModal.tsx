import { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

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
    width: '80vw',
    maxWidth: '1200px',
    maxHeight: '85vh',
    height: '85vh',
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

const CATEGORY_COLORS: Record<string, string> = {
  A: '#86B89E',
  B: '#C084FC',
  C: '#E85C5C',
  D: '#F4C98E',
  E: '#60A5FA',
}

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
      setLocalCategoryLabels({ ...currentCategoryLabels })
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
              boxSizing: 'border-box'
            }}
          >
            {/* Close Button - Red Circle X */}
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
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ff3333'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF4B4B'}
            >
              <X size={28} color="white" strokeWidth={3} />
            </button>

            {/* Header */}
            <h2 style={{ 
              fontSize: '56px', 
              color: 'black', 
              textAlign: 'center', 
              marginTop: '40px',
              marginBottom: '20px',
              textTransform: 'uppercase', 
              letterSpacing: '4px' 
            }}>
              PARAMÈTRES
            </h2>

            {/* Content Body */}
            <div style={{ flex: 1, display: 'flex', gap: '60px', padding: '0 60px', overflowY: 'auto' }}>
              
              {/* Left Column: Categories */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ 
                  fontSize: '36px', 
                  textAlign: 'center', 
                  color: 'black',
                  marginBottom: '20px', 
                  borderBottom: '3px dashed rgba(0,0,0,0.2)', 
                  paddingBottom: '10px' 
                }}>
                  CATÉGORIES
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {categories.map(cat => (
                    <div key={cat} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      backgroundColor: 'rgba(255,255,255,0.7)', 
                      padding: '12px 20px', 
                      borderRadius: '16px', 
                      border: '3px solid black', 
                      gap: '16px' 
                    }}>
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '8px', 
                        border: '3px solid black', 
                        backgroundColor: CATEGORY_COLORS[cat] || '#888' 
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
                          fontSize: '20px', 
                          fontWeight: 'bold', 
                          color: 'black',
                          width: '100%'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Questions & Tags */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ 
                  fontSize: '36px', 
                  textAlign: 'center', 
                  color: 'black',
                  marginBottom: '20px', 
                  borderBottom: '3px dashed rgba(0,0,0,0.2)', 
                  paddingBottom: '10px' 
                }}>
                  QUESTIONS & TAGS
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {questionOrder.map(q => {
                    const color = questionColors[q] || '#888'
                    return (
                      <div key={q} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        backgroundColor: 'rgba(255,255,255,0.7)', 
                        padding: '12px 20px', 
                        borderRadius: '16px', 
                        border: '3px solid black', 
                        gap: '16px' 
                      }}>
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '8px', 
                          border: '3px solid black', 
                          backgroundColor: color 
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
                            fontSize: '20px', 
                            fontWeight: 'bold', 
                            color: 'black',
                            width: '100%'
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* Actions Footer */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', padding: '30px' }}>
              <button
                onClick={onClose}
                style={{ 
                  padding: '12px 40px', 
                  borderRadius: '16px', 
                  backgroundColor: '#444', 
                  color: 'white', 
                  fontSize: '32px', 
                  fontFamily: "'Jersey 15', sans-serif", 
                  border: '4px solid black', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 0px rgba(0,0,0,1)'
                }}
              >
                ANNULER
              </button>
              <button
                onClick={handleConfirm}
                disabled={!hasChanges}
                style={{ 
                  padding: '12px 40px', 
                  borderRadius: '16px', 
                  backgroundColor: hasChanges ? 'white' : 'rgba(255,255,255,0.4)', 
                  color: hasChanges ? 'black' : 'rgba(0,0,0,0.4)', 
                  fontSize: '32px', 
                  fontFamily: "'Jersey 15', sans-serif", 
                  border: hasChanges ? '4px solid black' : '4px solid rgba(0,0,0,0.2)', 
                  cursor: hasChanges ? 'pointer' : 'not-allowed',
                  boxShadow: hasChanges ? '0 4px 0px rgba(0,0,0,1)' : 'none',
                  transform: hasChanges ? 'translateY(-2px)' : 'none'
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

