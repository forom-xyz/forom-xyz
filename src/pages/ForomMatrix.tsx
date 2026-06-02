import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { CarouselGrid } from '../components/CarouselGrid';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { HeartFAB } from '../components/HeartFAB';
import { SettingsFAB } from '../components/SettingsFAB';
import { SettingsModal } from '../components/SettingsModal';
import { UserModal } from '../components/UserModal';
import { WalletModal } from '../components/WalletModal';
import { RomapModal } from '../components/RomapModal';
import { QuestModal } from '../components/QuestModal';
import { useModalStore } from '../stores/useModalStore';

// Icons
import wikiIcon from '../assets/icons/wiki.png';
import rubixViewIcon from '../assets/icons/rubix_view.svg';
import tokensIcon from '../assets/icons/tokens.svg';

// Data
import { QUESTION_ORDER, QUESTION_COLORS } from '../data/memories';

export function ForomMatrix() {
  const { foromId } = useParams<{ foromId: string }>();
  const navigate = useNavigate();
  const modals = useModalStore();
  
  // Minimal required state
  const CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const [activeCategory, setActiveCategory] = useState('C');
  const [isRubixView, setIsRubixView] = useState(false);
  const [isDarkMode] = useState(true);

  // User State
  const sessionType = localStorage.getItem('session_type');
  const isPhantomMode = sessionType === 'guest';
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const currentUser = user?.email?.split('@')[0] || (isPhantomMode ? null : 'User');
  const userRole = user?.role || 'Associate';
  
  const [pixels, setPixels] = useState(500);
  const [xp, setXp] = useState(0);
  const level = 1;
  const [personalQuests, setPersonalQuests] = useState<any[]>([]);
  const [acceptedQuestId, setAcceptedQuestId] = useState<string | null>(null);

  // Labels
  const [categoryLabels, setCategoryLabels] = useState<Record<string, string>>(Object.fromEntries(CATEGORIES.map(c => [c, c])));
  const [questionLabels, setQuestionLabels] = useState<Record<string, string>>(Object.fromEntries(QUESTION_ORDER.map(q => [q, q])));

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // We bypass authorization block for Guest so they can actually see the Grid
    // But we lock the icons using `isPhantomMode`.
    if (isPhantomMode) {
      setIsAuthorized(true);
      return;
    }

    if (foromId === 'private-creators') {
      const inviteList = ['user@example.com', 'admin@forom.xyz'];
      if (user && inviteList.includes(user.email)) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } else {
      setIsAuthorized(true);
    }
  }, [foromId, isPhantomMode, user]);

  if (isAuthorized === null) {
    return <div className="text-white text-center p-20">Loading Access Guards...</div>;
  }

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white p-6">
        <div className="max-w-md text-center bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Jersey 15', sans-serif" }}>Access Denied</h2>
          <p className="mb-8 text-gray-400">
            You do not have the required access level for this Forom ({foromId}).
          </p>
          <button 
            className="px-8 py-3 rounded-full bg-orange-600 hover:bg-orange-500 font-bold transition-colors"
            onClick={() => alert('Request to Join sent to Mods/S-Mods!')}
          >
            Request to Join
          </button>
          
          <button 
            className="block mt-4 mx-auto text-sm text-gray-500 hover:text-white"
            onClick={() => navigate('/lobby')}
          >
            Back to Lobby
          </button>
        </div>
      </div>
    );
  }

  const sidebarItems = CATEGORIES.map((category) => ({
    id: category,
    label: categoryLabels[category] || category,
    disabled: false,
  }));

  const cornerIconStyle = "rounded-full overflow-hidden cursor-pointer shadow-lg hover:shadow-xl border-2 border-transparent transition-all flex items-center justify-center";
  const cornerIconSize = { width: '64px', height: '64px' };

  return (
    <div
      className="h-screen w-full overflow-hidden relative transition-colors duration-300"
      style={{ backgroundColor: isDarkMode ? '#050505' : '#ffffff' }}
    >
      {/* Right Column Stack: Settings, Quest */}
      <div
        className="fixed z-50 flex flex-col items-center"
        style={{ bottom: '48px', right: '3%', gap: '2vh' }}
      >
        {/* Quest Hub */}
        <motion.button
          onClick={isPhantomMode ? undefined : () => modals.openQuest()}
          whileHover={isPhantomMode ? {} : { scale: 1.12 }}
          whileTap={isPhantomMode ? {} : { scale: 0.92 }}
          className={`rounded-full flex items-center justify-center border-2 border-transparent hover:border-orange-500 transition-colors duration-300 ${isPhantomMode ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          style={{ width: '36px', height: '36px', backgroundColor: 'transparent' }}
          title={isPhantomMode ? "Locked (Phantom Mode)" : "Quest"}
        >
          {isPhantomMode ? (
            <Lock size={16} color="#ffffff" />
          ) : (
            <img src={tokensIcon} alt="Quest" className="w-full h-full object-contain" />
          )}
        </motion.button>

        {!isPhantomMode && (
          <SettingsFAB onClick={modals.openSettings} />
        )}
      </div>

      <Header
        onTokenClick={modals.openWallet}
        onUserClick={modals.openUser}
        onRomapClick={modals.openRomap}
        seasonPhase="V1"
        onLobbyClick={() => navigate(-1)} // Chroma Portal is a back button
        isDark={isDarkMode}
        mission="Les Fondations"
        isPhantom={isPhantomMode}
      />

      {/* Bottom Left - Heart + Wiki stacked */}
      <div
        className="fixed z-50 flex flex-col items-center"
        style={{ bottom: '48px', left: '3%', gap: '12px' }}
      >
        <div style={{ opacity: isPhantomMode ? 0.5 : 1, pointerEvents: isPhantomMode ? 'none' : 'auto' }}>
          <HeartFAB fixed={false} count={1} />
        </div>
        <motion.a
          href="https://en.wikipedia.org/wiki/Main_Page"
          target="_blank"
          rel="noopener noreferrer"
          className={`${cornerIconStyle}`}
          style={{ ...cornerIconSize, backgroundColor: 'transparent', borderColor: 'transparent', opacity: isPhantomMode ? 0.5 : 1, pointerEvents: isPhantomMode ? 'none' : 'auto' }}
          whileHover={isPhantomMode ? {} : { scale: 1.1, rotate: 5 }}
          whileTap={isPhantomMode ? {} : { scale: 0.95 }}
        >
          <img src={wikiIcon} alt="Wiki" className="w-3/4 h-3/4 object-contain" />
        </motion.a>
      </div>

      {/* Bottom Center - Rubix View Toggle */}
      <div
        className="fixed z-50 flex justify-center items-center pointer-events-none"
        style={{ bottom: '5px', left: '0', right: '0' }}
      >
        <motion.button
          onClick={() => setIsRubixView(prev => !prev)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center shrink-0 pointer-events-auto"
          style={{ width: '56px', height: '56px', background: 'transparent', border: 'none' }}
        >
          <img src={rubixViewIcon} alt="Rubix View" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        </motion.button>
      </div>

      {!isRubixView && (
        <Sidebar
          items={sidebarItems}
          activeId={activeCategory}
          onSelect={setActiveCategory}
          isDark={isDarkMode}
          position="right"
        />
      )}

      {/* Grid rendering blank memories (isEmptyGrid={true}) */}
      <CarouselGrid 
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        isDark={isDarkMode}
        isRubixView={isRubixView}
        onCloseRubix={() => setIsRubixView(false)}
        acceptedQuestId={acceptedQuestId}
        categoryLabels={categoryLabels}
        questionLabels={questionLabels}
        personalQuests={personalQuests}
        isEmptyGrid={true}
      />

      {/* Modals */}
      <SettingsModal
        isOpen={modals.isSettingsOpen}
        onClose={modals.closeSettings}
        onSave={(newCats, newTags) => {
          setCategoryLabels(newCats);
          setQuestionLabels(newTags);
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
        title="Citoyen"
        xp={xp}
        isDarkMode={isDarkMode}
        foromColor={null}
        mission="Les Fondations"
        currentUser={currentUser}
        isSuperModerator={userRole === 'S-MODS'}
        userRole={userRole as any}
        inVault={0}
        foromRules={[]}
        foromFriendKeys={[]}
      />

      <WalletModal
        isOpen={modals.isWalletOpen}
        onClose={modals.closeWallet}
        pixels={pixels}
        userRole={userRole as any}
      />

      <RomapModal
        isOpen={modals.isRomapOpen}
        onClose={modals.closeRomap}
        currentPhase={1}
      />

      <QuestModal
        isOpen={modals.isQuestOpen}
        onClose={modals.closeQuest}
        personalQuests={personalQuests}
        acceptedQuestId={acceptedQuestId}
        questionLabels={questionLabels}
        categoryLabels={categoryLabels}
        categories={CATEGORIES}
        seasonPhase="V1"
        pixels={pixels}
        canCreateQuest={userRole === 'S-MODS' || userRole === 'MODS'}
        userRole={userRole as any}
        onCreateQuest={(title, reward, question, category) => {
          setPersonalQuests(prev => [...prev, { id: Date.now().toString(), title, reward, question, category }]);
        }}
        onAcceptQuest={(id) => {
          setPersonalQuests(prev => prev.map(q => q.id === id ? { ...q, taken: true } : q));
          setAcceptedQuestId(id);
        }}
        onCompleteQuest={(id) => {
          setPixels(p => p + 2);
          setXp(x => x + 10);
          setPersonalQuests(prev => prev.map(q => q.id === id ? { ...q, completed: true, taken: false } : q));
          if (acceptedQuestId === id) setAcceptedQuestId(null);
        }}
        onCancelQuest={(id) => {
          setPersonalQuests(prev => prev.map(q => q.id === id ? { ...q, taken: false } : q));
          if (acceptedQuestId === id) setAcceptedQuestId(null);
        }}
        onProfileUpdate={() => {}}
      />
    </div>
  );
}
