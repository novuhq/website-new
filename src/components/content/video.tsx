"use client"

import { cva } from "class-variance-authority"
import {
  Maximize,
  Minimize,
  PauseIcon,
  PlayIcon,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react"
import {
  MediaControlBar,
  MediaController,
  MediaDurationDisplay,
  MediaFullscreenButton,
  MediaMuteButton,
  MediaPlayButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from "media-chrome/react"

import { IVideo } from "@/types/common"
import { cn } from "@/lib/utils"
import { useTouchDevice } from "@/hooks/use-touch-device"

import "@/styles/video.css"

interface IVideoProps extends IVideo {
  className?: string
  variant?: "default" | "outline"
}

const videoVariants = cva("relative", {
  variants: {
    variant: {
      default: "",
      outline:
        "rounded-xl p-2 before:pointer-events-none before:absolute before:inset-0 before:z-40 before:rounded-xl before:border before:border-border",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function ControlBar() {
  return (
    <MediaControlBar className="h-12 w-full overflow-hidden rounded-lg border border-border bg-background/[0.98] px-1 shadow-[0_0.25rem_0.625rem_0rem_hsla(var(--background)/.2)] md:px-2.5">
      <MediaPlayButton className="outline-none">
        {/* @ts-expect-error - slot prop not in Lucide icon types */}
        <PlayIcon key="play-icon" slot="play" className="size-4 md:size-5" />
        {/* @ts-expect-error - slot prop not in Lucide icon types */}
        <PauseIcon key="pause-icon" slot="pause" className="size-4 md:size-5" />
      </MediaPlayButton>
      <MediaTimeDisplay className="min-w-10 px-0 tracking-tight outline-none md:min-w-12" />
      <MediaTimeRange className="px-1 outline-none md:px-2.5" />
      <MediaDurationDisplay className="min-w-12 px-0 tracking-tight outline-none" />
      <MediaMuteButton className="px-1 outline-none md:px-2.5">
        {/* @ts-expect-error - slot prop not in Lucide icon types */}
        <Volume key="volume-low" slot="low" className="size-4 md:size-5" />
        <Volume1
          key="volume-medium"
          // @ts-expect-error - slot prop not in Lucide icon types
          slot="medium"
          className="size-4 md:size-5"
        />
        {/* @ts-expect-error - slot prop not in Lucide icon types */}
        <Volume2 key="volume-high" slot="high" className="size-4 md:size-5" />
        {/* @ts-expect-error - slot prop not in Lucide icon types */}
        <VolumeX key="volume-off" slot="off" className="size-4 md:size-5" />
      </MediaMuteButton>
      <MediaVolumeRange className="hidden max-w-[5.375rem] pr-1.5 outline-none sm:block" />
      <MediaFullscreenButton className="outline-none">
        <Maximize
          key="fullscreen-enter"
          // @ts-expect-error - slot prop not in Lucide icon types
          slot="enter"
          className="size-4 md:size-5"
        />
        <Minimize
          key="fullscreen-exit"
          // @ts-expect-error - slot prop not in Lucide icon types
          slot="exit"
          className="size-4 md:size-5"
        />
      </MediaFullscreenButton>
    </MediaControlBar>
  )
}

function Video({
  className,
  src,
  alt,
  width,
  height,
  poster,
  autoplay,
  controls,
  muted,
  loop,
  variant = "default",
}: IVideoProps) {
  const isTouchDevice = useTouchDevice()

  return (
    <figure
      className={cn(
        "relative col-span-1 row-span-1 my-8 grid w-auto overflow-hidden rounded-lg bg-background",
        className
      )}
    >
      <MediaController
        className={cn(
          "group relative col-span-full row-span-full flex w-full",
          videoVariants({ variant })
        )}
      >
        <video
          className={cn(
            "my-0 overflow-hidden bg-black",
            variant === "outline" && "rounded-lg",
            variant === "default" && "rounded-xl"
          )}
          slot="media"
          src={src}
          width={width}
          {...(typeof height === "number" ? { height } : {})}
          preload={autoplay ? "auto" : "metadata"}
          muted={autoplay ? true : muted}
          crossOrigin="anonymous"
          loop={loop}
          poster={poster}
          autoPlay={autoplay}
          suppressHydrationWarning
        />
        {alt && <figcaption className="sr-only">{alt}</figcaption>}
        {controls && (
          <div
            className={cn(
              "absolute inset-x-0 bottom-8 px-4 pb-4 md:px-12",
              !isTouchDevice &&
                "invisible translate-y-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
            )}
            key="control-bar"
          >
            <ControlBar />
          </div>
        )}
      </MediaController>
    </figure>
  )
}

export default Video
