"use client"

import Image from "next/image"
import GlassBorder from "@/images/pages/copilot/glass-border.svg"
import VideoPoster from "@/images/pages/copilot/poster.webp"

const VIDEO_WEBM_SRC = "/videos/copilot.webm"
const VIDEO_MP4_SRC = "/videos/copilot.hevc.mp4"

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
  copilot.hevc.mp4
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
  copilot.webm
 */

/**
 * Matches encoded copilot assets (1280×688, DAR 705:379).
 * Glass frame: `copilot/glass-border.svg` is 1280×688 with viewBox 1088×613 + preserveAspectRatio="none"
 * so the Copilot art stretches to this aspect; for a pixel-perfect redraw, export the frame at 1280×688.
 */
const VIDEO_ASPECT_CLASS = "aspect-[80/43]"

function HeroVideo() {
  return (
    <div
      className={`relative mx-auto w-full max-w-[66.75rem] overflow-hidden ${VIDEO_ASPECT_CLASS} filter-[var(--filter-mcp-hero-video)]`}
    >
      <Image
        src={GlassBorder}
        alt=""
        aria-hidden
        fill
        priority
        fetchPriority="high"
        loading="eager"
        className={`absolute inset-0 m-auto object-contain ${VIDEO_ASPECT_CLASS}`}
      />
      <div className="absolute inset-1.5 overflow-hidden rounded-[1.2vw] bg-background sm:rounded-[1.5vw] md:inset-2 md:rounded-[.975rem] lg:inset-2.5">
        <video
          className="h-full w-full object-cover"
          poster={VideoPoster.src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={VIDEO_WEBM_SRC} type="video/webm" />
          <source src={VIDEO_MP4_SRC} type='video/mp4; codecs="hvc1"' />
        </video>
      </div>
    </div>
  )
}

export default HeroVideo
