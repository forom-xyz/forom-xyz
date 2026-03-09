import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LoadingScreen } from './components/LoadingScreen'
import { ForomLobby } from './components/ForomLobby'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { CarouselGrid } from './components/CarouselGrid'
import { WalletModal } from './components/WalletModal'
import { QuestModal } from './components/QuestModal'
import { UserModal } from './components/UserModal'
import type { Quest } from './components/QuestModal'
import { HeartFAB } from './components/HeartFAB'

// Import Icons
import wikiIcon from './assets/icons/wiki.png'
import { Settings } from 'lucide-react'

import { SettingsModal } from './components/SettingsModal'
import { QUESTION_ORDER, QUESTION_COLORS } from './data/memories'

// Leveling helper — 10 XP per quest, 10 quests = lvl 1 (100 XP per level)
export function getLevelAndTitle(xp: number) {
  const level = Math.floor(xp / 100)
  let title = 'Citoyen'
  if (level >= 100) title = 'Légende'
  else if (level >= 75) title = 'Soul'
  else if (level >= 50) title = 'Lumière'
  else if (level >= 25) title = 'Mage'
  
  return { level, title }
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Available categories for the application */
const CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

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
  const [isLoading, setIsLoading] = useState(true)
  const [isInLobby, setIsInLobby] = useState(true)
  const [activeCategory, setActiveCategory] = useState('E')
  const [activeModal, setActiveModal] = useState<'token' | 'support' | 'user' | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isRubixView, setIsRubixView] = useState(false)

  // Economy & Leveling State
  const [pixels, setPixels] = useState(0)
  const [xp, setXp] = useState(0)
  const [personalQuests, setPersonalQuests] = useState<Quest[]>([])
  const [acceptedQuestId, setAcceptedQuestId] = useState<string | null>(null)

  const { level, title } = getLevelAndTitle(xp)

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

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />
  }

  if (isInLobby) {
    return <ForomLobby onConfirm={() => setIsInLobby(false)} />
  }

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
        onUserClick={() => setActiveModal('user')}
        onRubixClick={() => setIsRubixView(prev => !prev)}
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
        isRubixView={isRubixView}
        onCloseRubix={() => setIsRubixView(false)}
        acceptedQuestId={acceptedQuestId}
        onQuestComplete={(id) => {
          const quest = personalQuests.find(q => q.id === id)
          if (quest) {
            setPixels(p => Math.round((p + 2.07) * 100) / 100)
            setXp(x => x + 10)
            setPersonalQuests(prev => prev.filter(q => q.id !== id))
            setAcceptedQuestId(null)
          }
        }}
        questionLabels={questionLabels}
        personalQuests={personalQuests}
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

      <UserModal
        isOpen={activeModal === 'user'}
        onClose={() => setActiveModal(null)}
        pixels={pixels}
        level={level}
        title={title}
        xp={xp}
        isDarkMode={isDarkMode}
      />

      <WalletModal
        isOpen={activeModal === 'token'}
        onClose={() => setActiveModal(null)}
        pixels={pixels}
      />

      <QuestModal
        isOpen={activeModal === 'support'}
        onClose={() => setActiveModal(null)}
        personalQuests={personalQuests}
        acceptedQuestId={acceptedQuestId}
        questionLabels={questionLabels}
        categories={CATEGORIES as unknown as string[]}
        onCreateQuest={(title, reward, question, category) => {
          setPersonalQuests(prev => {
            if (prev.length >= 100) return prev
            return [...prev, { id: Date.now().toString(), title, reward, question, category }]
          })
        }}
        onAcceptQuest={(id) => setAcceptedQuestId(id)}
        onCompleteQuest={(id) => {
          const quest = personalQuests.find(q => q.id === id)
          if (quest) {
            // Fixed reward: 2.07 pixels + 10 XP per completed quest
            setPixels(p => Math.round((p + 2.07) * 100) / 100)
            setXp(x => x + 10)
            setPersonalQuests(prev => prev.filter(q => q.id !== id))
            if (acceptedQuestId === id) setAcceptedQuestId(null)
          }
        }}
        onCancelQuest={(id) => {
          if (acceptedQuestId === id) setAcceptedQuestId(null)
        }}
      />

    </div>
  )
}

export default App

