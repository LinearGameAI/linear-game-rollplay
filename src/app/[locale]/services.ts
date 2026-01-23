import { postFetcher } from "@/src/common/fetchers/request"
import { useMutation } from "@tanstack/react-query"
import { useSceneStoreActions } from "./store"


interface HttpApi_SessionRequest {
  prompt: string
  image: string
}

export interface HttpApi_SessionResponse {
  session_id: string
}

/**
 * 将图片URL转换为File对象
 * @param url - 图片URL
 * @param filename - 可选的文件名，如果不提供则从URL中提取
 * @returns Promise<File>
 */
const urlToFile = async (url: string, filename?: string): Promise<File> => {
  const response = await fetch(url)
  const blob = await response.blob()

  // 从URL中提取文件名，或使用默认名称
  const name = filename || url.split('/').pop() || 'image.png'

  // 创建File对象
  return new File([blob], name, { type: blob.type })
}

const postSession = async ({ prompt, image }: { prompt: string, image: File }) => {
  const form = new FormData()
  form.append("prompt", prompt)
  form.append("image", image)
  return postFetcher<HttpApi_SessionResponse, HttpApi_SessionRequest>({ url: `/api/session`, body: form })
}

export const usePostSessionService = () => {
  const { setSessionId } = useSceneStoreActions()
  return useMutation({
    mutationFn: ({ prompt, image }: { prompt: string, image: File }) => postSession({ prompt, image }),
    onSuccess: (data) => {
      setSessionId(data.session_id)
    },
    onError: () => {
      console.error('get session id failed.')
    }
  })
}