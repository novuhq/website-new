import Image from "next/image"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

export interface IPictureProps {
  className?: string
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
  variant?: "default" | "outline"
}

const pictureVariants = cva("relative", {
  variants: {
    variant: {
      default: "",
      outline:
        "rounded-xl p-2 before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-xl before:border before:border-border",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function Picture({
  className,
  src,
  alt = "",
  caption,
  variant = "default",
  width = 704,
  height,
}: IPictureProps) {
  const isGif = /\.gif(\?|$)/i.test(src)
  const cleanSrc = isGif ? src.replace(/(\.[^.]+)(\?.*)?$/, "$1") : src

  return (
    <figure className={cn("my-6 md:my-8", className)}>
      <div className={pictureVariants({ variant })}>
        {isGif ? (
          <img
            className="w-full rounded-lg"
            src={cleanSrc}
            width={width}
            height={height}
            alt={alt}
          />
        ) : (
          <Image
            className="w-full rounded-lg"
            src={cleanSrc}
            width={width}
            height={height}
            quality={100}
            sizes="(max-width: 768px) 100vw, 640px"
            alt={alt}
          />
        )}
      </div>
      {caption && (
        <figcaption className="mx-auto mt-3 max-w-2xl text-center text-sm font-medium tracking-tight text-muted-foreground md:text-base">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export default Picture
