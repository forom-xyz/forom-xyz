const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'ForomLobby.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Remove useGhostLayoutForColorMood
content = content.replace("  const useGhostLayoutForColorMood = true\n", "");

// 2. Remove the ternary condition wrapper start
content = content.replace(
`        {(!currentUser || useGhostLayoutForColorMood) ? (
          <>
            {/* GHOST VIEW LEFT */}`,
`        <>
            {/* VIEW LEFT */}`
);

// 3. Remove the entire false branch of the ternary condition
const startFalseBranch = `        ) : (
          <>
            {/* LOGGED IN VIEW LEFT: REJOINDRE */}`;

const endFalseBranch = `          </>
        )}
      </div>`;

const newEndBranch = `          </>
      </div>`;

if (content.includes(startFalseBranch)) {
  const head = content.substring(0, content.indexOf(startFalseBranch));
  const tail = content.substring(content.indexOf(endFalseBranch) + endFalseBranch.length);
  content = head + newEndBranch + tail;
}

// 4. Update the DÉCOUVRIR center column
const oldGridStart = `              <div style={{
                backgroundColor: '#1A1A1A',
                borderRadius: 'clamp(12px, 1.5vw, 24px)',
                padding: 'clamp(10px, 1.8vw, 28px)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(6px, 1vh, 14px)',
                boxSizing: 'border-box',
                zIndex: romPhase === 'public_tour' ? 45 : 1
              }}>`;

const oldGridEnd = `              </div>
            </div>

            {/* GHOST VIEW RIGHT */}`;

const replaceGrid = `              <div style={{
                backgroundColor: '#1A1A1A',
                borderRadius: 'clamp(12px, 1.5vw, 24px)',
                padding: 'clamp(16px, 1.8vw, 32px)',
                width: 'min(100%, 360px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(12px, 1.5vh, 20px)',
                boxSizing: 'border-box',
                zIndex: romPhase === 'public_tour' ? 45 : 1,
                alignItems: 'center'
              }}>
                <div style={{ color: '#2563EB', fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(14px, 1.8vw, 28px)', letterSpacing: '0.3em', textTransform: 'uppercase', textAlign: 'center' }}>
                  {t.public}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 1.2vw, 16px)', width: '100%' }}>
                  <svg style={{ cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.2s', width: 'clamp(16px, 2vw, 24px)', height: 'clamp(16px, 2vw, 24px)' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0.8'} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  <div style={{ backgroundColor: '#D9D9D9', borderRadius: '8px', width: 'clamp(36px, 4.5vw, 56px)', height: 'clamp(36px, 4.5vw, 56px)', flexShrink: 0 }} />
                  <div onClick={() => onSkip?.()} title="Tuto" style={{ backgroundColor: '#ffffff', borderRadius: '8px', width: 'clamp(46px, 6vw, 76px)', height: 'clamp(46px, 6vw, 76px)', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid transparent', transition: 'transform 0.15s, border-color 0.15s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.borderColor = '#2563EB' }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'transparent' }}>
                    <img src={tutoIcon} alt="Tuto" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ backgroundColor: '#D9D9D9', borderRadius: '8px', width: 'clamp(36px, 4.5vw, 56px)', height: 'clamp(36px, 4.5vw, 56px)', flexShrink: 0 }} />
                  <svg style={{ cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.2s', width: 'clamp(16px, 2vw, 24px)', height: 'clamp(16px, 2vw, 24px)' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0.8'} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>

                <div style={{ width: '70%', height: '1px', backgroundColor: 'rgba(255,255,255,0.7)', margin: '4px auto' }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 1.2vw, 16px)', width: '100%' }}>
                  <svg style={{ cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.2s', width: 'clamp(16px, 2vw, 24px)', height: 'clamp(16px, 2vw, 24px)' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0.8'} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  <div style={{ backgroundColor: '#D9D9D9', borderRadius: '8px', width: 'clamp(36px, 4.5vw, 56px)', height: 'clamp(36px, 4.5vw, 56px)', flexShrink: 0 }} />
                  <div onClick={() => window.open('https://forom.etsmtl.ca', '_blank')} title="ÉTS" style={{ backgroundColor: '#E3022C', borderRadius: '8px', width: 'clamp(46px, 6vw, 76px)', height: 'clamp(46px, 6vw, 76px)', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid transparent', transition: 'transform 0.15s, border-color 0.15s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.borderColor = '#ffffff' }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'transparent' }}>
                    <img src={etsIcon} alt="ÉTS" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ backgroundColor: '#D9D9D9', borderRadius: '8px', width: 'clamp(36px, 4.5vw, 56px)', height: 'clamp(36px, 4.5vw, 56px)', flexShrink: 0 }} />
                  <svg style={{ cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.2s', width: 'clamp(16px, 2vw, 24px)', height: 'clamp(16px, 2vw, 24px)' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0.8'} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>

                <div style={{ color: '#E85C5C', fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(14px, 1.8vw, 28px)', letterSpacing: '0.3em', textTransform: 'uppercase', textAlign: 'center' }}>
                  {t.prive}
                </div>
              </div>
            </div>

            {/* VIEW RIGHT */}`;

if (content.includes(oldGridStart) && content.includes(oldGridEnd)) {
  const headGrid = content.substring(0, content.indexOf(oldGridStart));
  const tailGrid = content.substring(content.indexOf(oldGridEnd) + oldGridEnd.length);
  content = headGrid + replaceGrid + tailGrid;
} else {
  console.log("Could not find old grid start or end");
}

fs.writeFileSync(file, content, 'utf8');
console.log("Successfully patched ForomLobby.tsx");
