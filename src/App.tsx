import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LoadingScreen } from './components/LoadingScreen'
import { ForomLobby } from './components/ForomLobby'
import { ForomCreationFlow } from './components/ForomCreationFlow'
import { type ForomColor } from './utils/foromColors'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { CarouselGrid } from './components/CarouselGrid'
import { WalletModal } from './components/WalletModal'
import { QuestModal } from './components/QuestModal'
import { UserModal } from './components/UserModal'
import type { Quest } from './components/QuestModal'
import { HeartFAB } from './components/HeartFAB'
import { RomapModal } from './components/RomapModal'

// Import Icons
import wikiIcon from './assets/icons/wiki.png'
import rubixViewIcon from './assets/icons/rubix_view.svg'

import { SettingsModal } from './components/SettingsModal'
import { SettingsFAB } from './components/SettingsFAB'
import { QUESTION_ORDER, QUESTION_COLORS } from './data/memories'
import { DEFAULT_CATEGORY_LABELS, DEFAULT_QUESTION_LABELS } from './data/forom-config'
import { DEFAULT_PUBLIC_FOROM_MISSION, getInitialQuestsForMission } from './data/quests'

import { useAppStore } from './stores/useAppStore'
import { useModalStore } from './stores/useModalStore'
import { getLevelAndTitle } from './utils/leveling'

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
  const { phase, setPhase } = useAppStore();
  const modals = useModalStore();

  const [isLoading, setIsLoading] = useState(true)
  const [isPhantomMode, setIsPhantomMode] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [mission, setMission] = useState(DEFAULT_PUBLIC_FOROM_MISSION)
  const [foromColor, setForomColor] = useState<ForomColor | null>('creation')
  const [foromRules] = useState<string[]>(['Honnêteté', '', '', '', '', '', '', '', '', 'Curiosité'])
  const [foromFriendKeys] = useState<string[]>(() =>
    Array.from({ length: 8 }, () => 'FRM-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase())
  )
  const [activeCategory, setActiveCategory] = useState('E')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isRubixView, setIsRubixView] = useState(false)

  // Economy & Leveling State
  const [pixels, setPixels] = useState(0)
  const [inVault, setInVault] = useState(0) // 5000 reserved
  const [xp, setXp] = useState(0)
  const [personalQuests, setPersonalQuests] = useState<Quest[]>(() => getInitialQuestsForMission(DEFAULT_PUBLIC_FOROM_MISSION))
  const [acceptedQuestId, setAcceptedQuestId] = useState<string | null>(null)

  const completedFoundationalQuestCount = personalQuests.filter(q => q.completed).length
  const seasonPhase: 'V1' | 'V2' | 'V3' = completedFoundationalQuestCount >= 100 ? 'V2' : 'V1'

  const { level, title } = getLevelAndTitle(xp)

  // Initialize customizable labels from the default config.
  const [categoryLabels, setCategoryLabels] = useState<Record<string, string>>(
    () => ({ ...DEFAULT_CATEGORY_LABELS }),
  )

  const [questionLabels, setQuestionLabels] = useState<Record<string, string>>(
    () => ({ ...DEFAULT_QUESTION_LABELS }),
  )

  // Detect Supermoderator
  const isSuperModerator = currentUser === 'xylo'

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
    return <LoadingScreen onComplete={() => {
      setIsLoading(false);
      setPhase('lobby');
    }} />
  }

  if (phase === 'lobby') {
    return (
      <ForomLobby 
        onConfirm={() => setPhase('creation-flow')} 
        onSkip={() => {
          setIsPhantomMode(!currentUser)
          setPhase('grid')
        }}
        onSignIn={(username) => {
          setCurrentUser(username)
          setIsPhantomMode(false)
          if (username === 'xylo') {
            setPixels(500)
            setInVault(5000)
          }
        }}
        currentUser={currentUser}
      />
    )
  }

  if (phase === 'creation-flow') {
    return (
      <ForomCreationFlow
        onComplete={(m, color) => {
          setMission(m)
          setForomColor(color)
          setPhase('grid')
          setIsPhantomMode(false)
          // A user-created forom always starts with the base A–J / 0–9 format.
          // Only the main public forom uses the supermoderator's saved config.
          setCategoryLabels(Object.fromEntries(CATEGORIES.map(c => [c, c])))
          setQuestionLabels(Object.fromEntries(QUESTION_ORDER.map(q => [q, q])))
          if (currentUser === 'xylo') {
            setPixels(500);    // 500 px for all supermods initially
            setInVault(5000);  // 5000 reserved (not used visually yet)
          } else {
            setPixels(500);    // members start with 500
          }
        }}
        onBack={() => setPhase('lobby')}
      />
    )
  }

  return (
    <div 
      className="h-screen overflow-hidden relative transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Right Column Stack: Theme, Settings */}
      <div 
        className="fixed z-50 flex flex-col items-center"
        style={{ bottom: '48px', right: '3%', gap: '3vh' }}
      >
        <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
        {isSuperModerator && (
          <SettingsFAB onClick={modals.openSettings} />
        )}
      </div>

      <Header 
        onTokenClick={modals.openWallet}
        onSupportClick={modals.openQuest}
        onUserClick={modals.openUser}
        onRomapClick={modals.openRomap}
        seasonPhase={seasonPhase}
        onLobbyClick={() => {
          setPhase('lobby')
          // Restore the main forom's supermoderator-configured labels when
          // returning to lobby so the user can re-enter the main forom correctly.
          setCategoryLabels({ ...DEFAULT_CATEGORY_LABELS })
          setQuestionLabels({ ...DEFAULT_QUESTION_LABELS })
          if (isPhantomMode) {
            setIsPhantomMode(false)
          }
        }}
        isDark={isDarkMode}
        mission={mission}
        isPhantom={isPhantomMode}
      />

      {/* --------------------------------------------------------------------------
          Corner Icons
      -------------------------------------------------------------------------- */}

      {/* Bottom Left - Heart + Wiki stacked */}
      <div
        className="fixed z-50 flex flex-col items-center"
        style={{ bottom: '48px', left: '3%', gap: '3vh' }}
      >
        <HeartFAB fixed={false} />
        <motion.a
          href="https://wiki.etsmtl.club/share/8cnz7bzxf3/p/services-offerts-j8LxYBFxrs"
          target="_blank"
          rel="noopener noreferrer"
          className={`${cornerIconStyle}`}
          style={{ ...cornerIconSize, backgroundColor: 'transparent', borderColor: 'transparent' }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={wikiIcon} alt="Wiki" className="w-3/4 h-3/4 object-contain" />
        </motion.a>
      </div>

      {/* Bottom Center - Rubix View Toggle */}
      <div 
        className="fixed z-50 flex justify-center items-center pointer-events-none"
        style={{ bottom: '48px', left: '0', right: '0' }}
      >
        <motion.button
          onClick={() => setIsRubixView(prev => !prev)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center shrink-0 pointer-events-auto shadow-lg bg-black/20 dark:bg-white/10 backdrop-blur-sm rounded-full p-2"
          style={{ width: '56px', height: '56px', border: '1px solid rgba(255,255,255,0.1)' }}
          title="Toggle Rubix View"
          aria-label="Toggle Rubix View"
        >
          <img src={rubixViewIcon} alt="Rubix View" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        </motion.button>
      </div>

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
        isOpen={modals.isSettingsOpen}
        onClose={modals.closeSettings}
        onSave={(newCats, newTags) => {
          setCategoryLabels(newCats)
          setQuestionLabels(newTags)
        }}
        currentCategoryLabels={categoryLabels}
        currentQuestionLabels={questionLabels}
        categories={CATEGORIES}
        questionOrder={QUESTION_ORDER}
        questionColors={QUESTION_COLORS}
      />

      <UserModal
        isOpen={modals.isUserOpen}
        onClose={modals.closeUser}
        pixels={pixels}
        level={level}
        title={title}
        xp={xp}
        isDarkMode={isDarkMode}
        foromColor={foromColor}
        mission={mission}
        currentUser={currentUser}
        isSuperModerator={isSuperModerator}
        inVault={inVault}
        foromRules={foromRules}
        foromFriendKeys={foromFriendKeys}
      />

      <WalletModal
        isOpen={modals.isWalletOpen}
        onClose={modals.closeWallet}
        pixels={pixels}
      />

      <RomapModal
        isOpen={modals.isRomapOpen}
        onClose={modals.closeRomap}
        currentPhase={seasonPhase === 'V1' ? 1 : seasonPhase === 'V2' ? 2 : 3}
      />

      <QuestModal
        isOpen={modals.isQuestOpen}
        onClose={modals.closeQuest}
        personalQuests={personalQuests}
        acceptedQuestId={acceptedQuestId}
        questionLabels={questionLabels}
        categoryLabels={categoryLabels}
        categories={CATEGORIES as unknown as string[]}
        seasonPhase={seasonPhase}
        pixels={pixels}
        canCreateQuest={isSuperModerator}
        onCreateQuest={(title, reward, question, category) => {
          const cost = seasonPhase === 'V1' ? 2 : 1;
          if (pixels < cost) return;
          // Deduct
          setPixels(p => Math.max(0, p - cost));
          
          setPersonalQuests(prev => {
            return [...prev, { id: Date.now().toString(), title, reward, question, category }]
          })
        }}
        onAcceptQuest={(id) => {
          setPersonalQuests(prev => prev.map(q => q.id === id ? { ...q, taken: true } : q))
          setAcceptedQuestId(id)
        }}
        onCompleteQuest={(id) => {
          const quest = personalQuests.find(q => q.id === id)
          if (quest) {
            // Fixed reward: 2 pixels + 10 XP per completed quest
            setPixels(p => Math.round((p + 2.00) * 100) / 100)
            setXp(x => x + 10)
            setPersonalQuests(prev => prev.map(q => q.id === id ? { ...q, completed: true, taken: false, completedBy: currentUser || undefined } : q))
            if (acceptedQuestId === id) setAcceptedQuestId(null)
          }
        }}
        onCancelQuest={(id) => {
          setPersonalQuests(prev => prev.map(q => q.id === id ? { ...q, taken: false } : q))
          if (acceptedQuestId === id) setAcceptedQuestId(null)
        }}
      />

    </div>
  )
}

export default App

