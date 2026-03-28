// =============================================================================
// MEMORY DATA STRUCTURE
// =============================================================================

/** Available WH-questions for memories */
export const WH_QUESTIONS = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
] as const

export type WhQuestion = (typeof WH_QUESTIONS)[number]

export const QUESTION_COLORS: Record<string, string> = {
  '0': '#DF1F24', // Red
  '1': '#EE8712', // Orange (blend red→yellow)
  '2': '#FDF000', // Yellow
  '3': '#7EB71B', // Lime (blend yellow→green)
  '4': '#007F36', // Green
  '5': '#009691', // Teal (blend green→sky blue)
  '6': '#00ADED', // Sky Blue
  '7': '#186DB7', // Medium Blue (blend sky→dark blue)
  '8': '#302E81', // Dark Blue
  '9': '#EC028A', // Magenta
}

export const QUESTION_ORDER: WhQuestion[] = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
]

export interface Memory {
  /** Unique identifier for the memory */
  id: string
  /** Category this memory belongs to */
  category: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J'
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
  /** Optional list of source URLs for this memory */
  sources?: string[]
  /** Whether this memory has been filled by a user */
  isFilled: boolean
}

// =============================================================================
// CATEGORY CONFIGURATION
// =============================================================================

export const CATEGORY_COLORS: Record<string, string> = {
  A: '#881FA0', // Purple
  B: '#4C2CA2', // Purple-Blue blend
  C: '#1139A4', // Blue
  D: '#085C6D', // Blue-Green blend
  E: '#007F36', // Green
  F: '#7EB21B', // Green-Yellow blend
  G: '#FDE500', // Yellow
  H: '#FEA80B', // Yellow-Orange blend
  I: '#FE6C17', // Orange
  J: '#F60B0F', // Red
}

export const CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] as const
export type CategoryType = (typeof CATEGORIES)[number]

export const ITEMS_PER_ROW = 10
export const TOTAL_ROWS = 10

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
// LOAD JSON MEMOS
// =============================================================================

function loadMemoriesFromJson(): Memory[] {
  const memories: Memory[] = []
  
  // Use Vite's glob import to load all 100 JSON memos synchronously
  type MemoModule = {
    grid_coordinate?: string
    title?: string
    resume?: string
    video_url?: string
    image_url?: string
    sources?: string[]
    question?: string
    videoUrl?: string
    thumbnailUrl?: string
    [key: string]: unknown
  }
  const memoModules = import.meta.glob('./memos/V1/*.json', { eager: true }) as Record<string, MemoModule>;

  CATEGORIES.forEach((category) => {
    for (let i = 0; i < ITEMS_PER_ROW; i++) {
      // Look for a memo module that matches the grid coordinate
      const coord = `${category}${i}`;
      let matchedMemo: MemoModule | null = null;

      for (const path in memoModules) {
        if (memoModules[path].grid_coordinate === coord) {
          matchedMemo = memoModules[path];
          break;
        }
      }

      if (matchedMemo) {
        memories.push({
          id: `${category.toLowerCase()}-${i}`,
          category,
          question: String(i) as WhQuestion,
          title: matchedMemo.title || `Emplacement ${i + 1}`,
          description: matchedMemo.resume || '',
          videoUrl: matchedMemo.video_url || null,
          thumbnailUrl: matchedMemo.image_url || null,
          sources: matchedMemo.sources || [],
          isFilled: true,
        });
      } else {
        memories.push({
          id: `${category.toLowerCase()}-${i}`,
          category,
          question: String(i) as WhQuestion,
          title: `Emplacement ${i + 1}`,
          description: 'Cet emplacement est disponible. Ajoutez une vidéo ou un contenu pour le remplir.',
          videoUrl: null,
          thumbnailUrl: null,
          isFilled: false,
        });
      }
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
export const MEMORIES: Memory[] = loadMemoriesFromJson()

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
