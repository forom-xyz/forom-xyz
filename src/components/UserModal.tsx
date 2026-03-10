import ReactModal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'
import userIcon from '../assets/icons/user.png'
import { FOROM_COLOR_MAP, type ForomColor } from './ChooseColorScreen'

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
}

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
    width: '1100px',
    maxWidth: '95vw',
    height: '600px',
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

export function UserModal({ isOpen, onClose, pixels, level, foromColor, mission }: UserModalProps) {
  // Empty quest list as requested without mockup data
  const completedQuests: Array<{ tag: string, tagColor: string, title: string, px: string, active: boolean }> = []

  // Mock progress calculation (e.g. 20%)
  const progressPercentage = 20

  return (
    <AnimatePresence>
      {isOpen && (
        <ReactModal
          isOpen={isOpen}
          onRequestClose={onClose}
          style={modalStyles}
          closeTimeoutMS={200}
          contentLabel="USER PROFILE"
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
              backgroundColor: '#D9D9D9',
              border: '6px solid black',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 8px 0px rgba(0,0,0,1)'
            }}
          >
            {/* Custom scrollbar styles */}
            <style>{`
              .quest-scroll::-webkit-scrollbar {
                width: 2px;
              }
              .quest-scroll::-webkit-scrollbar-track {
                background: transparent;
              }
              .quest-scroll::-webkit-scrollbar-thumb {
                background: white;
                border-radius: 2px;
              }
            `}</style>

            <button
              onClick={onClose}
              style={{ 
                position: 'absolute', 
                top: '16px', 
                right: '24px', 
                zIndex: 100,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FF4B4B',
                border: '3px solid black',
                cursor: 'pointer',
                boxShadow: '0 4px 0px rgba(0,0,0,1)'
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Header Title */}
            <div className="absolute top-6 w-full flex justify-center z-10 pointer-events-none">
              <h1 className="text-[54px] m-0 drop-shadow-sm uppercase" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
                <span className="text-[#333333]">XYLO</span> <span className="text-[#666666]">LOBBY</span>
              </h1>
            </div>

            {/* Main Content Layout */}
            <div className="flex w-full h-full pt-[110px] pb-12 px-10">
               
               {/* LEFT COLUMN: PX */}
               <div className="flex-1 flex flex-col items-center justify-start z-20">
                  <div className="text-[#5FCB76] text-[160px] leading-[0.85] drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)] tracking-tighter" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
                    PX
                  </div>
                  <div className="text-[#FFD700] text-[100px] leading-none drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)] mt-4" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
                    {pixels.toFixed(2)}
                  </div>
               </div>

               {/* CENTER COLUMN: User Profile */}
               <div className="flex-[1.4] flex flex-col items-center justify-start z-20 relative pt-2">
                  <div className="w-[160px] h-[160px] rounded-full border-[6px] border-black bg-white flex items-center justify-center overflow-hidden mb-6 shadow-[0_4px_0px_rgba(0,0,0,1)]">
                     <img src={userIcon} alt="User Profile" className="w-[60%] h-[60%] object-contain opacity-90" />
                  </div>

                  {/* Forom color badge */}
                  {foromColor && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '10px',
                    }}>
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: FOROM_COLOR_MAP[foromColor].bg,
                        border: '2px solid black',
                        flexShrink: 0,
                      }} />
                      <span style={{
                        fontFamily: "'Jersey 15', sans-serif",
                        fontSize: '22px',
                        color: 'white',
                        letterSpacing: '0.12em',
                      }}>
                        {FOROM_COLOR_MAP[foromColor].label}
                      </span>
                    </div>
                  )}

                  {/* Mission */}
                  {mission && (
                    <div style={{
                      fontFamily: "'Jersey 15', sans-serif",
                      fontSize: '16px',
                      color: 'rgba(255,255,255,0.6)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      maxWidth: '220px',
                      marginBottom: '10px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {mission}
                    </div>
                  )}

                  <div className="text-white text-[32px] tracking-[0.5em] mb-4 drop-shadow-sm ml-4 whitespace-nowrap" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
                    N I V E A U
                  </div>
                  
                  <div className="text-white text-[100px] leading-[0.8] mb-8 drop-shadow-sm" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
                    {level}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-[280px] h-[6px] bg-white relative overflow-hidden flex items-center mb-8 shadow-sm rounded-full">
                     <div className="h-full bg-[#0066FF]" style={{ width: `${progressPercentage}%` }}></div>
                  </div>

                  <div className="text-white text-[32px] tracking-[0.5em] drop-shadow-sm ml-4 whitespace-nowrap" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
                    C I T O Y E N
                  </div>
               </div>

               {/* RIGHT COLUMN: XP and Quests */}
               <div className="flex-1 flex flex-col items-center justify-start z-20">
                  <div className="text-[#FFB020] text-[160px] leading-[0.85] drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)] tracking-tighter" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
                    XP
                  </div>

                  {/* Scrollable list area */}
                  <div className="w-full flex-1 overflow-y-auto quest-scroll pr-4 pt-8 pb-4 flex flex-col items-center">
                     {completedQuests.length > 0 ? (
                       <div className="flex flex-col gap-4 w-full">
                          {completedQuests.map((quest, idx) => (
                             <div 
                               key={idx} 
                               className="flex flex-row items-center justify-between border-[4px] border-black rounded-[16px] px-4 py-3 w-full"
                               style={{ 
                                 backgroundColor: quest.active ? '#FFA639' : '#ffffff',
                                 boxShadow: '0 4px 0px rgba(0,0,0,0.8)',
                                 transition: 'all 0.15s ease'
                               }}
                             >
                                <div className="flex flex-row items-center gap-4 flex-1 overflow-hidden">
                                  {/* Number Tag */}
                                  <div 
                                    className="flex items-center justify-center rounded-[8px] border-[2px] border-black px-3 py-1 flex-shrink-0"
                                    style={{ backgroundColor: quest.tagColor, fontFamily: "'Jersey 15', sans-serif", fontSize: '20px', color: 'white', letterSpacing: '0.06em' }}
                                  >
                                    {quest.tag}
                                  </div>
                                  <div className="text-black uppercase truncate" style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '26px', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                                    {quest.title}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                                  <span style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '20px', color: 'rgba(0,0,0,0.6)' }}>
                                    {quest.px}
                                  </span>
                                  {quest.active && (
                                    <span style={{
                                      fontFamily: "'Jersey 15', sans-serif",
                                      fontSize: '16px',
                                      backgroundColor: 'black',
                                      color: '#FFA639',
                                      borderRadius: '6px',
                                      padding: '2px 8px',
                                      letterSpacing: '0.06em',
                                    }}>
                                      ACTIF
                                    </span>
                                  )}
                                </div>
                             </div>
                          ))}
                       </div>
                     ) : (
                       <div className="flex flex-col items-center justify-center opacity-40 mt-12">
                         <span style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '32px', color: 'rgba(0,0,0,0.6)', letterSpacing: '0.1em' }}>
                            AUCUNE QUÊTE
                         </span>
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
