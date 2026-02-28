import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { CarouselGrid } from './components/CarouselGrid'
import { WalletModal } from './components/WalletModal'
import { QuestModal } from './components/QuestModal'
import { HeartFAB } from './components/HeartFAB'

// Import Icons
import wikiIcon from './assets/icons/wiki.png'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Available categories for the application */
const CATEGORIES = ['Partenaires', 'Culture', 'Clubs', 'Trésorie', 'Atelier']

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

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
        style={{ bottom: '48px', right: '3%' }}
      >
        <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
      </div>

      {/* Heart counter FAB - Support System */}
      <HeartFAB />
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
        style={{ ...cornerIconSize, bottom: '48px', left: '3%', backgroundColor: 'transparent', borderColor: 'transparent' }}
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

      <WalletModal
        isOpen={activeModal === 'token'}
        onClose={() => setActiveModal(null)}
      />

      <QuestModal
        isOpen={activeModal === 'support'}
        onClose={() => setActiveModal(null)}
      />

    </div>
  )
}

export default App
