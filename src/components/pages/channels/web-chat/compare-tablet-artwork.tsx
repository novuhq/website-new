import Image from "next/image"
import oldLaptopBase from "@/images/pages/channels/web-chat/compare-layers/compare-old-laptop-base.jpg"
import oldLaptopDefault from "@/images/pages/channels/web-chat/compare-layers/compare-old-laptop-full.jpg"
import oldLaptopUI from "@/images/pages/channels/web-chat/compare-layers/compare-old-laptop.inline.svg"
import oldTabletBase from "@/images/pages/channels/web-chat/compare-layers/compare-old-tablet-base.jpg"
import oldTabletDefault from "@/images/pages/channels/web-chat/compare-layers/compare-old-tablet-full.jpg"
import oldTabletUI from "@/images/pages/channels/web-chat/compare-layers/compare-old-tablet.inline.svg"
import webLaptopBase from "@/images/pages/channels/web-chat/compare-layers/compare-web-laptop-base.jpg"
import webLaptopDefault from "@/images/pages/channels/web-chat/compare-layers/compare-web-laptop-full.jpg"
import webLaptopUI from "@/images/pages/channels/web-chat/compare-layers/compare-web-laptop.inline.svg"
import webTabletBase from "@/images/pages/channels/web-chat/compare-layers/compare-web-tablet-base.jpg"
import webTabletDefault from "@/images/pages/channels/web-chat/compare-layers/compare-web-tablet-full.jpg"
import webTabletUI from "@/images/pages/channels/web-chat/compare-layers/compare-web-tablet.inline.svg"

import { cn } from "@/lib/utils"

import { BrandArtwork } from "./brand-artwork"

const ARTWORK = {
  old: [
    {
      id: "compare-old-tablet",
      image: oldTabletDefault,
      background: oldTabletBase,
      UI: oldTabletUI,
      className: "md:block lg:hidden",
    },
    {
      id: "compare-old-laptop",
      image: oldLaptopDefault,
      background: oldLaptopBase,
      UI: oldLaptopUI,
      className: "lg:block xl:hidden",
    },
  ],
  web: [
    {
      id: "compare-web-tablet",
      image: webTabletDefault,
      background: webTabletBase,
      UI: webTabletUI,
      className: "md:block lg:hidden",
    },
    {
      id: "compare-web-laptop",
      image: webLaptopDefault,
      background: webLaptopBase,
      UI: webLaptopUI,
      className: "lg:block xl:hidden",
    },
  ],
} as const

/** Figma supplies separate landscape compositions at 768px and 1024px. */
export function CompareTabletArtwork({ kind }: { kind: keyof typeof ARTWORK }) {
  return ARTWORK[kind].map(({ id, image, background, UI, className }) => (
    <div key={id} className={cn("absolute inset-0 isolate hidden", className)}>
      <Image
        src={image}
        alt=""
        aria-hidden
        fill
        unoptimized
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
      <BrandArtwork
        id={id}
        background={background}
        UI={UI}
        cover
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
    </div>
  ))
}
