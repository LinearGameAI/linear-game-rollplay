'use client'

import { cn } from '@/src/common/tool'
import { DirectionKey } from '../types'
import { useDrag } from './shared/useDrag'
import DraggableButton from './shared/DraggableButton'
import { useCallback, useState } from 'react'

interface JoystickProps {
  /**
   * Callback when direction changes (W=up, A=left, S=down, D=right)
   */
  onDirectionChange?: (direction: DirectionKey) => void
  /**
   * Callback when joystick is released
   */
  onRelease?: () => void
  /**
   * Size of the joystick container (default: 154)
   */
  size?: number
  /**
   * Custom class name for the container
   */
  className?: string
  /**
   * Whether the joystick is disabled
   */
  disabled?: boolean
}

// Diamond arrow indicator component (matches Figma design)
function DiamondArrow({
  position,
  active,
  size = 16
}: {
  position: 'top' | 'bottom' | 'left' | 'right'
  active: boolean
  size?: number
}) {
  const positionStyles: Record<typeof position, string> = {
    top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 translate-y-0',
    bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 -rotate-135 translate-y-0',
    left: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 translate-x-0',
    right: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rotate-135 translate-x-0',
  }

  return (
    <div
      className={cn(
        'absolute transition-all duration-150',
        'bg-[linear-gradient(135deg,#FFF_7.41%,rgba(255,255,255,0)_50%)]',
        positionStyles[position],
      )}
      style={{
        width: size,
        height: size,
      }}
    />
  )
}

/**
 * Joystick - A draggable joystick component supporting 4-direction gestures
 */
export default function Joystick({
  onDirectionChange,
  onRelease,
  size = 154,
  className,
  disabled = false,
}: JoystickProps) {
  const [currentDirection, setCurrentDirection] = useState<DirectionKey>(DirectionKey.NONE)

  // Size calculations
  const buttonSize = size * 0.27
  const trackSize = size * 0.74
  const arrowSize = size * 0.19
  const maxDistance = (trackSize - buttonSize) / 2

  // Direction calculation
  const getDirection = useCallback((x: number, y: number): DirectionKey => {
    const threshold = maxDistance * 0.3

    if (Math.abs(x) < threshold && Math.abs(y) < threshold) {
      return DirectionKey.NONE
    }

    if (Math.abs(x) > Math.abs(y)) {
      return x > 0 ? DirectionKey.D : DirectionKey.A
    } else {
      return y > 0 ? DirectionKey.S : DirectionKey.W
    }
  }, [maxDistance])

  // Use shared drag hook
  const { containerRef, isDragging, position, handleMouseDown, handleTouchStart } = useDrag({
    disabled,
    maxDistance,
    mode: 'center',
    onMove: (pos) => {
      const direction = getDirection(pos.x, pos.y)
      if (direction !== currentDirection) {
        setCurrentDirection(direction)
        onDirectionChange?.(direction)
      }
    },
    onEnd: () => {
      setCurrentDirection(DirectionKey.NONE)
      onDirectionChange?.(DirectionKey.NONE)
      onRelease?.()
    },
  })

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative select-none touch-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      style={{ width: size, height: size }}
    >
      {/* Diamond Direction Arrows */}
      <DiamondArrow position="top" active={currentDirection === DirectionKey.W} size={arrowSize} />
      <DiamondArrow position="bottom" active={currentDirection === DirectionKey.S} size={arrowSize} />
      <DiamondArrow position="left" active={currentDirection === DirectionKey.A} size={arrowSize} />
      <DiamondArrow position="right" active={currentDirection === DirectionKey.D} size={arrowSize} />

      {/* Track Circle */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-[2px] rounded-full border-[2px] border-white bg-[rgba(255,255,255,0.3)]"
        style={{ width: trackSize, height: trackSize }}
      >
        <div className='w-full aspect-square border-1 border-white rounded-full' />
      </div>

      {/* Draggable Button */}
      <DraggableButton
        size={buttonSize}
        position={position}
        isDragging={isDragging}
        disabled={disabled}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        positionMode="center"
      />
    </div>
  )
}
