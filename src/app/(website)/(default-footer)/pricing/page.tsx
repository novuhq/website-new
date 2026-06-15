import { Metadata } from "next"
import { SEO_DATA } from "@/constants/seo-data"

import { getMetadata } from "@/lib/get-metadata"
import PricingPageContent from "@/components/pages/pricing/pricing-page-content"

const faqItems = [
  {
    question: "What is a workflow run?",
    answer:
      "A workflow run is one execution of a workflow. Triggering a workflow to a single subscriber counts as 1 run; triggering to a topic with 100 subscribers counts as 100 runs after fan-out.",
  },
  {
    question: "How is pricing calculated?",
    answer:
      "Pricing is based on the total number of workflow runs executed across all environments each month.",
  },
  {
    question: "What happens if I exceed my monthly workflow run limit?",
    answer:
      "We never stop or throttle your notifications. Usage above your plan rolls into on-demand pricing or, for Enterprise, your contract rate.",
  },
  {
    question: "Do you charge per notification or per user?",
    answer:
      "No. Billing is per workflow run, not per user or message. Subscribers are unlimited on paid plans.",
  },
  {
    question: "Can I use Novu free of charge?",
    answer:
      "Yes. Novu Cloud is free up to 10,000 workflow runs per month. You can also self-host the open-source Novu Project.",
  },
  {
    question: "Do you offer annual or volume discounts?",
    answer:
      "Yes. We offer reduced annual pricing and volume-based tiers. Enterprise customers receive custom bundle pricing.",
  },
  {
    question:
      "Which regions do you support and how is data residency handled?",
    answer:
      "All plans support US and EU regions. Enterprise can use additional regions (Singapore, UK, Australia, Japan, South Korea) or request custom regions/VPC hosting.",
  },
  {
    question: "Is Novu HIPAA compliant? Do you sign BAAs?",
    answer:
      "Yes. Enterprise plans include HIPAA compliance with a signed BAA. SOC 2 Type II and ISO 27001 certifications are available on Business and Enterprise.",
  },
  {
    question: "What data does Novu store and log?",
    answer:
      "Novu stores workflow definitions, subscriber profiles, and delivery logs. Message content is retained based on your plan's log-retention window. Enterprise customers can configure custom retention policies and data residency.",
  },
  {
    question: "What is your Service Level Agreement (SLA)?",
    answer:
      "Business plans include 99.9% uptime SLA. Enterprise plans offer 99.99% SLA with dedicated support and custom terms.",
  },
  {
    question: "Do you offer an Enterprise plan?",
    answer:
      "Yes. Enterprise includes custom workflow-run volume, premium SLA, dedicated support, SSO/SAML, RBAC, audit logs, and optional on-prem or VPC deployment.",
  },
  {
    question: "Does Novu support multi-tenant applications?",
    answer:
      "Yes. Novu supports multi-tenancy with per-tenant branding, configurations, and channel routing. Enterprise adds tenant-level analytics.",
  },
  {
    question: "How hard is it to migrate to Novu?",
    answer:
      "Most teams integrate Novu in under a day. Our SDK supports Node.js, Python, Go, PHP, Ruby, and .NET. Dedicated migration support is included on Enterprise.",
  },
  {
    question: "How many notifications can I send on Novu Cloud?",
    answer:
      "There is no hard cap on message volume. Plans are billed by workflow runs; each run can fan out to multiple channels and subscribers.",
  },
]

const siteUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || "https://novu.co"

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
}

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Novu",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: `${siteUrl}/pricing/`,
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "USD",
      description: "Up to 10,000 workflow runs per month",
    },
    {
      "@type": "Offer",
      name: "Business",
      price: "250",
      priceCurrency: "USD",
      description: "For growing teams with advanced notification needs",
    },
    {
      "@type": "Offer",
      name: "Enterprise",
      description:
        "Custom pricing with premium SLA, dedicated support, and advanced security",
    },
  ],
}

async function PricingPage() {
  return (
    <>
      <PricingPageContent />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  )
}

export default PricingPage

export const metadata: Metadata = getMetadata(SEO_DATA.pricing)

export const revalidate = 90
