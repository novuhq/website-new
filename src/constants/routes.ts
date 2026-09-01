import type { Route } from "next"

export const ROUTE: Record<string, Route<string> | URL> = {
  // API
  apiHubspot: "/api/hubspot",

  // CURRENT WEBSITE
  bookADemo: "/book-a-demo",
  bookADemoConnect: "/book-a-demo-connect",
  changelog: "/changelog",
  customers: "/customers",
  integrations: "/integrations",
  integrationsChannels: "/integrations/channels",
  integrationsChannelsInApp:
    "/integrations/channels#integration-category-in-app",
  integrationsChannelsEmail:
    "/integrations/channels#integration-category-email",
  integrationsChannelsSms: "/integrations/channels#integration-category-sms",
  integrationsChannelsPush: "/integrations/channels#integration-category-push",
  integrationsChannelsChat: "/integrations/channels#integration-category-chat",
  integrationsChannelsAgentChannels:
    "/integrations/channels#integration-category-agent-channels",
  integrationsSources: "/integrations/sources",
  integrationsSourcesWorkflow:
    "/integrations/sources#integration-category-email-frameworks",
  integrationsSourcesAiSdks:
    "/integrations/sources#integration-category-ai-sdks",
  integrationsSourcesAgentRuntimes:
    "/integrations/sources?category=agent-runtimes#integrations-explore",
  integrationsSourcesFeatureFlags:
    "/integrations/sources#integration-category-feature-flags",
  connect: "/connect",
  copilot: "/copilot",
  mcp: "/mcp",
  aci: "/aci",
  notify: "/notify",

  // Per-channel Novu Connect landing pages
  channelSlack: "/channels/slack",
  channelSlackLangchain: "/channels/slack/langchain",
  channelSlackAiSdk: "/channels/slack/ai-sdk",
  channelSlackChatSdk: "/channels/slack/chat-sdk",
  channelSlackCustomCode: "/channels/slack/custom-code",
  channelSlackClaude: "/channels/slack/claude",
  channelSlackClaudeAws: "/channels/slack/claude-aws",
  channelWhatsApp: "/channels/whatsapp",
  channelWhatsAppLangchain: "/channels/whatsapp/langchain",
  channelWhatsAppAiSdk: "/channels/whatsapp/ai-sdk",
  channelWhatsAppChatSdk: "/channels/whatsapp/chat-sdk",
  channelWhatsAppCustomCode: "/channels/whatsapp/custom-code",
  channelWhatsAppClaude: "/channels/whatsapp/claude",
  channelWhatsAppClaudeAws: "/channels/whatsapp/claude-aws",
  channelTelegram: "/channels/telegram",
  channelTelegramLangchain: "/channels/telegram/langchain",
  channelTelegramAiSdk: "/channels/telegram/ai-sdk",
  channelTelegramChatSdk: "/channels/telegram/chat-sdk",
  channelTelegramCustomCode: "/channels/telegram/custom-code",
  channelTelegramClaude: "/channels/telegram/claude",
  channelTelegramClaudeAws: "/channels/telegram/claude-aws",
  channelMicrosoftTeams: "/channels/microsoft-teams",
  channelMicrosoftTeamsLangchain: "/channels/microsoft-teams/langchain",
  channelMicrosoftTeamsAiSdk: "/channels/microsoft-teams/ai-sdk",
  channelMicrosoftTeamsChatSdk: "/channels/microsoft-teams/chat-sdk",
  channelMicrosoftTeamsCustomCode: "/channels/microsoft-teams/custom-code",
  channelMicrosoftTeamsClaude: "/channels/microsoft-teams/claude",
  channelMicrosoftTeamsClaudeAws: "/channels/microsoft-teams/claude-aws",
  channelEmail: "/channels/email",
  channelEmailLangchain: "/channels/email/langchain",
  channelEmailAiSdk: "/channels/email/ai-sdk",
  channelEmailChatSdk: "/channels/email/chat-sdk",
  channelEmailCustomCode: "/channels/email/custom-code",
  channelEmailClaude: "/channels/email/claude",
  channelEmailClaudeAws: "/channels/email/claude-aws",
  channelIMessage: "/channels/imessage",
  channelIMessageLangchain: "/channels/imessage/langchain",
  channelIMessageAiSdk: "/channels/imessage/ai-sdk",
  channelIMessageChatSdk: "/channels/imessage/chat-sdk",
  channelIMessageCustomCode: "/channels/imessage/custom-code",
  channelIMessageClaude: "/channels/imessage/claude",
  channelIMessageClaudeAws: "/channels/imessage/claude-aws",

  // PREVIOUS WEBSITE

  // Pages
  index: "/",
  blog: "/blog",
  blogCategory: "/blog/category",
  blogRss: "/blog/rss.xml",
  careers: "/careers",
  community: "/community",
  comparisonCourier: "/comparison/courier",
  comparisonKnock: "/comparison/knock",
  comparisonMagicBell: "/comparison/magicbell",
  comparisonSuprSend: "/comparison/suprsend",
  comparisonInHouse: "/comparison/building-in-house",
  contactUs: "/contact-us",
  contributors: "/contributors",
  digest: "/digest",
  framework: "/framework",
  inbox: "/inbox",
  pricing: "/pricing",
  security: "/security",
  useCases: "/usecases",

  // Legal
  dataProcessingAgreement: "/dpa",
  privacyPolicy: "/privacy",
  termsOfUse: "/terms",

  // Dashboard
  dashboard: "https://dashboard.novu.co",
  dashboardV2: "https://dashboard.novu.co",
  dashboardV2SignIn: "https://dashboard.novu.co",
  dashboardV2SignUp: "https://dashboard.novu.co",
  dashboardV2AgentsSignUp:
    "https://dashboard.novu.co/auth/sign-up?product_type=agents",
  workflows: "https://dashboard.novu.co/workflows",

  // Other services
  connectApp: "https://connect.novu.co",
  bookMeeting: "https://novu.co/contact-us/",
  handbook: "https://handbook.novu.co",
  roadmap: "https://roadmap.novu.co",
  statusPage: "https://novustatus.com",
  trustPage: "https://trust.novu.co",

  // Social
  applePodcasts:
    "https://podcasts.apple.com/il/podcast/sourcelife/id1632801980",
  discord: "https://discord.gg/novu?utm_campaign=website",
  github: "https://github.com/novuhq/novu?utm_campaign=website",
  githubIssues: "https://github.com/novuhq/novu/issues",
  githubSkills: "https://github.com/novuhq/skills",
  pixelPoint: "https://pixelpoint.io/",
  spotify: "https://open.spotify.com/show/2OyQJkn07lnJPNdxFWft96",
  twitter: "https://twitter.com/novuhq?utm_campaign=website",

  // Docs
  docs: "https://docs.novu.co/",
  docsApis: "https://docs.novu.co/api-reference",
  docsContentManagement:
    "https://docs.novu.co/platform/workflow/add-notification-content/channels-template-editors",
  docsCustomCode: "https://docs.novu.co/agents/get-started/what-is-aci",
  docsDigest: "https://docs.novu.co/platform/workflow/digest",
  docsFramework: "https://docs.novu.co/framework/introduction",
  docsGuides: "https://docs.novu.co/guides",
  docsInApp: "https://docs.novu.co/platform/inbox",
  docsInboxLocalization:
    "https://docs.novu.co/platform/inbox/advanced-features/localization",
  docsInboxPreferences:
    "https://docs.novu.co/platform/inbox/configuration/preferences",
  docsInboxSetup: "https://docs.novu.co/platform/inbox/setup-inbox",
  docsInboxSnooze: "https://docs.novu.co/platform/inbox/features/snooze",
  docsInboxStyling: "https://docs.novu.co/platform/inbox/configuration/styling",
  docsInboxTabs: "https://docs.novu.co/platform/inbox/configuration/tabs",
  docsMcp: "https://docs.novu.co/platform/additional-resources/mcp",
  docsNotifications: "https://docs.novu.co/platform/sdks/react",
  docsOverview: "https://docs.novu.co/platform",
  docsProviders:
    "https://docs.novu.co/platform/integrations?utm_campaign=website",
  docsQuickStart:
    "https://docs.novu.co/platform/quickstart/nextjs?utm_campaign=website",
  docsSdks: "https://docs.novu.co/platform/sdks",
  docsSelfHosting: "https://docs.novu.co/community/self-hosting-novu/overview",
  docsUserPreferences:
    "https://docs.novu.co/platform/sdks/react/hooks/use-preferences",
  docsWorkflow: "https://docs.novu.co/platform/workflow",
}
