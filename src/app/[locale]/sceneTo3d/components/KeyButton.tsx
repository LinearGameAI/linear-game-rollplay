import React from 'react'
import { useKeyButtonConfig } from '../context/KeyButtonContext'
import { cn } from '@/src/common/tool'
import Image from 'next/image'

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
        "font-bold font-goldman text-[#1E1849]",
        className
      )}
    >
      <Image src={'/key_bg.png'} alt="" fill className={cn('absolute inset-0 w-full h-full object-contain z-index-0 transition-all duration-300 ease-out', isActive && 'scale-90')} />
      <span className='z-index-1 relative'>{label}</span>
    </div>
  )
}
