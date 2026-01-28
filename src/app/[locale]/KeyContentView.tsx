'use client';

import { useEffect, useState, useRef } from "react"
import WASDControls from "./components/WASDControls"
import ArrowControls from "./components/ArrowControls"
import { DirectionKey } from "./types"
import { useSceneStoreData } from "./store";
import Joystick from "./components/Joystick";
import FloatingButton from "./components/FloatingButton";
import { cn } from "@/src/common/tool";

// Hook to detect screen size
function useIsSmallScreen(breakpoint: number = 768) {
  const [isSmall, setIsSmall] = useState(false)

  useEffect(() => {
    const checkSize = () => setIsSmall(window.innerWidth < breakpoint)
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [breakpoint])

  return isSmall
}

export default function KeyContentView() {
  const { wsUrl } = useSceneStoreData()
  const [keyState, setKeyState] = useState<DirectionKey>(DirectionKey.NONE)
  const wsRef = useRef<WebSocket | null>(null)
  const isSmallScreen = useIsSmallScreen()

  // Manage WebSocket connection
  useEffect(() => {
    if (!wsUrl) {
      console.log('WebSocket URL not available yet')
      return
    }

    console.log('Creating WebSocket connection to:', wsUrl)
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connection opened')
    }

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data)
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed')
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    // Cleanup: close WebSocket when component unmounts or wsUrl changes
    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        console.log('Closing WebSocket connection')
        ws.close()
      }
      wsRef.current = null
    }
  }, [wsUrl])


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

        // Send WebSocket message
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          const message = JSON.stringify({ type: "action", action: direction })
          wsRef.current.send(message)
          console.log('Sent WebSocket message:', message)
        }
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

  // Handle direction change from Joystick
  const handleDirectionChange = (dir: DirectionKey) => {
    console.log('drag direction change:', dir)
    setKeyState(dir)
    if (dir === DirectionKey.NONE) {
      return
    }
    // Send WebSocket message
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type: "action", action: dir })
      wsRef.current.send(message)
    }
  }

  return (
    <>
      {/* 小屏显示 Joystick，大屏显示 WASDControls */}
      <div className="absolute bottom-8 left-8">
        {isSmallScreen ? (
          <Joystick
            size={100}
            onDirectionChange={handleDirectionChange}
          />
        ) : (
            <WASDControls activeKey={keyState} />
        )}
      </div>

      <div className={cn("absolute bottom-8 right-8")}>
        {isSmallScreen ? <FloatingButton onDirectionChange={handleDirectionChange} /> : <ArrowControls activeKey={keyState} />}
      </div>
    </>
  )
}
