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
      title: "Channels",
      variant: "channels",
      content: [
        {
          items: [
            {
              label: "Slack",
              href: ROUTE.channelSlack,
              menuIcon: "slack",
              children: [
                {
                  label: "LangChain",
                  href: ROUTE.channelSlackLangchain,
                  menuIcon: "langchain",
                },
                {
                  label: "Vercel AI SDK",
                  href: ROUTE.channelSlackAiSdk,
                  menuIcon: "ai-sdk",
                },
                {
                  label: "Chat SDK",
                  href: ROUTE.channelSlackChatSdk,
                  menuIcon: "chat-sdk",
                },
                {
                  label: "Custom code",
                  href: ROUTE.channelSlackCustomCode,
                  menuIcon: "custom-code",
                },
                {
                  label: "Claude Managed Agent",
                  href: ROUTE.channelSlackClaude,
                  menuIcon: "claude",
                },
                {
                  label: "AWS Claude Managed Agent",
                  href: ROUTE.channelSlackClaudeAws,
                  menuIcon: "claude-aws",
                },
              ],
            },
            {
              label: "WhatsApp",
              href: ROUTE.channelWhatsApp,
              menuIcon: "whatsapp",
              children: [
                {
                  label: "LangChain",
                  href: ROUTE.channelWhatsAppLangchain,
                  menuIcon: "langchain",
                },
                {
                  label: "Vercel AI SDK",
                  href: ROUTE.channelWhatsAppAiSdk,
                  menuIcon: "ai-sdk",
                },
                {
                  label: "Chat SDK",
                  href: ROUTE.channelWhatsAppChatSdk,
                  menuIcon: "chat-sdk",
                },
                {
                  label: "Custom code",
                  href: ROUTE.channelWhatsAppCustomCode,
                  menuIcon: "custom-code",
                },
                {
                  label: "Claude Managed Agent",
                  href: ROUTE.channelWhatsAppClaude,
                  menuIcon: "claude",
                },
                {
                  label: "AWS Claude Managed Agent",
                  href: ROUTE.channelWhatsAppClaudeAws,
                  menuIcon: "claude-aws",
                },
              ],
            },
            {
              label: "Telegram",
              href: ROUTE.channelTelegram,
              menuIcon: "telegram",
              children: [
                {
                  label: "LangChain",
                  href: ROUTE.channelTelegramLangchain,
                  menuIcon: "langchain",
                },
                {
                  label: "Vercel AI SDK",
                  href: ROUTE.channelTelegramAiSdk,
                  menuIcon: "ai-sdk",
                },
                {
                  label: "Chat SDK",
                  href: ROUTE.channelTelegramChatSdk,
                  menuIcon: "chat-sdk",
                },
                {
                  label: "Custom code",
                  href: ROUTE.channelTelegramCustomCode,
                  menuIcon: "custom-code",
                },
                {
                  label: "Claude Managed Agent",
                  href: ROUTE.channelTelegramClaude,
                  menuIcon: "claude",
                },
                {
                  label: "AWS Claude Managed Agent",
                  href: ROUTE.channelTelegramClaudeAws,
                  menuIcon: "claude-aws",
                },
              ],
            },
            {
              label: "MS Teams",
              href: ROUTE.channelMicrosoftTeams,
              menuIcon: "teams",
              children: [
                {
                  label: "LangChain",
                  href: ROUTE.channelMicrosoftTeamsLangchain,
                  menuIcon: "langchain",
                },
                {
                  label: "Vercel AI SDK",
                  href: ROUTE.channelMicrosoftTeamsAiSdk,
                  menuIcon: "ai-sdk",
                },
                {
                  label: "Chat SDK",
                  href: ROUTE.channelMicrosoftTeamsChatSdk,
                  menuIcon: "chat-sdk",
                },
                {
                  label: "Custom code",
                  href: ROUTE.channelMicrosoftTeamsCustomCode,
                  menuIcon: "custom-code",
                },
                {
                  label: "Claude Managed Agent",
                  href: ROUTE.channelMicrosoftTeamsClaude,
                  menuIcon: "claude",
                },
                {
                  label: "AWS Claude Managed Agent",
                  href: ROUTE.channelMicrosoftTeamsClaudeAws,
                  menuIcon: "claude-aws",
                },
              ],
            },
            {
              label: "Email",
              href: ROUTE.channelEmail,
              menuIcon: "email",
              children: [
                {
                  label: "LangChain",
                  href: ROUTE.channelEmailLangchain,
                  menuIcon: "langchain",
                },
                {
                  label: "Vercel AI SDK",
                  href: ROUTE.channelEmailAiSdk,
                  menuIcon: "ai-sdk",
                },
                {
                  label: "Chat SDK",
                  href: ROUTE.channelEmailChatSdk,
                  menuIcon: "chat-sdk",
                },
                {
                  label: "Custom code",
                  href: ROUTE.channelEmailCustomCode,
                  menuIcon: "custom-code",
                },
                {
                  label: "Claude Managed Agent",
                  href: ROUTE.channelEmailClaude,
                  menuIcon: "claude",
                },
                {
                  label: "AWS Claude Managed Agent",
                  href: ROUTE.channelEmailClaudeAws,
                  menuIcon: "claude-aws",
                },
              ],
            },
            {
              label: "iMessage",
              href: ROUTE.channelIMessage,
              menuIcon: "imessage",
              children: [
                {
                  label: "LangChain",
                  href: ROUTE.channelIMessageLangchain,
                  menuIcon: "langchain",
                },
                {
                  label: "Vercel AI SDK",
                  href: ROUTE.channelIMessageAiSdk,
                  menuIcon: "ai-sdk",
                },
                {
                  label: "Chat SDK",
                  href: ROUTE.channelIMessageChatSdk,
                  menuIcon: "chat-sdk",
                },
                {
                  label: "Custom code",
                  href: ROUTE.channelIMessageCustomCode,
                  menuIcon: "custom-code",
                },
                {
                  label: "Claude Managed Agent",
                  href: ROUTE.channelIMessageClaude,
                  menuIcon: "claude",
                },
                {
                  label: "AWS Claude Managed Agent",
                  href: ROUTE.channelIMessageClaudeAws,
                  menuIcon: "claude-aws",
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
            {
              label: "Email for AI agents",
              href: ROUTE.emailForAiAgents,
              menuIcon: "aci",
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
          {
            label: "Email for AI agents",
            href: ROUTE.emailForAiAgents,
            isNew: true,
          },
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
