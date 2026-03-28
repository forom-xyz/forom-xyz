import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../stores/useAppStore'
import tutoIcon from '../assets/icons/TUTO.svg'
import etsIcon from '../assets/icons/ets.jpg'
import githubIcon from '../assets/icons/github.png'
import chromaNotesIcon from '../assets/icons/chroma_portal.svg'
import ghostWhtIcon from '../assets/icons/ghost_wht.svg'
import ghostBlkIcon from '../assets/icons/ghost_blk.svg'
import larucheIcon from '../assets/icons/laruche.svg'
import { RomOnboarding } from './RomOnboarding'

const DelayedTypewriterText = ({ text, delayMs = 200 }: { text: string, delayMs?: number }) => {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    if (!text) return

    let i = 0
    let interval: ReturnType<typeof setInterval>

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayed(text.slice(0, i))
        i++
        if (i > text.length) {
          clearInterval(interval)
        }
      }, 40)
    }, delayMs)

    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [text, delayMs])

  return <>{displayed}</>
}

// Redundant LanguageCarousel block migrated to LoadingScreen.tsx

export function ForomLobby({ onConfirm, onSkip, onSignIn, currentUser, onBackToLoading, onJoinEts }: { onConfirm: () => void; onSkip?: () => void; onSignIn?: (username: string) => void; currentUser?: string | null; onBackToLoading?: () => void; onJoinEts?: () => void }) {
  const [isPlayOpen, setIsPlayOpen] = useState(false)
  const [isDeployOpen, setIsDeployOpen] = useState(false)
  const [isCreateSelected, setIsCreateSelected] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showDevLogin, setShowDevLogin] = useState(false)

  const [joinKey, setJoinKey] = useState('')
  const [joinStep, setJoinStep] = useState<'idle' | 'color' | 'rule'>('idle')
  const [joinColor, setJoinColor] = useState<string | null>(null)
  const [joinRule, setJoinRule] = useState('')

  const [romPhase, setRomPhase] = useState<string | number>('idle')
  const ghostPanelWidth = 'min(30vw, 440px)'
  const useGhostLayoutForColorMood = true

  const { language: activeLang } = useAppStore()
  const TRANSLATIONS: Record<string, Record<string, string>> = {
    en: { rejoindre: 'JOIN', creer: 'CREATE', connectKey: 'Connect with a Key', confirmer: 'Confirm', public: 'Public', prive: 'Private' },
    fr: { rejoindre: 'REJOINDRE', creer: 'CRÉER', connectKey: 'Se connecter avec une clé', confirmer: 'Confirmer', public: 'Public', prive: 'Privé' },
    es: { rejoindre: 'UNIRSE', creer: 'CREAR', connectKey: 'Conectar con una llave', confirmer: 'Confirmar', public: 'Público', prive: 'Privado' }
  }
  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (['xylo', 'zylo', 'bylo', 'dylo', 'ets'].includes(username) && password === 'colors') {
      onSignIn?.(username)
      setIsSignInOpen(false)
    } else {
      alert('Invalid credentials')
    }
  }

  const getRomTranslation = (p: string | number) => {
    switch (p) {
      case 0: return ""
      case 1:
        if (activeLang === 'fr') return "Voici ROM. S'il n'est pas intelligent au départ, il grandira grâce à vous et votre communauté. Sa force ? Il fonctionne en local, comme un serveur Minecraft. Vous restez ainsi propriétaires de votre savoir collectif, libres de le conserver ou de le vendre."
        if (activeLang === 'es') return "Te presento a ROM. Aunque no es inteligente por defecto, cobrará vida gracias a tu comunidad. Su gran ventaja es que funciona de forma local, como un servidor de Minecraft. Así, ustedes son los únicos dueños de su conocimiento colectivo, con total libertad para conservarlo o venderlo."
        return "Meet ROM. He isn’t smart on his own, but he evolves with your community’s help. Like a Minecraft server, ROM runs locally, ensuring you own your collective knowledge. It's yours to keep or monetize as you see fit."
      case 2:
        if (activeLang === 'fr') return "Système reconnu ! En tant que créateur désigné, tes prochaines étapes sont cruciales."
        if (activeLang === 'es') return "¡Sistema reconocido! Como creador designado, tus próximos pasos son críticos."
        return "System recognized! As a designated creator, your next steps are critical."
      case 3:
        if (activeLang === 'fr') return "Pour sauver le monde, nous devons communiquer. Tu as deux choix :\n\nExplorer : Visite des serveurs publics pour voir comment d'autres humains ont bâti leurs civilisations.\n\nCréer : Construis ton propre serveur « style Minecraft » et donne vie à un ROM comme moi."
        if (activeLang === 'es') return "Para salvar el mundo, debemos comunicarnos. Tienes dos opciones:\n\nExplorar: Visita servidores públicos para ver cómo otros humanos han construido sus civilizaciones.\n\nCrear: Construye tu propio servidor \"estilo Minecraft\" y dale vida a un ROM como yo."
        return "To save the world, we must communicate. You have two choices:\n\nExplore: Visit public servers to see how other humans have built their civilizations.\n\nCreate: Build your own \"Minecraft-style\" server and bring a ROM like me to life."
      case 4:
        if (activeLang === 'fr') return "Créer un foyer pour un ROM est un grand pouvoir ! Pour garder ton serveur actif 24/7, je te suggère un Dev Kit Jetson NANO.\n\nTechnique : Tu auras besoin d'1To de stockage pour tous les mémos du monde. Ce matériel devient le « cœur » de ton Forom. C'est ainsi que tu donnes vie à ton propre ROM !\n\n*Bruits de vrombissement joyeux.*"
        if (activeLang === 'es') return "¡Crear un hogar para un ROM es una gran responsabilidad! Para mantener tu servidor activo 24/7, sugiero un Jetson NANO Dev Kit.\n\nEspecificaciones: Necesitarás 1TB de espacio para almacenar los memorandos del mundo. Este hardware se convierte en el 'corazón' de tu Forom. ¡Así le das vida a tu propio ROM!\n\n*Sonidos felices de zumbido.*"
        return "Creating a home for a ROM is a big responsibility! To keep your server alive 24/7, I suggest a Jetson NANO Dev Kit.\n\nTechnical Specs: You will need 1TB of space to store all the world's memos. This hardware becomes the 'heart' of your Forom. It's how you bring life to a ROM of your very own!\n\n*Happy whirring sounds.*"
      case 'public_tour':
        if (activeLang === 'fr') return "Ceci est l'espace dédié à vos forums publics et privés. Vous pouvez y accéder sans connexion pour découvrir des exemples concrets, soutenus par de grandes communautés."
        if (activeLang === 'es') return "Este es el espacio dedicado a tus foros públicos y privados. Puedes acceder sin registrarte para descubrir ejemplos reales impulsados por grandes comunidades."
        return "This is the hub for your public and private forums. You can access it without signing in to explore real-world examples supported by major communities."
      case 'login_tour':
        if (activeLang === 'fr') return "Ou tu peux te connecter d'abord et regarder juste après ;)"
        if (activeLang === 'es') return "O puedes iniciar sesión primero y mirar justo después ;)"
        return "Or you can sign in first and look right after ;)"
      default: return ""
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{
        backgroundColor: '#000000',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'sans-serif',
        color: 'white',
        boxSizing: 'border-box',
        padding: 'clamp(16px, 4vh, 48px) clamp(16px, 3vw, 48px) clamp(16px, 3vh, 36px)',
        position: 'relative',
      }}
    >
      {/* SPOTLIGHT OVERLAY for Golden Snitch Tour */}
      <motion.div
        animate={{ opacity: romPhase === 'public_tour' || romPhase === 'login_tour' ? 0.8 : 0 }}
        style={{ position: 'absolute', inset: 0, backgroundColor: 'black', zIndex: 40, pointerEvents: 'none' }}
        transition={{ duration: 0.5 }}
      />

      {/* SKIP TO FOROM / BACK TO LOADING */}
      {!isSignInOpen && (
        <button
          onClick={() => {
            if (onBackToLoading) {
              onBackToLoading()
            }
          }}
          className="absolute flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform"
          style={{
            zIndex: 30, // sits below overlay usually
            top: '32px',
            left: '32px',
            width: '48px',
            height: '48px',
            background: 'none',
            border: 'none',
            padding: 0
          }}
          title="Chroma portal"
        >
          <img src={chromaNotesIcon} alt="Chroma portal" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
        </button>
      )}

      {/* SIGN IN TOGGLE OR GHOST ICON */}
      {!isSignInOpen && (
        <button
          onClick={() => {
            if (!currentUser) {
              onBackToLoading?.()
            }
          }}
          className="absolute flex items-center justify-center transition-transform"
          style={{
            zIndex: romPhase === 'login_tour' ? 45 : 30, // Spotlight above overlay during login_tour
            top: '32px',
            right: '32px',
            width: '48px',
            height: '48px',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: currentUser ? 'default' : 'pointer'
          }}
          title={currentUser ? "Logged In" : "Ghost"}
        >
          <img src={currentUser ? ghostBlkIcon : ghostWhtIcon} alt="Ghost" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </button>
      )}

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
            {/* Close */}
            <button
              onClick={() => { setIsSignInOpen(false); setShowDevLogin(false) }}
              style={{ position: 'absolute', top: '14px', right: '18px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '24px', cursor: 'pointer', lineHeight: 1 }}
            >×</button>

            <h2 style={{ margin: '0 0 6px', fontSize: '20px', textAlign: 'center', fontWeight: 700, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Jersey 15', sans-serif" }}>Se connecter</h2>

            {!showDevLogin ? (
              <>
                {/* OAuth provider buttons */}
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
                    title={p.soon ? 'Bientôt disponible' : 'Bientôt disponible — OAuth2 / JWT à venir'}
                    style={{
                      position: 'relative',
                      padding: '11px 18px',
                      borderRadius: '10px',
                      border: `1px solid ${p.border}`,
                      backgroundColor: p.bg,
                      color: p.fg,
                      fontSize: '14px',
                      fontWeight: 600,
                      fontFamily: 'Montserrat, sans-serif',
                      cursor: 'not-allowed',
                      opacity: 0.6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {p.label}
                    <span style={{ marginLeft: 'auto', fontSize: '10px', opacity: 0.7, fontStyle: 'italic', fontWeight: 400 }}>
                      {p.soon ? '✦ bientôt' : 'bientôt'}
                    </span>
                  </button>
                ))}

                {/* Dev login toggle */}
                <button
                  onClick={() => setShowDevLogin(true)}
                  style={{ marginTop: '4px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', fontSize: '11px', cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.05em' }}
                >dev</button>
              </>
            ) : (
              /* Developer login (xylo only) */
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
                  <button type="button" onClick={() => setShowDevLogin(false)}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#333', color: 'white', cursor: 'pointer', fontSize: '14px' }}
                  >Retour</button>
                  <button type="submit"
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#2563EB', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}
                  >Connexion</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* KEY JOIN MODAL */}
      {joinStep !== 'idle' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.92)',
          zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '40px'
        }}>
          {joinStep === 'color' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
              <h2 style={{ margin: 0, fontWeight: 400, fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(24px, 3vw, 42px)', letterSpacing: '0.06em', textAlign: 'center', color: 'white' }}>
                Choisi ta couleur Forom
              </h2>
              <div style={{ display: 'flex', gap: '30px' }}>
                {[
                  { id: 'social', label: 'SOCIAL', bg: '#3333DD' },
                  { id: 'creation', label: 'CRÉATION', bg: '#FFD700' },
                  { id: 'guardien', label: 'GUARDIEN', bg: '#EE2222' }
                ].map(c => (
                  <div
                    key={c.id}
                    onClick={() => { setJoinColor(c.id); setJoinStep('rule'); }}
                    style={{ width: 'clamp(100px, 12vw, 160px)', height: 'clamp(100px, 12vw, 160px)', borderRadius: '50%', backgroundColor: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', border: joinColor === c.id ? `4px solid white` : 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = `0 0 0 4px white, 0 0 0 6px ${c.bg}` }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <span style={{ color: '#fff', fontWeight: 400, fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(14px, 1.8vw, 22px)', letterSpacing: '0.12em', textAlign: 'center' }}>
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {joinStep === 'rule' && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', width: 'min(90vw, 800px)' }}>
              <h2 style={{ margin: 0, fontWeight: 400, fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(20px, 2.5vw, 36px)', letterSpacing: '0.04em', textAlign: 'center', color: 'white' }}>
                Quelle est ta règle fondamentale pour ce FOROM ?
              </h2>
              <input
                autoFocus
                type="text"
                value={joinRule}
                onChange={e => setJoinRule(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && joinRule.trim()) {
                    setJoinStep('idle')
                    // Proceed to transition to lobby
                  }
                }}
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid rgba(255,255,255,0.6)', outline: 'none', color: '#fff', fontSize: 'clamp(16px, 2vw, 28px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 400, padding: '10px 0', textAlign: 'center', caretColor: '#fff' }}
                placeholder="Règle..."
              />
              <button
                onClick={() => {
                  if (joinRule.trim()) {
                    console.log('Friend joined Forom with rule:', joinRule, 'and color:', joinColor)
                    setJoinStep('idle')
                  }
                }}
                style={{ padding: '12px 36px', borderRadius: '999px', backgroundColor: '#555555', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 'clamp(16px, 1.8vw, 24px)', fontWeight: 'bold' }}
              >
                Rejoindre le FOROM
              </button>
            </motion.div>
          )}

          <button
            onClick={() => setJoinStep('idle')}
            style={{ position: 'absolute', top: '30px', right: '30px', background: 'transparent', border: 'none', color: 'white', fontSize: '40px', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      )}

      {/* Three columns — fills all available vertical space */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        flex: 1,
        minHeight: 0,
        gap: 'clamp(12px, 2vw, 36px)',
        boxSizing: 'border-box',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {(!currentUser || useGhostLayoutForColorMood) ? (
          <>
            {/* GHOST VIEW LEFT */}
            <div style={{ flex: '0 0 clamp(180px, 20vw, 300px)', minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: romPhase === "public_tour" ? 45 : 1, minHeight: 'clamp(520px, 74vh, 860px)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: ghostPanelWidth, alignSelf: 'flex-end' }}>
                <div style={{ color: "#ffffff", fontWeight: 900, fontSize: "clamp(10px, 1.2vw, 20px)", letterSpacing: "0.15em", marginBottom: "16px", textTransform: "uppercase", whiteSpace: "nowrap" }}>JOUER</div>
                <button onClick={() => setIsPlayOpen(!isPlayOpen)} style={{ background: "#000", border: '2px solid rgba(255,255,255,0.2)', cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s, border-color 0.2s", width: "clamp(40px, 5vw, 60px)", height: "clamp(40px, 5vw, 60px)", borderRadius: "50%" }} onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.borderColor = '#22C55E'; }} onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}>
                  <span style={{ color: "#22C55E", fontSize: "clamp(18px, 2vw, 24px)", fontWeight: "bold" }}>$</span>
                </button>

                <AnimatePresence>
                  {isPlayOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 24px)',
                        right: 0,
                        left: 'auto',
                        transform: 'none',
                        width: ghostPanelWidth,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '18px',
                        zIndex: 70
                      }}
                    >
                      <div style={{
                        width: '100%',
                        border: '2px solid rgba(255,255,255,0.6)',
                        borderRadius: '14px',
                        padding: '8px 12px',
                        textAlign: 'center',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 'clamp(11px, 1.1vw, 15px)',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: '#F4F4F4',
                        backgroundColor: 'rgba(0,0,0,0.7)'
                      }}>
                        PIXELS | EXPÉRIENCE | NIVEAU | NOTORIÉTÉ | SAVOIR
                      </div>

                      <p style={{
                        margin: 0,
                        color: '#FFD700',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 'clamp(11px, 1.2vw, 17px)',
                        lineHeight: 1.45,
                        textAlign: 'justify',
                        whiteSpace: 'pre-wrap',
                        letterSpacing: '0.06em'
                      }}>
Pour enrichir un forom public, l’organisation s'appuie sur quatre rôles clés : Super Admins (9), Admins (50), Moderators (100) et Membres (1 000). Chaque contributeur accumule de l’XP pour atteindre le niveau 100, validant ainsi sa maîtrise de l'archivage.

Le moteur de ce savoir, ce sont les Pixels (PX). Pour remplir leur mission, les s-mods et mods disposent d’un budget annuel de 5 000 PX à distribuer. Cette ressource permet de récompenser la création de mémos structurés, transformant les données brutes en intelligence collective souveraine. C’est par cette gestion active des Pixels que la communauté fait « spawn » son assistant local
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: ghostPanelWidth, position: 'absolute', right: 0, bottom: 0, zIndex: 5 }}>
                <div style={{ color: "#ffffff", fontWeight: 900, fontSize: "clamp(10px, 1.2vw, 20px)", letterSpacing: "0.15em", marginBottom: "16px", textTransform: "uppercase", whiteSpace: "nowrap" }}>FINANCER</div>
                <a href="https://laruchequebec.com/fr" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={larucheIcon} alt="La Ruche" style={{ width: "clamp(40px, 5vw, 64px)", height: "clamp(40px, 5vw, 64px)", objectFit: "contain", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
                </a>
              </div>
            </div>

            {/* GHOST VIEW CENTER */}
            <div style={{ flex: '0 1 clamp(380px, 42vw, 660px)', minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: '100%', position: 'relative', zIndex: 45, display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <RomOnboarding currentUser={currentUser || null} isCreateSelected={false} onPhaseChange={setRomPhase} />
              </div>
              
              <div style={{ color: '#FFD700', fontWeight: 900, fontSize: 'clamp(14px, 1.8vw, 28px)', letterSpacing: '0.3em', marginBottom: 'clamp(16px, 2vh, 32px)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>DÉCOUVRIR</div>
              
              <div style={{
                backgroundColor: '#1A1A1A',
                borderRadius: 'clamp(12px, 1.5vw, 24px)',
                padding: 'clamp(10px, 1.8vw, 28px)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(6px, 1vh, 14px)',
                boxSizing: 'border-box',
                zIndex: romPhase === 'public_tour' ? 45 : 1
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: 'clamp(8px, 0.8vw, 11px)', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>{t.public}</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'clamp(5px, 0.8vw, 12px)' }}>
                  <div onClick={() => onSkip?.()} title="Tuto" style={{ backgroundColor: '#000000', borderRadius: 'clamp(6px, 0.7vw, 12px)', aspectRatio: '1 / 1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.25)', transition: 'border-color 0.2s, transform 0.15s', overflow: 'hidden' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFD700'; e.currentTarget.style.transform = 'scale(1.06)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'scale(1)' }}>
                    <img src={tutoIcon} alt="Tuto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i + 1} style={{ backgroundColor: '#3A3A3A', borderRadius: 'clamp(6px, 0.7vw, 12px)', aspectRatio: '1 / 1', opacity: 0.7, cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 'clamp(10px, 1.1vw, 18px)', opacity: 0.5, userSelect: 'none' }}>🔒</span>
                    </div>
                  ))}
                </div>
                <div style={{ margin: 'clamp(2px, 0.5vh, 8px) 0' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.18)' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: 'clamp(8px, 0.8vw, 11px)', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>{t.prive}</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'clamp(5px, 0.8vw, 12px)' }}>
                  <div style={{ backgroundColor: '#E3022C', borderRadius: 'clamp(6px, 0.7vw, 12px)', aspectRatio: '1 / 1', opacity: 0.5, cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <span style={{ fontSize: 'clamp(10px, 1.1vw, 18px)', opacity: 0.5, userSelect: 'none' }}>🔒</span>
                  </div>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} style={{ backgroundColor: '#3A3A3A', borderRadius: 'clamp(6px, 0.7vw, 12px)', aspectRatio: '1 / 1', opacity: 0.7, cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 'clamp(10px, 1.1vw, 18px)', opacity: 0.5, userSelect: 'none' }}>🔒</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* GHOST VIEW RIGHT */}
            <div style={{ flex: '0 0 clamp(180px, 20vw, 300px)', minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", position: 'relative', minHeight: 'clamp(520px, 74vh, 860px)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: ghostPanelWidth, alignSelf: 'flex-start' }}>
                <div style={{ color: "#ffffff", fontWeight: 900, fontSize: "clamp(10px, 1.2vw, 20px)", letterSpacing: "0.15em", marginBottom: "16px", textTransform: "uppercase", whiteSpace: "nowrap" }}>CRÉER</div>
                <button onClick={() => setIsDeployOpen(!isDeployOpen)} style={{ background: "#000", border: '2px solid rgba(255,255,255,0.2)', cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s, border-color 0.2s", width: "clamp(40px, 5vw, 60px)", height: "clamp(40px, 5vw, 60px)", borderRadius: "50%" }} onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.borderColor = '#F97316'; }} onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}>
                  <span style={{ color: "#F97316", fontSize: "clamp(18px, 2vw, 24px)", fontWeight: "bold" }}>!</span>
                </button>

                <AnimatePresence>
                  {isDeployOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 24px)',
                        left: 0,
                        transform: 'none',
                        width: ghostPanelWidth,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '18px',
                        zIndex: 70
                      }}
                    >
                      <div style={{
                        width: '100%',
                        border: '2px solid rgba(255,255,255,0.7)',
                        borderRadius: '14px',
                        padding: '8px 12px',
                        textAlign: 'center',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 'clamp(11px, 1.1vw, 15px)',
                        letterSpacing: '0.18em',
                        color: '#111111',
                        backgroundColor: '#F5F5F5'
                      }}>
                        sudo ./forom-core --start-server --local-port 25565
                      </div>

                      <p style={{
                        margin: 0,
                        color: '#FFD700',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 'clamp(11px, 1.2vw, 17px)',
                        lineHeight: 1.45,
                        textAlign: 'justify',
                        whiteSpace: 'pre-wrap',
                        letterSpacing: '0.06em'
                      }}>
Envie de bâtir ton propre bastion d'intelligence ? Créer un serveur forom en local est aussi simple que de lancer un monde Minecraft. En hébergeant ton instance, tu deviens le gardien d'un moteur RAG souverain directement sur ta machine.

Invite tes amis à rejoindre les rangs des Membres ou des Modérateurs. Ensemble, archivez les mémos pour gagner des Pixels et grimper jusqu'au niveau 100. C’est ici que la mission prend vie : chaque connexion renforce l'IA de votre communauté. Préparez-vous au « spawn » de ROM et prenez enfin le contrôle total de vos données !
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: ghostPanelWidth, position: 'absolute', left: 0, bottom: 0, zIndex: 5 }}>
                <div style={{ color: "#ffffff", fontWeight: 900, fontSize: "clamp(10px, 1.2vw, 20px)", letterSpacing: "0.15em", marginBottom: "16px", textTransform: "uppercase", whiteSpace: "nowrap" }}>CONTRIBUER</div>
                <a href="https://github.com/Forom-ets/forom" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={githubIcon} alt="GitHub" style={{ width: "clamp(40px, 5vw, 60px)", height: "clamp(40px, 5vw, 60px)", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.8, transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.8"} />
                </a>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* LOGGED IN VIEW LEFT: REJOINDRE */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: romPhase === 'public_tour' ? 45 : 1 }}>
              <div style={{ color: '#E85C5C', fontWeight: 900, fontSize: 'clamp(13px, 1.6vw, 26px)', letterSpacing: '0.25em', marginBottom: 'clamp(10px, 2vh, 24px)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{t.rejoindre}</div>
              <div style={{ backgroundColor: '#1A1A1A', borderRadius: 'clamp(12px, 1.5vw, 24px)', padding: 'clamp(10px, 1.8vw, 28px)', width: '100%', display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1vh, 14px)', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: 'clamp(8px, 0.8vw, 11px)', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>{t.public}</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'clamp(5px, 0.8vw, 12px)' }}>
                  <div onClick={() => onSkip?.()} title="Tuto" style={{ backgroundColor: '#000000', borderRadius: 'clamp(6px, 0.7vw, 12px)', aspectRatio: '1 / 1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.25)', transition: 'border-color 0.2s, transform 0.15s', overflow: 'hidden' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFD700'; e.currentTarget.style.transform = 'scale(1.06)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'scale(1)' }}>
                    <img src={tutoIcon} alt="Tuto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i + 1} style={{ backgroundColor: '#3A3A3A', borderRadius: 'clamp(6px, 0.7vw, 12px)', aspectRatio: '1 / 1', opacity: 0.7, cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 'clamp(10px, 1.1vw, 18px)', opacity: 0.5, userSelect: 'none' }}>🔒</span>
                    </div>
                  ))}
                </div>
                <div style={{ margin: 'clamp(2px, 0.5vh, 8px) 0' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.18)' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: 'clamp(8px, 0.8vw, 11px)', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>{t.prive}</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'clamp(5px, 0.8vw, 12px)' }}>
                  <div onClick={() => { if (currentUser === 'xylo' || currentUser === 'ets') onJoinEts?.() }} title="Club étudiants ÉTS" style={{ backgroundColor: '#E3022C', borderRadius: 'clamp(6px, 0.7vw, 12px)', aspectRatio: '1 / 1', cursor: (currentUser === 'xylo' || currentUser === 'ets') ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.25)', transition: 'border-color 0.2s, transform 0.15s', overflow: 'hidden', position: 'relative', opacity: (currentUser === 'xylo' || currentUser === 'ets') ? 1 : 0.5 }} onMouseEnter={(currentUser === 'xylo' || currentUser === 'ets') ? (e => { e.currentTarget.style.borderColor = '#ffffff'; e.currentTarget.style.transform = 'scale(1.06)' }) : undefined} onMouseLeave={(currentUser === 'xylo' || currentUser === 'ets') ? (e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'scale(1)' }) : undefined}>
                    {(currentUser === 'xylo' || currentUser === 'ets') ? (
                      <img src={etsIcon} alt="ÉTS" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 'clamp(10px, 1.1vw, 18px)', opacity: 0.5, userSelect: 'none' }}>🔒</span>
                    )}
                  </div>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} style={{ backgroundColor: '#3A3A3A', borderRadius: 'clamp(6px, 0.7vw, 12px)', aspectRatio: '1 / 1', opacity: 0.7, cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 'clamp(10px, 1.1vw, 18px)', opacity: 0.5, userSelect: 'none' }}>🔒</span>
                    </div>
                  ))}
                </div>
              </div>

              <a href="https://github.com/Forom-ets/forom" target="_blank" rel="noopener noreferrer" style={{ marginTop: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src={githubIcon} alt="GitHub" style={{ width: 'clamp(28px, 3.5vw, 52px)', height: 'clamp(28px, 3.5vw, 52px)', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.8, transition: 'opacity 0.2s' }} onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')} />
              </a>
            </div>

            {/* LOGGED IN VIEW CENTER */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '100%', position: 'relative', zIndex: 45, display: 'flex', justifyContent: 'center' }}>
                <RomOnboarding currentUser={currentUser || null} isCreateSelected={isCreateSelected} onPhaseChange={setRomPhase} />
              </div>
              <div style={{ position: 'relative', zIndex: 45, marginTop: '24px', minHeight: '60px', display: 'flex', justifyContent: 'center', width: '100%', padding: '0 20px', boxSizing: 'border-box', pointerEvents: 'none' }}>
                <span style={{ color: '#FFD700', fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(12px, 1.2vw, 16px)', textAlign: 'center', lineHeight: 1.6, opacity: (romPhase === 'idle' || romPhase === 0) ? 0 : 0.8, transition: 'opacity 0.4s', whiteSpace: 'pre-wrap', maxWidth: '500px', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                  <DelayedTypewriterText key={`${activeLang}-${romPhase}`} text={getRomTranslation(romPhase)} delayMs={200} />
                </span>
              </div>
            </div>

            {/* LOGGED IN VIEW RIGHT: CRÉER */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ color: '#2563EB', fontWeight: 900, fontSize: 'clamp(13px, 1.6vw, 26px)', letterSpacing: '0.25em', marginBottom: 'clamp(10px, 2vh, 24px)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{t.creer}</div>
              <div onClick={() => setIsCreateSelected(true)} style={{ backgroundColor: isCreateSelected ? '#0d2b5e' : '#1A1A1A', borderRadius: 'clamp(12px, 1.5vw, 24px)', width: '100%', aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `3px solid ${isCreateSelected ? '#2563EB' : 'transparent'}`, boxSizing: 'border-box', transition: 'border-color 0.25s, background-color 0.25s' }}>
                <span style={{ color: 'white', fontSize: 'clamp(28px, 4vw, 64px)', fontWeight: 300, lineHeight: 1 }}>+</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* FOOTER AREA (Connect key and Confirmer) */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(14px, 2.5vh, 36px)', flexShrink: 0 }}>
        {/* CONNECT WITH A KEY */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: 'clamp(10px, 1.1vw, 15px)', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.connectKey}</span>
          <input
            type="text"
            value={joinKey}
            onChange={e => setJoinKey(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && joinKey.trim().length > 0) {
                setJoinStep('color')
              }
            }}
            placeholder="FRM-XXXX-XXXX"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', padding: '6px 12px', color: '#fff', fontSize: 'clamp(12px, 1.4vw, 18px)', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center', width: 'clamp(140px, 16vw, 200px)', outline: 'none', transition: 'border-color 0.2s' }}
            onFocus={(e) => e.target.style.borderColor = '#FFD700'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
          />
        </div>

        {/* CONFIRMER BUTTON */}
        <button
          onClick={() => { if (isCreateSelected && currentUser) onConfirm() }}
          disabled={!currentUser || !isCreateSelected}
          style={{
            padding: 'clamp(10px, 1.5vh, 18px) clamp(40px, 5vw, 80px)',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: 'clamp(14px, 1.5vw, 22px)',
            letterSpacing: '0.05em',
            border: 'none',
            cursor: (!currentUser || !isCreateSelected) ? 'not-allowed' : 'pointer',
            backgroundColor: (currentUser && isCreateSelected) ? '#5B9F65' : 'rgba(91,159,101,0.35)',
            color: (currentUser && isCreateSelected) ? '#ffffff' : 'rgba(255,255,255,0.4)',
            transition: 'background-color 0.2s, color 0.2s',
          }}
        >
          {t.confirmer}
        </button>
      </div>
    </motion.div>
  )
}
