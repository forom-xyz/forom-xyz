// =============================================================================
// MEMORY DATA STRUCTURE
// =============================================================================

/** Available WH-questions for memories */
export const WH_QUESTIONS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
] as const

export type WhQuestion = (typeof WH_QUESTIONS)[number]

export const QUESTION_COLORS: Record<string, string> = {
  '1': '#F59E0B',
  '2': '#FACC15',
  '3': '#84CC16',
  '4': '#10B981',
  '5': '#0EA5E9',
  '6': '#4F46E5',
  '7': '#8B5CF6',
}

export const QUESTION_ORDER: WhQuestion[] = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
]

export interface Memory {
  /** Unique identifier for the memory */
  id: string
  /** Category this memory belongs to */
  category: 'A' | 'B' | 'C' | 'D' | 'E'
  /** WH-question for this memory (Comment?, Pourquoi?, etc.) */
  question: WhQuestion | null
  /** Title of the memory - acts as the response to the question */
  title: string
  /** Description of the memory (up to 400 words) - tutorial information */
  description: string
  /** Optional YouTube video URL (full URL or video ID) */
  videoUrl: string | null
  /** Optional custom thumbnail URL (overrides YouTube thumbnail) */
  thumbnailUrl: string | null
  /** Whether this memory has been filled by a user */
  isFilled: boolean
}

// =============================================================================
// CATEGORY CONFIGURATION
// =============================================================================

export const CATEGORIES = ['A', 'B', 'C', 'D', 'E'] as const
export type CategoryType = (typeof CATEGORIES)[number]

export const ITEMS_PER_ROW = 20
export const TOTAL_ROWS = 5

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Extracts YouTube video ID from various YouTube URL formats
 * Supports: 
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - Just the video ID itself
 */
export function extractYouTubeId(url: string | null): string | null {
  if (!url) return null
  
  // If it's already just an ID (11 characters, alphanumeric + dash/underscore)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url
  }
  
  try {
    const urlObj = new URL(url)
    
    // youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
      return urlObj.searchParams.get('v')
    }
    
    // youtu.be/VIDEO_ID
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1)
    }
    
    // youtube.com/embed/VIDEO_ID
    if (urlObj.pathname.includes('/embed/')) {
      return urlObj.pathname.split('/embed/')[1]?.split('/')[0] || null
    }
  } catch {
    // Not a valid URL, return null
    return null
  }
  
  return null
}

/**
 * Gets the YouTube thumbnail URL for a video
 */
export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
}

/**
 * Gets the thumbnail URL for a memory
 * Priority: customThumbnail > YouTube thumbnail > null
 */
export function getMemoryThumbnail(memory: Memory): string | null {
  if (memory.thumbnailUrl) {
    return memory.thumbnailUrl
  }
  
  const videoId = extractYouTubeId(memory.videoUrl)
  if (videoId) {
    return getYouTubeThumbnail(videoId)
  }
  
  return null
}

/**
 * Checks if a memory has a video
 */
export function hasVideo(memory: Memory): boolean {
  return memory.videoUrl !== null && extractYouTubeId(memory.videoUrl) !== null
}

// =============================================================================
// PLACEHOLDER DATA GENERATION
// =============================================================================

/**
 * Generates placeholder memories for development/testing
 * Creates 100 items (5 categories × 20 items each)
 * All slots are empty by default - ready to be filled with real content
 */
function generatePlaceholderMemories(): Memory[] {
  const memories: Memory[] = []

  CATEGORIES.forEach((category, _categoryIndex) => {
    for (let i = 0; i < ITEMS_PER_ROW; i++) {
      memories.push({
        id: `${category.toLowerCase()}-${i}`,
        category,
        question: null,
        title: `Emplacement ${i + 1}`,
        description: 'Cet emplacement est disponible. Ajoutez une vidéo ou un contenu pour le remplir.',
        videoUrl: null,
        thumbnailUrl: null,
        isFilled: false,
      })
    }
  })

  return memories
}

// =============================================================================
// EXPORTED DATA
// =============================================================================

/**
 * All memories organized by category
 * Edit this array to add real content
 */
export const MEMORIES: Memory[] = generatePlaceholderMemories()

/**
 * Get memories for a specific category
 */
export function getMemoriesByCategory(category: CategoryType): Memory[] {
  return MEMORIES.filter(m => m.category === category)
}

/**
 * Get a specific memory by category and index
 */
export function getMemory(category: CategoryType, index: number): Memory | null {
  const categoryMemories = getMemoriesByCategory(category)
  return categoryMemories[index] ?? null
}

/**
 * Get a specific memory by its global index (0-99)
 */
export function getMemoryByGlobalIndex(index: number): Memory | null {
  return MEMORIES[index] ?? null
}

/**
 * Update a memory in the global array
 */
export function updateMemory(
  category: CategoryType,
  index: number,
  updates: Partial<Omit<Memory, 'id' | 'category'>>
): Memory | null {
  const categoryMemories = getMemoriesByCategory(category)
  const memory = categoryMemories[index]
  if (!memory) return null

  // Find the memory in the global array and update it
  const globalIndex = MEMORIES.findIndex(m => m.id === memory.id)
  if (globalIndex === -1) return null

  MEMORIES[globalIndex] = {
    ...MEMORIES[globalIndex],
    ...updates,
  }

  return MEMORIES[globalIndex]
}

/**
 * Get memories organized by rows for the carousel
 * Returns a 2D array: rows[categoryIndex][itemIndex]
 */
export function getMemoriesGrid(): Memory[][] {
  return CATEGORIES.map(category => getMemoriesByCategory(category))
}
