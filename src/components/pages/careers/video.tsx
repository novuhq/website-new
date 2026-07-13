"use client"

import { useEffect, useRef } from "react"

const VIDEO_SRC = "/videos/pages/careers/video.mp4"
const VIDEO_SRC_WEBM = "/videos/pages/careers/video.webm"
const POSTER_SRC = "/videos/pages/careers/poster.jpg"

function CareersVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const video = videoRef.current
    if (!container || !video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play()
        } else {
          video.pause()
        }
      },
      { threshold: 0.7 }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full overflow-hidden rounded-[12px] bg-black"
    >
      {/*
          Video optimization parameters:
            mp4: -c:v libx265 -crf 36 -vf scale=1920:-2 -preset slow -tag:v hvc1 -movflags faststart -an
            webm: -c:v libvpx-vp9 -crf 36 -vf scale=1920:-2 -deadline best -an
        */}
      <video
        ref={videoRef}
        className="size-full object-cover"
        poster={POSTER_SRC}
        muted
        playsInline
        preload="metadata"
      >
        <source src={VIDEO_SRC_WEBM} type="video/webm" />
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>
    </div>
  )
}

export default CareersVideo
