"use client"

import { useRef, useState, type ReactNode } from "react"
import { NovuProvider, useAgentChat } from "@novu/react"
import type { DynamicToolUIPart } from "ai"
import { ChevronUp, ExternalLink } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning"
import { Tool, ToolHeader } from "@/components/ai-elements/tool"

// The same integration and showcase subscriber as the original working demo.
const AGENT_ID = "webchat"
const SUBSCRIBER_ID = "69b008bc508e082a4f4f8322"

export type LiveAgentRenderer = (
  compact: boolean,
  emptyState: ReactNode
) => ReactNode
type LiveAgentChatProps = { children: (render: LiveAgentRenderer) => ReactNode }

function LiveComposer({
  compact,
  disabled,
  value,
  onChange,
  onSubmit,
  disabledReason,
}: {
  compact: boolean
  disabled: boolean
  value: string
  onChange?: (value: string) => void
  onSubmit?: () => void
  disabledReason?: string
}) {
  return (
    <form
      className={cn("group/composer shrink-0 p-[11px]", compact && "p-[5.6px]")}
      title={disabledReason}
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.()
      }}
    >
      <div
        className={cn(
          "flex min-h-[42px] items-center gap-1 rounded-xl border border-white/30 bg-black/88 pr-[3px] pl-3.5 focus-within:border-white/70",
          compact && "min-h-[19.6px] rounded-[5.6px] pr-[1.4px] pl-[6.5px]"
        )}
      >
        <Textarea
          aria-label="Message the agent"
          placeholder="Message the agent ..."
          rows={1}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.value)}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
          }}
          className={cn(
            "max-h-28 min-h-0 resize-none rounded-none border-0 bg-transparent p-0 text-[15px] leading-[1.2] font-medium tracking-[-0.01em] text-white shadow-none placeholder:text-white/40 focus-visible:ring-0 disabled:opacity-100 md:text-[15px] dark:bg-transparent",
            compact &&
              "text-[7px] group-focus-within/composer:py-2 group-focus-within/composer:text-base md:text-[7px]"
          )}
        />
        <Button
          type="submit"
          aria-label="Send message"
          variant="none"
          size="icon-sm"
          disabled={disabled || !value.trim()}
          className={cn(
            "size-[34px] shrink-0 rounded-lg bg-purple-2 text-black group-data-[wc-state=personalized]:bg-(--wc-accent) group-data-[wc-state=personalized]:text-(--wc-accent-foreground) disabled:opacity-100",
            compact &&
              "size-[15.85px] rounded-[3.7px] group-focus-within/composer:size-8 [&_svg]:size-2 group-focus-within/composer:[&_svg]:size-4"
          )}
        >
          <ChevronUp className="size-4" aria-hidden />
        </Button>
      </div>
    </form>
  )
}

function ConnectedAgentChat({ children }: LiveAgentChatProps) {
  const {
    messages,
    pendingActions,
    sendMessage,
    respondToAction,
    isRunning,
    isLoading,
    error,
  } = useAgentChat({ agentId: AGENT_ID })
  const [draft, setDraft] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [requestError, setRequestError] = useState<string | null>(null)
  const requestInFlight = useRef(false)
  const busy = isRunning || isLoading || submitting

  async function runRequest(
    request: () => Promise<{ error?: unknown }>,
    onSuccess?: () => void
  ) {
    if (requestInFlight.current) return
    requestInFlight.current = true
    setSubmitting(true)
    setRequestError(null)
    try {
      const result = await request()
      if (result.error)
        setRequestError(
          "The agent couldn’t complete your request. Please try again."
        )
      else onSuccess?.()
    } catch {
      setRequestError(
        "The agent couldn’t complete your request. Please try again."
      )
    } finally {
      requestInFlight.current = false
      setSubmitting(false)
    }
  }

  function submit() {
    const text = draft.trim()
    if (!text || busy) return
    void runRequest(
      () => sendMessage(text),
      () => setDraft("")
    )
  }

  return children((compact, emptyState) => (
    <>
      {messages.length === 0 && !busy ? (
        emptyState
      ) : (
        <Conversation className="min-h-0" aria-label="Agent conversation">
          <ConversationContent
            className={cn("gap-4 p-3", compact && "gap-3 p-2")}
          >
            {messages.map((message) => (
              <Message
                from={message.role}
                key={message.id}
                className="max-w-full"
              >
                <MessageContent
                  className={cn(
                    "min-w-0 text-sm wrap-anywhere group-[.is-user]:bg-white/10 group-[.is-user]:text-white",
                    compact && "text-xs"
                  )}
                >
                  {message.parts.map((part, index) => {
                    if (part.type === "text")
                      return message.role === "user" ? (
                        <span key={index} className="whitespace-pre-wrap">
                          {part.text}
                        </span>
                      ) : (
                        <MessageResponse
                          key={index}
                          isAnimating={part.state === "streaming"}
                        >
                          {part.text}
                        </MessageResponse>
                      )
                    if (part.type === "thinking")
                      return (
                        <Reasoning
                          key={index}
                          isStreaming={part.state === "streaming"}
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      )
                    if (part.type === "tool")
                      return (
                        <Tool key={index}>
                          <ToolHeader
                            type="dynamic-tool"
                            toolName={part.toolName}
                            state={part.state as DynamicToolUIPart["state"]}
                          />
                        </Tool>
                      )
                    if (part.type === "source" && part.url)
                      return (
                        <a
                          key={index}
                          href={part.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-(--wc-accent) hover:underline"
                        >
                          <ExternalLink className="size-3" aria-hidden />
                          {part.title || part.filename || part.url}
                        </a>
                      )
                    if (part.type === "file")
                      return (
                        <span key={index} className="text-xs text-white/60">
                          {part.name || "Attachment"}
                        </span>
                      )
                    return null
                  })}
                </MessageContent>
              </Message>
            ))}
            {pendingActions.map((action) =>
              action.type === "tool-approval" ? (
                <div
                  key={action.id}
                  className="rounded-lg border border-white/20 p-2 text-xs text-white"
                >
                  <p>The agent wants to run {action.toolName}. Approve?</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      disabled={submitting}
                      onClick={() =>
                        void runRequest(() =>
                          respondToAction({
                            actionId: action.id,
                            decision: "approved",
                          })
                        )
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={submitting}
                      onClick={() =>
                        void runRequest(() =>
                          respondToAction({
                            actionId: action.id,
                            decision: "denied",
                          })
                        )
                      }
                    >
                      Deny
                    </Button>
                  </div>
                </div>
              ) : (
                <a
                  key={action.id}
                  href={action.authorizeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-(--wc-accent) underline"
                >
                  Connect {action.displayName}
                </a>
              )
            )}
            {isRunning && (
              <p role="status" className="animate-pulse text-xs text-white/60">
                Thinking…
              </p>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      )}
      {(requestError || error) && (
        <p role="alert" className="px-3 text-xs text-red-1">
          {requestError || "The agent couldn’t connect. Please try again."}
        </p>
      )}
      <LiveComposer
        compact={compact}
        disabled={busy}
        value={draft}
        onChange={setDraft}
        onSubmit={submit}
      />
    </>
  ))
}

export default function LiveAgentChat({ children }: LiveAgentChatProps) {
  const applicationIdentifier = process.env.NEXT_PUBLIC_NOVU_APP_IDENTIFIER
  if (!applicationIdentifier) {
    return children((compact, emptyState) => (
      <>
        {emptyState}
        <p role="status" className="sr-only">
          Live chat is unavailable. Try the website preview.
        </p>
        <LiveComposer
          compact={compact}
          disabled
          value=""
          disabledReason="Live chat is unavailable. Try the website preview."
        />
      </>
    ))
  }
  return (
    <NovuProvider
      applicationIdentifier={applicationIdentifier}
      subscriberId={SUBSCRIBER_ID}
    >
      <ConnectedAgentChat>{children}</ConnectedAgentChat>
    </NovuProvider>
  )
}
