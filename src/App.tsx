import { useState, useEffect } from 'react'
import ReactModal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { CarouselGrid } from './components/CarouselGrid'
import { SupportModal } from './components/SupportModal'

// Import Icons
import wikiIcon from './assets/icons/wiki.png'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Available categories for the application */
const CATEGORIES = ['Partenaires', 'Culture', 'Clubs', 'Trésorie', 'Atelier']

// =============================================================================
// MODAL STYLES
// =============================================================================

const tokenModalStyles: ReactModal.Styles = {
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
    width: '600px',
    height: 'auto',
    maxHeight: '90vh',
    padding: 0,
    border: 'none',
    background: 'transparent',
    overflow: 'visible',
    borderRadius: 0,
  },
}

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: 'spring' as const,
      damping: 25,
      stiffness: 300,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

/** Simple Modal Component */
function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <ReactModal
          isOpen={isOpen}
          onRequestClose={onClose}
          style={tokenModalStyles}
          closeTimeoutMS={200}
          contentLabel={title}
          shouldCloseOnOverlayClick={true}
          shouldCloseOnEsc={true}
          ariaHideApp={true}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full h-full rounded-none shadow-2xl flex flex-col transition-colors duration-300"
            style={{ 
              backgroundColor: 'var(--color-surface)', 
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)'
            }}
          >
            <div className="flex justify-between items-center p-8 pb-4">
              <h2 className="text-2xl font-bold font-['Montserrat']">{title}</h2>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer text-zinc-500 hover:bg-black/5 dark:text-zinc-400 dark:hover:bg-white/10 border border-zinc-300 dark:border-zinc-600"
                type="button"
                aria-label="Close modal"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto text-base p-8 pt-4" style={{ color: 'var(--color-text-secondary)' }}>
              {children}
            </div>
          </motion.div>
        </ReactModal>
      )}
    </AnimatePresence>
  )
}

/** Modern Theme Toggle Switch */
function ThemeToggle({ 
  isDark, 
  onToggle 
}: { 
  isDark: boolean
  onToggle: () => void 
}) {
  return (
    <motion.button
      onClick={onToggle}
      className="relative flex items-center justify-between rounded-full p-1 cursor-pointer"
      style={{
        width: '56px',
        height: '28px',
        backgroundColor: isDark ? '#3b82f6' : '#e5e7eb',
        border: '2px solid',
        borderColor: isDark ? '#2563eb' : '#d1d5db',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Sun icon */}
      <span className="text-xs" style={{ opacity: isDark ? 0.4 : 1 }}>☀️</span>
      {/* Moon icon */}
      <span className="text-xs" style={{ opacity: isDark ? 1 : 0.4 }}>🌙</span>
      {/* Toggle knob */}
      <motion.div
        className="absolute rounded-full bg-white shadow-md"
        style={{ width: '20px', height: '20px', top: '2px' }}
        animate={{ left: isDark ? '32px' : '2px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

function App() {
  const [activeCategory, setActiveCategory] = useState('Clubs')
  const [activeModal, setActiveModal] = useState<'token' | 'support' | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Map categories to sidebar items
  const sidebarItems = CATEGORIES.map((category) => ({
    id: category,
    label: category,
    disabled: false,
  }))

  const cornerIconStyle = "rounded-full overflow-hidden cursor-pointer shadow-lg hover:shadow-xl border-2 border-transparent transition-all flex items-center justify-center"
  const cornerIconSize = { width: '64px', height: '64px' }

  return (
    <div 
      className="h-screen overflow-hidden relative transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Theme Toggle - Bottom Right */}
      <div 
        className="fixed z-50 flex items-center gap-2"
        style={{ bottom: '32px', right: '32px' }}
      >
        <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
      </div>
      <Header 
        onTokenClick={() => setActiveModal('token')}
        onSupportClick={() => setActiveModal('support')}
        isDark={isDarkMode}
      />

      {/* --------------------------------------------------------------------------
          Corner Icons
      -------------------------------------------------------------------------- */}

      {/* Bottom Left - Wiki */}
      <motion.a
        href="https://wiki.etsmtl.club/share/8cnz7bzxf3/p/services-offerts-j8LxYBFxrs"
        target="_blank"
        rel="noopener noreferrer"
        className={`absolute z-50 ${cornerIconStyle}`}
        style={{ ...cornerIconSize, bottom: '32px', left: '32px', backgroundColor: 'transparent', borderColor: 'transparent' }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <img src={wikiIcon} alt="Wiki" className="w-3/4 h-3/4 object-contain" />
      </motion.a>

      {/* --------------------------------------------------------------------------
          Main Layout
      -------------------------------------------------------------------------- */}

      <Sidebar
        items={sidebarItems}
        activeId={activeCategory}
        onSelect={setActiveCategory}
        isDark={isDarkMode}
      />

      <CarouselGrid
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        isDark={isDarkMode}
      />

      {/* --------------------------------------------------------------------------
          Modals
      -------------------------------------------------------------------------- */}

      <Modal 
        isOpen={activeModal === 'token'} 
        onClose={() => setActiveModal(null)}
        title="The FOROM Ecosystem"
      >
        <main className="flex-1 space-y-6">
          {/* Section Pixels */}
          <section>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl font-bold font-jersey text-[#FFD700]">$</span>
              <h3 className="text-xl font-semibold text-black dark:text-white">Les Pixels (Monnaie)</h3>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
              Les Pixels sont la devise transactionnelle de FOROM. Vous gagnez des Pixels pour 
              chaque mémo que vous contribuez à la grille. C'est le moteur de notre économie 
              interactive : utilisez-les pour soutenir des projets, interagir avec la communauté 
              ou débloquer de futures fonctionnalités.
            </p>
          </section>
        </main>
      </Modal>

      <SupportModal 
        isOpen={activeModal === 'support'} 
        onClose={() => setActiveModal(null)}
      />

    </div>
  )
}

export default App
