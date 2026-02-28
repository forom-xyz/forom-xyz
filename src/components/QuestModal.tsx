import ReactModal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'

// =============================================================================
// TYPES
// =============================================================================

interface QuestModalProps {
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

export function QuestModal({ isOpen, onClose }: QuestModalProps) {
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
              border: '8px solid black',
              borderRadius: '38px',
              color: 'white',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={onClose}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-[#FF4B4B] hover:bg-[#ff3333] transition-colors z-10"
              type="button"
              aria-label="Close modal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex-1 overflow-auto" style={{ padding: '2rem 5%' }}>
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                  <div className="flex-1 pb-4">
                    <h2 className="font-montserrat font-black text-white text-2xl tracking-wide">Défis de la communauté</h2>
                  </div>
                  <div className="flex-shrink-0 px-4">
                    <h1 className="text-white text-[100px] tracking-widest drop-shadow-md m-0 leading-none" style={{ fontFamily: "'Jersey 15', sans-serif" }}>QUESTS</h1>
                  </div>
                  <div className="flex-1 text-right pb-4">
                    <h2 className="font-montserrat font-black text-white text-2xl tracking-wide">Community Quests</h2>
                  </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-2 gap-16 text-white font-jetbrains text-sm leading-relaxed">
                  {/* Left Column - French */}
                  <div className="space-y-6">
                    <h3 className="font-montserrat font-bold text-white text-lg">Comment ça marche</h3>
                    <p>
                      Les quêtes sont des défis collectifs lancés par la communauté FOROM. Chaque défi accompli contribue à l'évolution de la plateforme et récompense les participants.
                    </p>
                    <ul className="space-y-4">
                      <li><span className="font-bold">• Défis actifs :</span> Chaque semaine, de nouvelles quêtes sont publiées dans les différentes catégories de la grille. Consultez régulièrement pour ne rien manquer.</li>
                      <li><span className="font-bold">• Gagner des pixels :</span> Compléter une quête vous rapporte des pixels, la monnaie de la plateforme. Plus le défi est complexe, plus la récompense est élevée.</li>
                      <li><span className="font-bold">• Quêtes collaboratives :</span> Certaines quêtes nécessitent la coopération de plusieurs membres. Formez des équipes et cumulez vos efforts pour décrocher les récompenses les plus rares.</li>
                      <li><span className="font-bold">• Classement :</span> Les contributeurs les plus actifs apparaissent dans le classement mensuel et reçoivent des bonus exclusifs en pixels.</li>
                    </ul>
                  </div>

                  {/* Right Column - English */}
                  <div className="space-y-6">
                    <h3 className="font-montserrat font-bold text-white text-lg text-right">How It Works</h3>
                    <p>
                      Quests are collective challenges launched by the FOROM community. Every completed challenge contributes to the platform's growth and rewards participants.
                    </p>
                    <ul className="space-y-4">
                      <li><span className="font-bold">• Active Challenges:</span> New quests are published weekly across the grid's categories. Check back regularly so you never miss an opportunity.</li>
                      <li><span className="font-bold">• Earn Pixels:</span> Completing a quest earns you pixels, the platform's currency. The more complex the challenge, the higher the reward.</li>
                      <li><span className="font-bold">• Collaborative Quests:</span> Some quests require cooperation from multiple members. Form teams, combine your efforts, and unlock the rarest rewards together.</li>
                      <li><span className="font-bold">• Leaderboard:</span> The most active contributors appear on the monthly leaderboard and receive exclusive pixel bonuses.</li>
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
