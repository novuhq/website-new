import { HOME_CHANNELS, HOME_CLI_SLUGS } from "@/data/pages/home"
import featuresBackground from "@/images/pages/home/features/bg.jpg"
import clientFacingPreview from "@/images/pages/home/features/client-facing.png"

import type { IFeatureChannel } from "@/components/pages/home/features"

// The interactive channel showcase for /solutions/ai-agents, reusing the
// homepage Features component. Scoped to the five approved Connect channels and
// their existing client-facing demo videos. The per-channel copy and the
// fictional company blurbs are agent scenarios (no real customer names).

export const AGENT_FEATURES_TITLE = "See your agent talk on every channel"

export const AGENT_FEATURES_DESCRIPTION =
  "One agent, connected once, holding a real two-way conversation on each channel your users already use. Pick a channel to see it in action."

const CONNECT_KEYS = [
  "slack",
  "teams",
  "whatsapp",
  "telegram",
  "email",
] as const

// Tab label. The narrow tab truncates "Microsoft Teams", so the tab reads
// "Teams" (unambiguous next to the Teams icon, and never the banned "MS Teams").
// The full "Microsoft Teams" still appears in the panel title and body copy.
const LABEL_OVERRIDES: Record<string, string> = {
  teams: "Teams",
}

// How each channel actually connects, shown in the demo panel so a visitor sees
// the mechanism, not just the promise. Novu handles the app, identity, and
// two-way routing; the agent code does not change per channel.
const CONNECT_EXPLANATIONS: Record<string, string> = {
  slack:
    "Novu installs a Slack app in your workspace, maps each Slack user to your agent, and routes every reply back to the same thread. One command wires the app, identity, and delivery.",
  teams:
    "Novu registers a Microsoft Teams app for your org, aware of channels and threads, with a human handoff step built in. Your agent reaches staff and clients where they already work.",
  whatsapp:
    "Novu connects through the WhatsApp Business API with approved message templates and delivery receipts, so a customer can reply and your agent answers in the same chat.",
  telegram:
    "Novu connects through a Telegram bot and routes each reply back to the right conversation, with rich messages and media supported out of the box.",
  email:
    "Novu connects through your email provider and threads replies back to your agent by reply-to. Responsive templates and high-deliverability routing, no inbox to build.",
}

const CLIENT_FACING_VIDEOS: Record<
  string,
  {
    webm: string
    mp4: string
    poster: string
    displaySize?: { width: number; height: number }
  }
> = {
  slack: {
    webm: "/videos/pages/home/features/slack-client-facing.webm",
    mp4: "/videos/pages/home/features/slack-client-facing.mp4",
    poster: "/videos/pages/home/features/slack-client-facing-poster.webp",
    displaySize: { width: 504, height: 348 },
  },
  whatsapp: {
    webm: "/videos/pages/home/features/whatsapp-client-facing.webm",
    mp4: "/videos/pages/home/features/whatsapp-client-facing.mp4",
    poster: "/videos/pages/home/features/whatsapp-client-facing-poster.webp",
    displaySize: { width: 504, height: 348 },
  },
  telegram: {
    webm: "/videos/pages/home/features/telegram-client-facing.webm",
    mp4: "/videos/pages/home/features/telegram-client-facing.mp4",
    poster: "/videos/pages/home/features/telegram-client-facing-poster.webp",
    displaySize: { width: 504, height: 436 },
  },
  email: {
    webm: "/videos/pages/home/features/email-client-facing.webm",
    mp4: "/videos/pages/home/features/email-client-facing.mp4",
    poster: "/videos/pages/home/features/email-client-facing-poster.webp",
    displaySize: { width: 504, height: 414 },
  },
  teams: {
    webm: "/videos/pages/home/features/teams-client-facing.webm",
    mp4: "/videos/pages/home/features/teams-client-facing.mp4",
    poster: "/videos/pages/home/features/teams-client-facing-poster.webp",
    displaySize: { width: 504, height: 332 },
  },
}

// 2-line blurb shown on hover over the company in each demo: a fictional
// company and what its agent does on that channel.
const COMPANY_INFO: Record<
  string,
  { name: string; about: string; useCase: string }
> = {
  slack: {
    name: "Helix",
    about:
      "A data-pipeline platform that keeps its customers' analytics flowing.",
    useCase:
      "Its support agent works in shared Slack Connect channels, diagnosing sync failures and fixing them once the customer approves.",
  },
  whatsapp: {
    name: "Fernweh",
    about: "A direct-to-consumer travel-gear brand.",
    useCase:
      "Its agent handles orders and delivery changes over WhatsApp, so a shopper can reroute a package in a few taps.",
  },
  telegram: {
    name: "Lumen",
    about: "A developer API platform.",
    useCase:
      "Its agent answers usage and billing questions in Telegram, showing real limits and upgrading a plan on request.",
  },
  teams: {
    name: "Vesta",
    about: "An enterprise security and compliance vendor.",
    useCase:
      "Its agent works with client IT admins in Microsoft Teams, provisioning access with the approvals enterprises require.",
  },
  email: {
    name: "Brightledger",
    about: "A billing and finance platform.",
    useCase:
      "Its agent resolves invoice questions over email, explaining charges and issuing credits through secure action links.",
  },
}

export const AGENT_FEATURE_ITEMS: IFeatureChannel[] = CONNECT_KEYS.map(
  (key) => {
    const channel = HOME_CHANNELS.find((item) => item.key === key)

    if (!channel) {
      throw new Error(`Missing HOME_CHANNELS entry for "${key}"`)
    }

    const cliSlug = HOME_CLI_SLUGS[key]

    return {
      key: channel.key,
      label: LABEL_OVERRIDES[key] ?? channel.label,
      title: channel.title,
      description: CONNECT_EXPLANATIONS[key] ?? channel.description,
      badges: channel.badges,
      features: channel.features,
      prompt: channel.prompt,
      availability: "live" as const,
      cliCommand: cliSlug ? `npx novu connect --channel ${cliSlug}` : undefined,
      backgroundImage: featuresBackground,
      clientFacingImage: clientFacingPreview,
      clientFacingVideo: CLIENT_FACING_VIDEOS[key],
      company: COMPANY_INFO[key],
    }
  }
)
