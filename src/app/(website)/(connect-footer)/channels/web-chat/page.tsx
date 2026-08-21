import type { Metadata } from "next"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import { getMetadata } from "@/lib/get-metadata"
import { Button } from "@/components/ui/button"
import ChannelIcon from "@/components/pages/home/features/channel-icon"
import Cta from "@/components/pages/home/cta"
import AgentChatShowcase from "@/components/pages/channels/agent-chat-showcase"
import { Reveal } from "@/components/pages/channels/web-chat-reveal"
import { TaglineReveal } from "@/components/pages/channels/web-chat-tagline"
import ChatThemeShowcase from "@/components/pages/channels/chat-theme-showcase"
import CopyPromptButton from "@/components/pages/home/copy-prompt-button"

export const metadata: Metadata = getMetadata({
  title: "Web Chat for AI Agents: Put Your Agent on Your Own Site | Novu",
  description:
    "Add your AI agent to your own website with Novu Web Chat, the embeddable widget that runs on the same rails as Slack, Microsoft Teams, iMessage, WhatsApp, Telegram, and email. One agent, one conversation, live in about two minutes.",
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

const WHY = [
  {
    label: "Yours",
    title: "The channel you own",
    body: "Every other channel is a place your users already are. Web Chat is the surface you control: your dashboard, your docs, your onboarding, your checkout.",
  },
  {
    label: "Fast",
    title: "The fastest to go live",
    body: "No third-party OAuth, no business verification, no app review. Drop in the widget and your agent is answering. About two minutes.",
  },
  {
    label: "One thread",
    title: "Never another silo",
    body: "The same agent and the same conversation as every channel. A user starts on your site and picks it back up on WhatsApp or email.",
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

const IMPLEMENT_PROMPT = `Add Novu Agent Chat to my app so end users can chat with my agent in-product.

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
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="flex flex-col items-start">
              <span className="rounded-full border border-purple-3/40 bg-purple-3/30 px-2.5 py-1.25 text-sm leading-none font-normal tracking-tighter text-purple-1">
                New channel
              </span>
              <h1 className="mt-3.5 max-w-full text-[2.25rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-white md:text-5xl">
                Shoot your agent to the web.
              </h1>
              <p className="mt-4 max-w-md text-base leading-normal font-normal tracking-tighter text-gray-70 md:text-xl md:leading-normal">
                One command puts your agent on your own site, live, as a chat
                widget. Same agent, same conversation as Slack, Microsoft Teams,
                iMessage, WhatsApp, Telegram, and email. No third-party setup.
                About two minutes.
              </p>
              <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
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

            <AgentChatShowcase />
          </div>
        </div>
      </section>

      {/* Why Web Chat */}
      <section className="mt-24 md:mt-32">
        <div className="container mx-auto max-w-288 px-5 md:px-8">
          <Reveal>
            <span className="font-mono text-xs tracking-[0.16em] text-gray-60 uppercase">
              Why Web Chat
            </span>
            <h2 className="mt-3 max-w-2xl text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-white md:text-[2rem]">
              A chat widget is an island. Your agent should not be.
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {WHY.map((card, i) => (
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

      {/* Channels */}
      <section className="mt-24 md:mt-32">
        <div className="container mx-auto max-w-288 px-5 md:px-8">
          <Reveal>
            <span className="font-mono text-xs tracking-[0.16em] text-gray-60 uppercase">
              One connection, every channel
            </span>
            <h2 className="mt-3 max-w-2xl text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-white md:text-[2rem]">
              The same agent, everywhere your users answer.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-normal tracking-tighter text-pretty text-gray-70">
              Web Chat runs on the same rails as every channel, through Novu
              Connect, our ACI, Agent Communication Infrastructure. Connect a new
              channel and your agent code does not change.
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
            A user opens the widget on your dashboard, asks a question, and closes
            the tab. An hour later your agent follows up by email, in the same
            thread, with full context. No stitching, no "as I mentioned earlier."
          </p>
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
              Adjust it to your site. Customize every pixel.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-normal tracking-tighter text-pretty text-gray-70">
              Web Chat is a React hook, not a locked-in black box. The live chat
              at the top of this page is built with AI Elements and styled to
              match this very site. Bring your own design system, drop in a
              component kit, or change as much as you want. Use AI Elements, or
              any similar React components you like. You own the whole surface.
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
              Web Chat is React and a hook, so it runs in whatever you build with.
              Paste the prompt into Lovable, Base44, Bolt, or any coding agent, or
              drop it into Next.js, Vite, or Remix by hand. Your agent goes live on
              your site, no matter where you build.
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
                  One prompt takes your agent to your website.
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
            Your agent stays yours: your code, your model, your tools. Novu
            carries the conversation across every channel. It never runs your
            agent's logic.
          </p>
        </div>
      </section>

      <Cta
        title="Put your agent on your own site"
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
