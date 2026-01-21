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

const host = process.env.NEXT_PUBLIC_API_HOST || ''
// 创建 store
export const useSceneStore = create<SceneState>((set, get) => ({
  ...initialState,
  setSessionId: (session_id: string) => {
    console.log('session_id=', session_id)
    const videoUrl = `http://${host}/api/session/${session_id}/mjpeg`
    const wsUrl = `ws://${host}/ws/${session_id}`
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
