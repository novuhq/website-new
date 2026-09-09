"use client"

import { useRef, useState } from "react"
import videoPoster from "@/images/pages/no-reply-is-dead/see-it-in-action-poster.jpg"

import VideoPlayButton from "@/components/ui/video-play-button"

const VIDEO_WEBM_SRC = "/videos/pages/no-reply-is-dead/see-it-in-action.webm"
const VIDEO_MP4_SRC = "/videos/pages/no-reply-is-dead/see-it-in-action.hevc.mp4"

/**
 * The master is a 3840x2158 60fps screen recording, so unlike the other
 * videos on the site it is downscaled and halved in frame rate: 1920 wide
 * still resolves the dashboard's small UI text at this section's 1210px slot,
 * where the references' 1280 would not, and 30fps is plenty for a screen
 * capture. `-preset slow` / `-cpu-used 2` stand in for the references'
 * `veryslow` / `best`, which are impractical for 35s at this size for a
 * difference of a percent or two. The master's audio track is digital silence
 * (-91dB peak), so it is dropped rather than shipped empty.
 *
 * HEVC (Safari, Chrome 107+, Edge):
 * ffmpeg -y -i see-it-in-action-origin.mp4 \
   -c:v libx265 \
   -crf 22 \
   -vf "scale=1920:-2,fps=30" \
   -preset slow \
   -tag:v hvc1 \
   -movflags +faststart \
   -an \
   see-it-in-action.hevc.mp4
 *
 * VP9 WebM (Chrome, Firefox, Safari 16+); -b:v 0 enables true CRF mode:
 * ffmpeg -y -i see-it-in-action-origin.mp4 \
   -c:v libvpx-vp9 \
   -crf 30 \
   -b:v 0 \
   -vf "scale=1920:-2,fps=30" \
   -deadline good \
   -cpu-used 2 \
   -an \
   see-it-in-action.webm
 *
 * The poster is the designed still from Figma, not frame 0 — the recording
 * opens on the dashboard, so the two deliberately differ.
 */

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
