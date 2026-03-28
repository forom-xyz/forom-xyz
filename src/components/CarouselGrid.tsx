import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, easeOut, easeIn } from 'framer-motion'
import { MemoryBox } from './MemoryBox'
import { MemoryModal } from './MemoryModal'
import { getMemory, ITEMS_PER_ROW, QUESTION_ORDER, QUESTION_COLORS, CATEGORY_COLORS } from '../data/memories'
import type { Memory, CategoryType } from '../data/memories'
import { mixColors } from '../utils/colors'
import { Sidebar } from './Sidebar'

// =============================================================================
// TYPES
// =============================================================================

interface CarouselGridProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  isDark?: boolean
  isRubixView?: boolean
  onCloseRubix?: () => void
  acceptedQuestId?: string | null
  onQuestComplete?: (questId: string) => void
  questionLabels?: Record<string, string>
  categoryLabels?: Record<string, string>
  personalQuests?: Array<{ id: string; category: string; question: string | null; title: string; completed?: boolean }>
  isEmptyGrid?: boolean
  isEtsForom?: boolean
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Color mapping for each category - defines border colors for video boxes */

/** Fallback color for categories without defined colors */
const DEFAULT_COLOR = '#E5E7EB'

/** Maximum horizontal scroll index (20 rectangles per row - 1 = 19) */
const MAX_HORIZONTAL_INDEX = ITEMS_PER_ROW - 1



// =============================================================================
// HELPER
// =============================================================================

// =============================================================================
// COMPONENT
// =============================================================================

export function CarouselGrid({
  categories,
  activeCategory,
  onCategoryChange,
  isDark = false,
  isRubixView = false,
  onCloseRubix,
  acceptedQuestId = null,
  onQuestComplete,
  questionLabels = {},
  categoryLabels = {},
  personalQuests = [],
  isEmptyGrid = false,
  isEtsForom = false,
}: CarouselGridProps) {
  // Start at horizontal index 5 so that the center tile (5 + activeIndex*10) hits 46 when paired with category E
  const [horizontalIndex, setHorizontalIndex] = useState(5)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  const [memoryUpdateKey, setMemoryUpdateKey] = useState(0) // For triggering re-renders
  const activeIndex = categories.indexOf(activeCategory)
  const gridRef = useRef<HTMLDivElement | null>(null)

  // Grid swipe-drag state
  const [isGridDragging, setIsGridDragging] = useState(false)
  const gridDragOrigin = useRef<{ x: number; y: number } | null>(null)
  const gridDragMoved = useRef(false)

  // Helper to get processed memory (locked if isEmptyGrid)
  const getProcessedMemory = useCallback((cat: CategoryType, index: number) => {
    let mem = getMemory(cat, index)
    if (isEmptyGrid && mem) {
      mem = { ...mem, isFilled: false, videoUrl: null, description: '', sources: [], title: `Emplacement ${index + 1}` }
    }
    return mem
  }, [isEmptyGrid])

  // Get current memory data for modal
  let currentMemory = getProcessedMemory(categories[activeIndex] as CategoryType, horizontalIndex)
  let currentColor = DEFAULT_COLOR

  if (currentMemory) {
    const matchedQuest = personalQuests.find(q => q.category === currentMemory?.category && q.question === currentMemory?.question);
    if (matchedQuest) {
      const catColor = CATEGORY_COLORS[currentMemory.category] || '#ffffff';
      const tagColor = currentMemory.question ? (QUESTION_COLORS[currentMemory.question] || '#888888') : '#888888';
      currentColor = mixColors(catColor, tagColor);
      currentMemory = { ...currentMemory, title: matchedQuest.title };
    }
  }

  // Handle memory update from modal
  const handleMemoryUpdate = useCallback((_updatedMemory: Memory) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    // Force re-render of the grid to reflect changes
    setMemoryUpdateKey(prev => prev + 1)
  }, [])

  // ---------------------------------------------------------------------------
  // Navigation Handlers (memoized to prevent unnecessary re-renders)
  // ---------------------------------------------------------------------------

  const handlePrevCategory = useCallback(() => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : categories.length - 1
    onCategoryChange(categories[newIndex])
  }, [activeIndex, categories, onCategoryChange])

  const handleNextCategory = useCallback(() => {
    const newIndex = activeIndex < categories.length - 1 ? activeIndex + 1 : 0
    onCategoryChange(categories[newIndex])
  }, [activeIndex, categories, onCategoryChange])

  const handlePrevVideo = useCallback(() => {
    setSlideDirection('left')
    setHorizontalIndex(prev => prev > 0 ? prev - 1 : MAX_HORIZONTAL_INDEX)
  }, [])

  const handleNextVideo = useCallback(() => {
    setSlideDirection('right')
    setHorizontalIndex(prev => prev < MAX_HORIZONTAL_INDEX ? prev + 1 : 0)
  }, [])



  // ---------------------------------------------------------------------------
  // Grid swipe-drag (hold + drag on the grid itself)
  // ---------------------------------------------------------------------------
  const DRAG_THRESHOLD = 40  // px before a navigation fires
  const DRAG_COOLDOWN = 350  // ms between navigations

  const gridDragCooling = useRef(false)
  const gridDragAccX = useRef(0)
  const gridDragAccY = useRef(0)
  const gridDragLastPos = useRef<{ x: number; y: number } | null>(null)

  const handleGridMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    gridDragOrigin.current = { x: e.clientX, y: e.clientY }
    gridDragLastPos.current = { x: e.clientX, y: e.clientY }
    gridDragMoved.current = false
    gridDragAccX.current = 0
    gridDragAccY.current = 0
    setIsGridDragging(true)
  }, [])

  const handleGridMouseMove = useCallback((e: MouseEvent) => {
    if (!isGridDragging || !gridDragLastPos.current) return

    const dx = e.clientX - gridDragLastPos.current.x
    const dy = e.clientY - gridDragLastPos.current.y
    gridDragLastPos.current = { x: e.clientX, y: e.clientY }

    const totalDx = Math.abs(e.clientX - (gridDragOrigin.current?.x ?? e.clientX))
    const totalDy = Math.abs(e.clientY - (gridDragOrigin.current?.y ?? e.clientY))
    if (totalDx > 5 || totalDy > 5) gridDragMoved.current = true

    if (gridDragCooling.current) return

    gridDragAccX.current += dx
    gridDragAccY.current += dy

    const absX = Math.abs(gridDragAccX.current)
    const absY = Math.abs(gridDragAccY.current)

    if (absY >= DRAG_THRESHOLD && absY >= absX) {
      if (gridDragAccY.current < 0) handleNextCategory()   // drag up → next row
      else handlePrevCategory()                             // drag down → prev row
      gridDragAccX.current = 0
      gridDragAccY.current = 0
      gridDragCooling.current = true
      setTimeout(() => { gridDragCooling.current = false }, DRAG_COOLDOWN)
    } else if (absX >= DRAG_THRESHOLD && absX > absY) {
      if (gridDragAccX.current < 0) handleNextVideo()      // drag left → next col
      else handlePrevVideo()                               // drag right → prev col
      gridDragAccX.current = 0
      gridDragAccY.current = 0
      gridDragCooling.current = true
      setTimeout(() => { gridDragCooling.current = false }, DRAG_COOLDOWN)
    }
  }, [isGridDragging, handleNextCategory, handlePrevCategory, handleNextVideo, handlePrevVideo])

  const handleGridMouseUp = useCallback(() => {
    setIsGridDragging(false)
    gridDragLastPos.current = null
  }, [])

  useEffect(() => {
    if (isGridDragging) {
      window.addEventListener('mousemove', handleGridMouseMove)
      window.addEventListener('mouseup', handleGridMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleGridMouseMove)
        window.removeEventListener('mouseup', handleGridMouseUp)
      }
    }
  }, [isGridDragging, handleGridMouseMove, handleGridMouseUp])

  // Handle mouse wheel with resistance and cooldown to avoid rapid skips
  useEffect(() => {
    const THRESHOLD = 80 // required accumulated delta before action
    const COOLDOWN_MS = 450 // cooldown after a triggered navigation

    let acc = 0
    let cooling = false
    let lastAxis: 'x' | 'y' | null = null

    const handleWheel = (e: WheelEvent) => {
      // Don't handle wheel events if modal is open
      if (isModalOpen) return
      if (!gridRef.current?.contains(e.target as Node)) return
      e.preventDefault()

      const isVertical = Math.abs(e.deltaY) > Math.abs(e.deltaX)
      const axis = isVertical ? 'y' : 'x'
      const delta = isVertical ? e.deltaY : e.deltaX

      // Reset accumulator when axis changes
      if (lastAxis && lastAxis !== axis) acc = 0
      lastAxis = axis

      if (cooling) return

      acc += delta

      if (Math.abs(acc) >= THRESHOLD) {
        if (isVertical) {
          if (acc > 0) handleNextCategory()
          else handlePrevCategory()
        } else {
          if (acc > 0) handleNextVideo()
          else handlePrevVideo()
        }

        acc = 0
        cooling = true
        setTimeout(() => { cooling = false }, COOLDOWN_MS)
      }
    }

    const node = gridRef.current
    if (node) {
      node.addEventListener('wheel', handleWheel, { passive: false })
      return () => node.removeEventListener('wheel', handleWheel)
    }
  }, [isModalOpen, handlePrevCategory, handleNextCategory, handlePrevVideo, handleNextVideo])

  /** Handle click on a video box to navigate to it */
  const handleBoxClick = (rowOffset: number, colOffset: number) => {
    // 1. Update Category if clicking a different row
    if (rowOffset !== 0) {
      const newRowIndex = activeIndex + rowOffset
      if (newRowIndex >= 0 && newRowIndex < categories.length) {
        onCategoryChange(categories[newRowIndex])
      }
    }

    // 2. Center the clicked video (update horizontal index)
    if (colOffset !== 0) {
      const newIndex = horizontalIndex + colOffset
      // Respect existing bounds (2 to MAX_HORIZONTAL_INDEX)
      if (newIndex >= 0 && newIndex <= MAX_HORIZONTAL_INDEX) {
        setSlideDirection(colOffset > 0 ? 'right' : 'left')
        setHorizontalIndex(newIndex)
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Render Helpers
  // ---------------------------------------------------------------------------

  /** Returns global video number based on row offset and column position (0-99 total, 20 per row) */
  const getGlobalIndex = (rowOffset: number, col: number): number | null => {
    // Calculate the actual category index for this row
    const rowCategoryIndex = activeIndex + rowOffset
    // If out of bounds, return null (row should be hidden)
    if (rowCategoryIndex < 0 || rowCategoryIndex >= categories.length) return null
    // Each category has 20 numbers: category 0 = 0-19, category 1 = 20-39, etc.
    const baseNumber = rowCategoryIndex * ITEMS_PER_ROW
    const itemIndex = horizontalIndex + col

    // Check if item index is within valid range for this category
    if (itemIndex < 0 || itemIndex >= ITEMS_PER_ROW) return null

    return baseNumber + itemIndex
  }

  /** Returns Memory data based on row offset and column position */
  const getMemoryForPosition = (rowOffset: number, col: number): Memory | null => {
    const rowCategoryIndex = activeIndex + rowOffset
    if (rowCategoryIndex < 0 || rowCategoryIndex >= categories.length) return null

    const category = categories[rowCategoryIndex] as CategoryType
    const itemIndex = horizontalIndex + col

    // Check bounds for the items per category
    if (itemIndex < 0 || itemIndex >= ITEMS_PER_ROW) return null

    return getProcessedMemory(category, itemIndex)
  }

  // ---------------------------------------------------------------------------
  // Filters handlers 
  // ---------------------------------------------------------------------------

  const handleQuestionClick = useCallback((questionStr: string) => {
    let closestRow = -1
    let closestCol = -1
    let minDistance = Infinity

    // Search through all categories and items to find the closest match
    for (let c = 0; c < categories.length; c++) {
      const cat = categories[c] as CategoryType
      for (let i = 0; i < ITEMS_PER_ROW; i++) {
        const mem = getProcessedMemory(cat, i)
        
        // Match if it has the right question
        if (mem && mem.question === questionStr) {
          // Calculate a simple distance metric (row distance heavily weighted to prefer current row, plus horizontal distance)
          const rowDist = Math.abs(c - activeIndex)
          const colDist = Math.abs(i - horizontalIndex)
          // Weight row distance more so we prefer staying in the same category if possible
          const dist = (rowDist * 100) + colDist

          if (dist < minDistance) {
            minDistance = dist
            closestRow = c
            closestCol = i
          }
        }
      }
    }

    if (closestRow !== -1 && closestCol !== -1) {
      // 1. Change category if needed
      if (closestRow !== activeIndex) {
        onCategoryChange(categories[closestRow])
      }
      
      // 2. Slide horizontally
      if (closestCol !== horizontalIndex) {
        setSlideDirection(closestCol > horizontalIndex ? 'right' : 'left')
        setHorizontalIndex(closestCol)
      }
    }
  }, [activeIndex, categories, horizontalIndex, onCategoryChange, getProcessedMemory])

  // ---------------------------------------------------------------------------
  // Grid Render Logic
  // ---------------------------------------------------------------------------

  // Animation variants for horizontal slide with scaling (instant swap feel)
  const slideVariants = {
    enter: {
      scale: 0.9,
      opacity: 0,
    },
    center: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.1,
        ease: easeOut,
      },
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      transition: {
        duration: 0.08,
        ease: easeIn,
      },
    },
  }

  const renderRow = (rowOffset: number, opacity: number, gap: string = '32px') => {
    return (
      <div
        key={rowOffset}
        className="flex items-center justify-center transition-opacity duration-200"
        style={{ gap, opacity }}
      >
        <AnimatePresence mode="popLayout" custom={slideDirection}>
          {[-2, -1, 0, 1, 2].map((col) => {
            // Center box of the middle row gets special treatment
            const isCentered = rowOffset === 0 && col === 0
            const globalIndex = getGlobalIndex(rowOffset, col)
            let memory = getMemoryForPosition(rowOffset, col)

            // Determine if there is a quest assigned to this slot
            const itemBorderColor = memory ? mixColors(CATEGORY_COLORS[memory.category] || '#ffffff', memory.question ? (QUESTION_COLORS[memory.question] || '#888888') : '#888888') : '#555555';
            let customBgColor: string | undefined = undefined;
            if (memory) {
              const catColor = CATEGORY_COLORS[memory.category] || '#ffffff';
              const tagColor = memory.question ? (QUESTION_COLORS[memory.question] || '#888888') : '#888888';
              
              const isMemoryDone = memory.isFilled && memory.videoUrl && memory.description && memory.description.trim().length > 0 && Array.isArray(memory.sources) && memory.sources.length > 0;

              const matchedQuest = personalQuests.find(q => q.category === memory?.category && q.question === memory?.question);
              if (matchedQuest) {
                if (matchedQuest.completed || isMemoryDone) {
                  customBgColor = mixColors(catColor, tagColor);
                }
                memory = { ...memory, title: matchedQuest.title };
              } else if (isMemoryDone) {
                customBgColor = mixColors(catColor, tagColor);
              }
            }

            // A slot is locked unless: already filled, OR the accepted quest matches this slot
            const acceptedQuest = personalQuests.find(q => q.id === acceptedQuestId)
            const isLocked = !memory?.isFilled && !(
              acceptedQuest &&
              memory &&
              acceptedQuest.category === memory.category &&
              acceptedQuest.question === memory.question
            )

            // Calculate sizing based on positions to create sphere perspective
            const absRow = Math.abs(rowOffset)
            const absCol = Math.abs(col)

            // Make outer columns smaller to enhance depth effect
            const isExtraSmall = absRow === 1 && absCol === 2
            const isSmall = (absRow === 1 && absCol === 1) || (absRow === 0 && absCol === 2)

            return (
              <motion.div
                key={`${rowOffset}-${col}-${horizontalIndex + col}-${memoryUpdateKey}`}
                custom={slideDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                layout
              >
                <MemoryBox
                  memory={memory}
                  borderColor={itemBorderColor}
                  customBgColor={customBgColor}
                  displayNumber={globalIndex}
                  isCentered={isCentered}
                  isSmall={isSmall}
                  isExtraSmall={isExtraSmall}
                  isDark={isDark}
                  isLocked={isLocked}
                  onClick={() => handleBoxClick(rowOffset, col)}
                  onInfoClick={isCentered && !isLocked ? () => setIsModalOpen(true) : undefined}
                  questionLabels={questionLabels}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    )
  }

  if (isRubixView) {
    return (
      <div
        className="absolute flex flex-col items-center justify-start z-10 pointer-events-auto"
        style={{ top: 0, bottom: 0, left: 0, right: 0, paddingTop: 'calc(max(9vh, 80px))', paddingBottom: 'calc(116px + 2vh)', backgroundColor: 'var(--color-bg)' }}
      >
        <div className="flex flex-col items-center justify-center flex-1 w-full" style={{ gap: '0.6vw', minHeight: 0 }}>
          {categories.map((category, row) => (
            <div key={category} className="flex items-center justify-center relative" style={{ gap: '0.6vw' }}>
              
              {/* Subtle Row Label (Category) positioned on the right */}
              <div 
                className="absolute left-full text-gray-400 font-bold uppercase flex items-center h-full whitespace-nowrap pointer-events-none" 
                style={{ 
                  fontFamily: "'Jersey 15', sans-serif", 
                  fontSize: 'clamp(12px, 1.5vw, 20px)', 
                  letterSpacing: '0.05em', 
                  opacity: 0.5,
                  marginLeft: '8%' // ~15% spacing as requested
                }}
              >
                {categoryLabels[category] || category}
              </div>

              {Array.from({ length: 10 }).map((_, col) => {
                const globalIndex = row * 10 + col
                let memory = getProcessedMemory(category as CategoryType, col)
                const itemBorderColor = memory ? mixColors(CATEGORY_COLORS[memory.category] || '#ffffff', memory.question ? (QUESTION_COLORS[memory.question] || '#888888') : '#888888') : '#e5e7eb';
                let customBgColor: string | undefined = undefined;
                
                if (memory) {
                  const catColor = CATEGORY_COLORS[memory.category] || '#ffffff';
                  const tagColor = memory.question ? (QUESTION_COLORS[memory.question] || '#888888') : '#888888';
                  const isMemoryDone = memory.isFilled && memory.videoUrl && memory.description && memory.description.trim().length > 0 && Array.isArray(memory.sources) && memory.sources.length > 0;

                  const matchedQuest = personalQuests.find(q => q.category === memory?.category && q.question === memory?.question);
                  if (matchedQuest) {
                    if (matchedQuest.completed || isMemoryDone) {
                      customBgColor = mixColors(catColor, tagColor);
                    }
                    memory = { ...memory, title: matchedQuest.title };
                  } else if (isMemoryDone) {
                    customBgColor = mixColors(catColor, tagColor);
                  }
                }

                const acceptedQuest = personalQuests.find(q => q.id === acceptedQuestId)
                const cellIsLocked = !memory?.isFilled && !(
                  acceptedQuest &&
                  memory &&
                  acceptedQuest.category === memory.category &&
                  acceptedQuest.question === memory.question
                )

                return (
                  <motion.div
                    key={col}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (row * 10 + col) * 0.005 }}
                    className="flex justify-center items-center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      onCategoryChange(category)
                      setSlideDirection(col > horizontalIndex ? 'right' : 'left')
                      setHorizontalIndex(col)
                      if (onCloseRubix) onCloseRubix()
                    }}
                  >
                    <MemoryBox
                      memory={memory}
                      borderColor={itemBorderColor}
                      customBgColor={customBgColor}
                      displayNumber={globalIndex}
                      isCentered={false}
                      isSmall={true}
                      isExtraSmall={false}
                      isDark={isDark}
                      isLocked={cellIsLocked}
                      isRubixView={true}
                    />
                  </motion.div>
                )
              })}
            </div>
          ))}
        </div>

      <div
        className="flex w-full items-center justify-center pointer-events-none"
        style={{ gap: '0.6vw', marginTop: '0.5vh' }}
      >
        {QUESTION_ORDER.map((q) => (
          <div key={q} className="flex justify-center items-center relative shrink-0">
            {/* 1) GHOST MEMORY BOX FOR FLAWLESS GEOMETRY MATCHING */}
            <div style={{ opacity: 0, pointerEvents: 'none' }}>
              <MemoryBox
                memory={null}
                borderColor="transparent"
                displayNumber={0}
                isCentered={false}
                isSmall={true}
                isExtraSmall={false}
              />
            </div>
            
            {/* 2) ABSOLUTE TEXT CENTERED OVER THE GHOST BOX */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 font-bold uppercase text-center whitespace-nowrap"
              style={{
                fontFamily: "'Jersey 15', sans-serif",
                fontSize: 'clamp(10px, 1.2vw, 16px)',
                letterSpacing: '0.05em',
                opacity: 0.5,
              }}
            >
              {questionLabels[q] || q}
            </div>
          </div>
        ))}
      </div>

      </div>
    )
  }

  return (
    <div
      className="absolute flex flex-col items-center justify-center z-10 pointer-events-none"
      style={{ top: 0, bottom: 0, left: 0, right: 0, paddingBottom: '30px' }}
    >
      
      {/* Top Question Filters removed - replaced by bottom custom Wheel */}

      {/* Main Content - Grid centered, Vertical Navigation positioned separately */}
      <div
        ref={gridRef}
        className="relative flex items-center justify-center pointer-events-auto"
        onMouseDown={handleGridMouseDown}
        onClickCapture={(e) => { if (gridDragMoved.current) { e.stopPropagation(); gridDragMoved.current = false } }}
        style={{ cursor: isGridDragging ? 'grabbing' : 'grab', userSelect: 'none' }}
      >
        {/* 3x5 Grid - centered */}
        <div className="flex flex-col items-center" style={{ gap: '32px' }}>
          {/* Top Row (-1) */}
          {renderRow(-1, 0.7)}

          {/* Middle Row (0) - Active with larger center box */}
          {renderRow(0, 1)}

          {/* Bottom Row (+1) */}
          {renderRow(1, 0.7)}
        </div>


      </div>

      {/* Tag Sidebar - Below Grid */}
      {!isRubixView && (
        <Sidebar
          position="bottom"
          items={QUESTION_ORDER.map(q => ({ id: q, label: questionLabels[q] || q, color: QUESTION_COLORS[q] || '#888888' }))}
          activeId={currentMemory?.question || ''}
          onSelect={handleQuestionClick}
          isDark={isDark}
          isEtsForom={isEtsForom}
        />
      )}

      {/* Memory Info Modal */}
      <MemoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        memory={currentMemory}
        borderColor={currentColor}
        index={activeIndex * ITEMS_PER_ROW + horizontalIndex}
        onMemoryUpdate={handleMemoryUpdate}
        onQuestComplete={acceptedQuestId && onQuestComplete ? () => onQuestComplete(acceptedQuestId) : undefined}
        questionLabels={questionLabels}
      />
    </div>
  )
}
