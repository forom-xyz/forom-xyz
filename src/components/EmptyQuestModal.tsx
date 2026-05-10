import { useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Memory } from '../data/memories'
import tokensIcon from '../assets/icons/tokens.svg'

export interface EmptyQuestModalProps {
  isOpen: boolean
  onClose: () => void
  memory: Memory | null
  categoryLabel?: string
  tagLabel?: string
  onTokenClick?: () => void
}

export function EmptyQuestModal({
  isOpen,
  onClose,
  memory,
  categoryLabel,
  tagLabel,
  onTokenClick,
}: EmptyQuestModalProps) {

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen || !memory) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[35] flex flex-col items-center justify-center bg-black/40"
          onClick={onClose}
        >
          {/* Main Container - Centered */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative flex flex-col items-center justify-center text-center bg-[#D9D9D9] w-[80vw] h-[65vh] max-w-[1000px] border-[8px] md:border-[12px] border-[#747474] rounded-[24px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ boxSizing: 'border-box' }}
          >
            {/* Close Button top-right */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                backgroundColor: 'white',
                color: 'black',
                border: '3px solid black',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 100,
                pointerEvents: 'auto',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              <X size={20} strokeWidth={3} />
            </button>

            {/* TOP INFOS */}
            <div className="absolute top-[12%] left-0 w-full flex flex-col items-center justify-center gap-1 uppercase font-bold text-[#111111]" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(10px, 1.2vw, 14px)' }}>
              <div>[ CATEGORY: {categoryLabel || memory.category} ]</div>
              <div>[ TAG: {tagLabel || memory.question} ]</div>
            </div>

            {/* CENTER TEXT */}
            <div className="flex-1 flex items-center justify-center">
              <h2 
                className="text-black uppercase tracking-widest drop-shadow-sm font-bold m-0 leading-none"
                style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(50px, 12vw, 150px)' }}
              >
                AUCUNE QUÊTE
              </h2>
            </div>

            {/* BOTTOM INFOS */}
            <div className="absolute bottom-[10%] left-0 w-full flex flex-col items-center justify-center gap-3">
              <span className="text-black font-semibold text-center tracking-normal" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(10px, 1vw, 12px)' }}>
                Allez dans le terminal<br />to
                <span className="flex justify-center w-full mt-2">
                  <VChevron />
                </span>
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTokenClick) {
                    onTokenClick()
                  }
                }}
                className="hover:scale-110 transition-transform cursor-pointer outline-none mt-2 relative"
                style={{ background: 'transparent', border: 'none', padding: 0, zIndex: 100, pointerEvents: 'auto' }}
              >
                <img 
                  src={tokensIcon} 
                  alt="Token" 
                  className="w-[48px] h-[48px] md:w-[64px] md:h-[64px] object-contain drop-shadow-md"
                />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function VChevron() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 2L8 8L13.5 2" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
