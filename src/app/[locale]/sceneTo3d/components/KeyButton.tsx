import React from 'react'
import { useKeyButtonConfig } from '../context/KeyButtonContext'
import { cn } from '@/src/common/tool'

interface KeyButtonProps {
  label: string | React.ReactNode
  isActive: boolean
  className?: string
}

export default function KeyButton({ label, isActive, className = "" }: KeyButtonProps) {
  const { config } = useKeyButtonConfig()

  const dynamicStyle = {
    width: `${config.width}px`,
    height: `${config.height}px`,
    fontSize: `${config.fontSize}px`
  }

  return (
    <div
      style={dynamicStyle}
      className={cn(
        "relative flex items-center justify-center",
        "rounded-lg border-2",
        "font-bold transition-all duration-100 ease-in-out",
        isActive
          ? "bg-white/90 text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.6)] scale-95"
          : "bg-black/30 text-white/70 border-white/30 backdrop-blur-sm",
        className
      )}
    >
      {label}
    </div>
  )
}
