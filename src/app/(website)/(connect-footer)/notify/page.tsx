import type { Metadata } from "next"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"
import { HOME_COMPLIANCE, HOME_FEATURED_CUSTOMERS } from "@/data/pages/home"
import {
  NOTIFY_COMMAND,
  NOTIFY_CTA,
  NOTIFY_EXPLORE,
  NOTIFY_FAQ,
  NOTIFY_FEATURE_SECTIONS,
  NOTIFY_HERO,
  NOTIFY_INBOX_PROMPT,
  NOTIFY_INBOX_SECTION,
  NOTIFY_PROMPT,
  NOTIFY_PROVIDERS_SECTION,
} from "@/data/pages/notify"
import notifyFeaturedBackground from "@/images/pages/home/bento-notify-featured-bg.png"
import notifyDigestGraphic from "@/images/pages/home/novu-notify/digest.jpg"
import notifyPreferencesGraphic from "@/images/pages/home/novu-notify/preferences.jpg"
import notifyWorkflowGraphic from "@/images/pages/home/novu-notify/workflow.jpg"
import nextjsIcon from "@/svgs/pages/home/inbox/nextjs.svg"
import reactIcon from "@/svgs/pages/home/inbox/react.svg"
import remixIcon from "@/svgs/pages/home/inbox/remix.svg"

import { getMetadata } from "@/lib/get-metadata"
import { getIntegrationsByTab } from "@/lib/integrations"
import { safeJsonLdStringify } from "@/lib/json-ld"
import { highlightEchoCode } from "@/lib/shiki"
import { absoluteUrl, toCanonicalPathname } from "@/lib/site-url"
import FAQ from "@/components/pages/faq"
import Compliance from "@/components/pages/home/compliance"
import Cta from "@/components/pages/home/cta"
import FeaturedCustomers from "@/components/pages/home/featured-customers"
import ExploreLinks from "@/components/pages/notify/explore-links"
import NotifyFeatureSplit from "@/components/pages/notify/feature-split"
import NotifyHero from "@/components/pages/notify/hero"
import InboxSection from "@/components/pages/notify/inbox-section"
import ProvidersSection from "@/components/pages/notify/providers-section"
import SectionWithLogosAnimated from "@/components/section-with-logos-animated"

const notifyCodeTabs = [
  {
    title: "Next.js",
    code: `import React from 'react';
import { Inbox } from '@novu/nextjs';

export function NotificationInbox() {
  return (
    <Inbox />
  );
}`,
    icon: nextjsIcon,
  },
  {
    title: "Remix",
    code: `import React from 'react';
import { Inbox } from '@novu/react';

export function NotificationInbox() {
  return (
    <Inbox />
  );
}`,
    icon: remixIcon,
  },
  {
    title: "React",
    code: `import React from 'react';
import { Inbox } from '@novu/react';

export function NotificationInbox() {
  return (
    <Inbox />
  );
}`,
    icon: reactIcon,
  },
]

const featureSectionImages = {
  digest: notifyDigestGraphic,
  preferences: notifyPreferencesGraphic,
  workflows: notifyWorkflowGraphic,
} as const

export const metadata: Metadata = getMetadata(SEO_DATA.notify)

const SITE_URL = absoluteUrl("/")
const PAGE_URL = absoluteUrl(toCanonicalPathname(String(ROUTE.notify)))
const ORGANIZATION_ID = `${SITE_URL}#organization`
const WEBSITE_ID = `${SITE_URL}#website`
const WEB_PAGE_ID = `${PAGE_URL}#webpage`
const FAQ_ID = `${PAGE_URL}#faq`
const BREADCRUMB_ID = `${PAGE_URL}#breadcrumb`

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": WEB_PAGE_ID,
      name: SEO_DATA.notify.title,
      description: SEO_DATA.notify.description,
      url: PAGE_URL,
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORGANIZATION_ID },
      breadcrumb: { "@id": BREADCRUMB_ID },
      mainEntity: [{ "@id": FAQ_ID }],
    },
    {
      "@type": "FAQPage",
      "@id": FAQ_ID,
      mainEntity: NOTIFY_FAQ.accordion.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": BREADCRUMB_ID,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Novu",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Novu Notify",
          item: PAGE_URL,
        },
      ],
    },
  ],
}

export default async function NotifyPage() {
  const [highlightedNotifyCodeTabs, channelIntegrations] = await Promise.all([
    Promise.all(
      notifyCodeTabs.map(async (tab) => ({
        ...tab,
        highlightedHtml: await highlightEchoCode(tab.code),
      }))
    ),
    getIntegrationsByTab("channels"),
  ])

  const providersByCategory = channelIntegrations.reduce<
    Record<string, typeof channelIntegrations>
  >((acc, integration) => {
    ;(acc[integration.category] ??= []).push(integration)
    return acc
  }, {})

  return (
    <div className="overflow-clip">
      <NotifyHero
        {...NOTIFY_HERO}
        command={NOTIFY_COMMAND}
        prompt={NOTIFY_PROMPT}
        codeTabs={highlightedNotifyCodeTabs}
        card={{
          ...NOTIFY_INBOX_SECTION.featured,
          backgroundImage: notifyFeaturedBackground,
        }}
      />
      <SectionWithLogosAnimated
        className="mt-16 mb-0 px-5 md:mt-20 md:mb-0 md:px-8 lg:mt-24 lg:mb-0 xl:mb-0"
        titleHighlight="Novu"
        title="is trusted by leading teams worldwide"
        titleSize="sm"
        titleClassName="leading-normal font-normal tracking-tighter"
        rows={2}
      />
      <InboxSection
        title={NOTIFY_INBOX_SECTION.title}
        description={NOTIFY_INBOX_SECTION.description}
        prompt={NOTIFY_INBOX_PROMPT}
        capabilities={NOTIFY_INBOX_SECTION.capabilities}
      />
      {NOTIFY_FEATURE_SECTIONS.map((section, index) => (
        <NotifyFeatureSplit
          key={section.key}
          label={section.label}
          title={section.title}
          description={section.description}
          bullets={section.bullets}
          links={section.links}
          linkClickLocation={`notify_${section.key}`}
          image={
            featureSectionImages[
              section.key as keyof typeof featureSectionImages
            ]
          }
          reverse={index % 2 === 1}
        />
      ))}
      <ProvidersSection
        {...NOTIFY_PROVIDERS_SECTION}
        providersByCategory={providersByCategory}
      />
      <FeaturedCustomers {...HOME_FEATURED_CUSTOMERS} />
      <ExploreLinks {...NOTIFY_EXPLORE} />
      <Compliance {...HOME_COMPLIANCE} />
      <FAQ
        {...NOTIFY_FAQ}
        className="md py-20 font-inter md:py-28 lg:py-36 xl:pt-50 xl:pb-10"
        titleClassName="tracking-plus-tight font-normal lg:text-[44px]"
        containerClassName="max-w-3xl lg:max-w-288 gap-y-5"
        variant="minimal"
        defaultOpenFirst
      />
      <Cta {...NOTIFY_CTA} command={NOTIFY_COMMAND} prompt={NOTIFY_PROMPT} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(jsonLdGraph),
        }}
      />
    </div>
  )
}
