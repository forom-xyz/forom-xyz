const fs = require('fs');
let code = fs.readFileSync('c:/corom/forom/src/components/MoodSelection.tsx', 'utf8');

code = code.replace(
  'interface MoodSelectionProps {\n  onGhost: () => void\n  onColor: () => void\n}',
  'interface MoodSelectionProps {\n  onGhost: () => void\n  onColor: (username: string) => void\n  onBack?: () => void\n}'
);

const newStart = \export function MoodSelection({ onGhost, onColor, onBack }: MoodSelectionProps) {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showDevLogin, setShowDevLogin] = useState(false);\;

code = code.replace(
  'export function MoodSelection({ onGhost, onColor }: MoodSelectionProps) {',
  newStart
);

const newHandle = \const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (['xylo', 'zylo', 'bylo', 'dylo', 'ets'].includes(username) && password === 'colors') {
      setIsSignInOpen(false)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      onColor(username)
    } else {
      alert('Invalid credentials')
    }
  }

  const handleConfirm = () => {\;

code = code.replace('const handleConfirm = () => {', newHandle);

code = code.replace(
  'if (selected === \\'fantome\\') onGhost()\n    else onColor()',
  'if (selected === \\'fantome\\') onGhost()\n    else setIsSignInOpen(true)'
);

code = code.replace(
  '<img\n        src={chromaPortalIcon}\n        alt=\"Chroma portal\"',
  \<img
        src={chromaPortalIcon}
        alt=\"Chroma portal\"
        onClick={onBack}
        style={{
          cursor: onBack ? 'pointer' : 'default',\
);

const modalCode = \
      {/* SIGN IN MODAL */}
      {isSignInOpen && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.92)',
          zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: '#111', padding: '40px 36px 32px', borderRadius: '20px',
            display: 'flex', flexDirection: 'column', gap: '14px', width: 'min(90vw, 360px)',
            border: '1px solid rgba(255,255,255,0.12)', position: 'relative',
          }}>
            <button
              onClick={() => { setIsSignInOpen(false); setShowDevLogin(false); }}
              style={{ position: 'absolute', top: '14px', right: '18px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '24px', cursor: 'pointer', lineHeight: 1 }}
            >×</button>

            <h2 style={{ margin: '0 0 6px', fontSize: '20px', textAlign: 'center', fontWeight: 700, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Jersey 15', sans-serif" }}>Se connecter</h2>

            {!showDevLogin ? (
              <>
                {([
                  { id: 'google', label: 'Google', bg: '#fff', fg: '#111', border: '#ddd', soon: false },
                  { id: 'discord', label: 'Discord', bg: '#5865F2', fg: '#fff', border: '#5865F2', soon: false },
                  { id: 'microsoft', label: 'Microsoft', bg: '#00A4EF', fg: '#fff', border: '#00A4EF', soon: false },
                  { id: 'meta', label: 'Meta', bg: '#0467DF', fg: '#fff', border: '#0467DF', soon: false },
                  { id: 'x', label: 'X', bg: '#000', fg: '#fff', border: '#555', soon: false },
                  { id: 'apple', label: 'Apple', bg: '#000', fg: '#fff', border: '#555', soon: false },
                  { id: 'ets', label: 'ETS — Authentik', bg: '#1a1a1a', fg: '#6CB4E4', border: '#6CB4E4', soon: true },
                ] as const).map(p => (
                  <button
                    key={p.id}
                    disabled
                    title={p.soon ? 'Bientôt disponible' : 'Bientôt disponible'}
                    style={{
                      position: 'relative', padding: '11px 18px', borderRadius: '10px',
                      border: \1px solid \\, backgroundColor: p.bg, color: p.fg,
                      fontSize: '14px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif',
                      cursor: 'not-allowed', opacity: 0.6, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: '8px', letterSpacing: '0.03em',
                    }}
                  >
                    {p.label}
                    <span style={{ marginLeft: 'auto', fontSize: '10px', opacity: 0.7, fontStyle: 'italic', fontWeight: 400 }}>
                      {p.soon ? '? bientôt' : 'bientôt'}
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => setShowDevLogin(true)}
                  style={{ marginTop: '4px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', fontSize: '11px', cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.05em' }}
                >dev</button>
              </>
            ) : (
              <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.35)', textAlign: 'center', fontFamily: 'monospace' }}>accès développeur</p>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#222', color: 'white', outline: 'none', fontSize: '14px' }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#222', color: 'white', outline: 'none', fontSize: '14px' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setShowDevLogin(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'transparent', border: '1px solid #444', color: '#888', cursor: 'pointer', fontWeight: 'bold' }}>Back</button>
                  <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#3b82f6', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Login</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
\;

code = code.replace(/    <\/motion\.div>\s*\)\s*}$/, modalCode);

fs.writeFileSync('c:/corom/forom/src/components/MoodSelection.tsx', code);
