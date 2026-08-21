"use client"

import { NovuProvider, useAgentChat } from "@novu/react"
import type { ChatStatus, DynamicToolUIPart } from "ai"
import { CheckIcon, ExternalLinkIcon, MessageCircleIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input"
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning"
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion"
import { Tool, ToolHeader } from "@/components/ai-elements/tool"

// The "webchat" Agent Chat integration lives under this Novu environment.
const AGENT_ID = "webchat"

// On a real product this comes from your auth (Clerk, NextAuth, Firebase, etc.).
// This marketing site has no end-user auth, so we use the showcase subscriber.
const SUBSCRIBER_ID = "69b008bc508e082a4f4f8322"

const STARTERS = [
  "What is Novu Connect?",
  "Which channels can my agent reach?",
  "How do I add Web Chat to my site?",
]

function AgentChatWidget() {
  const {
    messages,
    pendingActions,
    sendMessage,
    respondToAction,
    isRunning,
    isLoading,
    error,
  } = useAgentChat({ agentId: AGENT_ID })

  const busy = isRunning || isLoading
  const isEmpty = messages.length === 0 && !isLoading
  const status: ChatStatus = isRunning ? "streaming" : "ready"

  const submit = (text: string) => {
    const value = text.trim()
    if (!value || busy) return
    void sendMessage(value)
  }

  const handleSubmit = (message: PromptInputMessage) => {
    submit(message.text)
  }

  return (
    <div className="flex h-[34rem] flex-col overflow-hidden rounded-xl border border-gray-20 bg-[#05050b] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-gray-20 px-4 py-3">
        <span
          className="flex size-7.5 items-center justify-center rounded-lg font-mono text-sm font-medium text-white"
          style={{
            backgroundImage:
              "linear-gradient(135deg, hsl(var(--purple)), hsl(var(--purple-2)))",
          }}
        >
          N
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[0.9rem] font-medium text-white">
            Novu Agent Chat
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[0.7rem] text-gray-60">
            <span className="size-1.75 animate-pulse rounded-full bg-[#34C759]" />
            live on the web · agent: {AGENT_ID}
          </span>
        </span>
        <span className="ml-auto font-mono text-[0.68rem] text-gray-60">
          powered by Novu
        </span>
      </div>

      {/* Conversation */}
      <Conversation className="flex-1">
        <ConversationContent className="gap-6 p-4">
          {isEmpty && (
            <ConversationEmptyState
              className="h-full"
              title="Talk to a Novu agent"
              description="It's live on this page through Web Chat. Ask anything about Novu Connect."
              icon={<MessageCircleIcon className="size-6" />}
            />
          )}

          {messages.map((message) => {
            const isUser = message.role === "user"
            return (
              <Message from={message.role} key={message.id}>
                <MessageContent className="group-[.is-user]:rounded-lg group-[.is-user]:bg-purple-3 group-[.is-user]:px-4 group-[.is-user]:py-2.5 group-[.is-user]:text-white">
                  {message.parts.map((part, i) => {
                    if (part.type === "text") {
                      return isUser ? (
                        <span className="whitespace-pre-wrap" key={i}>
                          {part.text}
                        </span>
                      ) : (
                        <MessageResponse key={i}>{part.text}</MessageResponse>
                      )
                    }
                    if (part.type === "thinking") {
                      return (
                        <Reasoning
                          isStreaming={part.state === "streaming"}
                          key={i}
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      )
                    }
                    if (part.type === "tool") {
                      return (
                        <Tool key={i}>
                          <ToolHeader
                            state={part.state as DynamicToolUIPart["state"]}
                            toolName={part.toolName}
                            type="dynamic-tool"
                          />
                        </Tool>
                      )
                    }
                    if (part.type === "source" && part.url) {
                      return (
                        <a
                          className="inline-flex items-center gap-1 text-xs text-purple-1 hover:underline"
                          href={part.url}
                          key={i}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <ExternalLinkIcon className="size-3" aria-hidden />
                          {part.title || part.filename || part.url}
                        </a>
                      )
                    }
                    if (part.type === "file") {
                      return (
                        <span
                          className="text-xs text-muted-foreground"
                          key={i}
                        >
                          {part.name || "attachment"}
                        </span>
                      )
                    }
                    return null
                  })}
                </MessageContent>
              </Message>
            )
          })}

          {/* Tool approvals (human-in-the-loop) */}
          {pendingActions.map((action) =>
            action.type === "tool-approval" ? (
              <div
                className="rounded-lg border border-purple-3/40 bg-purple-3/10 p-3"
                key={action.id}
              >
                <p className="text-sm text-gray-90">
                  The agent wants to run{" "}
                  <span className="font-medium text-white">
                    {action.toolName}
                  </span>
                  . Approve?
                </p>
                <div className="mt-2.5 flex gap-2">
                  <Button
                    onClick={() =>
                      void respondToAction({
                        actionId: action.id,
                        decision: "approved",
                      })
                    }
                    size="sm"
                    variant="default"
                  >
                    <CheckIcon className="size-3.5" /> Approve
                  </Button>
                  <Button
                    onClick={() =>
                      void respondToAction({
                        actionId: action.id,
                        decision: "denied",
                      })
                    }
                    size="sm"
                    variant="outline"
                  >
                    <XIcon className="size-3.5" /> Deny
                  </Button>
                </div>
              </div>
            ) : (
              <a
                className="inline-flex w-fit items-center gap-1.5 rounded-md border border-gray-20 px-3 py-1.5 text-xs text-purple-1 hover:border-purple-3/50"
                href={action.authorizeUrl}
                key={action.id}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLinkIcon className="size-3.5" /> Connect{" "}
                {action.displayName}
              </a>
            )
          )}

          {isRunning && (
            <Message from="assistant">
              <MessageContent>
                <span className="animate-pulse text-sm text-muted-foreground">
                  Thinking...
                </span>
              </MessageContent>
            </Message>
          )}

          {error && (
            <p className="text-xs text-red-1">
              {"message" in error ? error.message : "Something went wrong."}
            </p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Starter suggestions (empty state) */}
      {isEmpty && (
        <div className="px-3 pb-1">
          <Suggestions>
            {STARTERS.map((s) => (
              <Suggestion key={s} onClick={submit} suggestion={s} />
            ))}
          </Suggestions>
        </div>
      )}

      {/* Composer */}
      <div className="p-3">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea placeholder="Message the agent..." />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit disabled={busy} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
}

function AgentChatShowcase({ className }: { className?: string }) {
  const applicationIdentifier = process.env.NEXT_PUBLIC_NOVU_APP_IDENTIFIER

  if (!applicationIdentifier) {
    return (
      <div
        className={cn(
          "rounded-xl border border-gray-20 bg-[#05050b] p-6 text-sm text-gray-60",
          className
        )}
      >
        Set NEXT_PUBLIC_NOVU_APP_IDENTIFIER to load the live Agent Chat.
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      {/* If this environment enables subscriber HMAC, pass subscriberHash to
          NovuProvider here, computed server-side, the same way the Inbox is secured. */}
      <NovuProvider
        applicationIdentifier={applicationIdentifier}
        subscriberId={SUBSCRIBER_ID}
      >
        <AgentChatWidget />
      </NovuProvider>
    </div>
  )
}

export default AgentChatShowcase
