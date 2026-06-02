
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WelcomeScreen } from '../pages/WelcomeScreen';
import { MoodSelectionPage } from '../pages/MoodSelectionPage';
import { Lobby } from '../pages/Lobby';
import { Dashboard } from '../pages/Dashboard';
import { ForomMatrix } from '../pages/ForomMatrix';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/mood" element={<MoodSelectionPage />} />
        <Route path="/lobby" element={<Lobby />}>
          {/* Nested Dashboard Route */}
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/forom/:foromId" element={<ForomMatrix />} />
        
        {/* Fallback route */}
        <Route path="*" element={<WelcomeScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
