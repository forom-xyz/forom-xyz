import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export interface WheelItem {
  id: string
  label: string
  color?: string
}

export interface WheelSelectorProps {
  items: WheelItem[]
  activeId?: string
  onChange: (id: string) => void
  orientation?: 'vertical' | 'horizontal'
  itemSize?: number
  visibleCount?: number
  isDark?: boolean
}

export function WheelSelector({
  items,
  activeId,
  onChange,
  orientation = 'vertical',
  itemSize = 80,
  visibleCount = 5,
  isDark = false,
}: WheelSelectorProps) {
  const N = items.length

  // Find initial center based on activeId if provided
  const initialIdx = activeId ? Math.max(0, items.findIndex(i => i.id === activeId)) : 0

  const [center, setCenter] = useState(initialIdx)
  const isVertical = orientation === 'vertical'

  // Sync state if activeId changes from outside
  useEffect(() => {
    if (activeId) {
      const idx = items.findIndex(i => i.id === activeId)
      if (idx !== -1) {
        window.setTimeout(() => {
          setCenter(prev => {
            const currentMod = ((prev % N) + N) % N
            if (currentMod !== idx) {
              let diff = idx - currentMod
              if (diff > N / 2) diff -= N
              if (diff < -N / 2) diff += N
              return prev + diff
            }
            return prev
          })
        }, 0)
      }
    }
  }, [activeId, items, N])

  const getItem = useCallback((idx: number) => {
    return items[((idx % N) + N) % N]
  }, [items, N])

  const move = useCallback((dir: number) => {
    setCenter(prev => {
      const next = prev + dir
      onChange(getItem(next).id)
      return next
    })
  }, [onChange, getItem])

  // Wheel handling with cooldown
  const wheelCooling = useRef(false)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (wheelCooling.current) return

    // For horizontal wheel, a mouse wheel might emit deltaY or deltaX
    const delta = isVertical ? e.deltaY : (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY)

    const dir = delta > 0 ? 1 : -1
    move(dir)

    wheelCooling.current = true
    setTimeout(() => { wheelCooling.current = false }, 150)
  }, [move, isVertical])

  const half = Math.floor(visibleCount / 2) + 1
  const slots = Array.from({ length: visibleCount + 2 }, (_, i) => center - half + i)
  const containerSize = visibleCount * itemSize

  // Gradient mask
  const gradient = isVertical
    ? 'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)'
    : 'linear-gradient(to right, transparent 0%, black 22%, black 78%, transparent 100%)'

  return (
    <div
      onWheel={handleWheel}
      style={{
        position: 'relative',
        width: isVertical ? '160px' : Math.max(containerSize, 600),
        height: isVertical ? containerSize : '80px',
        overflow: 'hidden',
        cursor: isVertical ? 'ns-resize' : 'ew-resize',
        maskImage: gradient,
        WebkitMaskImage: gradient,
        pointerEvents: 'auto',
      }}
    >
      {slots.map((p) => {
        const dist = p - center
        const item = getItem(p)
        const isCenter = dist === 0
        const absD = Math.abs(dist)

        const pos = (dist + half - 1) * itemSize

        return (
          <motion.div
            key={p}
            onClick={() => {
              if (dist !== 0) {
                setCenter(p)
                onChange(item.id)
              }
            }}
            initial={false}
            animate={{
              y: isVertical ? pos : '-50%',
              x: !isVertical ? pos : '-50%',
              opacity: isCenter ? 1 : absD === 1 ? 0.7 : 0.4,
              scale: isCenter ? 1.05 : absD === 1 ? 0.85 : 0.7,
              zIndex: isCenter ? 10 : 1,
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 30, mass: 0.8 }}
            style={{
              position: 'absolute',
              top: isVertical ? 0 : '50%',
              left: !isVertical ? '50%' : 0,
              width: isVertical ? '100%' : itemSize,
              height: isVertical ? itemSize : '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              fontFamily: "'Jersey 15', sans-serif",
              willChange: 'transform, opacity',
              textTransform: 'uppercase',
            }}
          >
            {!isVertical ? (
              <div
                style={{
                  backgroundColor: isCenter ? (item.color || '#333') : (item.color ? `${item.color}88` : 'transparent'),
                  color: isCenter ? '#fff' : (isDark ? '#eee' : '#222'),
                  padding: isCenter ? '8px 20px' : '6px 14px',
                  borderRadius: '16px',
                  border: isCenter ? '3px solid black' : '2px solid transparent',
                  transition: 'all 0.2s',
                  boxShadow: isCenter ? '0 4px 12px rgba(0,0,0,0.5)' : 'none',
                  fontSize: isCenter ? 'clamp(14px, 1.5vw, 22px)' : 'clamp(11px, 1.2vw, 15px)',
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </div>
            ) : (
              <span style={{
                color: isCenter ? (item.color || '#FFD700') : (isDark ? '#aaa' : '#555'),
                fontSize: isCenter ? 'clamp(20px, 2.5vw, 36px)' : 'clamp(13px, 1.5vw, 20px)',
                fontWeight: 900,
                letterSpacing: '0.1em',
                transition: 'color 0.2s',
                textShadow: isCenter ? '0 2px 8px rgba(0,0,0,0.5)' : 'none',
                whiteSpace: 'nowrap',
              }}>
                {item.label}
              </span>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
