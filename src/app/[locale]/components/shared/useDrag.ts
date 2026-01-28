'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

export interface Position {
  x: number
  y: number
}

export interface UseDragOptions {
  disabled?: boolean
  /** 
   * If provided, constrains position within this distance from center.
   * Works with 'center' mode.
   */
  maxDistance?: number
  /**
   * If true, constrains drag within the container bounds.
   * Works with 'start' mode.
   */
  constrainToContainer?: boolean
  /**
   * Size of the draggable element (needed for container constraint)
   */
  elementSize?: number
  /**
   * 'center' - calculates delta from element center (for joystick)
   * 'start' - calculates delta from drag start position (for floating button)
   */
  mode?: 'center' | 'start'
  /**
   * Callback when position changes during drag
   */
  onMove?: (position: Position) => void
  /**
   * Callback when drag ends
   */
  onEnd?: (position: Position, wasDragged: boolean) => void
}

/**
 * useDrag - A shared hook for drag functionality
 * Used by Joystick and FloatingButton
 */
export function useDrag(options: UseDragOptions = {}) {
  const {
    disabled = false,
    maxDistance,
    constrainToContainer = false,
    elementSize = 0,
    mode = 'start',
    onMove,
    onEnd,
  } = options

  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const startPos = useRef<Position>({ x: 0, y: 0 })
  const wasDragged = useRef(false)

  const dragThreshold = 5 // pixels to consider as drag vs click

  // Constrain position based on options
  const constrainPosition = useCallback((x: number, y: number): Position => {
    // For circular constraint (maxDistance)
    if (maxDistance) {
      const distance = Math.sqrt(x * x + y * y)
      if (distance > maxDistance) {
        const ratio = maxDistance / distance
        return { x: x * ratio, y: y * ratio }
      }
      return { x, y }
    }

    // For container bounds constraint
    if (constrainToContainer && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()

      // Calculate bounds from center
      const maxX = (rect.width - elementSize) / 2
      const maxY = (rect.height - elementSize) / 2

      const constrainedX = Math.max(-maxX, Math.min(maxX, x))
      const constrainedY = Math.max(-maxY, Math.min(maxY, y))

      return { x: constrainedX, y: constrainedY }
    }

    return { x, y }
  }, [maxDistance, constrainToContainer, elementSize])

  // Handle move
  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current || disabled) return

    let deltaX: number
    let deltaY: number

    if (mode === 'center') {
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      deltaX = clientX - centerX
      deltaY = clientY - centerY
    } else {
      deltaX = clientX - startPos.current.x
      deltaY = clientY - startPos.current.y
    }

    // Check if movement exceeds threshold
    if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
      wasDragged.current = true
    }

    const constrained = constrainPosition(deltaX, deltaY)
    setPosition(constrained)
    onMove?.(constrained)
  }, [disabled, mode, constrainPosition, onMove])

  // Handle drag start
  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (disabled) return
    setIsDragging(true)
    startPos.current = { x: clientX, y: clientY }
    wasDragged.current = false

    if (mode === 'center') {
      handleMove(clientX, clientY)
    }
  }, [disabled, mode, handleMove])

  // Handle drag end
  const handleEnd = useCallback(() => {
    if (!isDragging) return

    setIsDragging(false)
    onEnd?.(position, wasDragged.current)
    setPosition({ x: 0, y: 0 })
  }, [isDragging, position, onEnd])

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)
  }, [handleStart])

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY)
    }
  }, [handleStart])

  // Global event listeners for drag
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleMouseUp = () => handleEnd()
    const handleTouchEnd = () => handleEnd()

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, handleMove, handleEnd])

  return {
    containerRef,
    isDragging,
    position,
    handleMouseDown,
    handleTouchStart,
  }
}
