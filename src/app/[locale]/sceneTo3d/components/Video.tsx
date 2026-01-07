import { useSearchParams } from "next/navigation"


export const Video = () => {

  //获取查询参数videoId
  const searchParams = useSearchParams()
  const videoId = searchParams.get("videoId")
  const videoUrl = videoId || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover z-0"
    >
      <source src={videoUrl} />
      Your browser does not support the video tag.
    </video>
  )
}