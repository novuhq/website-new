"use client"

import { useRef, useState } from "react"
import videoPoster from "@/images/pages/no-reply-is-dead/see-it-in-action-poster.jpg"

import VideoPlayButton from "@/components/ui/video-play-button"

/* Encode the same way as the /mcp hero video — see the ffmpeg recipes in
   src/components/pages/mcp/hero-video.tsx. */
const VIDEO_WEBM_SRC = "/videos/no-reply-is-dead.webm"
const VIDEO_MP4_SRC = "/videos/no-reply-is-dead.hevc.mp4"

export function SeeItInAction() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
    // Fires inside a click handler, so the gesture requirement is always met.
    void videoRef.current?.play()
  }

  return (
    <section
      id="see-it-in-action"
      className="mt-24 scroll-mt-24 md:mt-28 lg:mt-32 xl:mt-44"
    >
      <div className="mx-auto max-w-320 px-5 md:px-8 2xl:px-0">
        <div className="mx-auto max-w-184 text-center">
          <h2 className="text-[2rem] leading-[1.13] font-normal tracking-plus-tight text-balance text-white md:text-[2.75rem] lg:text-[3.5rem]">
            See it in action
          </h2>
          <p className="mt-5 text-base leading-[1.5] tracking-tighter text-gray-60 md:text-xl lg:mt-6">
            Watch an email notification turn into a conversation with an agent
            that already knows the context.
          </p>
        </div>

        {/* Glass frame: a 10px inset rail around the video, per the design. */}
        <div className="mx-auto mt-12 w-full max-w-[76.25rem] rounded-2xl border border-white/50 bg-white/4 p-1.5 shadow-[0_12px_23.37px_-10px_rgba(0,0,0,0.3)] backdrop-blur-[90px] md:mt-14 md:rounded-[2rem] md:p-2.5">
          <div className="relative isolate aspect-[1210/685] overflow-hidden rounded-xl md:rounded-[1.25rem]">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              poster={videoPoster.src}
              playsInline
              controls={isPlaying}
              preload="metadata"
            >
              <source src={VIDEO_WEBM_SRC} type="video/webm" />
              <source src={VIDEO_MP4_SRC} type='video/mp4; codecs="hvc1"' />
            </video>

            {!isPlaying && (
              <VideoPlayButton
                onClick={handlePlay}
                label="Play the agent conversation demo"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
