import Image from "next/image"
import {
  DEPLOY_ACI_BAKED_LOGO,
  DEPLOY_ACI_FRAMEWORK_LOGOS,
} from "@/data/pages/web-chat-deploy-aci"

import { cn } from "@/lib/utils"

/**
 * Logos travel through the illustration's "Your agent / Your stack" plate
 * (`45487-81071` desktop, `45497-147085` mobile): the centred logo reaches
 * full opacity, holds, then exits and fades. Tune the pacing here — these
 * three numbers plus the logo order in
 * `src/data/pages/web-chat-deploy-aci.ts` are the only things a reviewer
 * should need to touch.
 */
export const FRAMEWORK_LOGO_CYCLE_TIMING = {
  /** Time to slide in and fade up to full opacity. */
  enterMs: 500,
  /** Time spent centred at full opacity. Spec: "~3 seconds". */
  holdMs: 3000,
  /** Time to slide out and fade back to 0. */
  exitMs: 500,
  /** Dead air after one logo exits before the next begins entering, so
   * two logos are never both at the centre at once even with animation
   * jitter. */
  restMs: 300,
} as const

/** Vertical travel direction for desktop. Mobile always travels
 * horizontally left-to-right regardless of this prop (see brief: "Desktop
 * travel is vertical, mobile is horizontal left-to-right"). The designer
 * hasn't settled which vertical direction reads better, hence the prop. */
export type FrameworkLogoCycleDirection = "up" | "down"

const DEFAULT_DIRECTION: FrameworkLogoCycleDirection = "up"

const LOGOS = DEPLOY_ACI_FRAMEWORK_LOGOS
const { enterMs, holdMs, exitMs, restMs } = FRAMEWORK_LOGO_CYCLE_TIMING
const SEGMENT_MS = enterMs + holdMs + exitMs + restMs
const CYCLE_MS = SEGMENT_MS * LOGOS.length

// Percentages within ONE shared `CYCLE_MS`-long keyframe timeline. Each logo
// only occupies the first `SEGMENT_MS / CYCLE_MS` slice of that timeline —
// it's invisible for the rest — and gets its own negative `animation-delay`
// of `index * SEGMENT_MS`, which tiles the slices back-to-back across real
// time. That's what keeps entry -> centre -> exit sequential without any JS
// timer: it's the same CSS keyframe animation running once per logo, just
// phase-shifted.
const ENTER_PCT = (enterMs / CYCLE_MS) * 100
const HOLD_END_PCT = ((enterMs + holdMs) / CYCLE_MS) * 100
const EXIT_END_PCT = ((enterMs + holdMs + exitMs) / CYCLE_MS) * 100

// The constant term (half the hold) just chooses which logo is centred at
// t=0 (index 0) — it doesn't affect the round-robin tiling, and it's purely
// cosmetic: the permanent fallback tile below (not this timing) is what
// guarantees the plate is never blank, since any given logo is only
// visible for one fifth of `CYCLE_MS` and a snapshot taken at an arbitrary
// later moment — e.g. after the load/hydration delay in a real page view —
// lands in a dead gap most of the time. CSS animations run from the
// browser's own compositor regardless of whether React ever hydrates, so
// this delay math (plus the keyframes below) is the entire animation —
// there is no JS timer backing it up.
const T0_OFFSET_MS = enterMs + holdMs / 2

function keyframes(
  name: string,
  axis: "X" | "Y",
  enterFrom: number,
  exitTo: number
) {
  return `
@keyframes ${name} {
  0% { opacity: 0; transform: translate${axis}(${enterFrom}%); }
  ${ENTER_PCT}% { opacity: 1; transform: translate${axis}(0%); }
  ${HOLD_END_PCT}% { opacity: 1; transform: translate${axis}(0%); }
  ${EXIT_END_PCT}% { opacity: 0; transform: translate${axis}(${exitTo}%); }
  100% { opacity: 0; transform: translate${axis}(${enterFrom}%); }
}`
}

const KEYFRAMES_UP = keyframes("wcDeployAciLogoUp", "Y", 60, -60)
const KEYFRAMES_DOWN = keyframes("wcDeployAciLogoDown", "Y", -60, 60)
const KEYFRAMES_HORIZONTAL = keyframes(
  "wcDeployAciLogoHorizontal",
  "X",
  -60,
  60
)

const STYLE_TAG = `
${KEYFRAMES_UP}
${KEYFRAMES_DOWN}
${KEYFRAMES_HORIZONTAL}
.wc-flc-logo {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  animation-duration: ${CYCLE_MS}ms;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  will-change: transform, opacity;
}
.wc-flc-logo[data-direction="up"] { animation-name: wcDeployAciLogoUp; }
.wc-flc-logo[data-direction="down"] { animation-name: wcDeployAciLogoDown; }
@media (max-width: 767px) {
  .wc-flc-logo[data-direction="up"],
  .wc-flc-logo[data-direction="down"] {
    animation-name: wcDeployAciLogoHorizontal;
  }
}
@media (prefers-reduced-motion: reduce) {
  /* All animated tiles hide, leaving only the permanent unanimated
     fallback below them — i.e. one static logo, per spec. */
  .wc-flc-logo {
    animation: none !important;
    opacity: 0;
  }
}
`

export function FrameworkLogoCycle({
  className,
  direction = DEFAULT_DIRECTION,
}: {
  className?: string
  direction?: FrameworkLogoCycleDirection
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Static, build-time-computed CSS text (no user input reaches this
          string) — plain CSS keyframes so the cycle runs even if this app
          never hydrates in a given environment. */}
      <style dangerouslySetInnerHTML={{ __html: STYLE_TAG }} />

      {/* Permanent fallback, unanimated: the same mark the flattened
          illustration bakes in behind this slot (`DEPLOY_ACI_BAKED_LOGO`,
          read directly rather than `LOGOS[0]` — reordering the cycle below
          can't break this). Whatever moment this is inspected — no JS,
          mid-transition, a `prefers-reduced-motion` visitor, or the
          animated tiles fully faded out between turns — this is always
          painted underneath at full opacity, so the plate is never
          blank. */}
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <Image
          alt={DEPLOY_ACI_BAKED_LOGO.name}
          className="size-full object-contain"
          src={DEPLOY_ACI_BAKED_LOGO.icon}
        />
      </div>

      {LOGOS.map((logo, index) => (
        <div
          key={logo.name}
          className="wc-flc-logo"
          data-direction={direction}
          style={{ animationDelay: `-${T0_OFFSET_MS + index * SEGMENT_MS}ms` }}
        >
          <Image
            alt={logo.name}
            className="size-full object-contain"
            src={logo.icon}
          />
        </div>
      ))}
    </div>
  )
}

export default FrameworkLogoCycle
