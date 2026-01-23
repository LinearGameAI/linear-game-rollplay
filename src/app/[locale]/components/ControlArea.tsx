'use client';

import React, { useLayoutEffect, useRef } from 'react'
import { cn } from '@/src/common/tool'
import Image from 'next/image';

interface ControlAreaProps {
  position: 'left' | 'right'
  className?: string
  children?: React.ReactNode // Allow children if needed later, e.g., icons
}

export default function ControlArea({ position, className, children }: ControlAreaProps) {
  // Define base positioning classes
  const positionClasses = position === 'left'
    ? "left-[3%] top-1/2 -translate-y-1/2"
    : "right-[3%] top-1/2 -translate-y-1/2"

  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const div = ref.current
    if (!div) return
    const { width, height } = div.getBoundingClientRect()
    console.log('width=', width, 'height=', height)
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-20 w-[40%] aspect-2/1 mt-[12%]", // Dimensions
        "flex items-center justify-center",
        "transition-all duration-500 ease-out", // Smooth transition
        "group", // Interaction
        positionClasses,
        className
      )}
    >
      <div className='w-full h-full'>
        <Image src={'/images/icon1.webp'} fill alt="" className='opacity-0 group-hover:opacity-100 w-full h-full' />
      </div>
      {children}
    </div>
  )
}
