import Image, { type ImageProps } from "next/image"

import { cn } from "@/lib/utils"

interface ILogo {
  src: ImageProps["src"]
  alt: string
  width: number
  height: number
}

type TLogoItem = ILogo & {
  wrapperClassName?: string
  imageClassName?: string
}

interface ILogosProps {
  logos: TLogoItem[]
  className?: string
  animated?: boolean
  animationClassName?: string
  trackClassName?: string
  listClassName?: string
  duplicateListClassName?: string
  useMask?: boolean
}

function Logos({
  logos,
  className,
  animated = true,
  animationClassName,
  trackClassName,
  listClassName,
  duplicateListClassName,
  useMask = false,
}: ILogosProps) {
  const shouldAnimate = animated && logos.length > 0

  return (
    <div
      className={cn(
        "-mx-5 overflow-hidden pt-8 pb-6 md:-mx-8 lg:mx-0 lg:overflow-visible lg:pt-0 lg:pb-10.5",
        shouldAnimate &&
          useMask &&
          "mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]",
        className
      )}
    >
      <div
        className={cn(
          "flex w-max lg:w-full",
          shouldAnimate &&
            (animationClassName ??
              "animate-[logos_30s_linear_infinite] will-change-transform motion-reduce:animate-none lg:animate-none lg:will-change-auto"),
          trackClassName
        )}
      >
        <ul
          className={cn(
            "flex shrink-0 items-center gap-6 pr-6 lg:w-full lg:justify-between lg:gap-0 lg:pr-0",
            listClassName
          )}
        >
          {logos.map(
            (
              { src, alt, width, height, wrapperClassName, imageClassName },
              index
            ) => (
              <li
                key={`logo_${index}`}
                className={cn(
                  "relative shrink-0 overflow-hidden",
                  wrapperClassName
                )}
              >
                <Image
                  className={cn("h-full w-full", imageClassName)}
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                />
              </li>
            )
          )}
        </ul>

        {shouldAnimate && (
          <ul
            className={cn(
              "flex shrink-0 items-center gap-6 pr-6 lg:hidden",
              duplicateListClassName
            )}
            aria-hidden="true"
          >
            {logos.map(
              (
                { src, alt, width, height, wrapperClassName, imageClassName },
                index
              ) => (
                <li
                  key={`logo_${index}_duplicate`}
                  className={cn(
                    "relative shrink-0 overflow-hidden",
                    wrapperClassName
                  )}
                >
                  <Image
                    className={cn("h-full w-full", imageClassName)}
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                  />
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Logos
