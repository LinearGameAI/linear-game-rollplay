import React from 'react'
import KeyButton from './KeyButton'
import { DirectionKey } from '../types'

interface WASDControlsProps {
  activeKey: DirectionKey
}

export default function WASDControls({ activeKey }: WASDControlsProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* W Key - Centered on top */}
      <KeyButton label="W" isActive={activeKey === DirectionKey.W} />

      {/* ASD Row */}
      <div className="flex gap-2">
        <KeyButton label="A" isActive={activeKey === DirectionKey.A} />
        <KeyButton label="S" isActive={activeKey === DirectionKey.S} />
        <KeyButton label="D" isActive={activeKey === DirectionKey.D} />
      </div>
    </div>
  )
}
