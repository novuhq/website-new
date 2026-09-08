import type {
  SurfaceTabsMessage,
  SurfaceTabsSidebarItem,
} from "@/data/pages/web-chat-surface-tabs"

import { cn } from "@/lib/utils"

import { SurfaceTabsChatCard } from "./surface-tabs-chat-card"
import { SurfaceTabsDashboardTable } from "./surface-tabs-dashboard-table"
import { SurfaceTabsSidebar } from "./surface-tabs-sidebar"

interface Box {
  left: number
  top: number
  width: number
  height: number
}

/**
 * CSS stand-in for Figma's `bg` group (`45487-80927` / `45497-141552`, ~70%
 * opacity): a layered composition of blurred colour ellipses behind the
 * dashboard, present on both tabs at both breakpoints. A previous pass
 * downloaded the actual asset and found it a 19.7 MB PNG relative to its
 * cropped, faded, ~70%-opacity footprint, so it's approximated here with
 * blurred radial gradients in the same five colours instead — zero asset
 * weight, and it scales at any breakpoint. Not pixel-identical, but it
 * restores the frame's intended ambient colour behind the dashboard chrome.
 */
const DASHBOARD_GLOW_BACKGROUND = [
  "radial-gradient(38% 55% at 12% 15%, #4B73EC 0%, transparent 70%)",
  "radial-gradient(34% 46% at 88% 8%, #523FFD 0%, transparent 70%)",
  "radial-gradient(46% 58% at 78% 85%, #FFA3F4 0%, transparent 72%)",
  "radial-gradient(34% 42% at 18% 90%, #FFA488 0%, transparent 70%)",
  "radial-gradient(55% 65% at 48% 45%, #664BEC 0%, transparent 75%)",
].join(", ")

export interface SurfaceTabsIllustrationProps {
  /** Overall canvas size in px — 1344×613 desktop, 528×242 mobile. */
  canvasWidth: number
  canvasHeight: number
  sidebarWidth: number
  sidebarItems: SurfaceTabsSidebarItem[]
  /** The floating chat card's box, in the same px space as the canvas. */
  chatBox: Box
  showTable?: boolean
  messages: SurfaceTabsMessage[]
  checklist?: string[]
  composerPlaceholder?: string
  composerDraft?: string
  compact?: boolean
  className?: string
}

/**
 * One dashboard+chat composition (Figma "ui" group `45487-80420` /
 * `45497-141046`, and its mobile equivalents at `45497-146321` /
 * `45497-145686`): a mock app shell (sidebar + content area) with the
 * floating glass chat card layered on top. Side panel and Full screen share
 * this exact structure — every difference between them (sidebar width, nav
 * items, chat box position/size, whether the content area shows a table,
 * the conversation) is passed in as props.
 *
 * The chat card's box was extracted independently at each breakpoint (not
 * inferred by scaling the desktop numbers): Side panel's mobile box lands on
 * the same proportions as its desktop box, but Full screen's mobile box is
 * narrower and shifted right relative to a plain scale-down of its desktop
 * box — a genuine per-breakpoint authoring difference in the frames, not a
 * rounding artifact.
 */
export function SurfaceTabsIllustration({
  canvasWidth,
  canvasHeight,
  sidebarWidth,
  sidebarItems,
  chatBox,
  showTable,
  messages,
  checklist,
  composerPlaceholder,
  composerDraft,
  compact,
  className,
}: SurfaceTabsIllustrationProps) {
  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: canvasWidth, height: canvasHeight }}
    >
      {/* dashboard */}
      <div
        className={cn(
          "absolute inset-0 flex overflow-hidden border border-[#2A2B33] bg-[#101114]",
          compact ? "rounded-[9px]" : "rounded-3xl"
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-70 blur-3xl"
          style={{ backgroundImage: DASHBOARD_GLOW_BACKGROUND }}
        />
        <SurfaceTabsSidebar
          items={sidebarItems}
          compact={compact}
          className="relative z-10 h-full"
          style={{ width: sidebarWidth }}
        />
        <div className="relative z-10 flex-1 overflow-hidden">
          {showTable && (
            <div className="opacity-40">
              <SurfaceTabsDashboardTable compact={compact} />
            </div>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,12,0)_0%,rgba(0,0,0,1)_81%)]" />
        </div>
      </div>

      {/* floating chat card */}
      <SurfaceTabsChatCard
        messages={messages}
        checklist={checklist}
        composerPlaceholder={composerPlaceholder}
        composerDraft={composerDraft}
        compact={compact}
        className="absolute"
        style={{
          left: chatBox.left,
          top: chatBox.top,
          width: chatBox.width,
          height: chatBox.height,
        }}
      />
    </div>
  )
}
