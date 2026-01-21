import { Suspense } from "react"
import ControlPanel from "./components/ControlPanel"
import GameButton from "./components/GameButton"
import { KeyButtonProvider } from "./context/KeyButtonContext"

import { Video } from "./components/Video"
import KeyContentView from "./KeyContentView"

export default function SceneTo3dPage() {
  return (
    <KeyButtonProvider>
      <div className="custom-cursor relative w-full h-screen overflow-hidden bg-black">
        {/* Video Background */}
        <Suspense fallback={<div>Loading...</div>}><Video /></Suspense>

        {/* Control Panel */}
        <ControlPanel />

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

          <KeyContentView />
        </div>
      </div>
    </KeyButtonProvider>
  )
}
