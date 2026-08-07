export interface IChannelPreviewVideo {
  webm: string
  mp4: string
  poster: string
  displaySize?: {
    width: number
    height: number
  }
}

export interface IChannelPreviewCompany {
  name: string
  about: string
  useCase: string
}

export const CHANNEL_PREVIEW_VIDEOS: Record<string, IChannelPreviewVideo> = {
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
  imessage: {
    webm: "/videos/pages/home/features/imessage-client-facing.webm",
    mp4: "/videos/pages/home/features/imessage-client-facing.mp4",
    poster: "/videos/pages/home/features/imessage-client-facing-poster.webp",
    displaySize: { width: 504, height: 332 },
  },
  inbox: {
    webm: "/videos/pages/home/features/inbox-client-facing.webm",
    mp4: "/videos/pages/home/features/inbox-client-facing.mp4",
    poster: "/videos/pages/home/features/inbox-client-facing-poster.webp",
    displaySize: { width: 425, height: 373 },
  },
}

export const CHANNEL_PREVIEW_COMPANIES: Record<string, IChannelPreviewCompany> =
  {
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
    imessage: {
      name: "Cedar House",
      about: "A restaurant group.",
      useCase:
        "Its agent manages reservations over iMessage, moving bookings and confirming details in the customer's Messages app.",
    },
    zoom: {
      name: "Loopwork",
      about: "A coaching and enablement platform.",
      useCase:
        "Its agent follows up after sessions in Zoom Team Chat, sharing recaps and booking the next meeting.",
    },
    linear: {
      name: "Tideline",
      about: "A product company.",
      useCase:
        "Its agent turns customer feature requests into triaged Linear issues, setting status and sharing a roadmap ETA.",
    },
    discord: {
      name: "Pixelforge",
      about: "A game studio.",
      useCase:
        "Its agent supports players in the community Discord, checking access and granting roles without leaving the channel.",
    },
    "google-chat": {
      name: "Kepler",
      about: "A design and build agency.",
      useCase:
        "Its agent answers client project questions in Google Chat spaces, sharing status cards and staging links.",
    },
  }
