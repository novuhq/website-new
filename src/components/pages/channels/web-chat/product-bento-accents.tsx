import {
  PRODUCT_BENTO_ACTIONS_STEP,
  PRODUCT_BENTO_APPROVE_LABEL,
  PRODUCT_BENTO_CANCEL_LABEL,
  PRODUCT_BENTO_CONFIRM_BODY,
  PRODUCT_BENTO_CONFIRM_TITLE,
  PRODUCT_BENTO_VIEW_ORDER_LABEL,
} from "@/data/pages/web-chat-product-bento"

/**
 * The discrete accent elements each card's illustration image excludes from
 * its own recolouring and instead gets as real DOM on top, per the shared
 * rules' hybrid decision ("bubbles, active rows, individual icons"). Every
 * element here reads `var(--wc-accent)`/`var(--wc-accent-soft)` directly, so
 * recolouring on personalize/loading costs zero re-renders — confirmed
 * accent-derived (not a fixed Figma literal) against the personalized
 * reference `45503-149086`: every one of these swaps from the idle pink
 * (`#E18CF2`/`rgba(225,140,242,…)`) to the recent.dev orange
 * (`#E65006`/`rgba(230,80,6,…)`).
 *
 * Position/size are percentages of the card's own box (`ProductBentoCard`
 * keeps that box's aspect ratio locked at any rendered width), so they track
 * the illustration losslessly from the 1920 desktop frame down to the
 * full-width mobile stack — Figma has no authored mobile frame for this
 * section (see the task report), so rather than guess separate mobile
 * pixels, padding/font/radius use a `text-[…] md:text-[…]` pair that scales
 * continuously between a legible small-viewport minimum and the exact
 * desktop Figma value.
 */

const BUBBLE_SHADOW =
  "0 3.63px 7.26px rgba(0,0,0,0.2), 0 3.63px 7.26px rgba(0,0,0,0.2)"

/**
 * Card 1 (`45487:79970`, left 6.67%/top 9.68%/width 45%) and card 2
 * (`45487:80132`, left 40.45%/top 34.48%/width 43.79%) chat bubbles.
 */
export function MessageBubble({
  text,
  leftPct,
  topPct,
  widthPct,
}: {
  text: string
  leftPct: number
  topPct: number
  widthPct: number
}) {
  return (
    <p
      className="absolute rounded-[9px_9px_1px_9px] p-[6px_12px_6px_7px] text-[11px] leading-[1.2] tracking-[-0.01em] text-white md:rounded-[14px_14px_2px_14px] md:p-[9px_20px_9px_10px] md:text-base"
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        width: `${widthPct}%`,
        background: "var(--wc-accent)",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: BUBBLE_SHADOW,
      }}
    >
      {text}
    </p>
  )
}

/**
 * Card 4 "Agent actions" step-3 pill (`45487:80338`-`45487:80340`, left
 * 10.19%/top 41.33%/width 9.26%) — the only step bullet that's accent-filled
 * in Figma (steps 1-2 stay a flat translucent white, unchanged between
 * personas).
 */
export function ActionsStepBullet() {
  return (
    <div
      className="absolute flex aspect-square items-center justify-center rounded-full border border-black text-[10px] font-medium tracking-[-0.02em] text-white md:text-lg"
      style={{
        left: "10.19%",
        top: "41.33%",
        width: "9.26%",
        // Opaque (mixed toward near-black, not `transparent`) so it fully
        // occludes the baked pixel underneath instead of letting it bleed
        // through and double the "3" as a ghosted ring.
        background: "color-mix(in srgb, var(--wc-accent) 80%, #0b0b0d)",
      }}
    >
      {PRODUCT_BENTO_ACTIONS_STEP}
    </div>
  )
}

/**
 * Card 4's confirm/Approve/Cancel panel (`45487:80341`-`45487:80350`, left
 * 22.22%/top 42.14%/width 67.82%). The panel fill/border are accent-derived;
 * the Approve (white/black) and Cancel (outline) buttons are not — both stay
 * identical between the idle and personalized reference frames.
 */
export function AgentActionsConfirmPanel() {
  return (
    <div
      className="absolute flex flex-col gap-3 rounded-xl p-[6px_8px_8px] md:p-[8px_12px_12px]"
      style={{
        left: "22.22%",
        top: "42.14%",
        width: "67.82%",
        // Opaque near-black tinted with the accent at the same ~12% Figma
        // reads (`accentSoft`), rather than `var(--wc-accent-soft)` directly
        // — that token is translucent, which let the baked "Confirm change"/
        // "Cancel" text underneath bleed through and ghost against this
        // panel's own DOM text.
        background: "color-mix(in srgb, var(--wc-accent) 12%, #0b0b0d)",
        border: "1px solid color-mix(in srgb, var(--wc-accent) 40%, #0b0b0d)",
        boxShadow: "0 18px 20px rgba(0,0,0,0.55)",
      }}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] tracking-[-0.02em] text-white md:text-base">
          {PRODUCT_BENTO_CONFIRM_TITLE}
        </span>
        <span className="text-[9px] tracking-[-0.02em] text-white/40 md:text-[13px]">
          {PRODUCT_BENTO_CONFIRM_BODY}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex flex-1 items-center justify-center rounded-md bg-white p-[4px_8px] text-[10px] font-medium tracking-[-0.01em] text-black md:p-[6px_12px_7px] md:text-sm">
          {PRODUCT_BENTO_APPROVE_LABEL}
        </span>
        <span className="flex flex-1 items-center justify-center rounded-md border border-white/20 p-[4px_8px] text-[10px] font-medium tracking-[-0.01em] text-white md:p-[6px_12px_7px] md:text-sm">
          {PRODUCT_BENTO_CANCEL_LABEL}
        </span>
      </div>
    </div>
  )
}

/**
 * Card 5's "View updater order" button (`45487:80387`/`45487:80388`, left
 * 27.55%/top 47.78%/width 74.07% — it deliberately overflows the card's right
 * edge, matching Figma's own crop there). Text stays the fixed near-black
 * `#050505` Figma uses in both the idle and personalized reference frames,
 * not `var(--wc-accent-foreground)` — flagged in the task report as a
 * possible contrast risk for very dark brand accents.
 */
export function ViewOrderButton() {
  return (
    <span
      className="absolute flex items-center justify-center rounded-lg px-2 text-center text-[10px] font-medium tracking-[-0.01em] md:text-sm"
      style={{
        left: "27.55%",
        top: "47.78%",
        width: "74.07%",
        // Height is also a percentage (34px of the card's 496px, Figma
        // `45487:80387`), not padding-driven like the other accents — this
        // button's baked source is a fixed-height pill, so a content-driven
        // height would shrink less than the image at narrow widths and
        // leave a sliver of the baked button (with its own baked label)
        // visible underneath, ghosting the text.
        height: "6.85%",
        background: "var(--wc-accent)",
        color: "#050505",
      }}
    >
      {PRODUCT_BENTO_VIEW_ORDER_LABEL}
    </span>
  )
}
