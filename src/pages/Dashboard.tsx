
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();
  // Mock data
  const userStats = {
    level: 12,
    impact: 450,
    foroms: ['Public Hub', 'Private Creators'],
  };

  return (
    <div 
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      <div 
        style={{
          backgroundColor: '#111', 
          padding: '40px', 
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.12)',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px', 
          width: 'min(90vw, 500px)',
        }}
      >
        <button
          onClick={() => navigate('/lobby')}
          style={{ position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '24px', cursor: 'pointer' }}
        >
          ×
        </button>
        <h2 style={{ margin: 0, fontFamily: "'Jersey 15', sans-serif", fontSize: '32px', textAlign: 'center', color: '#FFD700' }}>
          DASHBOARD
        </h2>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '16px' }}>
          <p><strong>Level:</strong> {userStats.level}</p>
          <p><strong>Impact (Pixels):</strong> {userStats.impact}</p>
          <p><strong>Your Foroms:</strong></p>
          <ul>
            {userStats.foroms.map(f => <li key={f}>- {f}</li>)}
          </ul>
        </div>
        <button
          onClick={() => navigate('/forom/public-hub')}
          style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#2563EB', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
        >
          Enter Matrix
        </button>
      </div>
    </div>
  );
}
