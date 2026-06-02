
import { useNavigate } from 'react-router-dom';
import { MoodSelection } from '../components/MoodSelection';

export function MoodSelectionPage() {
  const navigate = useNavigate();

  const handleGhostMode = () => {
    console.log('[MOCK] Setting guest session...');
    // Mock setting a guest session
    localStorage.setItem('session_type', 'guest');
    navigate('/lobby');
  };

  const handleColorModeAuth = () => {
    console.log('[MOCK] Authenticating user in Color mode...');
    // Mock authentication flow
    localStorage.setItem('session_type', 'authenticated');
    localStorage.setItem('user', JSON.stringify({ role: 'Associate', email: 'user@example.com' }));
    navigate('/lobby');
  };

  return (
    <MoodSelection 
      onGhost={handleGhostMode}
      onLogin={handleColorModeAuth}
      onRegister={handleColorModeAuth}
      onBack={() => navigate('/')}
    />
  );
}
