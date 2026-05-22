const VIDEO_WEBM_SRC = ""
const VIDEO_MP4_SRC = ""

function ConnectHeroVideo() {
  return (
    <div
      id="connect-demo"
      className="relative isolate mx-auto mt-14 aspect-square w-full max-w-152 overflow-hidden lg:absolute lg:-top-38 lg:right-8 lg:mt-0 lg:size-152 lg:max-w-none 2xl:right-0"
      aria-hidden
    >
      <video
        className="size-full object-cover"
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
  )
}

export default ConnectHeroVideo
