"use client"

import { ReactNode, useState } from "react"
import { cva } from "class-variance-authority"

import { IYouTubeEmbed } from "@/types/common"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

export interface IYouTubeEmbedProps extends IYouTubeEmbed {
  className?: string
  children: ReactNode
  width?: number
  height?: number
  variant?: "default" | "outline"
}

const youtubeVariants = cva("relative", {
  variants: {
    variant: {
      default: "",
      outline:
        "rounded-xl p-2 before:pointer-events-none before:absolute before:inset-0 before:z-40 before:rounded-xl before:border before:border-gray-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function YouTubeEmbed({
  children,
  youtubeId,
  className,
  variant = "default",
}: IYouTubeEmbedProps) {
  const [isVideoActive, setIsVideoActive] = useState(false)
  const Icon = Icons.play

  const handleVideoClick = () => {
    setIsVideoActive(true)
  }

  return (
    <figure
      className={cn(
        "youtube-embed not-prose relative flex",
        youtubeVariants({ variant }),
        className
      )}
    >
      <button
        className={cn(
          "w-full overflow-hidden",
          variant === "outline" && "rounded-lg",
          variant === "default" && "rounded-xl"
        )}
        role="button"
        onClick={handleVideoClick}
      >
        <div
          className={cn(
            "aspect-video size-full bg-background",
            isVideoActive && "invisible"
          )}
        >
          {children}
        </div>
        <div
          className="absolute top-1/2 left-1/2 flex size-12 -translate-1/2 items-center justify-center gap-x-2 rounded-full bg-foreground/30 shadow-md backdrop-blur-xs transition-transform duration-300 hover:scale-125"
          tabIndex={isVideoActive ? -1 : 0}
        >
          <Icon name="play" className="shrink-0" size={24} />
          <span className="sr-only">Play video</span>
        </div>
      </button>
      {isVideoActive && (
        <div className={cn("absolute inset-0", variant === "outline" && "p-2")}>
          <iframe
            className={cn(
              "aspect-video size-full bg-background",
              variant === "outline" && "rounded-lg",
              variant === "default" && "rounded-xl"
            )}
            width={704}
            height={396}
            src={`https://www.youtube.com/embed/${youtubeId}?&autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      )}
    </figure>
  )
}

export default YouTubeEmbed
