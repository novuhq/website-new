import videoPoster from "@/images/pages/connect/hero/video-poster.jpg"

const VIDEO_WEBM_SRC = "/videos/pages/connect/hero.webm"
const VIDEO_MP4_SRC = "/videos/pages/connect/hero.hevc.mp4"

/**
 * Current sources (tuned for ~4–5 MB at 1280p, ~46s, with audio):
 *
 * HEVC (Safari, Chrome 107+, Edge):
 * ffmpeg -y -i hero-origin.mp4 \
   -c:v libx265 \
   -crf 22 \
   -vf "scale=1216:-2" \
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
   -vf "scale=1216:-2" \
   -deadline best \
   -an \
   hero.webm
 */

function ConnectHeroVideo() {
  return (
    <div
      id="connect-demo"
      className="pointer-events-none relative left-1/2 z-0 mt-4 aspect-[1216/1144] w-[115%] max-w-175 -translate-x-1/2 overflow-hidden lg:absolute lg:-top-20 lg:right-0 lg:left-auto lg:mt-0 lg:w-[53.5%] lg:max-w-none lg:translate-x-0 xl:w-170 xl:translate-x-[10%] 2xl:-top-28 2xl:w-196 2xl:translate-x-[22%]"
      aria-hidden
    >
      <video
        className="size-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster={videoPoster.src}
        preload="metadata"
      >
        <source src={VIDEO_WEBM_SRC} type="video/webm" />
        <source src={VIDEO_MP4_SRC} type='video/mp4; codecs="hvc1"' />
      </video>
    </div>
  )
}

export default ConnectHeroVideo
