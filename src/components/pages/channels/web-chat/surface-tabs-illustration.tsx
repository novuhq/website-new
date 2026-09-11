import Image, { type StaticImageData } from "next/image"

interface SurfaceTabsIllustrationProps {
  alt: string
  desktop: StaticImageData
  mobile: StaticImageData
}

/** Original 2× artwork; picture selects the authored crop before downloading. */
export function SurfaceTabsIllustration({
  alt,
  desktop,
  mobile,
}: SurfaceTabsIllustrationProps) {
  return (
    <picture>
      <source
        media="(max-width: 1023px)"
        srcSet={mobile.src}
        width={mobile.width}
        height={mobile.height}
      />
      <Image
        src={desktop}
        alt={alt}
        unoptimized
        className="block h-auto w-full"
      />
    </picture>
  )
}
