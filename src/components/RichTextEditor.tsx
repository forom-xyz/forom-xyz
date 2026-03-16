import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronRight } from 'lucide-react'
import { serializeBlocks, deserializeBlocks, type Block, uid } from '../utils/richText'

// =============================================================================
// TYPES
// =============================================================================

type BlockType = Block['type']

interface SlashCommand {
  label: string
  description: string
  type: BlockType
  shortcut: string
  icon: string
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SLASH_COMMANDS: SlashCommand[] = [
  { label: 'Paragraphe',       description: 'Texte normal',       type: 'paragraph', shortcut: '',    icon: '¶'  },
  { label: 'Titre 1',          description: 'Grand titre',        type: 'h1',        shortcut: '#',   icon: 'H1' },
  { label: 'Titre 2',          description: 'Titre moyen',        type: 'h2',        shortcut: '##',  icon: 'H2' },
  { label: 'Titre 3',          description: 'Petit titre',        type: 'h3',        shortcut: '###', icon: 'H3' },
  { label: 'Liste à puces',    description: 'Liste non ordonnée', type: 'ul',        shortcut: '-',   icon: '•'  },
  { label: 'Liste numérotée',  description: 'Liste ordonnée',     type: 'ol',        shortcut: '1.',  icon: '1.' },
  { label: 'Citation',         description: 'Bloc de citation',   type: 'quote',     shortcut: '>',   icon: '"'  },
]

// =============================================================================
// HELPERS
// =============================================================================

function placeCaretAtEnd(el: HTMLElement) {
  const range = document.createRange()
  const sel = window.getSelection()
  range.selectNodeContents(el)
  range.collapse(false)
  sel?.removeAllRanges()
  sel?.addRange(range)
}

// =============================================================================
// BLOCK STYLES
// =============================================================================

function getBlockStyle(type: BlockType): React.CSSProperties {
  switch (type) {
    case 'h1':    return { fontSize: '20px', fontWeight: 800, fontFamily: "'Montserrat', sans-serif", lineHeight: '1.3', paddingBottom: '2px' }
    case 'h2':    return { fontSize: '16px', fontWeight: 700, fontFamily: "'Montserrat', sans-serif", lineHeight: '1.3', paddingBottom: '2px' }
    case 'h3':    return { fontSize: '14px', fontWeight: 700, fontFamily: "'Montserrat', sans-serif", lineHeight: '1.4', paddingBottom: '2px', textDecoration: 'underline' }
    case 'ul':    return { fontSize: '13px', fontFamily: "'Montserrat', sans-serif", lineHeight: '1.7' }
    case 'ol':    return { fontSize: '13px', fontFamily: "'Montserrat', sans-serif", lineHeight: '1.7' }
    case 'quote': return { fontSize: '13px', fontFamily: "'Montserrat', sans-serif", borderLeft: '3px solid #aaa', paddingLeft: '10px', color: '#555', fontStyle: 'italic', lineHeight: '1.7' }
    default:      return { fontSize: '13px', fontFamily: "'Montserrat', sans-serif", lineHeight: '1.7' }
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  maxWords?: number
  placeholder?: string
}

export default function RichTextEditor({
  value,
  onChange,
  maxWords = 400,
  placeholder = 'Tapez "/" pour les commandes…',
}: RichTextEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(() => deserializeBlocks(value))
  const [activeId, setActiveId] = useState<string>(() => deserializeBlocks(value)[0]?.id ?? '')
  const [slashMenu, setSlashMenu] = useState<{ blockId: string; query: string; top: number; left: number } | null>(null)
  const [menuIndex, setMenuIndex] = useState(0)
  const [blink, setBlink] = useState(true)

  const refs = useRef<Record<string, HTMLDivElement | null>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const isInitialized = useRef(false)

  // Blinking cursor effect
  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 530)
    return () => clearInterval(t)
  }, [])

  // Initialize DOM content on mount only
  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true
    blocks.forEach(block => {
      const el = refs.current[block.id]
      if (el && el.innerText !== block.content) {
        el.innerText = block.content
      }
    })
  }, [blocks])

  // Push serialized value outward
  const emitChange = useCallback((newBlocks: Block[]) => {
    onChange(serializeBlocks(newBlocks))
  }, [onChange])

  // -----------------------------------------------------------------------
  // Block mutations
  // -----------------------------------------------------------------------

  const updateBlockContent = useCallback((id: string, content: string) => {
    setBlocks(prev => {
      const next = prev.map(b => b.id === id ? { ...b, content } : b)
      emitChange(next)
      return next
    })
  }, [emitChange])

  const changeBlockType = useCallback((id: string, type: BlockType) => {
    setBlocks(prev => {
      const next = prev.map(b => b.id === id ? { ...b, type } : b)
      emitChange(next)
      return next
    })
    setTimeout(() => {
      const el = refs.current[id]
      if (el) { el.focus(); placeCaretAtEnd(el) }
    }, 0)
  }, [emitChange])

  const insertBlockAfter = useCallback((afterId: string, type: BlockType = 'paragraph') => {
    const newBlock: Block = { id: uid(), type, content: '' }
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === afterId)
      const next = [...prev]
      next.splice(idx + 1, 0, newBlock)
      emitChange(next)
      return next
    })
    setActiveId(newBlock.id)
    setTimeout(() => {
      const el = refs.current[newBlock.id]
      if (el) { el.innerText = ''; el.focus() }
    }, 0)
  }, [emitChange])

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prev => {
      if (prev.length <= 1) {
        // Just clear
        const next = [{ ...prev[0], content: '' }]
        emitChange(next)
        const el = refs.current[prev[0].id]
        if (el) el.innerText = ''
        return next
      }
      const idx = prev.findIndex(b => b.id === id)
      const next = prev.filter(b => b.id !== id)
      const focusId = next[Math.max(0, idx - 1)]?.id
      if (focusId) {
        setActiveId(focusId)
        setTimeout(() => {
          const el = refs.current[focusId]
          if (el) { el.focus(); placeCaretAtEnd(el) }
        }, 0)
      }
      emitChange(next)
      return next
    })
  }, [emitChange])

  // -----------------------------------------------------------------------
  // Slash command
  // -----------------------------------------------------------------------

  const openSlashMenu = useCallback((blockId: string) => {
    const el = refs.current[blockId]
    const container = containerRef.current
    if (!el || !container) return
    const elRect = el.getBoundingClientRect()
    const cRect = container.getBoundingClientRect()
    setSlashMenu({ blockId, query: '', top: elRect.bottom - cRect.top + 4, left: 0 })
    setMenuIndex(0)
  }, [])

  const applySlashCommand = useCallback((blockId: string, type: BlockType) => {
    const el = refs.current[blockId]
    if (el) {
      const text = el.innerText
      const slashIdx = text.lastIndexOf('/')
      const newContent = slashIdx >= 0 ? text.slice(0, slashIdx) : text
      el.innerText = newContent
      updateBlockContent(blockId, newContent)
      placeCaretAtEnd(el)
    }
    changeBlockType(blockId, type)
    setSlashMenu(null)
  }, [changeBlockType, updateBlockContent])

  const filteredCommands = slashMenu
    ? SLASH_COMMANDS.filter(c =>
        !slashMenu.query ||
        c.label.toLowerCase().includes(slashMenu.query.toLowerCase()) ||
        c.type.includes(slashMenu.query.toLowerCase())
      )
    : []

  // -----------------------------------------------------------------------
  // Event handlers
  // -----------------------------------------------------------------------

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, block: Block) => {
    if (slashMenu) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setMenuIndex(i => (i + 1) % filteredCommands.length); return }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setMenuIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length); return }
      if (e.key === 'Escape')    { setSlashMenu(null); return }
      if (e.key === 'Enter')     { e.preventDefault(); if (filteredCommands[menuIndex]) applySlashCommand(slashMenu.blockId, filteredCommands[menuIndex].type); return }
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      const continueAs: BlockType = (block.type === 'ul' || block.type === 'ol') ? block.type : 'paragraph'
      insertBlockAfter(block.id, continueAs)
      return
    }

    if (e.key === 'Backspace') {
      const el = refs.current[block.id]
      if (el && el.innerText.length === 0) {
        e.preventDefault()
        if (block.type !== 'paragraph') changeBlockType(block.id, 'paragraph')
        else deleteBlock(block.id)
      }
    }
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>, block: Block) => {
    const el = e.currentTarget
    const text = el.innerText

    // Word limit
    const draft = blocks.map(b => b.id === block.id ? { ...b, content: text } : b)
    const wordCount = serializeBlocks(draft).split(/\s+/).filter(Boolean).length
    if (wordCount > maxWords) {
      el.innerText = block.content
      placeCaretAtEnd(el)
      return
    }

    updateBlockContent(block.id, text)

    // Slash detection
    if (text.endsWith('/')) {
      openSlashMenu(block.id)
    } else if (slashMenu?.blockId === block.id) {
      const slashIdx = text.lastIndexOf('/')
      if (slashIdx >= 0) setSlashMenu(prev => prev ? { ...prev, query: text.slice(slashIdx + 1) } : null)
      else setSlashMenu(null)
    }
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <>
      {/* Placeholder CSS */}
      <style>{`
        .rte-block[data-empty="true"]::before {
          content: attr(data-placeholder);
          color: #bbb;
          pointer-events: none;
          position: absolute;
          left: 0; top: 0;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
        }
        .rte-block { position: relative; }
      `}</style>

      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden', position: 'relative', paddingLeft: '22px', paddingRight: '4px', boxSizing: 'border-box' }}
        onClick={() => {
          // Click on empty space → focus last block
          const lastId = blocks[blocks.length - 1]?.id
          if (lastId) {
            const el = refs.current[lastId]
            if (el) { el.focus(); placeCaretAtEnd(el) }
          }
        }}
      >
        {blocks.map((block, index) => {
          const isActive = activeId === block.id
          const isEmpty = block.content === ''
          const olCount = block.type === 'ol' ? blocks.slice(0, index + 1).filter(b => b.type === 'ol').length : 0

          return (
            <div
              key={block.id}
              style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', marginBottom: '1px' }}
            >
              {/* Blinking ">" marker */}
              <span style={{
                position: 'absolute',
                left: '-20px',
                top: block.type === 'h1' ? '2px' : '3px',
                fontSize: '14px',
                fontWeight: 900,
                color: '#222',
                opacity: isActive ? (blink ? 1 : 0) : 0,
                transition: 'opacity 0.08s',
                userSelect: 'none',
                pointerEvents: 'none',
                fontFamily: 'monospace',
              }}>
                <ChevronRight size={14} strokeWidth={3} />
              </span>

              {/* List prefix */}
              {block.type === 'ul' && (
                <span style={{ fontSize: '16px', lineHeight: '1.7', marginRight: '6px', flexShrink: 0, userSelect: 'none' }}>•</span>
              )}
              {block.type === 'ol' && (
                <span style={{ fontSize: '13px', lineHeight: '1.7', marginRight: '6px', flexShrink: 0, minWidth: '18px', userSelect: 'none', fontFamily: "'Montserrat', sans-serif" }}>{olCount}.</span>
              )}

              <div
                ref={el => { refs.current[block.id] = el }}
                contentEditable
                suppressContentEditableWarning
                className="rte-block"
                data-empty={isEmpty ? 'true' : 'false'}
                data-placeholder={isEmpty ? (isActive ? placeholder : '') : ''}
                onFocus={() => setActiveId(block.id)}
                onKeyDown={e => handleKeyDown(e, block)}
                onInput={e => handleInput(e, block)}
                style={{
                  flex: 1,
                  outline: 'none',
                  minHeight: '22px',
                  wordBreak: 'break-word',
                  caretColor: 'black',
                  ...getBlockStyle(block.type),
                }}
              />
            </div>
          )
        })}

        {/* Slash command palette */}
        {slashMenu && filteredCommands.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: slashMenu.top,
              left: slashMenu.left + 22,
              background: 'white',
              border: '2.5px solid black',
              borderRadius: '14px',
              boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
              zIndex: 9999,
              overflow: 'hidden',
              minWidth: '220px',
            }}
          >
            <div style={{ padding: '6px 10px 4px', fontSize: '10px', fontWeight: 700, color: '#888', letterSpacing: '0.08em', fontFamily: 'monospace', textTransform: 'uppercase' }}>
              Commandes
            </div>
            {filteredCommands.map((cmd, i) => (
              <div
                key={cmd.type}
                onMouseDown={e => { e.preventDefault(); applySlashCommand(slashMenu.blockId, cmd.type) }}
                onMouseEnter={() => setMenuIndex(i)}
                style={{
                  padding: '7px 14px',
                  cursor: 'pointer',
                  background: i === menuIndex ? '#f3f4f6' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'background 0.1s',
                }}
              >
                <span style={{
                  fontSize: '11px', fontFamily: 'monospace', fontWeight: 700,
                  minWidth: '24px', textAlign: 'center',
                  background: '#eee', borderRadius: '6px', padding: '2px 5px', color: '#333'
                }}>
                  {cmd.icon}
                </span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: "'Montserrat', sans-serif" }}>{cmd.label}</div>
                  <div style={{ fontSize: '11px', color: '#888', fontFamily: "'Montserrat', sans-serif" }}>{cmd.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
