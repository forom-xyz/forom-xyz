import ReactModal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'

// =============================================================================
// TYPES
// =============================================================================

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
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

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
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
                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                  <div className="flex-1 pb-4">
                    <h2 className="font-montserrat font-black text-[#FFD700] text-2xl tracking-wide">L'économie des pixels</h2>
                  </div>
                  <div className="flex-shrink-0 px-4">
                    <h1 className="text-white text-[100px] tracking-widest drop-shadow-md m-0 leading-none" style={{ fontFamily: "'Jersey 15', sans-serif" }}>PIXELS</h1>
                  </div>
                  <div className="flex-1 text-right pb-4">
                    <h2 className="font-montserrat font-black text-[#FFD700] text-2xl tracking-wide">The Pixel Economy</h2>
                  </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-2 gap-16 text-white font-jetbrains text-sm leading-relaxed">
                  {/* Left Column - French */}
                  <div className="space-y-6">
                    <h3 className="font-montserrat font-bold text-white text-lg">Connaissances et récompenses</h3>
                    <p>
                      Dans la grille interactive FOROM, l'économie est conçue pour encourager les contributions éducatives et le partage de connaissances.
                    </p>
                    <ul className="space-y-4">
                      <li><span className="font-bold">• Les couleurs comme catégories :</span> La grille est organisée par couleurs distinctes, chaque couleur représentant une catégorie, un sujet ou un thème spécifique. Cela fait du tableau une carte visuellement organisée de différents sujets.</li>
                      <li><span className="font-bold">• Gagner des pixels :</span> Les pixels servent de monnaie officielle à la plateforme. Les utilisateurs gagnent cette monnaie en contribuant activement à la communauté - plus précisément, en créant et en publiant des tutoriels utiles au sein des catégories de la grille.</li>
                      <li><span className="font-bold">• Les 9 super modérateurs :</span> Les neuf super modérateurs agissent comme les gestionnaires économiques de la plateforme. Plutôt que de rivaliser pour l'espace, ils supervisent le système de récompenses. Chaque modérateur est responsable de définir un catalogue unique de « cadeaux » ou d'avantages.</li>
                      <li><span className="font-bold">• Le système d'échange :</span> Une fois qu'un utilisateur a gagné des pixels grâce à ses tutoriels, il peut s'adresser aux super modérateurs pour échanger sa monnaie. Comme les modérateurs gèrent leurs propres récompenses, les utilisateurs peuvent magasiner et échanger leurs pixels contre les cadeaux spécifiques qui les intéressent le plus.</li>
                    </ul>
                  </div>

                  {/* Right Column - English */}
                  <div className="space-y-6">
                    <h3 className="font-montserrat font-bold text-white text-lg text-right">Knowledge Creation and Rewards</h3>
                    <p>
                      In the FOROM interactive grid, the economy is built around incentivizing educational contributions and knowledge sharing.
                    </p>
                    <ul className="space-y-4">
                      <li><span className="font-bold">• Colors as Categories:</span> The grid is organized by distinct colors, with each color representing a specific category, subject, or theme. This makes the board a visually organized map of different topics.</li>
                      <li><span className="font-bold">• Earning Pixels:</span> Pixels serve as the platform's official currency. Users earn this currency by actively contributing to the community-specifically, by creating and publishing helpful tutorials within the grid's categories.</li>
                      <li><span className="font-bold">• The 9 Super Moderators:</span> The nine super moderators act as the economic managers of the platform. Rather than competing for space, they oversee the reward system. Each moderator is responsible for defining a unique catalog of "gifts" or perks.</li>
                      <li><span className="font-bold">• The Exchange System:</span> Once a user earns pixels from their tutorials, they can approach the super moderators to trade their currency. Because the moderators curate their own rewards, users can shop around and exchange their pixels for the specific gifts that appeal to them the most.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </ReactModal>
      )}
    </AnimatePresence>
  )
}
