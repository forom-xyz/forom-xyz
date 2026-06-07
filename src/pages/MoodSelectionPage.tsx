import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoodSelection } from '../components/MoodSelection';
import { LoginFlow } from '../components/LoginFlow';
import { CustomEnrollmentFlow } from '../components/CustomEnrollmentFlow';
import { pb } from '../lib/pocketbase';

export function MoodSelectionPage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleGhostMode = () => {
    localStorage.setItem('session_type', 'guest');
    navigate('/lobby');
  };

  const handleLoginSubmit = async (data: { username: string; password: string }) => {
    setLoginError(null);
    try {
      const authData = await pb.collection('users').authWithPassword(data.username, data.password);
      localStorage.setItem('session_type', 'authenticated');
      localStorage.setItem('token', pb.authStore.token);
      localStorage.setItem('user', JSON.stringify({ role: authData.record.role, username: authData.record.username }));
      navigate('/lobby');
    } catch (e: any) {
      setLoginError(e.message || 'Login failed');
    }
  };

  const handleRegisterSubmit = async (data: { username: string; email: string; password: string; color: string; town: string }) => {
    try {
      // Format username to remove unsupported special characters and spaces
      const formattedUsername = data.username.replace(/[^a-zA-Z0-9_-]/g, '');
      
      await pb.collection('users').create({
        username: formattedUsername,
        email: data.email,
        password: data.password,
        passwordConfirm: data.password,
        color: data.color,
        city: data.town,
        name: data.username,
        global_role: "ghost"
      });
      // After registration, go to login
      setShowRegister(false);
      setShowLogin(true);
    } catch (error: any) {
      console.log(error.response?.data);
      let errorMessage = error.message || 'Failed to create record.';
      
      if (error.response?.data) {
        const validationErrors = Object.entries(error.response.data)
          .map(([field, err]: any) => `${field}: ${err.message}`)
          .join('\n');
        
        if (validationErrors) {
          errorMessage = validationErrors;
        }
      }
      
      alert(`Error creating account:\n${errorMessage}`);
    }
  };

  return (
    <>
      <MoodSelection 
        onGhost={handleGhostMode}
        onLogin={() => setShowLogin(true)}
        onRegister={() => setShowRegister(true)}
        onBack={() => navigate('/')}
      />

      {showLogin && (
        <LoginFlow
          error={loginError}
          onSubmit={handleLoginSubmit}
          onClose={() => setShowLogin(false)}
        />
      )}

      {showRegister && (
        <CustomEnrollmentFlow
          onSubmit={handleRegisterSubmit}
          onClose={() => setShowRegister(false)}
        />
      )}
    </>
  );
}
