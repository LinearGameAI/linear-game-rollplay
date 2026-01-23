'use client'

import { useSceneStoreData } from "../store"

export const Video = () => {
  // const defaultUrl = 'https://dge41qcibm0f9.cloudfront.net/assets/2026/01/16/img4_38390476-bfd6-4a5d-b27c-c4c47d84681e_e464577f-221a-4be9-b60c-2e327f65a9a4.png'
  const { videoUrl } = useSceneStoreData()
  return (
    <div className="absolute inset-0">
      {videoUrl && <img src={videoUrl} alt="" className="w-full h-full object-contain" />}
    </div>
  )

  /*
  //获取查询参数videoId
  const searchParams = useSearchParams()
  const videoId = searchParams.get("videoId")
  //'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  const videoUrl = videoId || '/images/video.mp4'

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute top-0 left-0 w-full h-full object-contain z-0"
    >
      <source src={videoUrl} />
      Your browser does not support the video tag.
    </video>
  )
    */
}