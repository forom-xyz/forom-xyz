import ReactModal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import coromIcon from '../assets/icons/corom.png'

// =============================================================================
// TYPES
// =============================================================================

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
  pixels: number
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
// HELPER COMPONENTS
// =============================================================================

function CircularProgress({ percentage, color, title, size = 180, strokeWidth = 8 }: { percentage: number, color: string, title?: string, size?: number, strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center" style={{ gap: '5%' }}>
      {title && <span className="text-white text-[64px] font-jersey uppercase drop-shadow-md leading-none tracking-widest">{title}</span>}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            opacity="0.2"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Percentage text inside circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-[56px] font-jetbrains drop-shadow-sm font-bold tracking-tight">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

export function WalletModal({ isOpen, onClose, pixels }: WalletModalProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'community'>('personal')

  // Economy calculations
  const MAX_PIXELS = 607
  const mxPixels = 0 // Represents other users' pixels (mocked to 0 for now)
  const miPercentage = Math.min(100, (pixels / MAX_PIXELS) * 100)
  const mxPercentage = Math.min(100, (mxPixels / MAX_PIXELS) * 100)
  const totalPercentage = Math.min(100, ((pixels + mxPixels) / MAX_PIXELS) * 100)

  return (
    <AnimatePresence>
      {isOpen && (
        <ReactModal
          isOpen={isOpen}
          onRequestClose={onClose}
          style={modalStyles}
          closeTimeoutMS={200}
          contentLabel="PIXELS"
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
              backgroundColor: '#5FCB76',
              border: '8px solid black',
              borderRadius: '38px',
              color: 'white',
              overflow: 'hidden',
            }}
          >
            {/* Left Side Switch Buttons (Info / Community) */}
            <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 100, display: 'flex', gap: '16px' }}>
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
                aria-label="Info"
              >
                I
              </button>

              <button
                onClick={() => setActiveTab('community')}
                style={{ 
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FF4B4B',
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
                    e.currentTarget.style.backgroundColor = '#ff3333'
                    e.currentTarget.style.transform = 'translateY(2px)'
                    e.currentTarget.style.boxShadow = '0 2px 0px rgba(0,0,0,1)'
                    e.currentTarget.style.opacity = '1'
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== 'community') {
                    e.currentTarget.style.backgroundColor = '#FF4B4B'
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = '0 4px 0px rgba(0,0,0,1)'
                    e.currentTarget.style.opacity = '0.7'
                  }
                }}
                aria-label="Community"
              >
                C
              </button>
            </div>

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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex-1 overflow-auto" style={{ padding: '2rem 5%' }}>
              <div className="flex flex-col h-full">

                {/* Content */}
                {activeTab === 'personal' ? (
                  <div className="flex flex-col items-center justify-center font-jersey text-center h-full space-y-16 mt-4 pb-12 w-full">
                    <h1 className="text-white text-[80px] tracking-widest drop-shadow-[4px_4px_0px_rgba(0,0,0,0.5)] uppercase m-0 leading-none font-jersey" style={{ fontFamily: "'Jersey 15', sans-serif" }}>PIXEL WALLET</h1>
                    
                    <div className="flex items-center justify-center w-full max-w-4xl mx-auto h-[350px]">
                      {/* Left: Numbers display */}
                      <div className="flex-1 flex flex-col items-end border-r-[8px] border-white h-full justify-center" style={{ gap: '5%', paddingRight: '5%' }}>
                        <span className="text-[#a3e635] text-[80px] leading-none opacity-60 font-jersey" style={{ fontFamily: "'Jersey 15', sans-serif" }}>607</span>
                        <span className="text-[#FFD700] text-[180px] leading-none drop-shadow-[4px_4px_0px_rgba(0,0,0,0.3)] font-jersey min-w-[200px]" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
                          {pixels.toString().padStart(2, '0')}
                        </span>
                        <span className="text-[#a3e635] text-[80px] leading-none opacity-60 font-jersey" style={{ fontFamily: "'Jersey 15', sans-serif" }}>01</span>
                      </div>
                      
                      {/* Right: PX logo */}
                      <div className="flex-1 flex items-center justify-start h-full" style={{ paddingLeft: '5%' }}>
                        <span className="text-white text-[240px] leading-none drop-shadow-[8px_8px_0px_rgba(0,0,0,0.2)] tracking-tight font-jersey" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
                          PX
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-start font-jersey text-center h-full pt-4 pb-8 overflow-y-auto" style={{ fontFamily: "'Jersey 15', sans-serif" }}>
                    {/* Header */}
                    <div className="text-center mb-12 flex flex-col gap-6 w-full">
                        <h2 className="text-[72px] font-jersey leading-none drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] m-0 tracking-widest">
                          <span className="text-[#FF4B4B]">COMMUNITY</span> <span className="text-white">WALLET</span>
                        </h2>
                        <h3 className="text-[56px] font-jersey leading-none drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] m-0 tracking-wider">
                          <span className="text-[#FF4B4B]">607</span> <span className="text-white">PIXELS</span> <span className="text-[#FF4B4B]">MAX.</span>
                        </h3>
                    </div>

                    {/* Circular Graphs Row */}
                    <div className="flex justify-center flex-1 items-center w-full" style={{ gap: '2%' }}>
                      
                      {/* MI (My Impact) Graph */}
                      <div style={{ transform: 'translateY(-80px)' }}>
                        <CircularProgress 
                          title="MI" 
                          percentage={miPercentage} 
                          color="#FFD700" 
                          size={220} 
                          strokeWidth={12} 
                        />
                      </div>

                      {/* Main Corom Image with Total Percentage */}
                      <div className="relative flex flex-col items-center justify-end" style={{ width: '380px', height: '380px', margin: '0 20px' }}>
                        <img 
                          src={coromIcon} 
                          alt="Corom Wallet" 
                          className="w-full h-full object-contain drop-shadow-2xl z-10" 
                        />
                        <div 
                          className="absolute z-20 bg-white rounded-full flex items-center justify-center"
                          style={{ 
                            bottom: '12%', 
                            width: '90px', 
                            height: '90px',
                            boxShadow: '0 4px 0px rgba(0,0,0,0.2)'
                          }}
                        >
                          <span className="text-black font-jetbrains text-[28px] font-bold tracking-tight">
                            {Math.round(totalPercentage)}%
                          </span>
                        </div>
                      </div>

                      {/* MX (Others Impact) Graph */}
                      <div style={{ transform: 'translateY(-80px)' }}>
                        <CircularProgress 
                          title="MX" 
                          percentage={mxPercentage} 
                          color="#0066FF" 
                          size={220} 
                          strokeWidth={12} 
                        />
                      </div>

                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </ReactModal>
      )}
    </AnimatePresence>
  )
}
