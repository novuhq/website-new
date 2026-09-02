"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

const EASE = [0.32, 0.72, 0, 1] as const

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-12% 0px" })
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

function WindowBar({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-gray-20 bg-white/[0.02] px-3.5 py-2.5">
      <span className="size-2.5 rounded-full bg-gray-20" />
      <span className="size-2.5 rounded-full bg-gray-20" />
      <span className="size-2.5 rounded-full bg-gray-20" />
      <span className="ml-2 font-mono text-xs tracking-tighter text-gray-60">
        {label}
      </span>
    </div>
  )
}

/* Step 1: the workflow editor with the "Send & reply via agent" toggle */
function EditorMock() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-20 bg-[#08080f]">
      <WindowBar label="workflow / order-shipped" />
      <div className="p-4">
        <div className="flex items-center gap-2 font-mono text-xs tracking-tighter text-gray-60">
          <span className="grid size-5 place-items-center rounded-md bg-purple-3/20 text-purple-1">
            @
          </span>
          Email step · &ldquo;Order shipped&rdquo;
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-purple-3/50 bg-purple-3/15 p-3.5">
          <div>
            <div className="text-sm font-medium text-white">
              Send &amp; reply via agent
            </div>
            <div className="mt-0.5 text-xs tracking-tighter text-gray-60">
              Replies become an agent conversation
            </div>
          </div>
          <span
            className="relative h-6 w-10 shrink-0 rounded-full bg-purple-1"
            role="img"
            aria-label="toggle on"
          >
            <span className="absolute top-[3px] right-[3px] size-[18px] rounded-full bg-[#08080f]" />
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2.5 font-mono text-[13px] tracking-tighter">
          <span className="text-gray-60">Agent</span>
          <span className="flex flex-1 items-center justify-between rounded-lg border border-gray-20 bg-black/40 px-3 py-2.5">
            <span className="flex items-center gap-2 text-gray-80">
              <span className="grid size-5 place-items-center rounded-full bg-purple-1 text-[11px] font-bold text-black">
                A
              </span>
              Ada · support
            </span>
            <span className="text-gray-60">▾</span>
          </span>
        </div>
      </div>
    </div>
  )
}

/* Step 2: the reply, in the channel the user is already on */
function ChatMock() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-20 bg-[#050507]">
      <WindowBar label="conversation" />
      <div className="flex flex-col gap-2.5 p-4">
        <span className="self-center rounded-full border border-gray-20 bg-[#0c0c14] px-2.5 py-1 font-mono text-[11px] tracking-tighter text-gray-60">
          WhatsApp · via agent
        </span>
        <div className="max-w-[85%] self-start rounded-2xl rounded-bl-md border border-gray-20 bg-[#0c0c14] px-3.5 py-2.5">
          <div className="mb-1 font-mono text-[10px] tracking-tighter text-gray-60">
            order-shipped
          </div>
          <p className="text-sm leading-snug text-gray-80">
            Your order shipped. Tracking #TN4471, arriving Thursday.
          </p>
        </div>
        <div className="max-w-[85%] self-end rounded-2xl rounded-br-md border border-gray-20 bg-[#15151d] px-3.5 py-2.5">
          <p className="text-sm leading-snug text-white">
            can I change the delivery address?
          </p>
        </div>
        <div className="max-w-[85%] self-start rounded-2xl rounded-bl-md border border-purple-3/40 bg-purple-3/[0.18] px-3.5 py-2.5">
          <div className="mb-1 font-mono text-[10px] tracking-tighter text-purple-1">
            Ada · support
          </div>
          <p className="text-sm leading-snug text-white">
            Sure. Order #4471 is still in transit to 12 Oak St. What&rsquo;s the
            new address?
          </p>
        </div>
      </div>
    </div>
  )
}

/* Step 3: the agent already has the notification in context */
function CodeMock() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-20 bg-[#050507]">
      <WindowBar label="agent.ts" />
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-[1.75]">
        <code>
          <span className="text-gray-60">
            {"// the reply arrives with the notification already loaded"}
          </span>
          {"\n"}
          {"ctx."}
          <span className="text-purple-1">notification</span>
          {"\n"}
          <span className="text-gray-60">
            {"// { id, workflowId, messageId, platformMessageId,"}
          </span>
          {"\n"}
          <span className="text-gray-60">
            {"//   sentAt, body, payload } | null"}
          </span>
          {"\n\n"}
          <span className="text-gray-60">
            {"// payload typed straight from your workflow schema"}
          </span>
          {"\n"}
          {"ctx.notification.payload."}
          <span className="text-purple-1">trackingNumber</span>
          {"\n\n"}
          <span className="text-gray-60">
            {"// route one run elsewhere, or send with no agent"}
          </span>
          {"\n"}
          <span className="text-purple-1">trigger</span>
          {'("order-shipped", { '}
          <span className="text-purple-1">agentId</span>
          {': "other-agent" })'}
        </code>
      </pre>
      <div className="border-t border-gray-20 px-4 py-3 font-mono text-xs tracking-tighter text-gray-60">
        payload already in context.{" "}
        <span className="text-purple-1">zero re-fetches.</span>
      </div>
    </div>
  )
}

function TypingBubble() {
  return (
    <div
      className="flex items-center gap-1.5 self-start rounded-2xl rounded-bl-md border border-purple-3/40 bg-purple-3/[0.18] px-4 py-3.5"
      aria-label="agent is replying"
    >
      <span className="size-1.5 animate-pulse rounded-full bg-purple-1 motion-reduce:animate-none" />
      <span className="size-1.5 animate-pulse rounded-full bg-purple-1 [animation-delay:0.15s] motion-reduce:animate-none" />
      <span className="size-1.5 animate-pulse rounded-full bg-purple-1 [animation-delay:0.3s] motion-reduce:animate-none" />
    </div>
  )
}

/* Step 4: the conversation keeps going, the agent keeps replying.
   The typing indicator resolves into a live second reply. */
function OngoingMock() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-15% 0px" })
  const reduce = useReducedMotion()
  const [replied, setReplied] = useState(false)

  useEffect(() => {
    if (reduce) {
      setReplied(true)
      return
    }
    if (!inView) return
    const timer = setTimeout(() => setReplied(true), 1600)
    return () => clearTimeout(timer)
  }, [inView, reduce])

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-xl border border-gray-20 bg-[#050507]"
    >
      <WindowBar label="conversation · live" />
      <div className="flex flex-col gap-2.5 p-4">
        <span className="self-center rounded-full border border-gray-20 bg-[#0c0c14] px-2.5 py-1 font-mono text-[11px] tracking-tighter text-gray-60">
          WhatsApp · via agent
        </span>
        <div className="max-w-[85%] self-end rounded-2xl rounded-br-md border border-gray-20 bg-[#15151d] px-3.5 py-2.5">
          <p className="text-sm leading-snug text-white">
            actually, send it to my office instead
          </p>
        </div>
        <div className="max-w-[85%] self-start rounded-2xl rounded-bl-md border border-purple-3/40 bg-purple-3/[0.18] px-3.5 py-2.5">
          <div className="mb-1 font-mono text-[10px] tracking-tighter text-purple-1">
            Ada · support
          </div>
          <p className="text-sm leading-snug text-white">
            Done. It&rsquo;ll arrive at 4 Byron St on Thursday. Want a heads-up
            when it ships?
          </p>
        </div>
        <div className="max-w-[85%] self-end rounded-2xl rounded-br-md border border-gray-20 bg-[#15151d] px-3.5 py-2.5">
          <p className="text-sm leading-snug text-white">yes please</p>
        </div>

        {replied ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="max-w-[85%] self-start rounded-2xl rounded-bl-md border border-purple-3/40 bg-purple-3/[0.18] px-3.5 py-2.5"
          >
            <div className="mb-1 font-mono text-[10px] tracking-tighter text-purple-1">
              Ada · support
            </div>
            <p className="text-sm leading-snug text-white">
              Perfect. I&rsquo;ll text you the moment it&rsquo;s out for
              delivery.
            </p>
          </motion.div>
        ) : (
          <TypingBubble />
        )}
      </div>
    </div>
  )
}

const STEPS = [
  {
    idx: "01",
    title: "Assign an agent to the workflow",
    body: (
      <>
        In the workflow editor, flip{" "}
        <span className="font-mono text-[0.95em] text-white">
          Send &amp; reply via agent
        </span>{" "}
        and pick the agent. Its messages now go out on the agent&rsquo;s own
        connected channels, and replies route straight back to it.
      </>
    ),
    mock: <EditorMock />,
  },
  {
    idx: "02",
    title: "The user just replies",
    body: (
      <>
        On the channel they are already on: Slack, WhatsApp, iMessage, Telegram,
        Microsoft Teams, or email. Novu matches the reply back by reply-to
        token, thread, or quoted message. No app, no portal, no
        &ldquo;click here to respond&rdquo;.
      </>
    ),
    mock: <ChatMock />,
  },
  {
    idx: "03",
    title: "Your agent already has the context",
    body: (
      <>
        The conversation is hydrated once with the original notification. Custom
        Code agents read a typed{" "}
        <span className="font-mono text-[0.95em] text-white">
          ctx.notification
        </span>
        . Managed Agents get the same context injected for them. No re-fetch, no
        &ldquo;please provide your order number&rdquo;.
      </>
    ),
    mock: <CodeMock />,
  },
  {
    idx: "04",
    title: "And the conversation keeps going",
    body: (
      <>
        The reply is not a one-off. The user keeps talking, the agent keeps
        answering on the same thread, with the whole history in hand. It stays a
        live conversation for as long as they need, not a ticket that closes.
      </>
    ),
    mock: <OngoingMock />,
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="mt-24 scroll-mt-24 md:mt-32">
      <div className="container mx-auto max-w-288 px-5 md:px-8">
        <Reveal className="max-w-2xl">
          <span className="rounded-full border border-purple-3/40 bg-purple-3/30 px-2.5 py-1.25 text-sm leading-none tracking-tighter text-purple-1">
            How it works
          </span>
          <h2 className="mt-3.5 text-[2rem] leading-[1.1] font-normal tracking-[-0.04em] text-balance text-white md:text-5xl">
            One toggle on the workflow. The reply does the rest.
          </h2>
          <p className="mt-4 text-base leading-normal tracking-tighter text-gray-70 md:text-lg">
            You do not wire up an inbound webhook, a reply parser, or a context
            store. Novu correlates the reply, loads the original payload once,
            and hands it to your agent.
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col gap-14 md:gap-20">
          {STEPS.map((step, i) => (
            <Reveal key={step.idx}>
              <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                  <div className="font-mono text-sm tracking-[0.16em] text-purple-1">
                    STEP {step.idx}
                  </div>
                  <h3 className="mt-3 text-2xl leading-tight font-normal tracking-[-0.03em] text-balance text-white md:text-[1.75rem]">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-md text-base leading-normal tracking-tighter text-gray-70">
                    {step.body}
                  </p>
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : undefined}>
                  {step.mock}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
