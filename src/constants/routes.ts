import type { Route } from "next"

export const ROUTE: Record<string, Route<string> | URL> = {
  // API
  apiHubspot: "/api/hubspot",

  // CURRENT WEBSITE
  changelog: "/changelog",
  customers: "/customers",

  // PREVIOUS WEBSITE

  // Pages
  index: "/",
  blog: "/blog",
  blogCategory: "/blog/category",
  blogRss: "/blog/rss.xml",
  community: "/community",
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
  dashboardV2: "https://dashboard-v2.novu.co",
  dashboardV2SignIn: "https://dashboard-v2.novu.co/auth/sign-in",
  dashboardV2SignUp: "https://dashboard-v2.novu.co/auth/sign-up",

  // Other services
  bookMeeting:
    "https://notify.novu.co/meetings/novuhq/novu-discovery-session-rr",
  careers: "https://careers.novu.co",
  handbook: "https://handbook.novu.co",
  roadmap: "https://roadmap.novu.co",
  statusPage: "https://novustatus.com",
  trustPage: "https://trust.novu.co",

  // Social
  applePodcasts:
    "https://podcasts.apple.com/il/podcast/sourcelife/id1632801980",
  discord: "https://discord.gg/novu?utm_campaign=website",
  github: "https://github.com/novuhq/novu?utm_campaign=website",
  pixelPoint: "https://pixelpoint.io/",
  spotify: "https://open.spotify.com/show/2OyQJkn07lnJPNdxFWft96",
  twitter: "https://twitter.com/novuhq?utm_campaign=website",

  // Docs
  docs: "https://docs.novu.co/",
  docsApis: "https://docs.novu.co/api-reference/overview",
  docsContentManagement: "https://docs.novu.co/workflow/template-editor",
  docsFramework: "https://docs.novu.co/framework/overview",
  docsGuides: "https://docs.novu.co/guides/overview",
  docsInApp: "https://docs.novu.co/inbox/introduction",
  docsNotifications:
    "https://docs.novu.co/platform/inbox/react/components/notifications",
  docsOverview: "https://docs.novu.co/platform/overview",
  docsProviders:
    "https://docs.novu.co/channels-and-providers/introduction?utm_campaign=website",
  docsQuickStart:
    "https://docs.novu.co/quickstarts/01-introduction?utm_campaign=website",
  docsSdks: "https://docs.novu.co/sdks/overview",
  docsUserPreferences:
    "https://docs.novu.co/inbox/react/components/preferences",
  docsWorkflow: "https://docs.novu.co/workflows/notification-workflows",
}
