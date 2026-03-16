// =============================================================================
// FOROM COLORS
// =============================================================================

export type ForomColor = 'social' | 'guardien' | 'creation'

export const FOROM_COLOR_MAP: Record<ForomColor, { bg: string; label: string }> = {
  social:   { bg: '#3333DD', label: 'SOCIAL'   },
  guardien: { bg: '#EE2222', label: 'GUARDIEN' },
  creation: { bg: '#DDFF55', label: 'CRÉATION' },
}