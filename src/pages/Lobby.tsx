import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ForomLobby } from '../components/ForomLobby';
import { LoginFlow } from '../components/LoginFlow';
import { LobbyUserModal } from '../components/LobbyUserModal';
import { AnimatePresence } from 'framer-motion';
import { useModalStore } from '../stores/useModalStore';
import { pb } from '../lib/pocketbase';

export function Lobby() {
  const navigate = useNavigate();
  const sessionType = localStorage.getItem('session_type');
  
  // Use PocketBase directly if logged in, otherwise use mock session logic or null
  const [currentUser, setCurrentUser] = useState<string | null>(
    pb.authStore.isValid ? pb.authStore.model?.username : (sessionType === 'authenticated' ? 'User' : null)
  );

  const isUserOpen = useModalStore((state) => state.isUserOpen);
  const closeUser = useModalStore((state) => state.closeUser);
  
  const [showLoginFlow, setShowLoginFlow] = useState(false);

  useEffect(() => {
    return pb.authStore.onChange((token, model) => {
      setCurrentUser(model ? model.username : null);
    });
  }, []);

  const handleSignInClick = () => {
    setShowLoginFlow(true);
  };

  const handleLoginSubmit = (data: { username: string }) => {
    setCurrentUser(data.username);
    localStorage.setItem('session_type', 'authenticated');
    localStorage.setItem('user', JSON.stringify({ role: 'Associate', email: 'user@example.com' }));
    setShowLoginFlow(false);
  };

  const handleConfirm = () => {
    navigate('/forom/new');
  };

  const handleSkip = () => {
    navigate('/forom/public-hub');
  };

  const handleBackToLoading = () => {
    navigate('/mood');
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ForomLobby 
        onConfirm={handleConfirm}
        onSkip={handleSkip}
        onSignIn={handleSignInClick}
        currentUser={currentUser}
        onBackToLoading={handleBackToLoading}
      />

      <AnimatePresence>
        {showLoginFlow && (
          <LoginFlow 
            onSubmit={handleLoginSubmit} 
            onClose={() => setShowLoginFlow(false)} 
          />
        )}
      </AnimatePresence>

      <LobbyUserModal
        isOpen={isUserOpen}
        onClose={closeUser}
        currentUser={pb.authStore.model?.username || currentUser}
        pixels={pb.authStore.model?.pixels || 0}
        xp={pb.authStore.model?.xp || 0}
        level={Math.floor((pb.authStore.model?.xp || 0) / 100) + 1}
        userRole={pb.authStore.model?.role || 'Associate'}
      />

      <Outlet />
    </div>
  );
}
