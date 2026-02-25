import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Mail } from 'lucide-react'
import cedilleIcon from '../assets/icons/cedille.png'
import etsIcon from '../assets/icons/ets.jpg'
import userIcon from '../assets/icons/user.png'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Color-coded letters for "FOROM" branding */
const LOGO_LETTERS = [
  { text: 'F', color: '#FF0000', darkColor: '#FF0000' },
  { text: 'O', color: '#000000', darkColor: '#ffffff' },
  { text: 'R', color: '#FFD700', darkColor: '#FFD700' },
  { text: 'O', color: '#000000', darkColor: '#ffffff' },
  { text: 'M', color: '#0066FF', darkColor: '#0066FF' },
]

/** Animation settings for staggered letter entrance */
const letterAnimation = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
}

// =============================================================================
// COMPONENT
// =============================================================================

interface HeaderProps {
  onTokenClick: () => void
  onSupportClick: () => void
  isDark?: boolean
}

export function Header({ onTokenClick, onSupportClick, isDark = false }: HeaderProps) {
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus search input when opened
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchActive])

  const handleCloseSearch = () => {
    setIsSearchActive(false)
    setSearchQuery('')
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-[3%] relative z-50 flex items-center transition-colors duration-300"
      style={{ paddingTop: '2.2vh', paddingBottom: '1.6vh', backgroundColor: 'var(--color-bg)' }}
    >
      {/* ---- Left group: ETS, Search, FOROM ---- */}
      <div className="flex items-center" style={{ gap: '5%', flex: 1 }}>
        {/* ETS Logo */}
        <motion.a
          href="https://www.etsmtl.ca/experience-etudiante/clubs-etudiants"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center shrink-0"
          style={{ width: '36px', height: '36px' }}
        >
          <img src={etsIcon} alt="ÉTS Montréal" className="w-full h-full object-contain rounded" />
        </motion.a>

        {/* Search Icon / Expanded Search Bar */}
        <div className="shrink-0">
          <AnimatePresence mode="wait">
            {!isSearchActive ? (
              <motion.button
                key="search-trigger"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsSearchActive(true)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="cursor-pointer bg-transparent border-none outline-none"
                style={{ color: isDark ? '#a1a1aa' : '#18181b' }}
                aria-label="Open search"
              >
                <Search size={22} strokeWidth={2.5} />
              </motion.button>
            ) : (
              <motion.div
                key="search-bar"
                initial={{ opacity: 0, width: 44 }}
                animate={{ opacity: 1, width: 280 }}
                exit={{ opacity: 0, width: 44 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="flex items-center gap-2 rounded-full px-3 py-1.5 border-2 transition-colors duration-300"
                style={{
                  backgroundColor: isDark ? '#18181b' : '#ffffff',
                  borderColor: isDark ? '#3f3f46' : '#d4d4d8',
                }}
              >
                <Search size={18} className="shrink-0" style={{ color: isDark ? '#71717a' : '#a1a1aa' }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && handleCloseSearch()}
                  placeholder="Search FOROM..."
                  className="flex-1 bg-transparent outline-none text-sm transition-colors duration-300"
                  style={{
                    color: isDark ? '#fafafa' : '#18181b',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                />
                <motion.button
                  onClick={handleCloseSearch}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="shrink-0 p-0.5 rounded-full cursor-pointer transition-colors duration-300"
                  style={{
                    backgroundColor: isDark ? '#27272a' : '#f4f4f5',
                    color: isDark ? '#a1a1aa' : '#71717a',
                  }}
                  aria-label="Close search"
                >
                  <X size={16} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ---- Center: FOROM Logo ---- */}
      <div className="relative flex items-center justify-center gap-3 shrink-0 mx-[5%]">
        {LOGO_LETTERS.map((letter, index) => (
          <motion.span
            key={index}
            initial={letterAnimation.initial}
            animate={letterAnimation.animate}
            transition={{
              delay: index * 0.1,
              type: 'spring',
              damping: 12,
              stiffness: 100,
            }}
            className="transition-colors duration-300"
            style={{
              fontSize: '44px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 900,
              color: isDark ? letter.darkColor : letter.color,
              lineHeight: 1,
              letterSpacing: '0.04em',
            }}
          >
            {letter.text}
          </motion.span>
        ))}
        {/* Tiny cedille easter-egg dot */}
        <a
          href="https://cedille.etsmtl.ca/"
          target="_blank"
          rel="noopener noreferrer"
          title="Cedille"
          style={{
            position: 'absolute',
            right: '-18px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '14px',
            height: '14px',
            display: 'block',
            borderRadius: '9999px',
            overflow: 'visible',
            cursor: 'pointer',
          }}
        >
          <img
            src={cedilleIcon}
            alt="Cedille"
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        </a>
      </div>

      {/* ---- Right: Mail, Pixel Wallet ($), Help Hub (?), User ---- */}
      <div className="flex items-center justify-end" style={{ gap: '5%', flex: 1 }}>
        {/* Mail / Contact */}
        <motion.a
          href="https://discord.gg/MdeNvRs5R9"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          className="cursor-pointer"
          style={{ color: isDark ? '#a1a1aa' : '#18181b' }}
          title="Contact Us"
        >
          <Mail size={24} strokeWidth={2} />
        </motion.a>

        {/* Pixel Wallet ($) — solid green circle */}
        <motion.button
          onClick={onTokenClick}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          className="rounded-full flex items-center justify-center cursor-pointer border-2 transition-colors duration-300"
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#22c55e',
            borderColor: isDark ? '#166534' : '#15803d',
          }}
          title="Pixel Wallet"
          aria-label="Pixel Wallet"
        >
          <span
            style={{
              fontFamily: "'Jersey 15', Montserrat, sans-serif",
              fontWeight: 900,
              fontSize: '20px',
              lineHeight: 1,
              color: '#ffffff',
            }}
          >
            $
          </span>
        </motion.button>

        {/* Help Hub (?) — solid orange circle */}
        <motion.button
          onClick={onSupportClick}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          className="rounded-full flex items-center justify-center cursor-pointer border-2 transition-colors duration-300"
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#f97316',
            borderColor: isDark ? '#9a3412' : '#c2410c',
          }}
          title="Help Hub"
          aria-label="Help Hub"
        >
          <span
            style={{
              fontFamily: "'Jersey 15', Montserrat, sans-serif",
              fontWeight: 900,
              fontSize: '20px',
              lineHeight: 1,
              color: '#ffffff',
            }}
          >
            ?
          </span>
        </motion.button>

        {/* User Profile */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center cursor-pointer"
          style={{ width: '36px', height: '36px' }}
        >
          <img
            src={userIcon}
            alt="User Profile"
            className="w-full h-full object-contain"
            style={{ filter: isDark ? 'invert(1)' : 'none' }}
          />
        </motion.div>
      </div>
    </motion.header>
  )
}
