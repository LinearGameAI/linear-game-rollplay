import React from 'react'
import { cn } from '@/src/common/tool'

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export default function GameButton({ children, className, ...props }: GameButtonProps) {

  return (
    <button
      className={cn(
        "relative group h-[150px] aspect-[860/300] font-libre font-normal text-[26px] tracking-[6px] text-[#DFDCBD] hover:text-[#463229]",
        "focus:outline-none custom-cursor",
        className
      )}
      {...props}
    >
      <div className={cn("pointer-events-none absolute inset-0 bg-no-repeat bg-center bg-contain transition-opacity duration-300", 'bg-[url(/images/btn-bg.png)] group-hover:bg-[url(/images/btn-bg-select.png)]')} />
      <span className="relative z-10">{children}</span>
    </button>
  )
}
