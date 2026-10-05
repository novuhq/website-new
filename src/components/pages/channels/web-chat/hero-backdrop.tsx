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

// Sampled independently from the tablet bloom (45902:55543). Its masked
// lights differ from a scaled copy of the desktop composition.
const TABLET_LIGHTS: readonly BloomLight[] = [
  [33.06, 33.77, 40.44, 29.46, "122 20 100"],
  [59.05, 44.45, 62.87, 40.72, "57 23 224"],
  [35.08, 48.23, 52.39, 37.36, "26 22 170"],
  [48.34, 56.93, 42.79, 13.31, "105 73 142"],
  [59.69, 50.9, 64.51, 21.42, "134 77 120"],
  [52.29, 35.02, 88.07, 40.03, "60 48 106"],
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
const TABLET_BACKGROUND = bloomBackground(TABLET_LIGHTS)
const MOBILE_BACKGROUND = bloomBackground(MOBILE_LIGHTS)
// The desktop Figma image fill tiles the 1024px noise source at 57.0623%.
const DESKTOP_NOISE_SIZE = heroNoise.width * 0.57062304

function BloomCanvas({ variant }: { variant: "phone" | "tablet" | "desktop" }) {
  const compact = variant === "phone"
  const dots = compact ? mobileDots : desktopDots

  return (
    <div
      data-slot="hero-bloom"
      className={cn(
        "absolute bg-black bg-blend-screen",
        variant === "phone" && "inset-x-0 top-0 h-[1407px] md:hidden",
        variant === "tablet" &&
          "top-0 left-[-176px] hidden h-329 w-344 md:block",
        variant === "desktop" &&
          "top-45.5 left-[-176px] h-329 w-344 xl:-top-16 xl:left-1/2 xl:h-[1788px] xl:w-full xl:min-w-[1920px] xl:-translate-x-1/2"
      )}
      style={{
        backgroundImage:
          variant === "phone"
            ? MOBILE_BACKGROUND
            : variant === "tablet"
              ? TABLET_BACKGROUND
              : DESKTOP_BACKGROUND,
      }}
    >
      {/* Texture stays at its own scale as the bloom grows with the viewport. */}
      <div
        className={cn(
          "absolute inset-0 opacity-32 mix-blend-overlay",
          !compact && "-scale-x-100"
        )}
        style={{
          backgroundImage: `url(${heroNoise.src})`,
          backgroundSize:
            variant === "desktop"
              ? `${DESKTOP_NOISE_SIZE}px ${DESKTOP_NOISE_SIZE}px`
              : `${heroNoise.width}px ${heroNoise.height}px`,
        }}
      />
      {/* Figma's original texture and blurred mask, exported together at 2×.
          Position by the rendered bounds, including the mask's blur bleed:
          desktop (255.508, 1039), mobile (0, 887.09) in their hero canvases.
          Snap the desktop export to whole pixels and keep its authored size
          as the bloom grows, so the small dots stay sharp and evenly spaced. */}
      <div
        data-slot="hero-dots"
        className={cn(
          "absolute bg-size-[100%_100%] bg-no-repeat mix-blend-plus-lighter",
          compact
            ? "inset-x-0 top-[887.09px]"
            : "top-[745px] left-[183px] h-38 w-[1010px] xl:top-[1039px] xl:left-[calc(50%-704px)] xl:h-53 xl:w-[1409px]"
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
      className="pointer-events-none absolute inset-x-0 top-0 -bottom-20 isolate hidden overflow-hidden lg:block"
    >
      {/* Fixed canvas heights keep the bloom aligned to the fixed-height UI.
          Desktop stays centered/cropped below 1920px and stretches above it. */}
      <BloomCanvas variant="desktop" />
      <HueLayer active={personalized} />
    </div>
  )
}

/** Anchor smaller canvases to the UI so copy wrapping cannot displace the glow. */
export function HeroResponsiveBackdrop({
  personalized,
}: {
  personalized: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-[570.09px] left-1/2 isolate -z-10 h-[1407px] w-screen -translate-x-1/2 overflow-hidden md:-top-[307px] md:h-329 lg:hidden"
    >
      {/* Phone dots start at the 317px dashboard's lower edge. The tablet
          canvas starts 307px above its 476px dashboard in 45902:52824. */}
      <BloomCanvas variant="phone" />
      <BloomCanvas variant="tablet" />
      <HueLayer active={personalized} />
    </div>
  )
}
