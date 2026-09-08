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
        <SurfaceTabsSidebar
          items={sidebarItems}
          compact={compact}
          className="h-full"
          style={{ width: sidebarWidth }}
        />
        <div className="relative flex-1 overflow-hidden">
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
