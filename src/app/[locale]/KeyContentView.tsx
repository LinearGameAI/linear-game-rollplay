'use client';

import { useEffect, useState, useRef } from "react"
import WASDControls from "./components/WASDControls"
import ArrowControls from "./components/ArrowControls"
import { DirectionKey } from "./types"
import { usePostSessionService } from "./services"
import { useSceneStoreData } from "./store";

export default function KeyContentView() {
  const { wsUrl } = useSceneStoreData()
  const [keyState, setKeyState] = useState<DirectionKey>(DirectionKey.NONE)
  const wsRef = useRef<WebSocket | null>(null)

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

  return (
    <>
      <div className="absolute bottom-8 left-8">
        <WASDControls activeKey={keyState} />
      </div>

      <div className="absolute bottom-8 right-8">
        <ArrowControls activeKey={keyState} />
      </div></>

  )
}
