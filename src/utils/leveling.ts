// =============================================================================
// LEVELING UTILITIES
// =============================================================================

// Leveling helper — 10 XP per quest, 10 quests = lvl 1 (100 XP per level)
export function getLevelAndTitle(xp: number) {
  const level = Math.floor(xp / 100)
  let title = 'Citoyen'
  if (level >= 100) title = 'Légende'
  else if (level >= 75) title = 'Soul'
  else if (level >= 50) title = 'Lumière'
  else if (level >= 25) title = 'Mage'

  return { level, title }
}