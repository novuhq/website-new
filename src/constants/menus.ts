import { ROUTE } from "@/constants/routes"

import { IMenuHeaderItem, IMenuSocialItem } from "@/types/common"

export const MENUS = {
  header: [
    {
      title: "Product",
      variant: "product",
      content: [
        {
          items: [
            {
              label: "Novu Notify",
              description: "Notification center for your app",
              href: ROUTE.inbox,
            },
            {
              label: "Novu Connect",
              description: "Connect AI agents with customers",
              href: ROUTE.connect,
            },
          ],
        },
      ],
    },
    {
      title: "Solutions",
      variant: "solutions",
      content: [
        {
          items: [
            {
              label: "For AI Agents",
              href: ROUTE.connect,
              menuIcon: "agents",
            },
            {
              label: "For App Notifications",
              href: ROUTE.inbox,
              menuIcon: "notifications",
            },
            {
              label: "For Builders",
              href: ROUTE.docsOverview,
              menuIcon: "builders",
            },
            {
              label: "For Enterprise",
              href: ROUTE.contactUs,
              menuIcon: "enterprise",
            },
          ],
        },
      ],
    },
    {
      title: "Channels",
      variant: "channels",
      content: [
        {
          items: [
            {
              label: "Slack",
              href: ROUTE.channelSlack,
              menuIcon: "slack",
            },
            {
              label: "WhatsApp",
              href: ROUTE.channelWhatsApp,
              menuIcon: "whatsapp",
            },
            {
              label: "Telegram",
              href: ROUTE.channelTelegram,
              menuIcon: "telegram",
            },
            {
              label: "MS Teams",
              href: ROUTE.channelMicrosoftTeams,
              menuIcon: "teams",
            },
            {
              label: "iMessage",
              href: ROUTE.connect,
              menuIcon: "imessage",
            },
            { label: "Email", href: ROUTE.channelEmail, menuIcon: "email" },
            { label: "Inbox", href: ROUTE.inbox, menuIcon: "inbox" },
            {
              label: "Push",
              href: ROUTE.integrationsChannels,
              menuIcon: "push",
            },
            {
              label: "Chat",
              href: ROUTE.integrationsChannels,
              menuIcon: "chat",
            },
            {
              label: "SMS",
              href: ROUTE.integrationsChannels,
              menuIcon: "sms",
            },
          ],
        },
      ],
    },
    {
      title: "AI",
      variant: "ai",
      content: [
        {
          items: [
            { label: "MCP", href: ROUTE.mcp, menuIcon: "mcp" },
            {
              label: "Novu Copilot",
              href: ROUTE.copilot,
              menuIcon: "copilot",
            },
            { label: "Novu ACI", href: ROUTE.aci, menuIcon: "aci" },
            { label: "Prompt", href: ROUTE.mcp, menuIcon: "prompt" },
            {
              label: "Skills",
              href: ROUTE.githubSkills,
              menuIcon: "skills",
            },
            { label: "Claude", href: ROUTE.docsMcp, menuIcon: "claude" },
            { label: "Codex", href: ROUTE.docsMcp, menuIcon: "codex" },
            { label: "Cursor", href: ROUTE.docsMcp, menuIcon: "cursor" },
          ],
        },
      ],
    },
    {
      title: "Resources",
      variant: "resources",
      content: [
        {
          subtitle: "Discover",
          items: [
            { label: "Blog", href: ROUTE.blog, menuIcon: "blog" },
            {
              label: "Customers",
              href: ROUTE.customers,
              menuIcon: "customers",
            },
            {
              label: "Community",
              href: ROUTE.community,
              menuIcon: "community",
            },
            {
              label: "Changelog",
              href: ROUTE.changelog,
              menuIcon: "changelog",
            },
            {
              label: "History of Notification",
              href: ROUTE.blog,
              menuIcon: "history",
            },
          ],
        },
        {
          subtitle: "Developers",
          items: [
            {
              label: "Documentation",
              href: ROUTE.docs,
              menuIcon: "documentation",
            },
            { label: "API Reference", href: ROUTE.docsApis, menuIcon: "api" },
            {
              label: "SDKs & Frameworks",
              href: ROUTE.docsSdks,
              menuIcon: "sdks",
            },
            {
              label: "Integrations",
              href: ROUTE.integrations,
              menuIcon: "integrations",
            },
            { label: "GitHub", href: ROUTE.github, menuIcon: "github" },
          ],
        },
        {
          subtitle: "Company",
          items: [
            { label: "About", href: ROUTE.handbook, menuIcon: "about" },
            { label: "Careers", href: ROUTE.careers, menuIcon: "careers" },
            {
              label: "Brand Assets",
              href: ROUTE.github,
              menuIcon: "brand",
            },
            { label: "Status", href: ROUTE.statusPage, menuIcon: "status" },
            {
              label: "Contact us",
              href: ROUTE.contactUs,
              menuIcon: "contact",
            },
          ],
        },
      ],
    },
    {
      title: "Pricing",
      href: ROUTE.pricing,
    },
  ] satisfies IMenuHeaderItem[],
  footer: {
    main: [
      {
        title: "Product",
        items: [
          { label: "Inbox Component", href: ROUTE.inbox, isNew: false },
          {
            label: "User Preference",
            href: ROUTE.docsUserPreferences,
            isNew: false,
          },
          { label: "Workflows", href: ROUTE.docsWorkflow, isNew: false },
          { label: "Framework", href: ROUTE.framework, isNew: false },
          { label: "Digest", href: ROUTE.digest, isNew: false },
          {
            label: "Content Management",
            href: ROUTE.docsContentManagement,
            isNew: false,
          },
          { label: "Integrations", href: ROUTE.integrations, isNew: false },
          {
            label: "Notifications Directory",
            href: ROUTE.docsNotifications,
            isNew: false,
          },
          {
            label: "Novu Copilot",
            href: ROUTE.copilot,
          },
          {
            label: "Novu MCP",
            href: ROUTE.mcp,
          },
          { label: "Novu ACI", href: ROUTE.aci, isNew: true },
        ],
      },
      {
        title: "Resources",
        items: [
          { label: "Documentation", href: ROUTE.docs, isNew: false },
          { label: "Blog", href: ROUTE.blog, isNew: false },
          { label: "Use Cases", href: ROUTE.useCases, isNew: false },
          { label: "Changelog", href: ROUTE.changelog, isNew: false },
          { label: "Roadmap", href: ROUTE.roadmap, isNew: false },
          { label: "Support", href: ROUTE.contactUs, isNew: false },
          {
            label: "Security & Compliance",
            href: ROUTE.security,
            isNew: false,
          },
          { label: "Pricing", href: ROUTE.pricing, isNew: false },
          { label: "Customers", href: ROUTE.customers, isNew: false },
        ],
      },
      {
        title: "Comparison",
        items: [
          {
            label: "Novu vs Courier",
            href: ROUTE.comparisonCourier,
            isNew: false,
          },
          { label: "Novu vs Knock", href: ROUTE.comparisonKnock, isNew: false },
          {
            label: "Novu vs MagicBell",
            href: ROUTE.comparisonMagicBell,
            isNew: false,
          },
          {
            label: "Novu vs SuprSend",
            href: ROUTE.comparisonSuprSend,
            isNew: false,
          },
          {
            label: "Novu vs In-house",
            href: ROUTE.comparisonInHouse,
            isNew: false,
          },
        ],
      },
      {
        title: "Company",
        items: [
          { label: "Community", href: ROUTE.community, isNew: false },
          { label: "Contributors", href: ROUTE.contributors, isNew: false },
          { label: "Careers", href: ROUTE.careers, isNew: false },
          { label: "Handbook", href: ROUTE.handbook, isNew: false },
          { label: "Contact Us", href: ROUTE.contactUs, isNew: false },
        ],
      },
    ],
    legal: [
      { label: "Terms of Use", href: ROUTE.termsOfUse },
      { label: "Privacy Policy", href: ROUTE.privacyPolicy },
      { label: "DPA", href: ROUTE.dataProcessingAgreement },
    ],
    social: [
      {
        href: ROUTE.twitter,
        label: "Follow us on X",
        icon: "x",
      },
      {
        href: ROUTE.github,
        label: "Follow us on GitHub",
        icon: "github",
      },
      {
        href: ROUTE.discord,
        label: "Join us on Discord",
        icon: "discord",
      },
    ] as IMenuSocialItem[],
  },
}
