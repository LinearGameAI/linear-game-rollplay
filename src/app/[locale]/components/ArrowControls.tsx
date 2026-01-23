'use client'

import React from 'react'
import KeyButton from './KeyButton'
import { DirectionKey } from '../types'

interface ArrowControlsProps {
  activeKey: DirectionKey
}

export default function ArrowControls({ activeKey }: ArrowControlsProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Up Arrow */}
      <KeyButton
        label={<span className="transform rotate-0">↑</span>}
        isActive={activeKey === DirectionKey.UP}
      />

      {/* Left, Down, Right Arrows */}
      <div className="flex gap-2">
        <KeyButton
          label={<span className="transform -rotate-90">←</span>}
          isActive={activeKey === DirectionKey.LEFT}
        />
        <KeyButton
          label={<span className="transform rotate-180">↓</span>}
          isActive={activeKey === DirectionKey.DOWN}
        />
        <KeyButton
          label={<span className="transform rotate-90">→</span>}
          isActive={activeKey === DirectionKey.RIGHT}
        />
      </div>
    </div>
  )
}
