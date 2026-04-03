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
  dashboardV2SignIn: "https://dashboard.novu.co/auth/sign-in",
  dashboardV2SignUp: "https://dashboard.novu.co/auth/sign-up",

  // Other services
  bookMeeting: "https://novu.co/contact-us/",
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
  docsApis: "https://docs.novu.co/api-reference",
  docsContentManagement:
    "https://docs.novu.co/platform/workflow/add-notification-content/channels-template-editors",
  docsFramework: "https://docs.novu.co/framework/introduction",
  docsGuides: "https://docs.novu.co/guides",
  docsInApp: "https://docs.novu.co/platform/inbox",
  docsNotifications: "https://docs.novu.co/platform/sdks/react",
  docsOverview: "https://docs.novu.co/platform",
  docsProviders:
    "https://docs.novu.co/platform/integrations?utm_campaign=website",
  docsQuickStart:
    "https://docs.novu.co/platform/quickstart/nextjs?utm_campaign=website",
  docsSdks: "https://docs.novu.co/platform/sdks",
  docsUserPreferences:
    "https://docs.novu.co/platform/sdks/react/hooks/use-preferences",
  docsWorkflow: "https://docs.novu.co/platform/workflow",
}
