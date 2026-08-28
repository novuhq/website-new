import { cn } from "@/lib/utils"
import {
  AgentChatProvider,
  AgentChatWidget,
} from "@/components/pages/channels/agent-chat-showcase"

const KNOWLEDGE = [
  { label: "docs & wikis", dot: "#a855f7" },
  { label: "chat threads", dot: "#f59e0b" },
  { label: "data warehouse", dot: "#22c55e" },
  { label: "tickets & crm", dot: "#3b82f6" },
]

/**
 * The second install pattern: the agent as the main surface, centered, like a
 * ChatGPT-style app. Same live agent, no docked-widget framing.
 */
export default function AgentCenterSurface({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-gray-20 bg-[#05050b] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)]",
        className
      )}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-gray-20 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-gray-30" />
          <span className="size-2.5 rounded-full bg-gray-30" />
          <span className="size-2.5 rounded-full bg-gray-30" />
        </div>
        <div className="mx-auto flex items-center gap-2 rounded-md border border-gray-20 bg-black px-3 py-1 font-mono text-[0.7rem] text-gray-60">
          knowledge.yourproduct.com
        </div>
        <span className="font-mono text-[0.68rem] text-gray-60">self-hosted</span>
      </div>

      {/* Body: a knowledge rail + the centered agent surface */}
      <div className="flex h-[30rem] md:h-[34rem]">
        <div className="hidden w-52 flex-col gap-3 border-r border-gray-20 p-5 lg:flex">
          <span className="font-mono text-[0.62rem] tracking-[0.12em] text-gray-60 uppercase">
            knowledge
          </span>
          <ul className="mt-1 flex flex-col gap-3">
            {KNOWLEDGE.map((k) => (
              <li
                key={k.label}
                className="flex items-center gap-2.5 font-mono text-xs text-gray-70"
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: k.dot }}
                />
                {k.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1">
          <AgentChatProvider className="h-full">
            <AgentChatWidget
              variant="center"
              emptyTitle="Ask anything your product knows"
              emptyDescription="One agent, front and center. This one is live, ask it anything about Novu Connect."
              starters={[
                "What is Novu Connect?",
                "Which channels can my agent reach?",
                "How do I add this to my app?",
              ]}
            />
          </AgentChatProvider>
        </div>
      </div>
    </div>
  )
}
