"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import GlassBorder from "@/images/pages/mcp/glass-border.svg"
import VideoPoster from "@/images/pages/mcp/mcp-poster.jpg"

const VIDEO_WEBM_SRC = "/videos/mcp.webm"
const VIDEO_MP4_SRC = "/videos/mcp.hevc.mp4"

/**
 * Current sources (tuned for ~4–5 MB at 1280p, ~46s, with audio):
 *
 * HEVC (Safari, Chrome 107+, Edge):
 * ffmpeg -y -i original.mp4 \
  -c:v libx265 \
  -crf 22 \
  -vf "scale=1280:-2" \
  -preset veryslow \
  -tag:v hvc1 \
  -movflags +faststart \
  -c:a aac \
  -b:a 128k \
  -ac 2 \
  example-4.hevc.mp4
 *
 * VP9 WebM (Chrome, Firefox, Safari 16+); -b:v 0 enables true CRF mode:
 * ffmpeg -y -i original.mp4 \
  -c:v libvpx-vp9 \
  -crf 26 \
  -b:v 0 \
  -vf "scale=1280:-2" \
  -deadline best \
  -c:a libopus \
  -b:a 96k \
  example-4.webm
 */

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
    // Fire and forget — play() returns a promise that rejects if user gesture is missing,
    // but since this runs in onClick it's always a valid gesture.
    void videoRef.current?.play()
  }

  return (
    <div className="relative mx-auto aspect-[1068/604] w-full max-w-[66.75rem] overflow-hidden filter-[var(--filter-mcp-hero-video)]">
      <Image
        src={GlassBorder}
        alt=""
        aria-hidden
        fill
        priority
        fetchPriority="high"
        loading="eager"
        className="absolute inset-0 m-auto aspect-[1068/604] object-contain"
      />
      <div className="absolute inset-1.5 overflow-hidden rounded-[1.2vw] bg-background sm:rounded-[1.5vw] md:inset-2 md:rounded-[.975rem] lg:inset-2.5">
        <video
          className="h-full w-full object-cover"
          ref={videoRef}
          poster={VideoPoster.src}
          playsInline
          controls={isPlaying}
          preload="metadata"
        >
          <source src={VIDEO_WEBM_SRC} type="video/webm" />
          <source src={VIDEO_MP4_SRC} type='video/mp4; codecs="hvc1"' />
        </video>

        {!isPlaying && (
          <button
            className="group absolute inset-0 flex items-center justify-center outline-none"
            type="button"
            aria-label="Play demo"
            onClick={handlePlay}
          >
            <span className="relative inline-flex size-14 items-center justify-center overflow-hidden rounded-full border border-white transition-transform duration-300 ease-out group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-white group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background">
              <span className="absolute inset-0 z-0 bg-white" aria-hidden />
              <span
                className="absolute inset-0 z-10 bg-gradient-to-b from-white to-gray-9 opacity-100 transition-opacity duration-300 ease-out group-hover:opacity-0"
                aria-hidden
              />
              <svg
                className="relative z-20 ml-0.5 text-black transition-[color,transform] duration-300 ease-out group-hover:scale-110 group-hover:text-blue-3"
                width="16"
                height="18"
                viewBox="0 0 16 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M14.7611 10.1238L2.01933 17.7689C1.13063 18.3021 0 17.6619 0 16.6255V1.33539C0 0.298996 1.13063 -0.341156 2.01933 0.192064L14.7611 7.83714C15.6242 8.35502 15.6242 9.60592 14.7611 10.1238Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

export default HeroVideo
