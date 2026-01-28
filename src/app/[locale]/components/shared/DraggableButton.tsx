'use client'

import { cn } from '@/src/common/tool'

interface DraggableButtonProps {
  /**
   * Size of the button
   */
  size: number
  /**
   * Current position offset
   */
  position: { x: number; y: number }
  /**
   * Whether currently dragging
   */
  isDragging: boolean
  /**
   * Whether the button is disabled
   */
  disabled?: boolean
  /**
   * Mouse down handler
   */
  onMouseDown: (e: React.MouseEvent) => void
  /**
   * Touch start handler
   */
  onTouchStart: (e: React.TouchEvent) => void
  /**
   * Position mode: 'center' for joystick, 'corner' for floating button
   */
  positionMode?: 'center' | 'corner'
  /**
   * Children content
   */
  children?: React.ReactNode
}

/**
 * DraggableButton - Shared button component with gradient styling
 * Used by Joystick and FloatingButton
 */
export default function DraggableButton({
  size,
  position,
  isDragging,
  disabled = false,
  onMouseDown,
  onTouchStart,
  positionMode = 'center',
  children,
}: DraggableButtonProps) {
  const positionClass = positionMode === 'center' 
    ? 'top-1/2 left-1/2' 
    : 'top-0 left-0'
  
  const transformBase = positionMode === 'center'
    ? `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`
    : `translate(${position.x}px, ${position.y}px)`

  return (
    <div
      className={cn(
        'absolute rounded-full cursor-grab',
        'p-0.5',
        isDragging && 'cursor-grabbing',
        disabled && 'cursor-not-allowed',
        positionClass,
      )}
      style={{
        width: size,
        height: size,
        transform: transformBase,
        transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        background: `linear-gradient(315deg, #a2a2a1 0%, #ffffff 100%)`,
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <div className='w-full h-full rounded-full bg-linear-to-tl from-[#CECFCA] to-[#999] flex items-center justify-center'>
        {children}
      </div>
    </div>
  )
}
