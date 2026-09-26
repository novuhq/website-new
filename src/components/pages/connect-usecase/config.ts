// Config-driven, section-based Novu use-case landing pages. ONE template
// (the UseCaseLanding component) renders any vertical from an ordered list of
// typed section blocks; each vertical supplies its own hero + sections + final
// CTA below. Content is grounded in real Attio (CRM) + Grain (call) research
// per vertical. Real customer names appear ONLY if already public/approved
// (Ebury, MongoDB are already on the site); everything else is anonymized to
// industry + use-case. Demo companies are illustrative samples, never real
// customers.

export interface ICta {
  label: string
  href: string
}

export interface ILabeledItem {
  title: string
  description: string
}

export interface IProofQuote {
  text: string
  attribution: string
}

export interface IUseCaseDemo {
  channel: string
  caption: string
  webm: string
  mp4: string
  poster: string
}

export interface ILogoRef {
  key: string
  alt: string
}

// Section blocks the template can render, in any order, any number.
export type ISection =
  | {
      type: "prose"
      eyebrow?: string
      title: string
      body: string
      quote?: IProofQuote
      cta?: ICta
    }
  | {
      type: "features"
      eyebrow?: string
      title: string
      body?: string
      items: ILabeledItem[]
      cta?: ICta
    }
  | {
      type: "badges"
      eyebrow?: string
      title: string
      body: string
      badges: string[]
      cta?: ICta
    }
  | {
      type: "split"
      eyebrow?: string
      title: string
      body: string
      points: string[]
      cta?: ICta
    }
  | {
      type: "demos"
      eyebrow?: string
      title: string
      body: string
      tagline?: string
      demos: IUseCaseDemo[]
      showCommand?: boolean
    }
  | {
      type: "proof"
      label: string
      logos: ILogoRef[]
      quotes: IProofQuote[]
    }

export interface IUseCaseLanding {
  slug: string
  eyebrow: string
  heroTitle: string
  heroDescription: string
  command: string
  heroProof?: { label: string; logo?: ILogoRef }
  sections: ISection[]
  finalCta: { title: string; body: string; primaryCtaLabel: string }
}

export const USE_CASE_LANDINGS: Record<string, IUseCaseLanding> = {
  fintech: {
    slug: "fintech",
    eyebrow: "For fintech and payments",
    heroTitle: "One governed communication layer for regulated fintech",
    heroDescription:
      "Bring every message your customers receive, transaction alerts, 2FA, statements, KYC, into one auditable system. Deliver on Email, SMS, push, and in-app Inbox today, add WhatsApp and iMessage without touching your code, and let your agents reach customers two-way on Slack and Teams. You keep your stack. Novu handles delivery.",
    command: "npx novu connect",
    heroProof: {
      label: "Trusted by regulated fintech and payments teams",
      logo: { key: "ebury", alt: "Ebury" },
    },
    sections: [
      {
        type: "prose",
        title: "Notification logic ends up scattered everywhere",
        body: "Transaction alerts in one service, 2FA in another, statements somewhere else, each with its own provider and no single place to control what a customer receives. That is hard to audit, slow to change, and risky in a regulated business.",
        quote: {
          text: "It was scattered around in every place in code, with no centralized place for us to manage it.",
          attribution: "A global payments provider",
        },
      },
      {
        type: "badges",
        eyebrow: "Regulated by design",
        title: "Built for regulated messaging",
        body: "Security review is usually the first gate, so Novu comes ready for it. Every message is logged with sender, recipient, and content, with audit-log retention up to seven years and logs delivered to your own systems by webhook. Deploy in an EU region or self-host when data residency requires it.",
        badges: ["SOC 2", "ISO 27001", "GDPR", "DPA"],
        cta: { label: "Get the security pack", href: "/security" },
      },
      {
        type: "features",
        title: "The messages fintech sends every day",
        body: "Start with the transactional notifications your customers already expect, on one reliable layer.",
        items: [
          {
            title: "2FA and one-time codes",
            description:
              "Reliable delivery even in markets where SMS is hard, with fallback across channels.",
          },
          {
            title: "Transaction status alerts",
            description:
              "Payment success and failure, and any change to the customer's account.",
          },
          {
            title: "Statements and documents",
            description:
              "Tell customers the moment a statement or document is ready to view.",
          },
          {
            title: "Billing and card alerts",
            description:
              "Payment failed, card expiring, and credit-limit notices, sent on time.",
          },
          {
            title: "KYC and consent flows",
            description:
              "Verification requests and consent-management notifications, tracked end to end.",
          },
          {
            title: "Fraud and security alerts",
            description:
              "Flag a suspicious event and let the customer confirm or freeze in one tap.",
          },
        ],
        cta: { label: "Read the docs", href: "/agents" },
      },
      {
        type: "split",
        title:
          "One trigger, every channel, preferences your customers control",
        body: "Send a single workflow to Email, SMS, push, and an in-app Inbox, and add WhatsApp and iMessage without changing your code. Give each customer granular preference control, not just all on or all off.",
        points: [
          "Email, SMS, push, and in-app Inbox on one workflow",
          "WhatsApp and iMessage added without a code change",
          "Per-customer preferences, more granular than in or out",
          "One integration to maintain, not five",
        ],
        cta: { label: "Explore channels", href: "/#channels" },
      },
      {
        type: "demos",
        eyebrow: "Novu Connect",
        title: "Now let your agents talk back",
        body: "This is where fintech is heading. Your agent reaches a customer in the channel they already use, asks for what it needs, and acts on the reply, with every sensitive action gated behind an approval. A KYC agent that collects documents in Slack. A payments agent that resolves a payout hold on WhatsApp.",
        tagline: "We never run your brain. That is the whole point.",
        showCommand: true,
        demos: [
          {
            channel: "WhatsApp",
            caption:
              "A merchant asks where today's payout is. The agent traces the hold, resubmits the tax document, and releases the payout after a one-tap approval.",
            webm: "/videos/channels/tallywave-whatsapp-client-facing.webm",
            mp4: "/videos/channels/tallywave-whatsapp-client-facing.hevc.mp4",
            poster:
              "/videos/channels/tallywave-whatsapp-client-facing-poster.png",
          },
          {
            channel: "Email",
            caption:
              "A merchant flags a chargeback. The agent checks the delivery proof and files the dispute through a secure action link.",
            webm: "/videos/channels/tallywave-email-client-facing.webm",
            mp4: "/videos/channels/tallywave-email-client-facing.hevc.mp4",
            poster: "/videos/channels/tallywave-email-client-facing-poster.png",
          },
        ],
      },
      {
        type: "prose",
        title: "Move off point providers without doubling spend",
        body: "Migrate email and SMS onto one layer on a phased path, keep your audit trail and approvals intact, and give product managers no-code templates so shipping a new message takes hours, not days.",
        cta: {
          label: "Talk to us about migration",
          href: "/book-a-demo-connect",
        },
      },
      {
        type: "proof",
        label: "Trusted by regulated fintech and payments teams",
        logos: [{ key: "ebury", alt: "Ebury" }],
        quotes: [
          {
            text: "Auditability and traceability is crucial for our industry. We need detailed logs of who was sent what, and for how long.",
            attribution: "A global FX and payments provider",
          },
          {
            text: "We wanted one place to control every message, with preference management more granular than a full in or out.",
            attribution: "A regulated consumer fintech",
          },
        ],
      },
    ],
    finalCta: {
      title: "Build your customer communication once. Deliver it everywhere.",
      body: "Keep your model, your prompts, and your keys. Novu is the communication layer that reaches your customers on every channel, with the audit trail and approvals a regulated business needs.",
      primaryCtaLabel: "Book a call",
    },
  },

  "dev-tools": {
    slug: "dev-tools",
    eyebrow: "For developer platforms",
    heroTitle: "Notification infrastructure for developer platforms",
    heroDescription:
      "One workflow layer across in-app Inbox, Email, SMS, push, Slack, Teams, WhatsApp, and Telegram. Embed a notification center in minutes, keep your own providers, and self-host the open-source core. Then bring your agent into the channels your users already use.",
    command: "npx novu",
    heroProof: {
      label: "Trusted by developer platforms",
      logo: { key: "mongodb", alt: "MongoDB" },
    },
    sections: [
      {
        type: "prose",
        title: "The homegrown notification system always outgrows you",
        body: "Notification code scattered across services, timezone and digest bugs, and a backlog only engineers can ship. Building it in house becomes an ongoing tax on the team that should be shipping your product.",
        quote: {
          text: "Notification logic was scattered throughout the codebase, with no centralized place to manage it.",
          attribution: "An AI-infrastructure company",
        },
        cta: { label: "See how teams migrate", href: "/agents" },
      },
      {
        type: "features",
        eyebrow: "Drop-in Inbox",
        title: "An in-app Inbox you embed in minutes",
        body: "React and headless SDKs, a drop-in bell and notification center, unread counts, tabs, and preferences your users control.",
        items: [
          {
            title: "React and headless SDKs",
            description:
              "A styled component or full headless control, with the state managed for you.",
          },
          {
            title: "Bell and notification center",
            description:
              "Drop in the bell, feed, tabs, and unread counts. Live out of the box.",
          },
          {
            title: "Preferences and digests",
            description:
              "Per-user preferences, timezone-aware digests, and translations built in.",
          },
        ],
        cta: { label: "View the Inbox docs", href: "/inbox" },
      },
      {
        type: "split",
        title: "One workflow layer, your providers",
        body: "Send one workflow to in-app, Email, SMS, push, Slack, Teams, WhatsApp, and Telegram, and keep SendGrid, SES, or Twilio as pure delivery. Automatic webhook ingestion puts every delivery event under one roof.",
        points: [
          "One workflow to every channel your users prefer",
          "Keep your own delivery providers",
          "Automatic delivery-event ingestion by webhook",
          "Subscriber upsert on your own user IDs",
        ],
        cta: { label: "Explore integrations", href: "/integrations" },
      },
      {
        type: "badges",
        eyebrow: "Open source",
        title: "Self-host it, or run our cloud",
        body: "The core is MIT and open source, with around 40K GitHub stars. Deploy in your own VPC or on-prem with Docker and Helm for FedRAMP, GDPR, and data-residency requirements, with enterprise support when you need it.",
        badges: [
          "MIT open source",
          "~40K GitHub stars",
          "Docker and Helm",
          "Self-host or cloud",
        ],
        cta: {
          label: "Star on GitHub",
          href: "https://github.com/novuhq/novu",
        },
      },
      {
        type: "features",
        title: "Built for scale and control",
        body: "The controls multi-tenant platforms need once notifications get real.",
        items: [
          {
            title: "Digest, throttle, batching",
            description:
              "Collapse 100 events into one message, and cap how often a user is pinged.",
          },
          {
            title: "Multi-tenancy",
            description:
              "Per-tenant branding and per-tenant SMTP for platforms serving many customers.",
          },
          {
            title: "Observability",
            description:
              "Activity feed and workflow, request, and step-level tracing via the API.",
          },
          {
            title: "Timezone and i18n",
            description:
              "Timezone-aware sends and translations, without building it yourself.",
          },
        ],
        cta: { label: "Read the architecture docs", href: "/agents" },
      },
      {
        type: "demos",
        eyebrow: "Novu Connect",
        title: "When notifications become two-way",
        body: "Notifications are not a one-way street. Bring your existing agent into the channels your users already use, let them reply in the thread, and gate any sensitive action behind a human approval.",
        tagline: "We never run your brain. That is the whole point.",
        showCommand: true,
        demos: [
          {
            channel: "Slack",
            caption:
              "A data platform's agent diagnoses a customer's failed sync in a shared Slack channel and fixes it after a one-click approval.",
            webm: "/videos/channels/slack-client-facing.webm",
            mp4: "/videos/channels/slack-client-facing.hevc.mp4",
            poster: "/videos/channels/slack-client-facing-poster.png",
          },
          {
            channel: "Telegram",
            caption:
              "A developer hits a rate limit. The API platform's agent shows real usage and upgrades the plan on request, with the tool call approved inline.",
            webm: "/videos/channels/telegram-client-facing.webm",
            mp4: "/videos/channels/telegram-client-facing.hevc.mp4",
            poster: "/videos/channels/telegram-client-facing-poster.png",
          },
        ],
      },
      {
        type: "proof",
        label: "Trusted by developer platforms",
        logos: [{ key: "mongodb", alt: "MongoDB" }],
        quotes: [
          {
            text: "Novu is very good at providing the SDK on the React side: in-app notifications, toast, push, bell icon, the inbox component.",
            attribution: "A data-cloud infrastructure company",
          },
          {
            text: "We wanted a boundary between where engineers live and the rest of the organization, and to treat notifications as a full system.",
            attribution: "A commodity-trading platform",
          },
        ],
      },
    ],
    finalCta: {
      title: "Ship notifications without maintaining the plumbing.",
      body: "An open-source core, an embeddable Inbox, and one workflow layer across every channel. Start free, or self-host in your own environment.",
      primaryCtaLabel: "Start free",
    },
  },

  security: {
    slug: "security",
    eyebrow: "For security and cybersecurity",
    heroTitle: "Deliver the alert that cannot be missed",
    heroDescription:
      "Real-time critical alerting and on-call escalation your users can rely on, across Slack, Microsoft Teams, WhatsApp, Telegram, and Email, with a delivery SLA, an audit trail, and the option to run it on your own infrastructure.",
    command: "npx novu",
    sections: [
      {
        type: "prose",
        title: "A late alert is a missed alert",
        body: "In security, a notification that arrives slow, or not at all, means the customer finds out too late. Critical delivery has to be immediate, reliable, and provable.",
        quote: {
          text: "If the alerting we raise is not immediate, the customer is not aware they have a problem.",
          attribution: "A database infrastructure vendor",
        },
        cta: { label: "See the alerting quickstart", href: "/agents" },
      },
      {
        type: "split",
        title: "Escalate on the channels your customers already use",
        body: "Route critical alerts to Slack, Microsoft Teams, WhatsApp, Telegram, and Email, and hand off to the on-call tools your customers already run. You do not control which channel they choose, so support them all.",
        points: [
          "Slack, Teams, WhatsApp, Telegram, and Email from one workflow",
          "Hand off to the customer's own on-call tooling",
          "Per-topic subscriptions the user controls",
          "Critical alerts users are not allowed to mute",
        ],
        cta: { label: "View channels and integrations", href: "/integrations" },
      },
      {
        type: "split",
        eyebrow: "Reliability",
        title: "A delivery guarantee on the alerts that matter",
        body: "Scope an uptime and critical-delivery SLA to the notifications that count, with recipient-level observability and an audit trail of who was alerted and when.",
        points: [
          "Uptime and critical-delivery SLA",
          "Recipient-level delivery observability by webhook",
          "Audit trail of who was alerted and when",
          "Dedicated per-tenant critical queues",
        ],
        cta: { label: "Read the reliability docs", href: "/agents" },
      },
      {
        type: "badges",
        eyebrow: "Built for your security review",
        title: "Your security team will ask. We are ready.",
        body: "Self-hosting and data residency, SSO, and a penetration-test report and compliance documentation on request. Run the open-source core in your own environment when review requires it.",
        badges: ["SOC 2", "ISO 27001", "Self-host", "SSO"],
        cta: { label: "Request the security pack", href: "/security" },
      },
      {
        type: "demos",
        eyebrow: "Novu Connect",
        title: "Agents that act, with a human in the loop",
        body: "An agent triages an alert in Slack or Teams, posts what it found, and asks an analyst to approve the containment action before it runs. The communication layer brings your agent into chat. It never runs your agent's brain.",
        tagline: "We never run your brain. That is the whole point.",
        showCommand: true,
        demos: [
          {
            channel: "Microsoft Teams",
            caption:
              "A security vendor's agent provisions access for a client's analysts in Teams, and only after an explicit approval.",
            webm: "/videos/channels/teams-client-facing.webm",
            mp4: "/videos/channels/teams-client-facing.hevc.mp4",
            poster: "/videos/channels/teams-client-facing-poster.png",
          },
          {
            channel: "Slack",
            caption:
              "An agent investigates an incident in a shared channel and remediates it once an engineer approves the action.",
            webm: "/videos/channels/slack-client-facing.webm",
            mp4: "/videos/channels/slack-client-facing.hevc.mp4",
            poster: "/videos/channels/slack-client-facing-poster.png",
          },
        ],
      },
      {
        type: "proof",
        label: "Trusted by security and infrastructure teams",
        logos: [],
        quotes: [
          {
            text: "Most of our security investigations happen in Slack. What we want next is for the agent to say you need to block this user, the analyst approves, and then it acts.",
            attribution: "A SOC and observability platform",
          },
          {
            text: "You said three nines. Three nines on what? We need the SLA scoped to the critical delivery of the actual notifications.",
            attribution: "A database infrastructure vendor",
          },
        ],
      },
    ],
    finalCta: {
      title: "Ship the alert that gets through.",
      body: "Real-time delivery, on-call escalation, and a human-approved agent, on your infrastructure when you need it. Start free, or talk to us about self-hosting and compliance.",
      primaryCtaLabel: "Start free",
    },
  },

  ecommerce: {
    slug: "ecommerce",
    eyebrow: "For e-commerce and marketplaces",
    heroTitle: "Every order update, on the channel your customers actually read",
    heroDescription:
      "Order, shipping, and delivery updates across Email, SMS, WhatsApp, push, and an in-app Inbox, from one workflow. Keep your own providers and domain reputation, split transactional off your marketing tool, and let customers reply to reschedule a delivery.",
    command: "npx novu",
    heroProof: {
      label: "Trusted by consumer marketplaces and brands",
      logo: { key: "whoppah", alt: "Whoppah" },
    },
    sections: [
      {
        type: "features",
        eyebrow: "Order lifecycle",
        title: "From confirmation to delivery, on every channel",
        body: "The messages a shopper expects, sent reliably and on the channel they prefer.",
        items: [
          {
            title: "Order confirmation",
            description:
              "Confirm the order the moment it is placed, transactional, no unsubscribe needed.",
          },
          {
            title: "Shipping and delivery",
            description:
              "Shipped, out for delivery, and delivered updates across Email, SMS, and WhatsApp.",
          },
          {
            title: "Delivery exceptions",
            description:
              "Let the customer reply to reschedule a window or redirect the parcel.",
          },
          {
            title: "Back in stock and price drop",
            description:
              "Wishlist and stock alerts to the channel each shopper prefers.",
          },
          {
            title: "Payment and refund",
            description:
              "Payment, refund, and payout confirmations, sent on time.",
          },
          {
            title: "Cart and checkout nudges",
            description:
              "Abandoned-basket reminders as transactional triggers, kept separate from marketing.",
          },
        ],
        cta: { label: "Explore the notification workflow", href: "/agents" },
      },
      {
        type: "split",
        title: "Reach every shopper, and stay out of spam",
        body: "Send Email, SMS, WhatsApp, push, and in-app from one workflow, and bring your own provider so you keep your domain reputation and see what was delivered and read.",
        points: [
          "Email, SMS, WhatsApp, push, and in-app on one workflow",
          "Bring your own provider and domain reputation",
          "Bounce, delivery, and read tracking",
          "Quiet-by-default preferences per shopper",
        ],
        cta: { label: "Read the deliverability docs", href: "/integrations" },
      },
      {
        type: "prose",
        title: "Notify both sides of your marketplace",
        body: "Item sold, offer received, message waiting, payout sent. One stack notifies buyer and seller across every channel, at millions of messages a month.",
        quote: {
          text: "A collection of the user's records they want to purchase, about 20 million messages, on one workflow.",
          attribution: "A large online marketplace",
        },
        cta: { label: "See the marketplace pattern", href: "/agents" },
      },
      {
        type: "features",
        eyebrow: "Consumer Inbox",
        title: "An in-app inbox and preference center in minutes",
        body: "React or headless, a five to ten minute install, and one place where shoppers choose channels and quiet hours.",
        items: [
          {
            title: "In-app inbox",
            description:
              "A drop-in notification center inside your app, live out of the box.",
          },
          {
            title: "Per-channel preferences",
            description:
              "Let each shopper pick which channels they want, enforced everywhere.",
          },
          {
            title: "Quiet hours",
            description:
              "Quiet-by-default sending so customers are never over-messaged.",
          },
          {
            title: "React or headless",
            description:
              "A styled component or full headless control, with state managed for you.",
          },
        ],
        cta: { label: "Add an Inbox in minutes", href: "/inbox" },
      },
      {
        type: "demos",
        eyebrow: "Novu Connect",
        title: "Let customers reply, not just receive",
        body: "Turn a delivery notification into a conversation. A customer replies on WhatsApp to reschedule a delivery, and a service agent can confirm and change details in the app the customer already uses.",
        tagline: "We never run your brain. That is the whole point.",
        showCommand: true,
        demos: [
          {
            channel: "WhatsApp",
            caption:
              "A shopper asks where their order is. The agent finds the delayed parcel and reroutes it to a pickup point in a couple of taps.",
            webm: "/videos/channels/whatsapp-client-facing.webm",
            mp4: "/videos/channels/whatsapp-client-facing.hevc.mp4",
            poster: "/videos/channels/whatsapp-client-facing-poster.png",
          },
          {
            channel: "iMessage",
            caption:
              "A consumer-service agent confirms and reschedules right in the customer's Messages app, with a native time picker.",
            webm: "/videos/channels/imessage-client-facing.webm",
            mp4: "/videos/channels/imessage-client-facing.hevc.mp4",
            poster: "/videos/channels/imessage-client-facing-poster.png",
          },
        ],
      },
      {
        type: "proof",
        label: "Trusted by consumer marketplaces and brands",
        logos: [
          { key: "whoppah", alt: "Whoppah" },
          { key: "hemnet", alt: "Hemnet" },
          { key: "tatilbudur", alt: "TatilBudur" },
        ],
        quotes: [
          {
            text: "Novu is really good when it comes to transactional. That is usually where companies moving off a marketing tool land.",
            attribution: "A consumer collectibles platform",
          },
          {
            text: "We send Email, SMS, WhatsApp, push, and in-app notifications, just shy of four million a month, and growing.",
            attribution: "A global money-transfer service",
          },
        ],
      },
    ],
    finalCta: {
      title: "Move your transactional messaging onto one layer.",
      body: "Millions of messages a month across every channel, with your own providers and domain reputation. Split transactional off your marketing tool without ripping it out.",
      primaryCtaLabel: "Start free",
    },
  },
}
