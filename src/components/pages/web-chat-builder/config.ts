// Config-driven Web Chat "builder" landing pages. Each entry targets a website
// or AI-app builder (Squarespace, Wix, Webflow, Framer, Bubble, Bolt, Lovable,
// v0, Base44, Replit) with the same intent: add your AI agent to an app built on
// that platform via Novu Web Chat, one script tag, no backend, and the same
// workflow reaching every other channel. Rendered by the shared UseCaseLanding
// component. Copy is grounded in 05-seo/2026-08-22-web-chat-builder-pages-*.md.
//
// Product facts verified 2026-08-22 against the Web Chat page + demo component:
// CLI is `npx novu connect --channel web-chat`; install is one <script> tag; the
// exact embed src is pending the Web Chat launch. Channels: Slack, Microsoft
// Teams, iMessage, WhatsApp, Telegram, Email.

// Self-contained types for the Web Chat builder landing pages. Rendered by the
// local BuilderLanding component (./landing). No dependency on other pages.

export interface ILabeledItem {
  title: string
  description: string
  href?: string
}

export type ISection =
  | {
      type: "features"
      eyebrow?: string
      title: string
      body?: string
      items: ILabeledItem[]
    }
  | {
      type: "split"
      eyebrow?: string
      title: string
      body?: string
      points: string[]
    }
  | {
      type: "badges"
      eyebrow?: string
      title: string
      body: string
      badges: string[]
    }

export interface IBuilderLanding {
  slug: string
  seoTitle: string
  seoDescription: string
  eyebrow: string
  heroTitle: string
  heroDescription: string
  command: string
  sections: ISection[]
  finalCta: { title: string; body: string; primaryCtaLabel: string }
}

const COMMAND = "npx novu connect --channel web-chat"

const CHANNEL_BADGES = [
  "Web Chat",
  "Slack",
  "Microsoft Teams",
  "iMessage",
  "WhatsApp",
  "Telegram",
  "Email",
]

interface BuilderInput {
  slug: string
  name: string
  kind: "site" | "app"
  eyebrow: string
  heroTitle: string
  heroDescription: string
  embedStep: string
  capabilities: ILabeledItem[]
  faq: ILabeledItem[]
  seoTitle: string
  seoDescription: string
  finalCtaTitle: string
  finalCtaBody: string
}

function howToSteps(input: BuilderInput): string[] {
  const connect =
    input.kind === "app"
      ? "Connect your agent: run npx novu connect --channel web-chat, or paste 'Add an agent to my app https://novu.co/agents.md' into your coding agent."
      : "Connect your agent to Novu Web Chat: run npx novu connect --channel web-chat."
  const last =
    input.kind === "app"
      ? "Ship. Your users can talk to your agent in the app."
      : "Publish. Your agent is live in the chat, replying to visitors."
  return [
    connect,
    "Copy your one-line Web Chat embed, a single script tag.",
    input.embedStep,
    last,
  ]
}

function makeBuilder(input: BuilderInput): IBuilderLanding {
  const surface = input.kind === "app" ? "app" : "site"
  return {
    slug: input.slug,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    eyebrow: input.eyebrow,
    heroTitle: input.heroTitle,
    heroDescription: input.heroDescription,
    command: COMMAND,
    sections: [
      {
        type: "features",
        eyebrow: "What you get",
        title: `Your agent, live on your ${input.name} ${surface}`,
        items: input.capabilities,
      },
      {
        type: "split",
        title: input.heroTitle.replace(/^Add /, "How to add ") + " in four steps",
        body: "No webhooks, no OAuth, about two minutes.",
        points: howToSteps(input),
      },
      {
        type: "badges",
        eyebrow: "One workflow, every channel",
        title: "Not a chat bubble. Your agent's own channel.",
        body: `The chat on your ${input.name} ${surface} is one destination in a Novu workflow. The same agent reaches your users on every channel they use, from one workflow, and you never rebuild it per channel. Novu carries the conversation and never runs the brain. That is the whole point.`,
        badges: CHANNEL_BADGES,
      },
      {
        type: "features",
        title: "Frequently asked questions",
        items: input.faq,
      },
    ],
    finalCta: {
      title: input.finalCtaTitle,
      body: input.finalCtaBody,
      primaryCtaLabel: "Start free",
    },
  }
}

const siteCapabilities = (
  name: string,
  embedWhere: string,
  planNote: string
): ILabeledItem[] => [
  {
    title: "One-snippet embed",
    description: `Paste a single script tag into ${embedWhere}.`,
  },
  {
    title: "No backend to host",
    description: "Novu is the delivery layer. There is nothing for you to run.",
  },
  {
    title: "Themeable",
    description: `Style the widget to match your ${name} design.`,
  },
  {
    title: "Two-way",
    description: "Your agent reads what visitors send and replies in the widget.",
  },
  {
    title: "Every channel, one workflow",
    description:
      "The same agent reaches users on Slack, Microsoft Teams, iMessage, WhatsApp, Telegram, and Email.",
  },
  {
    title: "Shareable public link",
    description: `Every agent also gets a public link, so you can share it even without ${planNote}.`,
  },
]

const appCapabilities: ILabeledItem[] = [
  {
    title: "One command",
    description:
      "Connect your agent with the Novu CLI, or paste the agents.md URL into your coding agent.",
  },
  {
    title: "One embed, no backend",
    description:
      "A single script tag drops the chat into your app. Novu is the delivery layer.",
  },
  {
    title: "Bring your own agent",
    description:
      "Your logic, your model. Novu carries the conversation and never runs the brain.",
  },
  {
    title: "Every channel, one workflow",
    description:
      "The same agent reaches users on Slack, Microsoft Teams, iMessage, WhatsApp, Telegram, and Email.",
  },
]

const appFaq = (name: string): ILabeledItem[] => [
  {
    title: `How do I add chat to a ${name} app?`,
    description:
      "Connect your agent with npx novu connect --channel web-chat and drop the one-line embed into your app.",
  },
  {
    title: "Who runs the AI model?",
    description:
      "You do. Novu carries the conversation and never runs the brain.",
  },
  {
    title: "Can users reach the agent on other channels?",
    description:
      "Yes. Slack, Microsoft Teams, iMessage, WhatsApp, Telegram, and email, all from one workflow.",
  },
]

export const BUILDER_LANDINGS: Record<string, IBuilderLanding> = {
  squarespace: makeBuilder({
    slug: "squarespace",
    name: "Squarespace",
    kind: "site",
    eyebrow: "Web Chat for Squarespace",
    heroTitle: "Add an AI agent to your Squarespace site",
    heroDescription:
      "Put the AI agent you built on your Squarespace site with one snippet. It talks with visitors in the widget, and the same workflow reaches them on Slack, Microsoft Teams, iMessage, WhatsApp, Telegram, and Email. Your agent's own channel, not a support bubble.",
    embedStep:
      "In Squarespace, open the page's Code Block, or Settings, Advanced, Code Injection for the whole site, and paste the snippet.",
    capabilities: siteCapabilities(
      "Squarespace",
      "a Squarespace Code Block or site-wide code injection",
      "a paid plan"
    ),
    faq: [
      {
        title: "How do I add an AI chatbot to my Squarespace site?",
        description:
          "Connect your agent to Novu Web Chat, then paste the embed snippet into a Code Block or site-wide code injection. The widget renders and your agent replies in it.",
      },
      {
        title: "Is this live chat with a human?",
        description:
          "No. It is your AI agent's channel. The same workflow can also notify a human on Slack if you want a person in the loop.",
      },
      {
        title: "Can I also reach users on WhatsApp or email?",
        description:
          "Yes. The same Novu workflow reaches Slack, Microsoft Teams, iMessage, WhatsApp, Telegram, and Email.",
      },
      {
        title: "Do I need to host a backend?",
        description:
          "No. Novu is the delivery layer, so there is nothing for you to run.",
      },
    ],
    seoTitle: "Add AI Chat to Your Squarespace Site | Novu Web Chat",
    seoDescription:
      "Embed an AI chat widget on any Squarespace site with one snippet. Your agent replies in the chat, and the same workflow also reaches users on Slack, WhatsApp, and Email.",
    finalCtaTitle: "Give your Squarespace site an AI agent.",
    finalCtaBody:
      "Keep your model, your prompts, and your keys. Novu is the communication layer that puts your agent on your site and reaches your users on every channel.",
  }),

  wix: makeBuilder({
    slug: "wix",
    name: "Wix",
    kind: "site",
    eyebrow: "Web Chat for Wix",
    heroTitle: "Add an AI agent to your Wix site",
    heroDescription:
      "Put the AI agent you built on your Wix site with one snippet. It talks with visitors in the widget, and the same workflow reaches them on Slack, Microsoft Teams, iMessage, WhatsApp, Telegram, and Email. Your agent's own channel, not a support bubble.",
    embedStep:
      "In Wix, go to Settings, Custom Code, add the snippet, and set it to load on all pages.",
    capabilities: siteCapabilities(
      "Wix",
      "Wix custom code so it loads on all pages",
      "Wix Velo or a paid plan"
    ),
    faq: [
      {
        title: "How do I add a chatbot to my Wix site?",
        description:
          "Connect your agent to Novu Web Chat, then add the snippet through Wix custom code so it loads on all pages.",
      },
      {
        title: "Is this live chat with a human?",
        description:
          "No. It is your AI agent's channel, with the option to loop a human in on Slack.",
      },
      {
        title: "Can the same agent reach users on WhatsApp or email?",
        description:
          "Yes, from the same workflow: Slack, Microsoft Teams, iMessage, WhatsApp, Telegram, and Email.",
      },
      {
        title: "Do I need to host a backend?",
        description: "No. Novu is the delivery layer.",
      },
    ],
    seoTitle: "Add AI Chat to Your Wix Site | Novu Web Chat",
    seoDescription:
      "Add an AI chat widget to any Wix site with one snippet. Your agent replies in the chat, and the same workflow also reaches users on Slack, WhatsApp, and Email.",
    finalCtaTitle: "Give your Wix site an AI agent.",
    finalCtaBody:
      "Keep your model, your prompts, and your keys. Novu puts your agent on your Wix site and reaches your users on every channel from one workflow.",
  }),

  webflow: makeBuilder({
    slug: "webflow",
    name: "Webflow",
    kind: "site",
    eyebrow: "Web Chat for Webflow",
    heroTitle: "Add an AI agent to your Webflow site",
    heroDescription:
      "Put the AI agent you built on your Webflow site with one embed. It talks with visitors in the widget, and the same workflow reaches them on Slack, Microsoft Teams, iMessage, WhatsApp, Telegram, and Email. Your agent's own channel, not a generic widget.",
    embedStep:
      "In the Webflow Designer, add an Embed element where you want the widget, or paste it into Project Settings, Custom Code for the whole site.",
    capabilities: siteCapabilities(
      "Webflow",
      "a Webflow Embed element or site-wide custom code",
      "a paid plan"
    ),
    faq: [
      {
        title: "How do I add an AI chatbot to a Webflow site?",
        description:
          "Connect your agent to Novu Web Chat, then paste the embed into a Webflow Embed element or site-wide custom code.",
      },
      {
        title: "Can I style it to match my Webflow design?",
        description: "Yes, the widget is themeable.",
      },
      {
        title: "Is this human live chat?",
        description:
          "No. It is your AI agent's channel, with the option to loop a human in on Slack.",
      },
      {
        title: "Can the same agent reach users on WhatsApp or email?",
        description: "Yes, from the same workflow.",
      },
    ],
    seoTitle: "Add an AI Chatbot to Your Webflow Site | Novu Web Chat",
    seoDescription:
      "Add an AI chatbot to any Webflow site with one embed. Your agent replies in the chat, and the same workflow also reaches users on Slack, WhatsApp, and Email.",
    finalCtaTitle: "Give your Webflow site an AI agent.",
    finalCtaBody:
      "Bring the agent you built. Novu puts it on your Webflow site and reaches your users on every channel from one workflow.",
  }),

  framer: makeBuilder({
    slug: "framer",
    name: "Framer",
    kind: "site",
    eyebrow: "Web Chat for Framer",
    heroTitle: "Add an AI agent to your Framer site",
    heroDescription:
      "One embed puts an AI agent on your Framer site. It talks with visitors in the widget and continues on Slack, WhatsApp, and email, all from one workflow. Themeable to match your Framer design.",
    embedStep:
      "In Framer, add an Embed component where you want the widget, or paste the snippet into site settings custom code.",
    capabilities: siteCapabilities(
      "Framer",
      "a Framer Embed component or site custom code",
      "a paid plan"
    ),
    faq: [
      {
        title: "How do I add a chatbot to a Framer site?",
        description:
          "Connect your agent to Novu Web Chat, then paste the embed into an Embed component or site custom code.",
      },
      {
        title: "Can I style it to match my Framer design?",
        description: "Yes, the widget is themeable.",
      },
      {
        title: "Is this human live chat?",
        description: "No. It is your AI agent's channel.",
      },
      {
        title: "Can the same agent reach users on WhatsApp or email?",
        description: "Yes, from the same workflow.",
      },
    ],
    seoTitle: "Add an AI Chatbot to Your Framer Site | Novu Web Chat",
    seoDescription:
      "Add an AI chatbot to any Framer site with one embed. Your agent replies in the chat, and the same workflow also reaches users on Slack, WhatsApp, and Email.",
    finalCtaTitle: "Give your Framer site an AI agent.",
    finalCtaBody:
      "Bring your agent. Novu puts it on your Framer site and reaches your users on every channel from one workflow.",
  }),

  bubble: makeBuilder({
    slug: "bubble",
    name: "Bubble",
    kind: "app",
    eyebrow: "Web Chat for Bubble",
    heroTitle: "Add an AI agent to your Bubble app",
    heroDescription:
      "Bubble lets you ship a real app. Novu Web Chat gives it an AI agent your users can talk to, with one embed and no backend. The same agent continues the conversation on Slack, WhatsApp, and email.",
    embedStep:
      "In the Bubble editor, add an HTML element where you want the widget, or paste the snippet into the page header.",
    capabilities: appCapabilities,
    faq: [
      {
        title: "How do I add a chatbot to my Bubble app?",
        description:
          "Paste the Novu Web Chat embed into an HTML element or the page header.",
      },
      {
        title: "Do I need a Bubble plugin?",
        description: "No, a single embed is enough.",
      },
      {
        title: "Is this human live chat?",
        description:
          "No, it is your AI agent, with the option to loop a human in on Slack.",
      },
      {
        title: "Can it also reach users on WhatsApp or email?",
        description: "Yes, from the same workflow.",
      },
    ],
    seoTitle: "Add Agent Chat to Your Bubble App | Novu Web Chat",
    seoDescription:
      "Add an AI chat widget to your Bubble app with one embed. Your agent replies in the chat, and the same workflow also reaches users on Slack, WhatsApp, and Email.",
    finalCtaTitle: "Give your Bubble app an AI agent.",
    finalCtaBody:
      "Bring your agent. Novu puts it in your Bubble app and reaches your users on every channel from one workflow.",
  }),

  bolt: makeBuilder({
    slug: "bolt",
    name: "Bolt.new",
    kind: "app",
    eyebrow: "Web Chat for Bolt.new",
    heroTitle: "Add an AI agent to your Bolt.new app",
    heroDescription:
      "You built the app in Bolt. Give it an AI agent your users can talk to. One command, one embed, no backend, and the same agent continues on Slack, WhatsApp, and email.",
    embedStep:
      "Drop the one-line embed into your app where you want the chat to appear.",
    capabilities: appCapabilities,
    faq: appFaq("Bolt.new"),
    seoTitle: "Add Chat to Your Bolt.new App | Novu Web Chat",
    seoDescription:
      "Add an AI agent chat to an app built with Bolt.new. One command, one script tag, no backend. The same agent also reaches users on Slack, WhatsApp, and Email.",
    finalCtaTitle: "Give your Bolt.new app an AI agent.",
    finalCtaBody:
      "Bring your agent. Novu puts it in the app you built and reaches your users on every channel from one workflow.",
  }),

  lovable: makeBuilder({
    slug: "lovable",
    name: "Lovable",
    kind: "app",
    eyebrow: "Web Chat for Lovable",
    heroTitle: "Add an AI agent to your Lovable app",
    heroDescription:
      "Built it in Lovable? Give it an AI agent your users can talk to. One command, one embed, no backend, and the same agent continues on every channel.",
    embedStep:
      "Drop the one-line embed into your app where you want the chat to appear.",
    capabilities: appCapabilities,
    faq: appFaq("Lovable"),
    seoTitle: "Add Chat to Your Lovable App | Novu Web Chat",
    seoDescription:
      "Add an AI agent chat to an app built with Lovable. One command, one script tag, no backend. The same agent also reaches users on Slack, WhatsApp, and Email.",
    finalCtaTitle: "Give your Lovable app an AI agent.",
    finalCtaBody:
      "Bring your agent. Novu puts it in the app you built and reaches your users on every channel from one workflow.",
  }),

  v0: makeBuilder({
    slug: "v0",
    name: "v0",
    kind: "app",
    eyebrow: "Web Chat for v0",
    heroTitle: "Add an AI agent to your v0 app",
    heroDescription:
      "v0 gets you a working app fast. Novu Web Chat gives it an AI agent your users can talk to, in one command and one embed, continuing on every channel.",
    embedStep:
      "v0 gives you React and Next.js code, so drop the one-line embed straight into your layout.",
    capabilities: appCapabilities,
    faq: appFaq("v0"),
    seoTitle: "Add Chat to Your v0 App | Novu Web Chat",
    seoDescription:
      "Add an AI agent chat to an app built with v0. One command, one script tag, no backend. The same agent also reaches users on Slack, WhatsApp, and Email.",
    finalCtaTitle: "Give your v0 app an AI agent.",
    finalCtaBody:
      "Bring your agent. Novu puts it in the app you built and reaches your users on every channel from one workflow.",
  }),

  base44: makeBuilder({
    slug: "base44",
    name: "Base44",
    kind: "app",
    eyebrow: "Web Chat for Base44",
    heroTitle: "Add an AI agent to your Base44 app",
    heroDescription:
      "Shipped an app on Base44? Give it an AI agent your users can talk to, in one command and one embed, continuing on Slack, WhatsApp, and email.",
    embedStep:
      "Drop the one-line embed into your app where you want the chat to appear.",
    capabilities: appCapabilities,
    faq: appFaq("Base44"),
    seoTitle: "Add Chat to Your Base44 App | Novu Web Chat",
    seoDescription:
      "Add an AI agent chat to an app built with Base44. One command, one script tag, no backend. The same agent also reaches users on Slack, WhatsApp, and Email.",
    finalCtaTitle: "Give your Base44 app an AI agent.",
    finalCtaBody:
      "Bring your agent. Novu puts it in the app you built and reaches your users on every channel from one workflow.",
  }),

  replit: makeBuilder({
    slug: "replit",
    name: "Replit",
    kind: "app",
    eyebrow: "Web Chat for Replit",
    heroTitle: "Add an AI agent to your Replit app",
    heroDescription:
      "Built and hosted on Replit? Give your app an AI agent your users can talk to, in one command and one embed, continuing on every channel.",
    embedStep:
      "Drop the one-line embed into your app where you want the chat to appear.",
    capabilities: appCapabilities,
    faq: appFaq("Replit"),
    seoTitle: "Add Chat to Your Replit App | Novu Web Chat",
    seoDescription:
      "Add an AI agent chat to an app built on Replit. One command, one script tag, no backend. The same agent also reaches users on Slack, WhatsApp, and Email.",
    finalCtaTitle: "Give your Replit app an AI agent.",
    finalCtaBody:
      "Bring your agent. Novu puts it in the app you built and reaches your users on every channel from one workflow.",
  }),
}

export function getBuilder(slug: string): IBuilderLanding | undefined {
  return BUILDER_LANDINGS[slug]
}

export function getAllBuilderSlugs(): string[] {
  return Object.keys(BUILDER_LANDINGS)
}

// Platform-link cards for the hub pages.
const PLATFORM_LINKS: ILabeledItem[] = [
  { title: "Squarespace", description: "Add AI chat to a Squarespace site.", href: "/channels/web-chat/squarespace" },
  { title: "Wix", description: "Add AI chat to a Wix site.", href: "/channels/web-chat/wix" },
  { title: "Webflow", description: "Add an AI chatbot to a Webflow site.", href: "/channels/web-chat/webflow" },
  { title: "Framer", description: "Add an AI chatbot to a Framer site.", href: "/channels/web-chat/framer" },
  { title: "Bubble", description: "Add agent chat to a Bubble app.", href: "/channels/web-chat/bubble" },
  { title: "Bolt.new", description: "Add chat to a Bolt.new app.", href: "/channels/web-chat/bolt" },
  { title: "Lovable", description: "Add chat to a Lovable app.", href: "/channels/web-chat/lovable" },
  { title: "v0", description: "Add chat to a v0 app.", href: "/channels/web-chat/v0" },
  { title: "Base44", description: "Add chat to a Base44 app.", href: "/channels/web-chat/base44" },
  { title: "Replit", description: "Add chat to a Replit app.", href: "/channels/web-chat/replit" },
]

export const HUB_LANDINGS: Record<string, IBuilderLanding> = {
  "add-chat-to-website": {
    slug: "add-chat-to-website",
    seoTitle: "How to Add Chat to Your Website (AI Agent, Any Platform) | Novu",
    seoDescription:
      "Add AI chat to any website with one script tag. Your agent replies in the chat, and the same workflow also reaches users on Slack, WhatsApp, and Email. Works on Squarespace, Wix, Webflow, and more.",
    eyebrow: "Novu Web Chat",
    heroTitle: "How to add an AI agent to your website",
    heroDescription:
      "One script tag puts your AI agent on any site. It talks with visitors in the widget, and the same workflow reaches them on every channel they use. Works on any platform that lets you add code: Squarespace, Wix, Webflow, Framer, Bubble, or a hand-built site.",
    command: COMMAND,
    sections: [
      {
        type: "split",
        title: "How to add chat to your website in four steps",
        body: "No webhooks, no OAuth, about two minutes.",
        points: [
          "Connect your agent to Novu Web Chat: run npx novu connect --channel web-chat.",
          "Copy your one-line embed, a single script tag.",
          "Paste it into your site's custom code or an embed block.",
          "Publish. Your agent is live in the chat.",
        ],
      },
      {
        type: "features",
        eyebrow: "Pick your platform",
        title: "Add AI chat to your builder",
        body: "Step-by-step for every website and app builder.",
        items: PLATFORM_LINKS,
      },
      {
        type: "badges",
        eyebrow: "One workflow, every channel",
        title: "Your agent's own channel, everywhere",
        body: "The chat on your site is one destination in a Novu workflow. The same agent reaches your users on every channel they use, from one workflow. Novu carries the conversation and never runs the brain. That is the whole point.",
        badges: CHANNEL_BADGES,
      },
      {
        type: "features",
        title: "Frequently asked questions",
        items: [
          {
            title: "How do I add a chat box to my website?",
            description:
              "Embed one script tag from Novu Web Chat. It renders the widget and your AI agent replies in it.",
          },
          {
            title: "What is the easiest way to add live chat to a website?",
            description:
              "A single embed, no backend to host. On no-code builders you paste it into custom code.",
          },
          {
            title: "Can I add chat without coding?",
            description:
              "Yes. On Squarespace, Wix, Webflow, Framer, and Bubble you paste one snippet into a code block.",
          },
          {
            title: "Does the same agent work on other channels?",
            description:
              "Yes, the same workflow reaches Slack, Microsoft Teams, iMessage, WhatsApp, Telegram, and Email.",
          },
        ],
      },
    ],
    finalCta: {
      title: "Add your agent to your website. Reach users everywhere.",
      body: "One script tag puts your agent on your site. The same workflow reaches your users on every channel they use.",
      primaryCtaLabel: "Start free",
    },
  },

  "ai-chatbot-for-website": {
    slug: "ai-chatbot-for-website",
    seoTitle: "AI Chatbot for Your Website: Bring Your Own Agent | Novu Web Chat",
    seoDescription:
      "Put your own AI agent on your website as a chatbot, with one script tag and no backend. The same agent also reaches users on Slack, WhatsApp, and Email.",
    eyebrow: "Novu Web Chat",
    heroTitle: "An AI chatbot for your website, powered by your own agent",
    heroDescription:
      "Most website chatbots are a vendor's bot. This is yours. Bring the agent you already built, embed one script tag, and it talks with visitors on your site and continues on any channel. Novu never runs the brain. That is the whole point.",
    command: COMMAND,
    sections: [
      {
        type: "features",
        eyebrow: "Bring your own agent",
        title: "Your agent, not a vendor's bot",
        items: [
          {
            title: "Your logic, your model",
            description: "Novu is the delivery layer. It never runs the brain.",
          },
          {
            title: "Any framework",
            description:
              "Works with LangChain, Vercel AI SDK, CrewAI, or custom code.",
          },
          {
            title: "Two-way and multi-channel",
            description: "One workflow reaches every channel your users use.",
          },
          {
            title: "Open source",
            description:
              "On the infrastructure around 40K developers already trust.",
          },
        ],
      },
      {
        type: "split",
        title: "How to add an AI chatbot to your website in four steps",
        body: "No webhooks, no OAuth, about two minutes.",
        points: [
          "Connect your agent to Novu Web Chat: run npx novu connect --channel web-chat.",
          "Copy your one-line embed, a single script tag.",
          "Paste it into your site's custom code or an embed block.",
          "Publish. Your chatbot is live and replying.",
        ],
      },
      {
        type: "features",
        eyebrow: "Pick your platform",
        title: "Add your chatbot to your builder",
        items: PLATFORM_LINKS,
      },
      {
        type: "badges",
        eyebrow: "One workflow, every channel",
        title: "One chatbot, every channel",
        body: "Your chatbot on the web is one destination in a Novu workflow. The same agent reaches your users on Slack, Microsoft Teams, iMessage, WhatsApp, Telegram, and Email, from one workflow.",
        badges: CHANNEL_BADGES,
      },
      {
        type: "features",
        title: "Frequently asked questions",
        items: [
          {
            title: "What is the best AI chatbot for a website?",
            description:
              "If you want your own agent rather than a vendor bot, Novu Web Chat lets you embed the agent you built with one script tag.",
          },
          {
            title: "How do I put an AI chatbot on my website?",
            description:
              "Connect your agent with npx novu connect --channel web-chat, then paste the embed.",
          },
          {
            title: "Who runs the AI model?",
            description:
              "You do. Novu carries the conversation and never runs the brain.",
          },
          {
            title: "Can the chatbot also message users on WhatsApp or email?",
            description: "Yes, from the same workflow.",
          },
        ],
      },
    ],
    finalCta: {
      title: "Put your own agent on your website.",
      body: "Bring your model, your prompts, and your keys. Novu is the communication layer that reaches your users on every channel.",
      primaryCtaLabel: "Start free",
    },
  },
}

export function getHub(slug: string): IBuilderLanding | undefined {
  return HUB_LANDINGS[slug]
}
