import { motion, AnimatePresence, type Variants } from 'framer-motion'
import ReactModal from 'react-modal'
import type { ForomColor } from '../utils/foromColors'
import type { UserRole } from '../App'

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────
const CameraIcon = () => (
  <svg width="48" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
)

export const ParameterIcon = ({ width = 60, height = 60 }: { width?: number | string, height?: number | string }) => (
  <svg width={width} height={height} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background slightly rounded */}
    <rect width="100" height="100" rx="20" fill="#000" />
    {/* Sliders base */}
    <rect x="25" y="20" width="6" height="60" rx="3" fill="#D1D5DB" />
    <rect x="42" y="20" width="6" height="60" rx="3" fill="#D1D5DB" />
    <rect x="59" y="20" width="6" height="60" rx="3" fill="#D1D5DB" />
    <rect x="76" y="20" width="6" height="60" rx="3" fill="#D1D5DB" />
    
    {/* Knobs */}
    {/* Yellow left */}
    <circle cx="28" cy="65" r="9" fill="#FCD34D" />
    <circle cx="28" cy="65" r="5" fill="#FFF" />
    
    {/* Blue middle-left */}
    <circle cx="45" cy="35" r="9" fill="#93C5FD" />
    <circle cx="45" cy="35" r="5" fill="#FFF" />
    
    {/* Red middle-right */}
    <circle cx="62" cy="70" r="9" fill="#FCA5A5" />
    <circle cx="62" cy="70" r="5" fill="#FFF" />
    
    {/* Grey right */}
    <circle cx="79" cy="30" r="9" fill="#9CA3AF" />
    <circle cx="79" cy="30" r="5" fill="#FFF" />
  </svg>
)

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
interface LobbyUserModalProps {
  isOpen: boolean
  onClose: () => void
  pixels: number
  level: number
  title?: string
  xp: number
  isDarkMode?: boolean
  foromColor?: ForomColor | null
  mission?: string
  currentUser?: string | null
  isSuperModerator?: boolean
  inVault?: number
  foromRules?: string[]
  foromFriendKeys?: string[]
  userRole?: UserRole
}

const modalStyles: ReactModal.Styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    inset: 'auto',
    width: '90vw',
    maxWidth: '1200px',
    height: 'auto',
    maxHeight: '85vh',
    padding: 0,
    border: 'none',
    background: 'transparent',
    overflow: 'visible',
    borderRadius: 0,
    boxSizing: 'border-box' as const,
    display: 'flex',
    flexDirection: 'column' as const,
  },
}

const variants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.15, ease: 'easeOut' } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.1, ease: 'easeIn' } },
}

export function LobbyUserModal({
  isOpen,
  onClose,
  pixels,
  level,
  currentUser,
}: LobbyUserModalProps) {
  
  const displayName  = currentUser ? currentUser.toLowerCase() : 'xylo'

  return (
    <AnimatePresence>
      {isOpen && (
        <ReactModal
          isOpen={isOpen}
          onRequestClose={onClose}
          style={modalStyles}
          closeTimeoutMS={200}
          shouldCloseOnOverlayClick
          shouldCloseOnEsc
          ariaHideApp={false}
        >
          <>
          {/* Top Right Parameter Icon (Outside the main container) */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: -60,
              right: 20,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              zIndex: 10000,
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            title="Paramètres"
          >
            <ParameterIcon />
          </button>

          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              width: '100%',
              backgroundColor: '#5A5A5A',
              border: '14px solid #89664D',
              borderRadius: '24px',
              padding: '32px 40px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              overflowY: 'auto'
            }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(250px, 1fr) minmax(250px, 1fr) minmax(250px, 1fr)',
              gap: '40px',
              color: 'white',
              fontFamily: "'Jersey 15', monospace"
            }}>
              
              {/* LEFT COLUMN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                
                {/* Couleurs */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '36px', letterSpacing: '0.1em', margin: '0 0 20px 0', textTransform: 'uppercase' }}>Couleurs</h2>
                  <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-end', height: '100px', borderBottom: '2px solid rgba(255,255,255,0)' }}>
                    {/* Sécurité */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '12px', height: '15px', backgroundColor: '#EF4444' }}></div>
                      <span style={{ fontSize: '10px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.8)' }}>sécurité</span>
                    </div>
                    {/* Créatif */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '12px', height: '60px', backgroundColor: '#FCD34D' }}></div>
                      <span style={{ fontSize: '10px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.8)' }}>créatif</span>
                    </div>
                    {/* Social */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '12px', height: '10px', backgroundColor: '#3B82F6' }}></div>
                      <span style={{ fontSize: '10px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.8)' }}>Social</span>
                    </div>
                  </div>
                </div>

                {/* Associations */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '32px', letterSpacing: '0.05em', margin: '0 0 16px 0' }}>Associations</h2>
                  
                  <div style={{ 
                    backgroundColor: '#E5E7EB', 
                    borderRadius: '16px', 
                    padding: '20px 16px',
                    width: '100%',
                    color: '#111'
                  }}>
                    {/* Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 20px', gap: '5px', marginBottom: '16px', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 'bold' }}>
                      <div style={{ textAlign: 'left', color: '#555' }}>Foron's</div>
                      <div style={{ textAlign: 'center', color: '#555' }}>Rôle</div>
                      <div style={{ textAlign: 'center', color: '#555' }}>Quêtes</div>
                      <div style={{ textAlign: 'center', color: '#555' }}>Missions</div>
                      <div></div>
                    </div>
                    
                    {/* Row 1 */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 20px', gap: '5px', alignItems: 'center', marginBottom: '12px', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
                      <div style={{ color: '#EF4444', fontWeight: 'bold' }}>etsmtl.ca</div>
                      <div style={{ textAlign: 'center', color: '#A855F7' }}>s-mods</div>
                      <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#EF4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>0</div></div>
                      <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#3B82F6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>0</div></div>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #555', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '10px', fontWeight: 'bold' }}>x</div></button>
                    </div>

                    {/* Row 2 */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 20px', gap: '5px', alignItems: 'center', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
                      <div style={{ color: '#3B82F6', fontWeight: 'bold' }}>tuto</div>
                      <div style={{ textAlign: 'center', color: '#A855F7' }}>s-mods</div>
                      <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#EF4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>0</div></div>
                      <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#3B82F6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>0</div></div>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #555', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '10px', fontWeight: 'bold' }}>x</div></button>
                    </div>
                  </div>
                </div>

              </div>

              {/* CENTER COLUMN */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                
                {/* Header CORE */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '48px', letterSpacing: '0.05em' }}>
                  <span style={{ color: '#FCD34D' }}>C</span>
                  <span style={{ color: '#3B82F6' }}>O</span>
                  <span style={{ color: '#EF4444' }}>R</span>
                  <span style={{ color: '#D1D5DB' }}>E</span>
                </div>

                {/* Camera Icon */}
                <div style={{ margin: '10px 0', border: '2px solid white', borderRadius: '8px', padding: '8px 12px' }}>
                  <CameraIcon />
                </div>

                <div style={{ fontSize: '14px', margin: '4px 0 16px', letterSpacing: '0.1em' }}>Signature</div>

                {/* Username block */}
                <div style={{ fontSize: '10px', fontFamily: "'Montserrat', sans-serif", color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', fontStyle: 'italic' }}>
                  {displayName}@forom.xyz
                </div>
                
                <div style={{ fontSize: '64px', margin: '10px 0', color: 'white' }}>
                  {displayName}
                </div>

                <div style={{ fontSize: '12px', fontFamily: "'Montserrat', sans-serif", color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em' }}>
                  montréal
                </div>

                {/* Portefeuille */}
                <div style={{ fontSize: '32px', margin: '40px 0 16px', letterSpacing: '0.05em' }}>Portefeuille</div>
                <div style={{ 
                  backgroundColor: '#22C55E', 
                  border: '4px solid #FCD34D',
                  borderRadius: '12px',
                  padding: '12px 32px',
                  fontSize: '48px',
                  color: 'white',
                  textShadow: '2px 2px 0px rgba(0,0,0,0.3)',
                  marginBottom: '32px'
                }}>
                  {pixels} px
                </div>

                {/* Réalisations */}
                <div style={{ fontSize: '24px', letterSpacing: '0.05em', marginBottom: '16px' }}>Réalisations</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ fontSize: '24px', cursor: 'pointer' }}>{"<"}</span>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.6)' }}></div>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
                  <span style={{ fontSize: '24px', cursor: 'pointer' }}>{">"}</span>
                </div>

              </div>

              {/* RIGHT COLUMN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* Niveau */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '36px', letterSpacing: '0.05em', margin: '0 0 20px 0' }}>Niveau</h2>
                  <div style={{ 
                    width: '64px', height: '64px', borderRadius: '50%',
                    backgroundColor: '#1F2937', border: '5px solid #111',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '32px', color: 'white', marginBottom: '24px'
                  }}>
                    {level}
                  </div>
                  
                  {/* Progress Line */}
                  <div style={{ width: '100%', position: 'relative', height: '40px' }}>
                    <div style={{ position: 'absolute', top: '5px', left: '10%', right: '10%', height: '2px', backgroundColor: 'rgba(255,255,255,0.3)', zIndex: 1 }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FFF' }}></div>
                        <span style={{ fontSize: '8px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.05em' }}>Citoyen</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#9CA3AF' }}></div>
                        <span style={{ fontSize: '8px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.6)' }}>Mage</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3B82F6' }}></div>
                        <span style={{ fontSize: '8px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.6)' }}>Lumière</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F472B6' }}></div>
                        <span style={{ fontSize: '8px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.6)' }}>Âme</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }}></div>
                        <span style={{ fontSize: '8px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.6)' }}>Légende</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progression */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
                  <h2 style={{ fontSize: '32px', letterSpacing: '0.05em', margin: '0 0 16px 0' }}>Progression</h2>
                  <div style={{ display: 'flex', gap: '60px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>Quêtes</span>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>0</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>Missions</span>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>0</div>
                    </div>
                  </div>
                </div>

                {/* Memo's */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px' }}>
                  <h2 style={{ fontSize: '32px', letterSpacing: '0.05em', margin: '0 0 24px 0' }}>Memo's</h2>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '12px' }}></div>
                    <div style={{ width: '100px', height: '100px', backgroundColor: '#E5E7EB', borderRadius: '16px' }}></div>
                    <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '12px' }}></div>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Confirmer disabled button inside the modal per screenshot */}
            {/* The screenshot shows "Confirmer" floating *below* the parameter UI modal in the middle. */}
          </motion.div>
          
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '30px', position: 'relative', zIndex: 10000 }}>
             <button
               disabled
               style={{
                 padding: '12px 60px',
                 borderRadius: '999px',
                 backgroundColor: '#2F4533', // Dark greenish per screenshot
                 color: 'rgba(255,255,255,0.4)',
                 fontFamily: "'Montserrat', sans-serif",
                 fontWeight: 700,
                 fontSize: '18px',
                 letterSpacing: '0.05em',
                 border: 'none',
                 opacity: 0.8,
                 cursor: 'not-allowed'
               }}
             >
               Confirmer
             </button>
          </div>
          </>
        </ReactModal>
      )}
    </AnimatePresence>
  )
}
