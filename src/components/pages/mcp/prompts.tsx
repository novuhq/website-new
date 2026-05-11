import Image from "next/image"
import promptsEllipses from "@/images/pages/mcp/prompts-ellipses.svg"

import PromptActions from "./prompt-actions"

interface IMcpPromptCard {
  prompt: string
}

const PROMPT_CARDS: IMcpPromptCard[] = [
  {
    prompt:
      "List all failed chat notifications from the last 24 hours and show me the error details.",
  },
  {
    prompt:
      "Create a workflow that sends an order confirmation via email, an SMS with the tracking number, and an in-app notification through Novu Inbox.",
  },
  {
    prompt: "Check if my SendGrid and Twilio integrations are active.",
  },
  {
    prompt:
      "Trigger a workflow that sends an order confirmation via SendGrid email, and sends an SMS with the tracking number, and an in-app notification through Novu Inbox.",
  },
  {
    prompt:
      "Find subscriber user_789, mute their in-app channel, but keep email and push active.",
  },
  {
    prompt:
      "Pull all failed notifications across all channels in the past 24 hours and group them by provider and show me the error details.",
  },
]

function Prompts() {
  return (
    <section className="section-container relative mt-26 md:mt-48 lg:mt-60">
      <Image
        src={promptsEllipses}
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-[1.125rem] left-1/2 h-[25.125rem] w-[92rem] max-w-none -translate-x-1/2 select-none"
      />

      <div className="relative z-10 flex flex-col gap-12 md:gap-15">
        <div className="flex max-w-[51.3125rem] flex-col gap-5">
          <div className="flex items-center gap-2">
            <span className="size-1.5 bg-blue-3" />
            <span className="text-sm leading-none tracking-tight text-blue-1 uppercase">
              Prompts
            </span>
          </div>
          <h2 className="max-w-[50.75rem] text-[1.75rem] leading-dense font-medium tracking-tighter text-balance text-foreground md:text-[2.5rem] lg:text-[2.75rem]">
            Paste any prompt into your MCP client to interact with Novu in
            natural language
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROMPT_CARDS.map((card) => {
            return (
              <article
                key={card.prompt}
                className="relative min-h-[6.375rem] rounded-xl border border-mcp-prompt-card-border bg-mcp-prompt-card px-4 pt-4 pr-20 pb-5"
              >
                <p className="text-base leading-snug font-book tracking-tight text-foreground">
                  &ldquo;{card.prompt}&rdquo;
                </p>

                <PromptActions prompt={card.prompt} />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Prompts
