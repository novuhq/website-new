import type { CSSProperties } from "react"
import Image from "next/image"
import {
  SURFACE_TABS_AGENT_NAME,
  type SurfaceTabsMessage,
} from "@/data/pages/web-chat-surface-tabs"
import agentMark from "@/images/pages/channels/web-chat/surface-tabs-agent-mark.png"
import { ArrowUp, Minus, Sparkles, X } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * One chat bubble. User turns fill black and align right; agent replies are
 * plain text under a small caption and align left — both per the "message"
 * frames shared by the Side panel (`45487-81003`…) and Full screen
 * (`45497-141628`…) states. Figma positions each bubble with an explicit
 * x/y offset, but the offsets are just where a normal-flow chat log (user
 * right-aligned, agent left-aligned, stacked top to bottom) would place
 * them, so this renders as flex rows rather than absolutely positioned ones.
 */
function ChatBubble({
  message,
  compact,
}: {
  message: SurfaceTabsMessage
  compact?: boolean
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <p
          className={cn(
            "max-w-[85%] rounded-tl-[14px] rounded-tr-[14px] rounded-br-[4px] rounded-bl-[14px] border border-white/20 bg-black tracking-[-0.01em] text-white shadow-[0_3.6px_31.3px_rgba(0,0,0,0.2)]",
            compact
              ? "rounded-tl-[5.5px] rounded-tr-[5.5px] rounded-br-[1.5px] rounded-bl-[5.5px] py-[1.5px] pr-[8px] pl-[5px] text-[6px]"
              : "py-2 pr-5 pl-3 text-[15px] leading-[1.2]"
          )}
        >
          {message.text}
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex max-w-[85%] flex-col",
        compact ? "gap-[3px]" : "gap-2"
      )}
    >
      <div
        className={cn("flex items-center", compact ? "gap-[2px]" : "gap-1.5")}
      >
        <Sparkles
          className={cn(
            "shrink-0 text-white/50",
            compact ? "size-[6px]" : "size-3.5"
          )}
        />
        <span
          className={cn(
            "tracking-[-0.01em] text-white/50",
            compact ? "text-[5px]" : "text-[13px]"
          )}
        >
          {message.label}
        </span>
      </div>
      <p
        className={cn(
          "tracking-[-0.01em] text-white",
          compact ? "text-[6px] leading-[1.37]" : "text-[15px] leading-[1.37]"
        )}
      >
        {message.text}
      </p>
    </div>
  )
}

export interface SurfaceTabsChatCardProps {
  messages: SurfaceTabsMessage[]
  checklist?: string[]
  composerPlaceholder?: string
  composerDraft?: string
  className?: string
  style?: CSSProperties
  compact?: boolean
}

/**
 * The floating glass chat card (Figma "chat" `45487-80948` / `45497-141573`).
 * Shared by both tab states — only the message script, optional checklist
 * and composer content differ, passed in as props.
 */
export function SurfaceTabsChatCard({
  messages,
  checklist,
  composerPlaceholder,
  composerDraft,
  className,
  style,
  compact,
}: SurfaceTabsChatCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[14px] border border-white/90 bg-[radial-gradient(circle_at_115%_-41%,rgba(0,0,0,0.36)_15%,rgba(148,72,225,0.36)_57%,rgba(234,136,239,0.36)_79%)] shadow-[0_12px_32px_rgba(0,0,0,0.64),0_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[48px]",
        compact &&
          "rounded-[5.5px] shadow-[0_4.7px_12.6px_rgba(0,0,0,0.64),0_1.6px_1.6px_rgba(0,0,0,0.25)] backdrop-blur-[19px]",
        className
      )}
      style={style}
    >
      {/* header */}
      <div
        className={cn(
          "flex shrink-0 items-center border-b border-white/30",
          compact ? "h-[22px] gap-[6px] px-[3px]" : "h-14 gap-4 px-3"
        )}
      >
        <Image
          src={agentMark}
          alt=""
          className={cn(
            "shrink-0 rounded-full",
            compact ? "size-[16px]" : "size-10"
          )}
        />
        <span
          className={cn(
            "tracking-[-0.02em] text-white",
            compact ? "text-[7px]" : "text-lg"
          )}
        >
          {SURFACE_TABS_AGENT_NAME}
        </span>
        <div
          className={cn(
            "ml-auto flex items-center",
            compact ? "gap-[6px]" : "gap-4"
          )}
        >
          <Minus
            className={cn("text-white/70", compact ? "size-[8px]" : "size-5")}
          />
          <X
            className={cn("text-white/70", compact ? "size-[8px]" : "size-5")}
          />
        </div>
      </div>

      {/* message log */}
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden",
          compact ? "gap-[6px] p-[5px]" : "gap-6 p-5"
        )}
      >
        {messages.map((message, i) => (
          <ChatBubble key={i} message={message} compact={compact} />
        ))}

        {checklist && (
          <div
            className={cn(
              "flex max-w-[90%] flex-col",
              compact ? "gap-px" : "gap-0.5"
            )}
          >
            {checklist.map((item, i) => (
              <div
                key={item}
                className={cn(
                  "flex items-start bg-white/10 tracking-[-0.01em] text-white",
                  compact
                    ? "gap-[3px] px-[5px] py-[3px] text-[6px]"
                    : "gap-2 px-5 py-2 text-[15px]",
                  i === 0 && (compact ? "rounded-t-[3px]" : "rounded-t-lg"),
                  i === checklist.length - 1 &&
                    (compact ? "rounded-b-[3px]" : "rounded-b-lg")
                )}
              >
                <Sparkles
                  className={cn(
                    "mt-0.5 shrink-0",
                    compact ? "size-[6px]" : "size-3.5"
                  )}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* composer */}
      {(composerPlaceholder || composerDraft) && (
        <div
          className={cn(
            "mx-auto flex shrink-0 items-center border border-white/60 bg-black/88",
            compact
              ? "mb-[5px] h-[16px] w-[calc(100%-10px)] gap-[3px] rounded-[5px] px-[5px]"
              : "mb-3 h-[42px] w-[calc(100%-24px)] gap-2 rounded-xl px-3.5"
          )}
        >
          <span
            className={cn(
              "flex-1 truncate tracking-[-0.01em]",
              composerDraft ? "text-white" : "text-[#616161]",
              compact ? "text-[6px]" : "text-[15px] font-medium"
            )}
          >
            {composerDraft ?? composerPlaceholder}
            {composerDraft && (
              <span className="animate-pulse bg-white/20">&nbsp;</span>
            )}
          </span>
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-lg bg-[#E18CF2]",
              compact ? "size-[13px] rounded-[3px]" : "size-8.5"
            )}
          >
            <ArrowUp
              className={cn("text-black", compact ? "size-[8px]" : "size-4")}
            />
          </span>
        </div>
      )}
    </div>
  )
}
