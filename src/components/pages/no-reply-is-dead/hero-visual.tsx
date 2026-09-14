"use client"

import { useEffect, useRef, useState } from "react"
import videoPoster from "@/images/pages/no-reply-is-dead/hero-poster.jpg"
import { Pause, Play } from "lucide-react"

import { Button } from "@/components/ui/button"

const VIDEO_WEBM_SRC = "/videos/pages/no-reply-is-dead/hero.webm"
const VIDEO_MP4_SRC = "/videos/pages/no-reply-is-dead/hero.hevc.mp4"

function playVideo(video: HTMLVideoElement) {
  void video.play().catch(() => {
    // Autoplay can be blocked; the play control remains available to retry.
  })
}

/**
 * Sources are encoded from the 1216x1064 master, which is already twice the
 * 608x532 slot, so neither recipe rescales. The master carries no audio
 * track, hence `-an` on both.
 *
 * HEVC (Safari, Chrome 107+, Edge):
 * ffmpeg -y -i hero-origin.mp4 \
   -c:v libx265 \
   -crf 22 \
   -preset veryslow \
   -tag:v hvc1 \
   -movflags +faststart \
   -an \
   hero.hevc.mp4
 *
 * VP9 WebM (Chrome, Firefox, Safari 16+); -b:v 0 enables true CRF mode:
 * ffmpeg -y -i hero-origin.mp4 \
   -c:v libvpx-vp9 \
   -crf 26 \
   -b:v 0 \
   -deadline best \
   -an \
   hero.webm
 *
 * The poster is frame 0 of the master — the lock screen before the
 * notification lands — so playback starts without a visible jump.
 */

export function HeroVisual() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncMotionPreference = () => {
      if (reducedMotion.matches) {
        video.pause()
        // Reset playback so the poster is shown when the preference changes.
        video.load()
      } else {
        playVideo(video)
      }
    }

    syncMotionPreference()
    reducedMotion.addEventListener("change", syncMotionPreference)
    return () => {
      reducedMotion.removeEventListener("change", syncMotionPreference)
      video.pause()
    }
  }, [])

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      playVideo(video)
    } else {
      video.pause()
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-152 lg:mx-0">
      <video
        ref={videoRef}
        id="notification-hero-video"
        className="aspect-[608/532] w-full rounded-2xl object-cover"
        poster={videoPoster.src}
        loop
        muted
        playsInline
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEmptied={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
        aria-label="A phone lock screen receives an “Order shipped” notification with tracking #TN4471, arriving Thursday, which opens into a WhatsApp thread where the user replies to ask if the delivery address can be changed."
      >
        <source src={VIDEO_WEBM_SRC} type="video/webm" />
        <source src={VIDEO_MP4_SRC} type='video/mp4; codecs="hvc1"' />
      </video>
      <Button
        type="button"
        size="icon"
        className="absolute right-3 bottom-3 size-11 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        aria-label={isPlaying ? "Pause hero animation" : "Play hero animation"}
        aria-controls="notification-hero-video"
        onClick={togglePlayback}
      >
        {isPlaying ? <Pause aria-hidden /> : <Play aria-hidden />}
      </Button>
    </div>
  )
}
