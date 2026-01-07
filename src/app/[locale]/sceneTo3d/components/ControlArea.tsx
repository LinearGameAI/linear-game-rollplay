import React from 'react'
import { cn } from '@/src/common/tool'
import Image from 'next/image'

interface ControlAreaProps {
  position: 'left' | 'right'
  className?: string
  children?: React.ReactNode // Allow children if needed later, e.g., icons
}

export default function ControlArea({ position, className, children }: ControlAreaProps) {
  // Define base positioning classes
  const positionClasses = position === 'left'
    ? "left-[20%] top-1/2 -translate-y-1/2"
    : "right-[20%] top-1/2 -translate-y-1/2"

  return (
    <div
      className={cn(
        "absolute z-20 w-[200px] h-[300px]", // Dimensions
        "flex items-center justify-center",
        "border-2 border-transparent rounded-xl", // Initial border
        "transition-all duration-500 ease-out", // Smooth transition
        "hover:border-white/40 hover:bg-white/5 hover:backdrop-blur-sm hover:scale-105", // Hover effects
        "group cursor-pointer", // Interaction
        positionClasses,
        className
      )}
    >
      {/* Optional: Add a subtle inner glow or indicator that appears on hover */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Image width={100} height={100} src={'/images/icon1.webp'} alt="" />
        {/* <div className="w-16 h-16 rounded-full bg-white/10 blur-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /> */}
      </div>

      {children}
    </div>
  )
}
