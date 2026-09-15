import Image, { type StaticImageData } from "next/image"

interface SurfaceTabsIllustrationProps {
  alt: string
  desktop: StaticImageData
  mobile: StaticImageData
  tablet: StaticImageData
  laptop: StaticImageData
}

/** Original 2× artwork; picture selects the authored crop before downloading. */
export function SurfaceTabsIllustration({
  alt,
  desktop,
  mobile,
  tablet,
  laptop,
}: SurfaceTabsIllustrationProps) {
  return (
    <picture>
      <source
        media="(min-width: 1024px) and (max-width: 1279px)"
        srcSet={laptop.src}
        width={laptop.width}
        height={laptop.height}
      />
      <source
        media="(min-width: 768px) and (max-width: 1023px)"
        srcSet={tablet.src}
        width={tablet.width}
        height={tablet.height}
      />
      <source
        media="(max-width: 767px)"
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
