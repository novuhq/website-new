import desktopDots from "@/images/pages/channels/web-chat/hero-dots-desktop.png"
import mobileDots from "@/images/pages/channels/web-chat/hero-dots-mobile.png"
import heroNoise from "@/images/pages/channels/web-chat/hero-noise.png"

import { cn } from "@/lib/utils"
import { HueLayer } from "@/components/pages/channels/web-chat/hue-layer"

// Light centers/radii are percentages of each authored canvas. These six
// smooth fields approximate Figma's masked blue, violet and pink ellipses
// (45440:66781 desktop / 45487:111217 mobile) without magnifying raster grain.
type BloomLight = readonly [
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  color: string,
]

const DESKTOP_LIGHTS: readonly BloomLight[] = [
  [33.53, 35.13, 42.09, 30.55, "132 26 114"],
  [61.74, 45.21, 62.21, 42.1, "76 40 225"],
  [38.88, 49.14, 60.18, 38.42, "24 24 199"],
  [48.54, 59.12, 46.74, 13.51, "97 70 136"],
  [57.3, 52.32, 69.17, 20.12, "137 75 84"],
  [50.74, 33.36, 88.82, 38.53, "44 37 81"],
]

const MOBILE_LIGHTS: readonly BloomLight[] = [
  [39.17, 48.92, 72.17, 29.04, "110 37 92"],
  [61.26, 55.43, 110.24, 37.34, "71 51 230"],
  [47.16, 66.66, 59.4, 16.67, "91 59 118"],
  [72.49, 64, 110.82, 20.71, "121 61 127"],
  [55.25, 72.37, 106.02, 14.74, "0 8 87"],
  [94.14, 50.26, 129.48, 33.55, "58 39 92"],
]

function bloomBackground(lights: readonly BloomLight[]) {
  return lights
    .map(([x, y, radiusX, radiusY, color]) => {
      // A sampled Gaussian falloff makes the light fade softly without a
      // viewport-sized blur filter or a visible, hard ellipse boundary.
      const stops = Array.from({ length: 17 }, (_, index) => {
        const position = index / 16
        const alpha = index === 16 ? 0 : Math.exp(-6.125 * position ** 2)
        return `rgb(${color} / ${alpha.toFixed(4)}) ${position * 100}%`
      })
      return `radial-gradient(ellipse ${radiusX}% ${radiusY}% at ${x}% ${y}%, ${stops.join(", ")})`
    })
    .join(", ")
}

const DESKTOP_BACKGROUND = bloomBackground(DESKTOP_LIGHTS)
const MOBILE_BACKGROUND = bloomBackground(MOBILE_LIGHTS)

function BloomCanvas({ compact = false }: { compact?: boolean }) {
  const dots = compact ? mobileDots : desktopDots

  return (
    <div
      data-slot="hero-bloom"
      className={cn(
        "absolute -top-16 bg-black bg-blend-screen",
        compact
          ? "inset-x-0 h-[1407px] lg:hidden"
          : "left-1/2 hidden h-[1788px] w-full min-w-[1920px] -translate-x-1/2 lg:block"
      )}
      style={{
        backgroundImage: compact ? MOBILE_BACKGROUND : DESKTOP_BACKGROUND,
      }}
    >
      {/* Texture stays at its own scale as the bloom grows with the viewport. */}
      <div
        className="absolute inset-0 opacity-32 mix-blend-overlay"
        style={{
          backgroundImage: `url(${heroNoise.src})`,
          backgroundSize: `${heroNoise.width}px ${heroNoise.height}px`,
        }}
      />
      {/* Figma's original texture and blurred mask, exported together at 2×.
          Position by the rendered bounds, including the mask's blur bleed:
          desktop (255.508, 1039), mobile (0, 887.09) in their hero canvases. */}
      <div
        data-slot="hero-dots"
        className={cn(
          "absolute bg-size-[100%_100%] bg-no-repeat mix-blend-plus-lighter",
          compact
            ? "inset-x-0 top-[887.09px]"
            : "top-[1039px] left-[13.3077%] w-[73.3846%]"
        )}
        style={{
          backgroundImage: `url(${dots.src})`,
          aspectRatio: `${dots.width} / ${dots.height}`,
        }}
      />
    </div>
  )
}

export function HeroBackdrop({ personalized }: { personalized: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -bottom-20 isolate overflow-hidden"
    >
      {/* Fixed canvas heights keep the bloom aligned to the fixed-height UI.
          Desktop stays centered/cropped below 1920px and stretches above it. */}
      <BloomCanvas compact />
      <BloomCanvas />
      <HueLayer active={personalized} />
    </div>
  )
}
