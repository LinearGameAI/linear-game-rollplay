"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import WASDControls from "./components/WASDControls"
import ArrowControls from "./components/ArrowControls"
import ControlPanel from "./components/ControlPanel"
import GameButton from "./components/GameButton"
import { KeyButtonProvider } from "./context/KeyButtonContext"
import { DirectionKey } from "./types"
import { Video } from "./components/Video"
import ControlArea from "./components/ControlArea"

export default function SceneTo3dPage() {
  const t = useTranslations("SceneTo3d") // Assuming you might have translations later
  const [keyState, setKeyState] = useState<DirectionKey>(DirectionKey.NONE)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      // Map keys to DirectionKey enum
      let direction: DirectionKey = DirectionKey.NONE

      switch (key) {
        case 'w': direction = DirectionKey.W; break;
        case 'a': direction = DirectionKey.A; break;
        case 's': direction = DirectionKey.S; break;
        case 'd': direction = DirectionKey.D; break;
        case 'arrowup': direction = DirectionKey.UP; break;
        case 'arrowdown': direction = DirectionKey.DOWN; break;
        case 'arrowleft': direction = DirectionKey.LEFT; break;
        case 'arrowright': direction = DirectionKey.RIGHT; break;
      }

      if (direction !== DirectionKey.NONE) {
        console.log(`Key pressed: ${key}`)
        setKeyState(direction)
        // Add your game logic here
      }
    }

    const handleKeyUp = () => {
      setKeyState(DirectionKey.NONE)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <KeyButtonProvider>
      <div className="custom-cursor relative w-full h-screen overflow-hidden bg-black">
        {/* Video Background */}
        <Suspense fallback={<div>Loading...</div>}><Video /></Suspense>

        {/* Control Panel */}
        <ControlPanel />

        {/* Control Areas */}
        {/* <ControlArea position="left" />
        <ControlArea position="right" /> */}

        {/* Overlay Content */}
        <div className="relative z-10 w-full h-full">
          {/* Title (Optional) */}
          <div className="absolute top-8 left-0 right-0 text-center text-white/50 flex flex-col gap-4 items-center">
            <h1 className="text-2xl font-bold">Roll-01 Realtime Model</h1>
          </div>

          <div className="hidden absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-row items-center gap-2">
            <GameButton>Not now</GameButton>
            <GameButton>Pick my ship</GameButton>
          </div>

          {/* WASD Controls - Bottom Left */}
          <div className="absolute bottom-8 left-8">
            <WASDControls activeKey={keyState} />
          </div>

          {/* Arrow Controls - Bottom Right */}
          <div className="absolute bottom-8 right-8">
            <ArrowControls activeKey={keyState} />
          </div>
        </div>
      </div>
    </KeyButtonProvider>
  )
}
