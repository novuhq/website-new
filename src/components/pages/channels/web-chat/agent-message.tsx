"use client"

import { Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

export interface AgentMessageProps {
  role: "user" | "agent"
  text: string
  compact?: boolean
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
export function AgentMessage({ role, text, compact }: AgentMessageProps) {
  if (role === "user") {
    return (
      <div className="flex animate-wc-message-enter justify-end">
        <p
          className={cn(
            "max-w-[85%] rounded-tl-[14px] rounded-tr-[14px] rounded-br-[4px] rounded-bl-[14px] border border-white/20 py-2 pr-5 pl-3 text-[15px] leading-[1.2] tracking-[-0.01em] shadow-[0_6px_14px_rgba(0,0,0,0.1)]",
            compact &&
              "rounded-tl-[6.5px] rounded-tr-[6.5px] rounded-br-[2px] rounded-bl-[6.5px] py-1 pr-2.5 pl-1.5 text-[7px] shadow-[0_3px_7px_rgba(0,0,0,0.1)]"
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
        "flex max-w-[85%] animate-wc-message-enter flex-col gap-2",
        compact && "gap-1"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1.5 text-[13px] leading-none tracking-[-0.01em] text-white/50",
          compact && "gap-0.5 text-[6px]"
        )}
      >
        <Sparkles className={cn("size-3.5 shrink-0", compact && "size-1.5")} />
        <span>Agent</span>
      </div>
      <p
        className={cn(
          "text-[15px] leading-[1.2] tracking-[-0.01em] text-white",
          compact && "text-[7px]"
        )}
      >
        {text}
      </p>
    </div>
  )
}

/**
 * The step-2-only "agent is thinking" state (brief Behaviour: shown at step
 * 2, gone once step 3 lands). No literal copy for this exists in either the
 * brief's content block or a Figma text node for it was found, so it's built
 * from pieces that do trace: the same icon+"Agent" label used on every agent
 * reply, plus a row of plain dots (a standard typing-indicator convention,
 * not invented prose). The phrase "Agent is thinking" is used only as an
 * `aria-live` label for assistive tech, never rendered visibly.
 */
export function AgentThinking({ compact }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex animate-wc-message-enter items-center gap-1.5",
        compact && "gap-0.5"
      )}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Agent is thinking</span>
      <Sparkles
        className={cn("size-3.5 shrink-0 text-white/50", compact && "size-1.5")}
        aria-hidden
      />
      <span
        className={cn(
          "text-[13px] leading-none tracking-[-0.01em] text-white/50",
          compact && "text-[6px]"
        )}
        aria-hidden
      >
        Agent
      </span>
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
