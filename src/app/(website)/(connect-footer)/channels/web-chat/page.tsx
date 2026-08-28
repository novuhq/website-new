import type { Metadata } from "next"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import { getMetadata } from "@/lib/get-metadata"
import { Button } from "@/components/ui/button"
import ChannelIcon from "@/components/pages/home/features/channel-icon"
import Cta from "@/components/pages/home/cta"
import AgentInProduct from "@/components/pages/channels/agent-in-product"
import AgentCenterSurface from "@/components/pages/channels/agent-center-surface"
import AciPackage from "@/components/pages/channels/aci-package"
import { Reveal } from "@/components/pages/channels/web-chat-reveal"
import { TaglineReveal } from "@/components/pages/channels/web-chat-tagline"
import ChatThemeShowcase from "@/components/pages/channels/chat-theme-showcase"
import CopyPromptButton from "@/components/pages/home/copy-prompt-button"

export const metadata: Metadata = getMetadata({
  title: "Web Chat: Put Your AI Agent Inside Your Product | Novu",
  description:
    "Web Chat is your real AI agent, embedded in your product. It works in your app's context, takes actions through your frontend, and renders your own components in the conversation. Same agent on Slack, Microsoft Teams, iMessage, WhatsApp, Telegram, and email, on Novu's production ACI.",
  pathname: "/channels/web-chat",
})

const CHANNELS: Array<{ key: string; name: string; isNew?: boolean }> = [
  { key: "chat", name: "Web Chat", isNew: true },
  { key: "slack", name: "Slack" },
  { key: "teams", name: "Microsoft Teams" },
  { key: "imessage", name: "iMessage" },
  { key: "whatsapp", name: "WhatsApp" },
  { key: "telegram", name: "Telegram" },
  { key: "email", name: "Email" },
]

// Pillar 1: it lives in your product. State, actions, your own UI.
const IN_PRODUCT = [
  {
    label: "Context",
    title: "Works in your app's context",
    body: "It knows who the user is and what they are doing right now, so it answers and acts in context instead of making them start over.",
  },
  {
    label: "Actions",
    title: "Takes real actions",
    body: "Through your frontend and your tools, with approval gates you control. It books the call, updates the record, files the ticket, and resolves the request in the thread.",
  },
  {
    label: "Your UI",
    title: "Renders your components",
    body: "Replies are real interface, not walls of text. Built from your own components with AI Elements or your design system, with tool calls and approvals rendered inline.",
  },
]

const BUILDERS = [
  "Lovable",
  "Base44",
  "Bolt",
  "v0",
  "Replit",
  "Cursor",
  "Windsurf",
  "Claude Code",
  "Next.js",
  "Vite",
  "Remix",
]

const IMPLEMENT_PROMPT = `Add Novu Web Chat to my app so end users can chat with my agent in-product.

Use @novu/react (useAgentChat + NovuProvider) following the docs at https://docs.novu.co/agents/channels/agent-chat. Build a production-quality chat UI with AI Elements (https://elements.ai-sdk.dev): render the message list from message.parts, a composer, reasoning and tool parts, and tool approvals via respondToAction. Match my app's existing styling and design system. Do not dump raw JSON.

Wrap the UI in <NovuProvider> for the signed-in end user: read applicationIdentifier from an environment variable, pass the authenticated user's id as subscriberId from my existing auth, and pass subscriberHash if my app enables Novu subscriber HMAC. Follow my app's framework, routing, styling, and TypeScript conventions, place the chat in a sensible spot, and add no unnecessary wrappers.`

export default function WebChatPage() {
  return (
    <div className="overflow-clip">
      {/* Hero */}
      <section className="relative pt-20 md:pt-24 lg:pt-28">
        {/* Ambient brand glow behind the hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 mx-auto h-125 max-w-4xl bg-[radial-gradient(closest-side,hsl(var(--purple-3)/0.28),transparent_75%)] blur-2xl"
        />
        <div className="container mx-auto max-w-288 px-5 md:px-8">
          <Reveal className="flex flex-col items-center text-center">
            <span className="rounded-full border border-purple-3/40 bg-purple-3/30 px-2.5 py-1.25 text-sm leading-none font-normal tracking-tighter text-purple-1">
              New channel
            </span>
            <h1 className="mt-3.5 max-w-3xl text-[2.25rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-white md:text-5xl">
              Your agent, live inside your product.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-normal font-normal tracking-tighter text-gray-70 md:text-xl md:leading-normal">
              Web Chat is not a chat widget. It is your real AI agent, embedded
              in your app. It works in your product's context, takes actions
              through your frontend, and renders your own components right in the
              conversation. The same agent is on Slack, Microsoft Teams, iMessage,
              WhatsApp, Telegram, and email. Deployed to production in about two
              minutes.
            </p>
            <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Button
                size="none"
                variant="default"
                className="h-11 shrink-0 rounded-md px-5 text-base leading-none font-medium tracking-[-0.025em] normal-case"
                asChild
              >
                <NextLink
                  href={ROUTE.connect}
                  data-click-location="web_chat_hero"
                  data-click-text="add_to_app"
                >
                  Add it to your app
                </NextLink>
              </Button>
              <CopyPromptButton
                className="h-11 shrink-0 rounded-md px-5 text-base leading-none font-medium tracking-[-0.025em] normal-case"
                copiedLabel="Copied"
                label="Copy the prompt"
                size="none"
                value={IMPLEMENT_PROMPT}
                variant="outline"
              />
              <Button
                size="none"
                variant="outline"
                className="h-11 shrink-0 rounded-md px-5 text-base leading-none font-medium tracking-[-0.025em] normal-case"
                asChild
              >
                <NextLink
                  href={ROUTE.bookADemoConnect}
                  data-click-location="web_chat_hero"
                  data-click-text="book_a_demo"
                >
                  Book a Demo
                </NextLink>
              </Button>
            </div>
            <p className="mt-6 font-mono text-sm text-gray-60">
              ~40K GitHub stars · open source · no OAuth to install
            </p>
          </Reveal>

          <Reveal delay={0.12} className="mt-14">
            <p className="mb-4 text-center font-mono text-xs text-gray-60">
              Live and interactive. Paste your site to see the agent in your product.
            </p>
            <AgentInProduct />
          </Reveal>
        </div>
      </section>

      {/* A new era: this is Web Chat */}
      <section className="mt-24 md:mt-32">
        <div className="container mx-auto max-w-288 px-5 md:px-8">
          <Reveal>
            <span className="font-mono text-xs tracking-[0.16em] text-gray-60 uppercase">
              A new era
            </span>
            <h2 className="mt-3 max-w-2xl text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-white md:text-[2rem]">
              You know the old chat widget. This is Web Chat.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-normal tracking-tighter text-pretty text-gray-70">
              The old chat widget answered from a script, then handed you a
              ticket form. Web Chat puts your real AI agent inside your product,
              where it can read the context, take the action, and render the
              result as real UI.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Reveal
              className="rounded-xl border border-gray-20 bg-[#05050b] p-6"
              delay={0.06}
            >
              <span className="font-mono text-xs tracking-[0.14em] text-gray-60 uppercase">
                The old chat widget
              </span>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm text-gray-70">
                <li>Canned replies from a script</li>
                <li>&quot;We&apos;ll get back to you&quot; and a ticket form</li>
                <li>Walls of text, bolted onto one page</li>
                <li>Its own silo, forgets you when you leave</li>
              </ul>
            </Reveal>
            <Reveal
              className="rounded-xl border border-purple-3/50 bg-purple-3/5 p-6"
              delay={0.12}
            >
              <span className="font-mono text-xs tracking-[0.14em] text-purple-1 uppercase">
                Web Chat
              </span>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm text-gray-80">
                <li>Your real agent: your logic, your model</li>
                <li>Acts in your product: books, updates, files, resolves</li>
                <li>Renders your components, right in the thread</li>
                <li>One conversation across every channel</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pillar 1: lives in your product */}
      <section className="mt-24 md:mt-32">
        <div className="container mx-auto max-w-288 px-5 md:px-8">
          <Reveal>
            <span className="font-mono text-xs tracking-[0.16em] text-gray-60 uppercase">
              Lives in your product
            </span>
            <h2 className="mt-3 max-w-2xl text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-white md:text-[2rem]">
              Not a chat box on your site. An agent inside your app.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-normal tracking-tighter text-pretty text-gray-70">
              Web Chat is embedded in your product, so it can do the work in
              place: understand the context, act on it, and answer with real
              interface built from your own components.
            </p>
          </Reveal>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {IN_PRODUCT.map((card, i) => (
              <li key={card.title} className="h-full">
                <Reveal
                  delay={i * 0.08}
                  className="h-full rounded-xl border border-gray-20 bg-[#05050b] p-6 transition-colors duration-500 hover:border-purple-3/40"
                >
                  <span className="font-mono text-xs tracking-[0.14em] text-gray-60 uppercase">
                    {card.label}
                  </span>
                  <h3 className="mt-3 text-lg font-normal tracking-tighter text-white">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-normal text-pretty text-gray-70">
                    {card.body}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Second install pattern: the agent as the main surface */}
      <section className="mt-24 md:mt-32">
        <div className="container mx-auto max-w-288 px-5 md:px-8">
          <Reveal>
            <span className="font-mono text-xs tracking-[0.16em] text-gray-60 uppercase">
              Ship it your way
            </span>
            <h2 className="mt-3 max-w-2xl text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-white md:text-[2rem]">
              Dock it beside your app, or make it the main event.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-normal tracking-tighter text-pretty text-gray-70">
              Same agent, same hook. Put it in a side panel next to your product,
              like the demo up top, or give it the whole screen as the primary
              surface. This one is centered, and it is just as live.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <AgentCenterSurface />
          </Reveal>
        </div>
      </section>

      {/* Pillar 2: same agent, every channel */}
      <section className="mt-24 md:mt-32">
        <div className="container mx-auto max-w-288 px-5 md:px-8">
          <Reveal>
            <span className="font-mono text-xs tracking-[0.16em] text-gray-60 uppercase">
              Same agent, every channel
            </span>
            <h2 className="mt-3 max-w-2xl text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-white md:text-[2rem]">
              The one thing an in-app agent alone can never do.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-normal tracking-tighter text-pretty text-gray-70">
              Web Chat runs on the same rails as every channel, through Novu
              Connect, our ACI, Agent Communication Infrastructure. It is the same
              agent in your product and on Slack, Microsoft Teams, iMessage,
              WhatsApp, Telegram, and email. Connect a new channel and your agent
              code does not change.
            </p>
          </Reveal>
          <Reveal delay={0.06} className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {CHANNELS.map((channel) => (
              <div key={channel.key}>
                <div
                  className={`group flex flex-col items-center gap-3 rounded-xl border bg-[#05050b] px-4 py-6 transition-colors duration-500 ${
                    channel.isNew
                      ? "border-purple-3/50"
                      : "border-gray-20 hover:border-gray-40"
                  }`}
                >
                  <span
                    className={`flex size-12 items-center justify-center rounded-lg border bg-black ${
                      channel.isNew ? "border-purple-3/50" : "border-gray-20"
                    }`}
                  >
                    <ChannelIcon channel={channel.key} isActive={channel.isNew} />
                  </span>
                  <span
                    className={`text-center text-sm leading-tight font-medium tracking-tighter ${
                      channel.isNew ? "text-white" : "text-gray-80"
                    }`}
                  >
                    {channel.name}
                  </span>
                </div>
              </div>
            ))}
          </Reveal>
          <p className="mt-8 max-w-2xl text-base leading-normal tracking-tighter text-pretty text-gray-60">
            A user starts a task with your agent inside your app, then closes the
            tab. An hour later your agent follows up by email, in the same thread,
            with full context. No stitching, no "as I mentioned earlier."
          </p>
        </div>
      </section>

      {/* The ACI package: production infrastructure, not just a connection */}
      <section className="mt-24 md:mt-32">
        <div className="container mx-auto max-w-288 px-5 md:px-8">
          <Reveal>
            <span className="font-mono text-xs tracking-[0.16em] text-gray-60 uppercase">
              The ACI package
            </span>
            <h2 className="mt-3 max-w-2xl text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-white md:text-[2rem]">
              You are not connecting a chat. You are deploying the ACI.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-normal tracking-tighter text-pretty text-gray-70">
              Add the agent and you inherit the whole ACI, Agent Communication
              Infrastructure: identity for every user, one durable thread,
              delivery that lands, and the compliance and scale to run it for
              real. Not a prototype and not a widget. Production ready in under two
              minutes.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <AciPackage />
          </Reveal>
        </div>
      </section>

      {/* Customizable UI */}
      <section className="mt-24 md:mt-32">
        <div className="container mx-auto max-w-288 px-5 md:px-8">
          <Reveal className="rounded-2xl border border-gray-20 bg-[#05050b] p-6 md:p-10">
            <span className="font-mono text-xs tracking-[0.16em] text-gray-60 uppercase">
              Yours to style
            </span>
            <h2 className="mt-3 max-w-2xl text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-white md:text-[2rem]">
              You own the whole surface. Down to the pixel.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-normal tracking-tighter text-pretty text-gray-70">
              Web Chat is a React hook, not a locked-in black box. The live
              agent at the top of this page is built with AI Elements and styled
              to match this very site. Bring your own design system, drop in a
              component kit, or change as much as you want. Use AI Elements, or
              any similar React components you like. You render the conversation,
              so it looks and behaves like part of your product.
            </p>
            <ChatThemeShowcase className="mt-8" />
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-sm">
              <a
                className="inline-flex items-center gap-1 text-purple-1 transition-colors hover:text-white"
                href="https://elements.ai-sdk.dev/"
                rel="noreferrer"
                target="_blank"
              >
                AI Elements <span aria-hidden>↗</span>
              </a>
              <a
                className="inline-flex items-center gap-1 text-purple-1 transition-colors hover:text-white"
                href="https://docs.langchain.com/oss/python/langchain/frontend/integrations/ai-elements"
                rel="noreferrer"
                target="_blank"
              >
                AI Elements with LangChain <span aria-hidden>↗</span>
              </a>
              <span className="text-gray-60">or any similar library</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Ship from any builder + copy prompt */}
      <section className="mt-24 md:mt-32">
        <div className="container mx-auto max-w-288 px-5 md:px-8">
          <Reveal>
            <span className="font-mono text-xs tracking-[0.16em] text-gray-60 uppercase">
              Works anywhere
            </span>
            <h2 className="mt-3 max-w-2xl text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-white md:text-[2rem]">
              It's just a prompt. Ship it from any builder.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-normal tracking-tighter text-pretty text-gray-70">
              Web Chat is React and a hook, so it runs in whatever you build
              with. Paste the prompt into Lovable, Base44, Bolt, or any coding
              agent, or drop it into Next.js, Vite, or Remix by hand. Your agent
              goes live inside your app, no matter where you build.
            </p>
          </Reveal>

          <Reveal className="mt-8 flex flex-wrap gap-2" delay={0.06}>
            {BUILDERS.map((name) => (
              <span
                className="rounded-full border border-gray-20 bg-[#05050b] px-3.5 py-1.5 font-mono text-sm text-gray-80"
                key={name}
              >
                {name}
              </span>
            ))}
            <span className="rounded-full px-3.5 py-1.5 font-mono text-sm text-gray-60">
              or any framework
            </span>
          </Reveal>

          <Reveal
            className="mt-10 rounded-2xl border border-gray-20 bg-[#05050b] p-6 md:p-8"
            delay={0.1}
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <h3 className="text-lg font-normal tracking-tighter text-white">
                  One prompt puts your agent inside your product.
                </h3>
                <p className="mt-2 text-sm leading-normal text-gray-70">
                  Copy it, paste it into the agent you already use, and it builds
                  the full chat with AI Elements, styled to your app.
                </p>
              </div>
              <CopyPromptButton
                className="h-11 shrink-0 rounded-md px-5 text-base leading-none font-medium tracking-[-0.025em] normal-case"
                copiedLabel="Copied"
                label="Copy the prompt"
                size="none"
                value={IMPLEMENT_PROMPT}
                variant="default"
              />
            </div>
            <pre className="mt-5 max-h-44 overflow-auto rounded-lg border border-gray-20 bg-black p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-gray-70">
              {IMPLEMENT_PROMPT}
            </pre>
          </Reveal>
        </div>
      </section>

      {/* Boundary: the design skill's tagline reveal moment */}
      <section className="mt-24 text-center md:mt-40">
        <div className="container mx-auto max-w-2xl px-5 md:px-8">
          <TaglineReveal />
          <p className="mt-4 text-base leading-normal tracking-tighter text-pretty text-gray-60">
            Your agent stays yours: your code, your model, your tools. Novu gives
            it the surface inside your product and carries the conversation across
            every channel. It never runs your agent's logic.
          </p>
        </div>
      </section>

      <Cta
        title="Put your agent inside your product"
        description="Pro tip: paste 'Add an agent to my app https://novu.co/agents.md' into your coding agent, or run npx novu connect. One agent, every channel, one conversation."
        actions={[
          {
            kind: "primary-button",
            label: "Explore Novu Connect",
            href: ROUTE.connect,
            clickLocation: "web_chat_cta",
            clickText: "explore_connect",
          },
          {
            kind: "secondary-button",
            label: "Book a Demo",
            href: ROUTE.bookADemoConnect,
            clickLocation: "web_chat_cta",
            clickText: "book_a_demo",
          },
        ]}
      />
    </div>
  )
}
