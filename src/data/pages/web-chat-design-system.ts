/**
 * §7 "Works with your design system. Ship to production" (Task 14).
 * Figma desktop `45487-82563`. No dedicated mobile frame exists for this
 * section in the full mobile page (`45487-98982`) — see the component for
 * details, matching the gap Task 10 already found and documented for §3.
 *
 * Every string below traces to a text node under `45487-82563`, read via
 * the Figma MCP `get_figma_data` tool. Dashes are U+2014 (em dash) and the
 * "typing" ellipsis is the single U+2026 glyph — both copied verbatim from
 * the Figma text runs, not retyped, per the branch's apostrophe-mismatch
 * lesson (see F14 in the plan ledger).
 */

export const DESIGN_SYSTEM_HEADING =
  "Works with your design system. Ship to production"

export const DESIGN_SYSTEM_DESCRIPTION =
  "Web Chat is a flexible React hook, not a fixed widget. Style it with your own components or any compatible library to match your brand."

export const DESIGN_SYSTEM_PRIMARY_CTA_LABEL = "Start building"
export const DESIGN_SYSTEM_SECONDARY_CTA_LABEL = "Explore AI elements"
export const DESIGN_SYSTEM_SECONDARY_CTA_HREF = "https://elements.ai-sdk.dev/"

export const DESIGN_SYSTEM_AGENT_LABEL = "Agent"
export const DESIGN_SYSTEM_TYPING_LABEL = "Agent is typing…"
export const DESIGN_SYSTEM_COMPOSER_PLACEHOLDER = "Enter a message..."

export type DesignSystemBubble =
  | { kind: "user"; text: string }
  | {
      kind: "agent"
      text: string
      linkText?: string
      /**
       * When the immediately preceding bubble is `typing`, Figma renders the
       * delivered reply as plain text with no repeated "Agent" caption (the
       * typing line already established the speaker) — e.g. `45487:82715`
       * and `45487:82655` have no `label` wrapper, unlike every other agent
       * reply. Set on those two bubbles only.
       */
      skipLabel?: boolean
    }
  | { kind: "typing" }
  | { kind: "status"; text: string }
  | { kind: "checklist"; items: string[] }

export interface DesignSystemSurface {
  id: "amber" | "purple" | "blue"
  /** Only the centre (purple) surface shows a header title in Figma. */
  title?: string
  /** Only the centre and right (blue) surfaces show a composer in Figma. */
  showComposer: boolean
  bubbles: DesignSystemBubble[]
}

/** Centre surface (`45487:82686`) — the prominent one, drawn last/on top. */
export const DESIGN_SYSTEM_CENTER_SURFACE: DesignSystemSurface = {
  id: "purple",
  title: "Product Assistant",
  showComposer: true,
  bubbles: [
    {
      kind: "user",
      text: "Can you move my product demo to Thursday afternoon?",
    },
    {
      kind: "agent",
      text: "Sure — I found your 2 PM booking. Move it to Thursday at 3:30?",
    },
    { kind: "user", text: "Yes, and invite Maya from my team." },
    { kind: "typing" },
    {
      kind: "agent",
      text: "Done — the demo is rescheduled, and Maya has been added.",
      linkText: "View...",
      skipLabel: true,
    },
  ],
}

/** Left surface (`45487:82629`), amber theme. */
export const DESIGN_SYSTEM_LEFT_SURFACE: DesignSystemSurface = {
  id: "amber",
  showComposer: false,
  bubbles: [
    {
      kind: "agent",
      text: "Your Pro plan renews on October 18. No changes are currently scheduled.",
    },
    {
      kind: "user",
      text: "Can you switch me to annual billing and keep my current features?",
    },
    { kind: "typing" },
    {
      kind: "agent",
      text: "Yes — your current features will stay the same.",
      skipLabel: true,
    },
    { kind: "status", text: "Updating your subscription" },
    {
      kind: "checklist",
      items: [
        "Checked plan eligibility",
        "Preserved current features",
        "Calculated annual...",
      ],
    },
  ],
}

/** Right surface (`45487:82587`), blue theme. */
export const DESIGN_SYSTEM_RIGHT_SURFACE: DesignSystemSurface = {
  id: "blue",
  showComposer: true,
  bubbles: [
    {
      kind: "user",
      text: "Can you give Maya access to the analytics dashboard?",
    },
    {
      kind: "agent",
      text: "I found Maya Chen in your workspace. Should I add her as a Viewer?",
    },
    { kind: "user", text: "Yes, and let her know in Slack!" },
    {
      kind: "agent",
      text: "Done — Maya has Viewer access, and the Slack message was sent.",
    },
  ],
}
