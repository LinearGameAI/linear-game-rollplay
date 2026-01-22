import { create } from 'zustand'


// 定义状态类型
interface SceneState {
  session_id: string
  videoUrl: string
  wsUrl: string

  // Actions
  setSessionId: (session_id: string) => void
}

// 初始状态
const initialState = {
  session_id: '',
  videoUrl: '',
  wsUrl: ''

}

// 创建 store
export const useSceneStore = create<SceneState>((set, get) => ({
  ...initialState,
  setSessionId: (session_id: string) => {
    console.log('session_id=', session_id)
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = process.env.NEXT_PUBLIC_API_HOST || 'roll-api.lineargame.ai'
    const wsUrl = `${protocol}://${host}/ws/${session_id}`

    const videoUrl = `https://${host}/api/session/${session_id}/mjpeg`

    console.log('host=', host)
    console.log('videoUrl=', videoUrl)
    console.log('wsUrl=', wsUrl)
    set({
      session_id,
      videoUrl: !!session_id ? videoUrl : '',
      wsUrl: !!session_id ? wsUrl : ''
    })
  }
}))

export const useSceneStoreData = () => {
  const session_id = useSceneStore((state) => state.session_id)
  const videoUrl = useSceneStore((state) => state.videoUrl)
  const wsUrl = useSceneStore((state) => state.wsUrl)
  return { sessionId: session_id, videoUrl, wsUrl }
}

export const useSceneStoreActions = () => {
  const session_id = useSceneStore((state) => state.session_id)
  const setSessionId = useSceneStore((state) => state.setSessionId)
  return { session_id, setSessionId }
}
