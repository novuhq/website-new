import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import { getCustomersPage, isCustomerStoryCard } from "@/lib/customers"
import { getStaticPageBySlug } from "@/lib/static"
import { CONNECT_FAQ } from "@/components/pages/connect/faq-data"

import { formatCodeFence, formatMarkdownLink } from "../markdown-format"
import { bulletList, faqMarkdown, linkList, pageFromSeo } from "../page-utils"
import { portableTextToMarkdown } from "../portable-text-to-markdown"
import type { MarkdownPage, SeoEntry } from "../types"
import { absoluteUrl, toCanonicalPathname } from "../url"

function section(title: string, content: Array<string | undefined | null>) {
  return [`## ${title}`, ...content].filter(Boolean).join("\n\n")
}

function itemSections(
  items: Array<{ title: string; description?: string; bullets?: string[] }>
) {
  return items
    .map((item) =>
      [
        `### ${item.title}`,
        item.description,
        item.bullets?.length ? bulletList(item.bullets) : "",
      ]
        .filter(Boolean)
        .join("\n\n")
    )
    .join("\n\n")
}

async function customerStoriesMarkdown() {
  const customersPage = await getCustomersPage(false)
  const customerStories = customersPage?.cards.filter(isCustomerStoryCard) || []

  if (!customerStories.length) return ""

  return section("Customer stories", [
    linkList(
      customerStories.map((customer) => ({
        title: customer.name,
        href: absoluteUrl(
          toCanonicalPathname(`${ROUTE.customers}/${customer.slug.current}`)
        ),
        description: [
          customer.quoteText,
          [customer.quoteAuthorName, customer.quoteAuthorPosition]
            .filter(Boolean)
            .join(", "),
        ]
          .filter(Boolean)
          .join(" - "),
      }))
    ),
  ])
}

const MCP_CONFIG_SNIPPET = `{
  "mcpServers": {
    "novu": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.novu.co/",
        "--header",
        "Authorization: Bearer \${NOVU_API_KEY}"
      ],
      "env": {
        "NOVU_API_KEY": "your-novu-api-key-here"
      }
    }
  }
}`

const MCP_STEPS = [
  {
    title: "Connect your AI client",
    description:
      "Point any MCP client — Claude, Cursor, or your app — to the Novu MCP Server.",
  },
  {
    title: "Discover available tools",
    description:
      "Your agent finds 23 tools: subscribers, preferences, workflows, triggers, notifications, integrations, and environments.",
  },
  {
    title: "Novu delivers everywhere",
    description:
      "Novu delivers across channels — in-app, email, SMS, push — with full observability.",
  },
]

const MCP_PROMPTS = [
  "List all failed chat notifications from the last 24 hours and show me the error details.",
  "Create a workflow that sends an order confirmation via email, an SMS with the tracking number, and an in-app notification through Novu Inbox.",
  "Check if my SendGrid and Twilio integrations are active.",
  "Trigger a workflow that sends an order confirmation via SendGrid email, and sends an SMS with the tracking number, and an in-app notification through Novu Inbox.",
  "Find subscriber user_789, mute their in-app channel, but keep email and push active.",
  "Pull all failed notifications across all channels in the past 24 hours and group them by provider and show me the error details.",
]

const MCP_TOOL_GROUPS = [
  {
    title: "Subscriber management",
    bullets: [
      "create_subscriber: Create a new subscriber with attributes like name, email, phone, and custom data",
      "get_subscriber: Retrieve a single subscriber by their subscriberId",
      "update_subscriber: Update an existing subscriber's attributes",
      "delete_subscriber: Delete a subscriber by their subscriberId",
      "find_subscribers: Search for subscribers using various query parameters",
    ],
  },
  {
    title: "Preferences",
    bullets: [
      "get_subscriber_preferences: Get subscriber notification preferences for all channels",
      "update_subscriber_preferences: Update subscriber notification preferences for specific channels",
    ],
  },
  {
    title: "Workflow management",
    bullets: [
      "create_workflow: Create a new workflow with comprehensive configuration including steps",
      "get_workflow: Get detailed information about a specific workflow",
      "get_workflows: Get all available workflows",
      "update_workflow: Update an existing workflow",
      "delete_workflow: Delete a workflow by its unique identifier",
    ],
  },
  {
    title: "Triggering & events",
    bullets: [
      "trigger_workflow: Trigger a workflow to send notifications to a subscriber",
      "bulk_trigger_workflow: Trigger multiple workflows in a single API call",
      "cancel_triggered_event: Cancel a pending triggered event",
    ],
  },
  {
    title: "Notifications",
    bullets: [
      "get_notification: Get a specific notification by ID with detailed execution logs",
      "get_notifications: Get notifications/events with advanced filtering options",
    ],
  },
  {
    title: "Integrations",
    bullets: [
      "get_integrations: List all channel integrations (email, SMS, push, chat, in-app)",
      "get_active_integrations: List only the active integrations",
      "delete_integration: Delete an integration by its integrationId",
      "set_primary_integration: Mark an integration as the primary for its channel",
    ],
  },
  {
    title: "Other",
    bullets: [
      "get_environments: Get all environments with their details and API keys",
      "get_api_key_status: Check the current API key status and server region configuration",
    ],
  },
]

const COPILOT_OLD_WAY_FEATURES = [
  {
    title: "From docs to done",
    description:
      "Skip the ramp-up. Say what you need in plain language and get a working flow back.",
  },
  {
    title: "Fewer handoffs",
    description:
      "Copy tweaks, timing changes, and new channels don't need an engineering ticket.",
  },
  {
    title: "Same day, not next sprint",
    description: "Write a prompt in the morning, test it before lunch.",
  },
]

const COPILOT_STEPS = [
  {
    title: "Describe",
    description:
      "One sentence is enough. The more detail you give, the closer the output lands.",
  },
  {
    title: "Review",
    description:
      "Keep it, Discard it, or Re-run with a tweaked prompt. Nothing ships until you say so.",
  },
  {
    title: "Deploy to production",
    description:
      "The workflow lands in your dev environment. Test, edit, and promote it to production like any other.",
  },
]

const COPILOT_PROMPTS = [
  {
    title: "Re-engagement",
    description:
      "When a user is inactive for two weeks, send a personal Email. If they don't return in 3 days, send a Push notification, then an SMS reminder after 2 days.",
    bullets: [
      "Output: A nudge that remembers where they left off, not a generic email.",
    ],
  },
  {
    title: "Transactional digest",
    description:
      "Bundle routine order updates into one daily summary via Email, but break through instantly with Push when something is actually urgent.",
    bullets: [
      "Output: One calm summary a day instead of a dozen interrupting pings.",
    ],
  },
  {
    title: "Trial conversion",
    description:
      "A friendly heads-up via Email before a trial ends, a softer In-App reminder the day before, and a clear upgrade offer via Push on expiry.",
    bullets: ["Output: A sequence that feels helpful, not pushy."],
  },
  {
    title: "Milestone celebration",
    description:
      "Celebrate users when they hit a meaningful milestone with In-App and Push, then invite them to share it via Email the day after.",
    bullets: ["Output: Recognition at the moment it matters."],
  },
]

const COPILOT_TEAM_FEATURES = [
  {
    title: "No boring asks in their queue",
    description: "Copy edits, timing tweaks, new channels — no more tickets.",
  },
  {
    title: "They still own what ships",
    description: "Generated workflows land in dev as real Novu workflows.",
  },
  {
    title: "No new system to learn",
    description: "Same shape as every other workflow in the project.",
  },
]

const BOOK_DEMO_ENTERPRISE_CARDS = [
  {
    title: "Security, compliance & governance",
    description:
      "Meet enterprise requirements with SSO, access controls, audit logs, compliance support, and governance features built for regulated teams.",
  },
  {
    title: "Reliability & deployment control",
    description:
      "Monitor notification performance, scale critical communications, and choose the cloud, self-hosted, or hybrid architecture that fits your needs.",
  },
  {
    title: "Open-source with support",
    description:
      "Get the transparency and flexibility of open source with dedicated support, onboarding, and assurances expected from an enterprise platform.",
  },
]

const BOOK_DEMO_COMPLIANCE = [
  "GDPR: Built to support EU data protection requirements.",
  "ISO 27001: International standard for information security management.",
  "SOC 2 Type II: Proven long-term data security through independent audits.",
  "HIPAA: Support for protected health information workflows.",
  "Compliance Support: If you don't see the required certification listed, talk to us.",
]

const BOOK_DEMO_FEATURES = [
  "SAML / SSO",
  "Self-hosted option",
  "Custom rate limits",
  "RBAC",
  "Security review support",
  "Audit logs",
  "Enterprise SLA",
  "Dedicated support",
]

const BOOK_DEMO_CENTRALIZE_FEATURES = [
  {
    title: "Inbox",
    description: "Give users one place to receive and act on key updates.",
  },
  {
    title: "User-controlled preferences",
    description: "Let users choose how and when notifications arrive.",
  },
  {
    title: "Notification digests",
    description: "Group updates into summaries to reduce noise.",
  },
  {
    title: "Centralized workflow logic",
    description: "Manage notification behavior from one workflow layer.",
  },
]

const CONNECT_DEMO_CONTROL_FEATURES = [
  {
    title: "Agent permissions",
    description:
      "Control what each agent can read, write, search, or execute across connected tools and customer-facing workflows.",
  },
  {
    title: "Capability guardrails",
    description:
      "Disable risky actions before agents go live, so every workflow stays within approved operational boundaries.",
  },
  {
    title: "Operational visibility",
    description:
      "See which tools are enabled for each agent, review capability changes, and keep agent behavior transparent across teams.",
  },
]

const CONNECT_DEMO_ENTERPRISE_CARDS = [
  {
    title: "Governance & Access",
    description:
      "Control who can create, deploy, and manage customer-facing agents across your organization.",
  },
  {
    title: "Production Reliability",
    description:
      "Monitor agent status, delivery health, and communication workflows before they impact customers.",
  },
  {
    title: "Human Oversight",
    description:
      "Route sensitive, failed, or high-value interactions to the right team with context preserved.",
  },
  {
    title: "Deployment Flexibility",
    description:
      "Run agent communication infrastructure in the setup that fits your security and scale requirements.",
  },
]

const CONNECT_DEMO_FEATURES = [
  "SAML / SSO",
  "SCIM",
  "Self-hosted option",
  "RBAC",
  "Multi-environment support",
  "Audit logs",
  "Enterprise SLA",
  "Dedicated support",
  "Security review support",
  "Custom rate limits",
]

const CONNECT_CHANNELS = [
  "Slack: Send team alerts",
  "WhatsApp: Reach users fast",
  "Email: Deliver clean digests",
  "Telegram: Push instant updates",
  "Teams: Notify team channels",
  "Google Chat: Coming soon",
  "iMessage: Coming soon",
  "Linear: Coming soon",
  "Zoom: Coming soon",
  "Discord: Coming soon",
  "Messenger: Coming soon",
  "GitHub: Coming soon",
]

function indexBody() {
  return [
    SEO_DATA.index.description,
    section("Notification infrastructure for product teams", [
      "Build multi-channel notification workflows across email, SMS, push, in-app, and chat with APIs and workflows designed for production teams.",
      "Use Novu to centralize workflow logic, user preferences, digests, in-app inbox experiences, and provider integrations.",
    ]),
    section("Just copy and ship", [
      "Copy the component, connect it to Novu, and ship a production-grade notification inbox without rebuilding the full experience from scratch.",
    ]),
    section("Core capabilities", [
      bulletList([
        "Workflow orchestration",
        "Multi-channel delivery",
        "User preferences",
        "Notification digests",
        "In-app inbox",
        "Provider integrations",
      ]),
    ]),
    section("Get started", [
      formatMarkdownLink("Start building", ROUTE.dashboardV2SignUp),
      formatMarkdownLink("Read the docs", ROUTE.docsOverview),
    ]),
  ].join("\n\n")
}

async function bookDemoBody() {
  return [
    "Novu Enterprise Inbox",
    "Notification infrastructure built for enterprise scale",
    "From compliance reviews to global delivery, Novu gives enterprise teams the control, visibility, and reliability they need.",
    "Actions: Book a demo; Book a Call.",
    section("Notifications brands count on", [
      "Ensuring seamless notifications from business to users, with zero hassle.",
    ]),
    section("Built for enterprise requirements", [
      "Meet enterprise expectations for security, compliance, reliability, and support without rebuilding notification infrastructure in-house.",
      itemSections(BOOK_DEMO_ENTERPRISE_CARDS),
      "Action: Book a demo.",
    ]),
    section("Enterprise-ready from day one", [
      "Everything your team needs to meet security, compliance, deployment, and support requirements at scale.",
      bulletList(BOOK_DEMO_COMPLIANCE),
      `Enterprise features included:\n\n${bulletList(BOOK_DEMO_FEATURES)}`,
      "Action: Book a demo.",
    ]),
    section("Centralize customer notifications across products and channels", [
      "Give teams one controlled layer for notification workflows, preferences, digests, and in-app communication without rebuilding notification logic in every product.",
      itemSections(BOOK_DEMO_CENTRALIZE_FEATURES),
    ]),
    await customerStoriesMarkdown(),
    section("See how Novu fits your enterprise stack", [
      "Talk with our team about your security, compliance, deployment, and notification infrastructure requirements.",
      "Actions: Book a demo; Book a Call.",
    ]),
  ]
    .filter(Boolean)
    .join("\n\n")
}

async function bookDemoConnectBody() {
  return [
    "Novu connect",
    "The infrastructure layer connecting AI agents to customers",
    "Connect existing agents to customer channels with the control, security, and reliability enterprise teams expect.",
    "Actions: Book a demo; Book a Call.",
    section("Novu is trusted by leading teams worldwide", []),
    section("One control layer for every agent conversation", [
      "Meet enterprise expectations for security, compliance, reliability, and support without rebuilding notification infrastructure in-house.",
      itemSections(CONNECT_DEMO_CONTROL_FEATURES),
      "Action: Book a demo.",
    ]),
    section("Built for enterprise agent communication", [
      "Move agents from internal experiments to customer-facing systems with the controls, reliability, and visibility enterprise teams require.",
      itemSections(CONNECT_DEMO_ENTERPRISE_CARDS),
      "Actions: Book a demo; Book a Call.",
    ]),
    section("Enterprise-ready from day one", [
      "Everything your team needs to meet security, compliance, deployment, and support requirements at scale.",
      bulletList(BOOK_DEMO_COMPLIANCE),
      `Enterprise features included:\n\n${bulletList(CONNECT_DEMO_FEATURES)}`,
      "Action: Book a demo.",
    ]),
    section("Meet customers wherever they are", [
      "Support customer communication across messaging, email, collaboration, and custom channels from one platform.",
      bulletList(CONNECT_CHANNELS),
    ]),
    await customerStoriesMarkdown(),
    faqMarkdown(CONNECT_FAQ),
    section("See how Novu Connect fits your enterprise agent stack", [
      "Talk with our team about your agents, customer channels, security requirements, and deployment path.",
      "Actions: Book a demo; Book a Call.",
    ]),
  ]
    .filter(Boolean)
    .join("\n\n")
}

function mcpBody() {
  return [
    "MCP Server",
    "Connect any AI to Novu. Instantly.",
    "A standardized bridge for MCP-compatible AI clients to Novu. Connect once, notify everywhere.",
    [
      formatMarkdownLink("Install MCP now", "#how-it-works"),
      formatMarkdownLink("Review the skill file", ROUTE.githubSkills),
    ]
      .map((item) => `- ${item}`)
      .join("\n"),
    section("Trigger a workflow with your agent, and let Novu do the rest", [
      itemSections(MCP_STEPS),
      formatCodeFence(MCP_CONFIG_SNIPPET, "json"),
      "Supported MCP clients shown on the page: Cursor, Codex, Claude Desktop, VS Code, Windsurf, GitHub Copilot.",
    ]),
    section(
      "Paste any prompt into your MCP client to interact with Novu in natural language",
      [bulletList(MCP_PROMPTS)]
    ),
    section(
      "Every tool your agent needs to control notification infrastructure",
      [
        itemSections(MCP_TOOL_GROUPS),
        formatMarkdownLink("Read the docs", ROUTE.docsMcp),
      ]
    ),
    section("Integrates seamlessly with leading agentic frameworks", [
      bulletList([
        "Claude",
        "Cursor",
        "Windsurf",
        "Copilot",
        "Codex",
        "VS Code",
      ]),
    ]),
    section("Don’t just take our word for it...", [
      "Explore what developers and non-technical users say about why they're fans of our open-source notifications framework.",
    ]),
    section("Get involved: start, engage, contribute", [
      linkList([
        {
          title: "Novu Cloud",
          href: ROUTE.dashboard as string,
          description:
            "Embark on your journey by creating your personalized account",
        },
        {
          title: "Join Discord",
          href: ROUTE.discord as string,
          description:
            "Immerse yourself in the community by joining our dedicated server",
        },
        {
          title: "Fork and Work",
          href: ROUTE.githubIssues as string,
          description:
            "Discover an issue within our project and make a valuable contribution",
        },
      ]),
    ]),
    section("Start building with MCP", [
      "Connect your first AI agent in under 5 minutes.",
      formatMarkdownLink("GET STARTED FREE", ROUTE.dashboard),
      formatMarkdownLink("READ THE DOCS", ROUTE.docsMcp),
    ]),
  ].join("\n\n")
}

function copilotBody() {
  return [
    "Novu copilot",
    "Describe the notification journey. Ship it the same day.",
    "Built for product managers. Tell Novu Copilot what you want in plain English, and it builds the workflow, following industry best practices.",
    [
      formatMarkdownLink("start building for free", ROUTE.dashboardV2SignUp),
      formatMarkdownLink("See how it works", "#how-it-works"),
    ]
      .map((item) => `- ${item}`)
      .join("\n"),
    section("Trusted by the best product and engineering teams", []),
    section("Every notification change used to be a project.", [
      "Read the docs. Learn the dashboard. Map out the flow. File a ticket. Wait. Iterate. Copilot collapses that loop into a sentence.",
      itemSections(COPILOT_OLD_WAY_FEATURES),
    ]),
    section("Write it like a brief. Get back a real Novu workflow.", [
      "Copilot reads your prompt and assembles the steps inside Novu, picking channels, timing, and conditions to match what you described.",
      itemSections(COPILOT_STEPS),
      formatMarkdownLink("Generate your first workflow", ROUTE.workflows),
    ]),
    section("What you can ship this afternoon.", [
      "Each of these started as a single sentence. They're the kind of journeys that move onboarding completion, retention, and conversion.",
      itemSections(COPILOT_PROMPTS),
    ]),
    section("Workflows you can actually trust with your users.", [
      "Copilot generates workflows shaped by patterns Novu has seen work across thousands of production setups. The output is closer to what a senior notifications engineer would build than to a first draft.",
      formatMarkdownLink("Ship a workflow you can trust", ROUTE.workflows),
    ]),
    section("Less notification work on your engineers' plate.", [
      "Most engineers don't enjoy being the bottleneck on copy tweaks, timing changes, and new channels. Copilot takes that load off them — product moves faster, engineering still owns the workflow end to end.",
      itemSections(COPILOT_TEAM_FEATURES),
    ]),
    section("Your next workflow is one prompt away.", [
      "Free to start, no credit card. BETA — we're shipping improvements weekly based on what product teams ask for.",
      formatMarkdownLink("start shipping", ROUTE.dashboardV2SignUp),
    ]),
  ].join("\n\n")
}

const STATIC_ROUTE_COPY: Record<
  string,
  SeoEntry & { body: string | (() => string | Promise<string>) }
> = {
  "/": {
    ...SEO_DATA.index,
    body: indexBody,
  },
  "/book-a-demo": {
    ...SEO_DATA.bookADemo,
    body: bookDemoBody,
  },
  "/book-a-demo-connect": {
    ...SEO_DATA.bookADemoConnect,
    body: bookDemoConnectBody,
  },
  "/mcp": {
    ...SEO_DATA.mcp,
    body: mcpBody,
  },
  "/copilot": {
    ...SEO_DATA.copilot,
    body: copilotBody,
  },
}

export async function getStaticMarketingPage(
  pathname: string
): Promise<MarkdownPage | null> {
  const page = STATIC_ROUTE_COPY[pathname]
  if (!page) return null

  const body = typeof page.body === "function" ? await page.body() : page.body
  return pageFromSeo(page, body)
}

export async function getStaticSanityPage(
  pathname: string
): Promise<MarkdownPage | null> {
  const slug = pathname.slice(1)
  if (!slug || slug.includes("/")) return null

  const staticPage = await getStaticPageBySlug(slug, false)
  if (!staticPage) return null

  return {
    title: staticPage.seo?.title || staticPage.title,
    description: staticPage.seo?.description,
    pathname: `/${staticPage.slug.current}`,
    body: portableTextToMarkdown(staticPage.content),
    updatedAt: staticPage.publishedAt || staticPage._createdAt,
    noIndex: staticPage.seo?.noIndex,
  }
}
