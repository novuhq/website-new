"use client"

import Image from "next/image"
import agentReplyMark from "@/images/pages/channels/web-chat/agent-reply-mark.svg"

import { cn } from "@/lib/utils"

export interface AgentMessageProps {
  role: "user" | "agent"
  text: string
  compact?: boolean
  className?: string
  animate?: boolean
}

/**
 * One chat bubble. User turns fill with the personalized accent and align
 * right; agent replies are plain text under a small "Agent" label and align
 * left — both per the brief's Behaviour section. Every message plays a
 * one-shot blurred-to-sharp entrance via `animate-wc-message-enter`
 * (globals.css), whose keyframe values are lifted from `ENTER_FROM` ->
 * `VISIBLE` in `focus-blur-text-cycle.tsx`, and whose duration reads
 * `--wc-message-reveal-ms` (set by the panel from
 * `STORYBOARD_TIMING.messageRevealMs`). Because it's a CSS `animation`
 * rather than a `transition`, it plays automatically the moment a message
 * mounts — no JS timer or state needed.
 *
 * Figma (desktop): user bubble `45487:90415` (padding `8px 20px 9px 12px`,
 * radius `14.5px 14.5px 3.6px 14.5px`, border `rgba(255,255,255,0.2)`,
 * shadow `0 6px 14px rgba(0,0,0,0.1)`, fill/text = accent/accent-foreground);
 * agent reply label+text `45487:90421`/`45487:90426` ("Agent" label 13px
 * `rgba(255,255,255,0.5)`, reply 15px white). Mobile scaled ~0.4662x
 * (`45487:114507`), matching the mobile "ui" group's measured scale factor.
 */
export function AgentMessage({
  role,
  text,
  compact,
  className,
  animate = true,
}: AgentMessageProps) {
  if (role === "user") {
    return (
      <div
        className={cn(
          "flex justify-end",
          animate && "animate-wc-message-enter",
          className
        )}
      >
        <p
          className={cn(
            "max-w-full rounded-tl-[14.5px] rounded-tr-[14.5px] rounded-br-[3.6px] rounded-bl-[14.5px] border border-white/20 pt-2 pr-5 pb-[9px] pl-3 text-[15px] leading-[1.2] tracking-[-0.01em] shadow-[0_6px_14px_rgba(0,0,0,0.1)]",
            compact &&
              "rounded-tl-[6.76px] rounded-tr-[6.76px] rounded-br-[1.69px] rounded-bl-[6.76px] border-0 pt-[4.2px] pr-[9.79px] pb-[4.66px] pl-[6.06px] text-[7px] leading-[1.2] shadow-[0_3px_7px_rgba(0,0,0,0.1)] ring-[0.466px] ring-white/20 ring-inset"
          )}
          style={{
            backgroundColor: "var(--wc-accent)",
            color: "var(--wc-accent-foreground)",
          }}
        >
          {text}
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex w-[281px] max-w-full flex-col gap-2",
        animate && "animate-wc-message-enter",
        compact && "w-[131px] gap-[3.73px]",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1.5 text-[13px] leading-none tracking-[-0.01em] text-white/50",
          compact && "gap-[2.8px] text-[6.06px] leading-none"
        )}
      >
        <AgentReplyMark compact={compact} />
        <span>Agent</span>
      </div>
      <p
        className={cn(
          "text-[15px] leading-[1.2] tracking-[-0.01em] whitespace-pre-line text-white",
          compact && "text-[7px] leading-[1.2]"
        )}
      >
        {text}
      </p>
    </div>
  )
}

function AgentReplyMark({ compact }: { compact?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative block size-4 shrink-0",
        compact && "size-[7.46px]"
      )}
    >
      <Image
        src={agentReplyMark}
        alt=""
        className="absolute top-[0.24%] left-[4.15%] h-[87.28%] w-[91.67%]"
      />
    </span>
  )
}

/**
 * The step-2-only "agent is thinking" state (brief Behaviour: shown at step
 * 2, gone once step 3 lands). No literal copy for this exists in either the
 * brief's content block or a Figma text node for it — no frame shows a
 * hero-storyboard thinking label at all — so this is dots-only: the
 * agent mark plus three plain dots (a standard typing-indicator
 * convention, not invented prose), with no visible text label. The phrase
 * "Agent is thinking" appears only inside the `sr-only` span below, giving
 * the indicator an accessible name without rendering any copy on screen.
 *
 * Deliberately NOT `role="status" aria-live="polite"` (final-review Fix 5):
 * the hero's storyboard is a decorative, looping marketing animation, and
 * this indicator mounts and unmounts on every lap for as long as the hero
 * is on screen — as a live region it would announce "Agent is thinking" to
 * screen-reader users every few seconds, indefinitely, while the tab is
 * simply open. The `sr-only` label stays so the indicator still has an
 * accessible name for anyone who navigates onto it directly; it just never
 * proactively interrupts.
 */
export function AgentThinking({ compact }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex animate-wc-message-enter items-center gap-1.5",
        compact && "gap-0.5"
      )}
    >
      <span className="sr-only">Agent is thinking</span>
      <AgentReplyMark compact={compact} />
      <span
        className={cn("flex items-center gap-0.5", compact && "gap-px")}
        aria-hidden
      >
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className={cn(
              "size-1 rounded-full bg-white/40",
              compact && "size-0.5"
            )}
          />
        ))}
      </span>
    </div>
  )
}
