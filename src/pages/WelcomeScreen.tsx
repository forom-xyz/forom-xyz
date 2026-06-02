import { useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../components/LoadingScreen';

export function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <LoadingScreen onComplete={() => navigate('/mood')} />
  );
}
