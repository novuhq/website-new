import { ROUTE } from "@/constants/routes"

import { IMenuSocialItem } from "@/types/common"

export const MENUS = {
  header: [
    {
      title: "Product",
      content: [
        {
          subtitle: "Features",
          items: [
            { label: "Inbox Component", href: ROUTE.inbox },
            { label: "User Preference", href: ROUTE.docsUserPreferences },
            { label: "Workflows", href: ROUTE.docsWorkflow },
            { label: "Framework", href: ROUTE.framework },
            { label: "Digest", href: ROUTE.digest },
            { label: "Content Management", href: ROUTE.docsContentManagement },
          ],
        },
        {
          subtitle: "Changelog news",
          type: "changelog" as const,
        },
      ],
    },
    {
      title: "Resources",
      content: [
        {
          subtitle: "Explore",
          items: [
            { label: "Use Cases", href: ROUTE.useCases },
            { label: "Blog", href: ROUTE.blog },
            { label: "Changelog", href: ROUTE.changelog },
            { label: "Roadmap", href: ROUTE.roadmap },
            { label: "Support", href: ROUTE.contactUs },
            { label: "Discord", href: ROUTE.discord },
          ],
        },
        {
          subtitle: "Latest post",
          type: "blog" as const,
        },
      ],
    },
    {
      title: "Docs",
      content: [
        {
          subtitle: "Topics",
          items: [
            { label: "Documentation", href: ROUTE.docs },
            { label: "Guides", href: ROUTE.docsGuides },
            { label: "Framework", href: ROUTE.docsFramework },
            { label: "API Reference", href: ROUTE.docsApis },
            { label: "SDKs", href: ROUTE.docsSdks },
          ],
        },
        {
          subtitle: "Quickstart",
          type: "link" as const,
          card: {
            title: "Getting started",
            description:
              "This guide walks you through integrating Novu's Inbox",
            image: "/images/header/illustration-docs.jpg",
            href: ROUTE.docsOverview,
          },
        },
      ],
    },
    {
      title: "Pricing",
      href: ROUTE.pricing,
    },
    {
      title: "Contact Us",
      href: ROUTE.contactUs,
    },
  ],
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
          { label: "Digest", href: ROUTE.digest, isNew: true },
          {
            label: "Content Management",
            href: ROUTE.docsContentManagement,
            isNew: false,
          },
          {
            label: "Notifications Directory",
            href: ROUTE.docsNotifications,
            isNew: false,
          },
        ],
      },
      {
        title: "Resources",
        items: [
          { label: "Documentation", href: ROUTE.docs, isNew: true },
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
