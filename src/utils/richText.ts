// =============================================================================
// RICH TEXT UTILITIES
// =============================================================================

export type Block = {
  id: string
  type: 'h1' | 'h2' | 'h3' | 'paragraph' | 'ul' | 'ol' | 'quote'
  content: string
}

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

export { uid }

export function serializeBlocks(blocks: Block[]): string {
  return blocks.map(b => {
    switch (b.type) {
      case 'h1':    return `# ${b.content}`
      case 'h2':    return `## ${b.content}`
      case 'h3':    return `### ${b.content}`
      case 'ul':    return `- ${b.content}`
      case 'ol':    return `1. ${b.content}`
      case 'quote': return `> ${b.content}`
      default:      return b.content
    }
  }).join('\n')
}

export function deserializeBlocks(text: string): Block[] {
  if (!text.trim()) return [{ id: uid(), type: 'paragraph', content: '' }]
  return text.split('\n').map(line => {
    if (line.startsWith('### ')) return { id: uid(), type: 'h3',       content: line.slice(4) }
    if (line.startsWith('## '))  return { id: uid(), type: 'h2',       content: line.slice(3) }
    if (line.startsWith('# '))   return { id: uid(), type: 'h1',       content: line.slice(2) }
    if (line.startsWith('- '))   return { id: uid(), type: 'ul',       content: line.slice(2) }
    if (/^\d+\. /.test(line))    return { id: uid(), type: 'ol',       content: line.replace(/^\d+\. /, '') }
    if (line.startsWith('> '))   return { id: uid(), type: 'quote',    content: line.slice(2) }
    return { id: uid(), type: 'paragraph', content: line }
  })
}