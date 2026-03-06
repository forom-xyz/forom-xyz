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
import { Settings } from 'lucide-react'

import { SettingsModal } from './components/SettingsModal'
import { QUESTION_ORDER, QUESTION_COLORS } from './data/memories'

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Initialize customizable labels
  const [categoryLabels, setCategoryLabels] = useState<Record<string, string>>(() => {
    const labels: Record<string, string> = {}
    CATEGORIES.forEach(c => labels[c] = c)
    return labels
  })
  
  const [questionLabels, setQuestionLabels] = useState<Record<string, string>>(() => {
    const labels: Record<string, string> = {}
    QUESTION_ORDER.forEach(q => labels[q] = q)
    return labels
  })

  // Detect Supermoderator (localhost)
  const isSuperModerator = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

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
    label: categoryLabels[category] || category,
    disabled: false,
  }))

  const cornerIconStyle = "rounded-full overflow-hidden cursor-pointer shadow-lg hover:shadow-xl border-2 border-transparent transition-all flex items-center justify-center"
  const cornerIconSize = { width: '64px', height: '64px' }

  return (
    <div 
      className="h-screen overflow-hidden relative transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Theme Toggle & Supermoderator Settings - Bottom Right */}
      <div 
        className="fixed z-50 flex items-center gap-4"
        style={{ bottom: '48px', right: '3%' }}
      >
        {isSuperModerator && (
          <motion.button
            whileHover={{ scale: 1.1, rotate: 45 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center justify-center p-2 rounded-full cursor-pointer shadow-md bg-white border-2 border-transparent transition-colors"
            style={{ 
              color: isDarkMode ? '#1a1a1a' : '#1a1a1a',
              backgroundColor: isDarkMode ? '#e5e7eb' : '#ffffff' 
            }}
            aria-label="Supermoderator Settings"
          >
            <Settings size={28} />
          </motion.button>
        )}
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
        questionLabels={questionLabels}
      />

      {/* --------------------------------------------------------------------------
          Modals
      -------------------------------------------------------------------------- */}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(newCats, newTags) => {
          setCategoryLabels(newCats)
          setQuestionLabels(newTags)
          console.log('Saved settings:', newCats, newTags)
        }}
        currentCategoryLabels={categoryLabels}
        currentQuestionLabels={questionLabels}
        categories={CATEGORIES}
        questionOrder={QUESTION_ORDER}
        questionColors={QUESTION_COLORS}
      />

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
