import { INTEGRATION_MENU_ITEMS } from "@/constants/integration-menu"
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
              children: [
                { label: "Inbox", href: ROUTE.inbox },
                { label: "Workflows", href: ROUTE.docsWorkflow },
                { label: "Digest", href: ROUTE.digest },
                { label: "User preferences", href: ROUTE.docsUserPreferences },
                {
                  label: "Content management",
                  href: ROUTE.docsContentManagement,
                },
                { label: "Framework", href: ROUTE.framework },
              ],
            },
            {
              label: "Novu Connect",
              description: "Connect AI agents with customers",
              href: ROUTE.connect,
              children: [
                {
                  label: "Agent Communication Infrastructure",
                  href: ROUTE.aci,
                },
                { label: "Agent templates", href: ROUTE.connectTemplates },
                {
                  label: "Agent-assigned workflows",
                  href: ROUTE.noReplyIsDead,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Integrations",
      variant: "integrations",
      content: [
        {
          items: INTEGRATION_MENU_ITEMS,
        },
      ],
    },
    {
      title: "Build with AI",
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
            {
              label: "Skills",
              href: ROUTE.githubSkills,
              menuIcon: "skills",
            },
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
              label: "Community",
              href: ROUTE.community,
              menuIcon: "community",
            },
            {
              label: "Changelog",
              href: ROUTE.changelog,
              menuIcon: "changelog",
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
            { label: "GitHub", href: ROUTE.github, menuIcon: "github" },
          ],
        },
        {
          subtitle: "Company",
          items: [
            { label: "About", href: ROUTE.handbook, menuIcon: "about" },
            { label: "Careers", href: ROUTE.careers, menuIcon: "careers" },
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
      title: "Customers",
      href: ROUTE.customers,
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
