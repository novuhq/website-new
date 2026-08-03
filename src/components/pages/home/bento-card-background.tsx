import Image, { type StaticImageData } from "next/image"
import noiseLight from "@/images/pages/home/surface-noise.webp"

import { cn } from "@/lib/utils"

export type BentoCardBackgroundImage = StaticImageData | string

interface IBentoCardBackgroundProps {
  backgroundClassName?: string
  backgroundImage: BentoCardBackgroundImage
}

function BentoCardBackground({
  backgroundClassName,
  backgroundImage,
}: IBentoCardBackgroundProps) {
  const isExportedImage = typeof backgroundImage !== "string"

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {isExportedImage ? (
        <Image
          className={cn("object-fill", backgroundClassName)}
          src={backgroundImage}
          alt=""
          fill
          sizes="100vw"
          quality={90}
        />
      ) : (
        <div
          className={cn("absolute inset-0 bg-[#0B0C0E]", backgroundClassName)}
          style={{ backgroundImage }}
        />
      )}

      <div
        className="absolute inset-0 opacity-[0.11] mix-blend-overlay"
        style={{
          backgroundImage: `url("${noiseLight.src}")`,
          backgroundPosition: "top left",
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />
    </div>
  )
}

export default BentoCardBackground
