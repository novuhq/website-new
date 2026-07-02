"use client"

import { useRef, useState } from "react"
import { Play } from "lucide-react"

const VIDEO_SRC = "/videos/pages/careers/video.mp4"
const VIDEO_SRC_WEBM = "/videos/pages/careers/video.webm"
const POSTER_SRC = "/videos/pages/careers/poster.jpg"

function CareersVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
    void videoRef.current?.play()
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[12px] bg-black">
      {/*
          Video optimization parameters:
            mp4: -c:v libx265 -crf 36 -vf scale=1920:-2 -preset slow -tag:v hvc1 -movflags faststart -an
            webm: -c:v libvpx-vp9 -crf 36 -vf scale=1920:-2 -deadline best -an
        */}
      <video
        ref={videoRef}
        className="size-full object-cover"
        poster={POSTER_SRC}
        controls={isPlaying}
        playsInline
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={VIDEO_SRC_WEBM} type="video/webm" />
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {!isPlaying && (
        <button
          className="group absolute inset-0 flex items-center justify-center outline-none"
          type="button"
          aria-label="Play video"
          onClick={handlePlay}
        >
          <span className="inline-flex h-14 items-center justify-center rounded-full border border-white/50 bg-[#FFFFFF38] shadow-[0_6px_24px_rgba(0,0,0,0.45)] backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
            <span className="inline-flex items-center justify-center gap-3 px-5 text-xl leading-none font-semibold tracking-normal text-white">
              <Play
                className="size-5 fill-current stroke-current"
                aria-hidden
              />
              Play video
            </span>
          </span>
        </button>
      )}
    </div>
  )
}

export default CareersVideo
