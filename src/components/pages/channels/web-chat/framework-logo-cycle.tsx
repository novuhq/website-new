import type { CSSProperties } from "react"
import Image from "next/image"
import { DEPLOY_ACI_FRAMEWORK_LOGOS } from "@/data/pages/web-chat-deploy-aci"
import corners from "@/svgs/pages/channels/web-chat/frameworks/corners.svg"

import { cn } from "@/lib/utils"

export const FRAMEWORK_LOGO_CYCLE_TIMING = {
  holdMs: 3000,
  moveMs: 700,
} as const

export type FrameworkLogoCycleDirection = "up" | "down"

const LOGOS = DEPLOY_ACI_FRAMEWORK_LOGOS
const { holdMs, moveMs } = FRAMEWORK_LOGO_CYCLE_TIMING
const STEP_MS = holdMs + moveMs
const CYCLE_MS = STEP_MS * LOGOS.length
const STEP_PCT = 100 / LOGOS.length
const HOLD_PCT = (holdMs / CYCLE_MS) * 100

// Figma coordinates are image-relative. Translate percentages are relative to
// the logo itself: 106px desktop, 70⅔px mobile. This preserves all three slots
// as the illustration scales, including its deliberately asymmetric spacing.
const STYLE_TAG = `
.wc-flc-track {
  --wc-logo-entry-x: ${(-118 / (212 / 3)) * 100}%;
  --wc-logo-entry-y: 0%;
  --wc-logo-exit-x: ${(117 / (212 / 3)) * 100}%;
  --wc-logo-exit-y: 0%;
}
.wc-flc-logo {
  left: ${(125 / 320) * 100}%;
  top: ${(55 / 658) * 100}%;
  width: ${(212 / 3 / 320) * 100}%;
  animation-name: wcDeployAciLogoTrack;
}
.wc-flc-corners {
  animation-name: wcDeployAciLogoCorners;
}
.wc-flc-logo, .wc-flc-corners {
  animation-duration: ${CYCLE_MS}ms;
  animation-delay: var(--wc-logo-delay);
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}
@media (width >= 64rem) {
  .wc-flc-track {
    --wc-logo-entry-x: 0%;
    --wc-logo-entry-y: ${(176 / 106) * 100}%;
    --wc-logo-exit-x: 0%;
    --wc-logo-exit-y: ${(-175 / 106) * 100}%;
  }
  .wc-flc-track[data-direction="down"] {
    --wc-logo-entry-y: ${(-175 / 106) * 100}%;
    --wc-logo-exit-y: ${(176 / 106) * 100}%;
  }
  .wc-flc-logo {
    left: ${(97 / 1280) * 100}%;
    top: ${(187 / 480) * 100}%;
    width: ${(106 / 1280) * 100}%;
  }
}
@keyframes wcDeployAciLogoTrack {
  0%, ${HOLD_PCT}%, 100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  ${STEP_PCT}%, ${STEP_PCT + HOLD_PCT}% {
    opacity: 0.4;
    transform: translate3d(var(--wc-logo-exit-x), var(--wc-logo-exit-y), 0);
  }
  ${2 * STEP_PCT}%, ${2 * STEP_PCT + HOLD_PCT}% {
    opacity: 0;
    transform: translate3d(calc(var(--wc-logo-exit-x) * 2), calc(var(--wc-logo-exit-y) * 2), 0);
  }
  ${3 * STEP_PCT}%, ${3 * STEP_PCT + HOLD_PCT}% {
    opacity: 0;
    transform: translate3d(calc(var(--wc-logo-entry-x) * 2), calc(var(--wc-logo-entry-y) * 2), 0);
  }
  ${4 * STEP_PCT}%, ${4 * STEP_PCT + HOLD_PCT}% {
    opacity: 0.4;
    transform: translate3d(var(--wc-logo-entry-x), var(--wc-logo-entry-y), 0);
  }
}
@keyframes wcDeployAciLogoCorners {
  0%, ${HOLD_PCT}%, 100% { opacity: 0; }
  ${STEP_PCT}%, ${4 * STEP_PCT + HOLD_PCT}% { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .wc-flc-logo, .wc-flc-corners { animation: none; opacity: 0; }
  .wc-flc-logo[data-wc-first] { opacity: 1; transform: none; }
}
`

/**
 * One coordinated track: center → outgoing → offscreen → incoming → center.
 * Negative phase offsets populate the three Figma positions on first paint.
 * Corner frames travel with the outer logos and fade away in the center.
 * No stationary logo or black tile sits underneath the moving artwork.
 */
export function FrameworkLogoCycle({
  className,
  direction = "down",
}: {
  className?: string
  direction?: FrameworkLogoCycleDirection
}) {
  return (
    <div
      aria-hidden="true"
      data-wc-logo-track=""
      data-direction={direction}
      className={cn(
        "wc-flc-track pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: STYLE_TAG }} />
      {LOGOS.map((logo, index) => (
        <div
          key={logo.name}
          data-wc-framework={logo.name}
          data-wc-first={index === 0 || undefined}
          className="wc-flc-logo absolute aspect-square opacity-0 will-change-[transform,opacity]"
          style={
            {
              "--wc-logo-delay": `${index * STEP_MS - CYCLE_MS}ms`,
            } as CSSProperties
          }
        >
          <Image alt="" className="size-full object-contain" src={logo.icon} />
          <Image
            alt=""
            className="wc-flc-corners absolute inset-0 size-full object-contain"
            src={corners}
          />
        </div>
      ))}
    </div>
  )
}

export default FrameworkLogoCycle
