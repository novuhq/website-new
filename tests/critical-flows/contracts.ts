const monitorContract = {
  policy: "monitor",
} as const

export const destinations = {
  dashboard: "https://dashboard.novu.co",
  agentsSignUp: "https://dashboard.novu.co/auth/sign-up?product_type=agents",
  connectApp: "https://connect.novu.co",
  connect: "/connect",
  pricing: "/pricing",
} as const

export const navigationContract = {
  ...monitorContract,
  id: "TC-NAV-001",
  priority: "P0",
  mode: "navigate",
  route: "/",
  heading: "Connect your AI agents and products to customers",
  destination: destinations.pricing,
  destinationHeading: "Flexible pricing for companies and developers",
  authLinks: {
    desktop: [{ name: "Sign up now", href: destinations.dashboard }],
    desktopSignedIn: [
      { name: "Visit Dashboard", href: destinations.dashboard },
    ],
    mobile: [
      { name: "Login", href: destinations.dashboard },
      { name: "Get Started", href: destinations.dashboard },
    ],
  },
  authStateCookie: "novu-critical-flow-auth-state",
  authStates: {
    loading: "loading",
    signedIn: "signed-in",
  },
} as const

export const liveChannelContract = {
  ...monitorContract,
  id: "TC-HOME-001",
  priority: "P0",
  mode: "render",
  route: "/",
  channel: "Slack",
  heading: "Connect your AI agent to Slack",
  command: "npx novu connect --channel slack",
} as const

export const waitlistContract = {
  ...monitorContract,
  id: "TC-HOME-002",
  priority: "P1",
  mode: "submit",
  route: "/",
  channel: "Zoom",
  email: "critical-flow-waitlist@example.com",
  validationError: "Please enter a valid email address.",
  submissionError: "Something went wrong. Please try again.",
  success: "Thanks. We'll email you when Zoom is live.",
} as const

export const connectStackContract = {
  ...monitorContract,
  id: "TC-HOME-003",
  priority: "P0",
  mode: "render",
  route: "/",
  heading: "Opinionated about communication. Unopinionated about intelligence.",
  channel: "MS Teams",
  framework: "LangChain",
  command: "npx novu connect --channel teams --runtime langchain",
  prompt: `Connect this project's LangChain agent to MS Teams with Novu Connect.

Follow https://novu.co/agents.md end to end (custom code bridge path). Default to the non-interactive CLI (\`--ci\`).

Inspect the repo (agent entry point, how LangChain is used, package manager, env conventions). Do not modify anything yet.

Prefer a connect command shaped like:

npx novu@latest connect --ci --runtime langchain --channel teams

(Omit --keyless: bridge uses dashboard OAuth. Adjust flags only as agents.md allows for this runtime.)

Prefer the secure setup links the CLI prints. After connect, finish any bridge wiring from the requirements file agents.md describes. Do not invent setup steps or ask for secrets in chat unless agents.md requires it.`,
} as const

export const channelPagesContract = {
  ...monitorContract,
  id: "TC-CHANNEL-001",
  priority: "P0",
  mode: "render",
  pages: [
    {
      route: "/channels/slack",
      heading: "Connect your AI agent to Slack",
      cliSlug: "slack",
    },
    {
      route: "/channels/whatsapp",
      heading: "Connect your AI agent to WhatsApp",
      cliSlug: "whatsapp",
    },
    {
      route: "/channels/telegram",
      heading: "Connect your AI agent to Telegram",
      cliSlug: "telegram",
    },
    {
      route: "/channels/microsoft-teams",
      heading: "Connect your AI agent to Microsoft Teams",
      cliSlug: "teams",
    },
    {
      route: "/channels/email",
      heading: "Connect your AI agent to Email",
      cliSlug: "email",
    },
  ],
} as const

export const channelHandoffContract = {
  ...monitorContract,
  id: "TC-CHANNEL-002",
  priority: "P0",
  mode: "navigate",
  route: "/channels/slack",
  destination: destinations.connect,
  destinationHeading: "Connect your agent to any channel",
} as const

export const connectContract = {
  ...monitorContract,
  id: "TC-CONNECT-001",
  priority: "P0",
  mode: "navigate",
  route: destinations.connect,
  heading: "Connect your agent to any channel",
  command: "npx novu connect",
  prompt: `Connect this project's AI agent to customer channels (Slack, Microsoft Teams, WhatsApp, Telegram, Email, or iMessage) with Novu Connect.

Follow https://novu.co/agents.md end to end. Default to the non-interactive CLI (\`npx novu@latest connect … --ci\`).

Inspect the repo first. Ask me which channel to connect if it is not clear. Detect the framework/runtime from the project, or ask once. Then run one connect command per agents.md (bridge vs managed, keyless vs dashboard OAuth).

Prefer the secure setup links the CLI prints. Do not invent setup steps or ask for secrets in chat unless agents.md says that channel requires it (e.g. iMessage/Sendblue).`,
  signUpDestination: destinations.agentsSignUp,
  connectAppDestination: destinations.connectApp,
} as const

export const integrationsContract = {
  ...monitorContract,
  id: "TC-INTEGRATION-001",
  priority: "P0",
  mode: "navigate",
  route: "/integrations/channels",
  heading: "Novu Integrations for Unified Notification Delivery",
  query: "SendGrid",
  detailRoute: "/integrations/sendgrid",
  detailHeading: "SendGrid",
  docsDestination: "https://docs.novu.co/platform/integrations/email/sendgrid",
} as const

export const pricingContract = {
  ...monitorContract,
  id: "TC-ACQ-001",
  priority: "P0",
  mode: "navigate",
  route: destinations.pricing,
  heading: "Flexible pricing for companies and developers",
  selfServePlans: ["Free", "Pro", "Team"],
  enterprisePlan: "Enterprise",
} as const

export const subscriptionContract = {
  ...monitorContract,
  id: "TC-SUB-001",
  priority: "P1",
  mode: "submit",
  route: "/blog",
  heading: "Built with Novu",
  email: "critical-flow+skipform@hubspot.com",
  validationError: "Please enter a valid email address.",
  submissionError: "Something went wrong. Please try again.",
  success: "Thank you for subscribing!",
} as const

export const careersContract = {
  ...monitorContract,
  id: "TC-LEAD-001",
  priority: "P1",
  mode: "submit",
  route: "/careers",
  heading: "Build the infrastructure behind every product update",
  email: "critical-flow-careers@example.com",
  success:
    "Thanks. We received your note and will reach out if there is a fit.",
} as const
