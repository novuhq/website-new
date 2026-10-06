"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { NovuProvider, useAgentChat } from "@novu/react"
import type { DynamicToolUIPart } from "ai"
import { ExternalLink } from "lucide-react"

import { cn } from "@/lib/utils"
import type { WebChatSession } from "@/lib/web-chat-session"
import { Button } from "@/components/ui/button"
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
import {
  LiveComposer,
  type ComposerState,
} from "@/components/pages/channels/web-chat/live-composer"

const AGENT_ID = "webchat"
const VISITOR_SUBSCRIBER_ID =
  /^web-chat-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

export type LiveAgentRenderer = (
  compact: boolean,
  emptyState: ReactNode
) => ReactNode
type LiveAgentChatProps = {
  children: (render: LiveAgentRenderer) => ReactNode
  /** Shared with the idle panel's message box. */
  composer: ComposerState
  /** The session request finished, connected or not. */
  onSettled?: () => void
}

// The live chat only mounts before any brand is submitted (the storyboard
// takes over after that), so it always uses the default theme.
function ConnectedAgentChat({
  children,
  composer: {
    draft,
    setDraft,
    focused,
    setFocused,
    pendingSend,
    setPendingSend,
  },
}: {
  children: LiveAgentChatProps["children"]
  composer: ComposerState
}) {
  const {
    messages,
    pendingActions,
    sendMessage,
    respondToAction,
    isRunning,
    isLoading,
    error,
  } = useAgentChat({ agentId: AGENT_ID })
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

  // A message sent while the chat was still loading or connecting goes out
  // as soon as it is ready. `runRequest` ignores a duplicate call.
  useEffect(() => {
    if (!pendingSend || busy) return
    setPendingSend(false)
    submit()
  })

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
              <p
                role="status"
                className="text-xs text-white/60 motion-safe:animate-pulse"
              >
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
        value={draft}
        onChange={setDraft}
        onSubmit={submit}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        canSend={!busy}
        autoFocus={focused}
      />
    </>
  ))
}

export default function LiveAgentChat({
  children,
  composer,
  onSettled,
}: LiveAgentChatProps) {
  const [session, setSession] = useState<WebChatSession | null>(null)
  const [initializing, setInitializing] = useState(true)
  const { draft, setDraft, focused, setFocused, setPendingSend } = composer
  const settled = useRef(onSettled)
  settled.current = onSettled

  useEffect(() => {
    const controller = new AbortController()
    void fetch("/api/web-chat/session", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return
        const value: unknown = await response.json()
        if (
          typeof value === "object" &&
          value !== null &&
          "applicationIdentifier" in value &&
          typeof value.applicationIdentifier === "string" &&
          value.applicationIdentifier &&
          "subscriberId" in value &&
          typeof value.subscriberId === "string" &&
          VISITOR_SUBSCRIBER_ID.test(value.subscriberId) &&
          "subscriberHash" in value &&
          typeof value.subscriberHash === "string" &&
          /^[0-9a-f]{64}$/.test(value.subscriberHash) &&
          !controller.signal.aborted
        ) {
          setSession({
            applicationIdentifier: value.applicationIdentifier,
            subscriberId: value.subscriberId,
            subscriberHash: value.subscriberHash,
          })
        }
      })
      .catch(() => {
        // Keep the website-personalization preview available if chat is offline.
      })
      .finally(() => {
        if (controller.signal.aborted) return
        setInitializing(false)
        settled.current?.()
      })

    return () => controller.abort()
  }, [])

  if (!session) {
    const reason = initializing
      ? "Connecting to live chat…"
      : "Live chat is unavailable. Try the website preview."
    return children((compact, emptyState) => (
      <>
        {emptyState}
        <p role="status" className="sr-only">
          {reason}
        </p>
        <LiveComposer
          compact={compact}
          value={draft}
          onChange={setDraft}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmit={() => {
            if (initializing && draft.trim()) setPendingSend(true)
          }}
          readOnly={!initializing}
          canSend={false}
          status={reason}
          autoFocus={focused}
        />
      </>
    ))
  }

  return (
    <NovuProvider {...session}>
      <ConnectedAgentChat composer={composer}>{children}</ConnectedAgentChat>
    </NovuProvider>
  )
}
