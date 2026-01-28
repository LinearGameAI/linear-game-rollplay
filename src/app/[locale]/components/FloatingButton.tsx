'use client'

import { cn } from '@/src/common/tool'
import { useDrag } from './shared/useDrag'
import DraggableButton from './shared/DraggableButton'
import { DirectionKey } from '../types'
import { useState, useCallback } from 'react'

interface FloatingButtonProps {
  /**
   * Size of the button (default: 42)
   */
  size?: number
  /**
   * Maximum drag distance (default: 60)
   */
  maxDistance?: number
  /**
   * Callback when direction changes (W=up, A=left, S=down, D=right)
   */
  onDirectionChange?: (direction: DirectionKey) => void
  /**
   * Callback when button is clicked (not dragged)
   */
  onClick?: () => void
  /**
   * Callback when drag ends with position delta
   */
  onDragEnd?: (delta: { x: number; y: number }) => void
  /**
   * Custom class name
   */
  className?: string
  /**
   * Whether the button is disabled
   */
  disabled?: boolean
  /**
   * Children content
   */
  children?: React.ReactNode
}

/**
 * FloatingButton - A draggable floating button with trail effect and direction support
 */
export default function FloatingButton({
  size = 42,
  maxDistance = 60,
  onDirectionChange,
  onClick,
  onDragEnd,
  className,
  disabled = false,
  children,
}: FloatingButtonProps) {
  const [currentDirection, setCurrentDirection] = useState<DirectionKey>(DirectionKey.NONE)

  // Direction calculation (same as Joystick)
  const getDirection = useCallback((x: number, y: number): DirectionKey => {
    const threshold = maxDistance * 0.3 // 30% threshold

    if (Math.abs(x) < threshold && Math.abs(y) < threshold) {
      return DirectionKey.NONE
    }

    if (Math.abs(x) > Math.abs(y)) {
      return x > 0 ? DirectionKey.RIGHT : DirectionKey.LEFT
    } else {
      return y > 0 ? DirectionKey.DOWN : DirectionKey.UP
    }
  }, [maxDistance])

  // Use shared drag hook
  const { containerRef, isDragging, position, handleMouseDown, handleTouchStart } = useDrag({
    disabled,
    mode: 'center',
    maxDistance,
    onMove: (pos) => {
      const direction = getDirection(pos.x, pos.y)
      if (direction !== currentDirection) {
        setCurrentDirection(direction)
        onDirectionChange?.(direction)
      }
    },
    onEnd: (pos, wasDragged) => {
      setCurrentDirection(DirectionKey.NONE)
      onDirectionChange?.(DirectionKey.NONE)
      if (wasDragged) {
        onDragEnd?.(pos)
      } else {
        onClick?.()
      }
    },
  })

  // Calculate trail path
  const trailLength = Math.sqrt(position.x ** 2 + position.y ** 2)
  const trailAngle = Math.atan2(position.y, position.x) * (180 / Math.PI)

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative select-none touch-none',
        'w-[25vw] aspect-square',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      {/* Trail effect - only visible during drag */}
      {isDragging && trailLength > 0 && (
        <div
          className="absolute top-1/2 left-1/2 origin-left pointer-events-none"
          style={{
            width: trailLength,
            height: size,
            transform: `translate(0, -50%) rotate(${trailAngle}deg)`,
            background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 100%)`,
          }}
        />
      )}

      {/* Draggable Button */}
      <DraggableButton
        size={size}
        position={position}
        isDragging={isDragging}
        disabled={disabled}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        positionMode="center"
      >
        {children}
      </DraggableButton>
    </div>
  )
}
