import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ForomLobby } from '../components/ForomLobby';
import { LoginFlow } from '../components/LoginFlow';
import { AnimatePresence } from 'framer-motion';

export function Lobby() {
  const navigate = useNavigate();
  const sessionType = localStorage.getItem('session_type');
  const [currentUser, setCurrentUser] = useState<string | null>(
    sessionType === 'authenticated' ? 'User' : null
  );
  
  const [showLoginFlow, setShowLoginFlow] = useState(false);

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
      
      <div style={{ position: 'absolute', top: '32px', left: '50%', transform: 'translateX(-50%)', zIndex: 90, display: 'flex', gap: '20px' }}>
         <button 
           onClick={() => navigate('/lobby/dashboard')}
           style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#333', color: 'white', border: '1px solid #555', cursor: 'pointer' }}
         >
           View Dashboard
         </button>
      </div>

      <AnimatePresence>
        {showLoginFlow && (
          <LoginFlow 
            onSubmit={handleLoginSubmit} 
            onClose={() => setShowLoginFlow(false)} 
          />
        )}
      </AnimatePresence>

      <Outlet />
    </div>
  );
}
