import React from "react"
import logoBitmex from "@/images/pages/pricing/logos/bitmex.svg"
import logoBpp from "@/images/pages/pricing/logos/bpp.svg"
import logoCheckpoint from "@/images/pages/pricing/logos/checkpoint.svg"
import logoCloudSoftwareGroup from "@/images/pages/pricing/logos/cloud-software-group.svg"
import logoDeriv from "@/images/pages/pricing/logos/deriv.svg"
import logoDocplannerGroup from "@/images/pages/pricing/logos/docplanner-group.svg"
import logoEbury from "@/images/pages/pricing/logos/ebury.svg"
import logoElProffen from "@/images/pages/pricing/logos/el-proffen.svg"
import logoGuesty from "@/images/pages/pricing/logos/guesty.svg"
import logoHemnet from "@/images/pages/pricing/logos/hemnet.svg"
import logoInfluencer from "@/images/pages/pricing/logos/influencer.svg"
import logoJoyride from "@/images/pages/pricing/logos/joyride.svg"
import logoKantAkademi from "@/images/pages/pricing/logos/kant-akademi.svg"
import logoKarmacheck from "@/images/pages/pricing/logos/karmacheck.svg"
import logoKornFerry from "@/images/pages/pricing/logos/korn-ferry.svg"
import logoLottiefiles from "@/images/pages/pricing/logos/lottiefiles.svg"
import logoMedvol from "@/images/pages/pricing/logos/medvol.svg"
import logoMoises from "@/images/pages/pricing/logos/moises.svg"
import logoMongodb from "@/images/pages/pricing/logos/mongodb.svg"
import logoNamirial from "@/images/pages/pricing/logos/namirial.svg"
import logoNep from "@/images/pages/pricing/logos/nep.svg"
import logoNormative from "@/images/pages/pricing/logos/normative.svg"
import logoNovacy from "@/images/pages/pricing/logos/novacy.svg"
import logoQuorumCyber from "@/images/pages/pricing/logos/quorum-cyber.svg"
import logoRoche from "@/images/pages/pricing/logos/roche.svg"
import logoSherweb from "@/images/pages/pricing/logos/sherweb.svg"
import logoSinch from "@/images/pages/pricing/logos/sinch.svg"
import logoTatilbudur from "@/images/pages/pricing/logos/tatilbudur.svg"
import logoTenderd from "@/images/pages/pricing/logos/tenderd.svg"
import logoTrustflight from "@/images/pages/pricing/logos/trustflight.svg"
import logoUnified from "@/images/pages/pricing/logos/unified.svg"
import logoUnity from "@/images/pages/pricing/logos/unity.svg"
import logoUnops from "@/images/pages/pricing/logos/unops.svg"
import logoWaltonEnterprises from "@/images/pages/pricing/logos/walton-enterprises.svg"
import logoWhoppah from "@/images/pages/pricing/logos/whoppah.svg"

import type { IPricingPageData } from "@/types/pricing"

const renderScheduleCallButton = (
  onScheduleClick: (source: string) => void
) => (
  <button
    type="button"
    className="cursor-pointer text-primary hover:text-primary-muted"
    onClick={(e) => {
      e.preventDefault()
      onScheduleClick("pricing_faq")
    }}
  >
    Schedule a call
  </button>
)

export const pricingPageData: IPricingPageData = {
  _createdAt: "2025-11-24T15:18:07Z",
  _type: "pricing",
  _updatedAt: "2026-02-12T13:59:33Z",
  cta: {
    buttonText: "Schedule a call",
    buttonUrl: "https://dashboard-v2.novu.co/auth/sign-up",
    description:
      "Schedule a call with our team to find the perfect plan for your use case",
    text: "Not sure what plan fits your needs?",
  },
  faq: {
    accordion: {
      items: [
        {
          answer: (
            <p>
              A workflow run is one execution of a workflow. Triggering a
              workflow to a single subscriber counts as 1 run; triggering to a{" "}
              <a
                href="https://docs.novu.co/platform/concepts/topics"
                target="_blank"
                rel="noopener noreferrer"
              >
                topic
              </a>{" "}
              with 100 subscribers counts as 100 runs after fan-out.
            </p>
          ),
          question: "What is a workflow run?",
        },
        {
          answer: (
            <p>
              Pricing is based on the total number of workflow runs executed
              across all environments each month.
            </p>
          ),
          question: "How is pricing calculated?",
        },
        {
          answer: (onScheduleClick) => (
            <p>
              We never stop or throttle your notifications. Usage above your
              plan rolls into on‑demand pricing or, for Enterprise, your
              contract rate.{" "}
              <button
                type="button"
                className="cursor-pointer text-primary hover:text-primary-muted"
                onClick={(e) => {
                  e.preventDefault()
                  onScheduleClick("pricing_faq")
                }}
              >
                Schedule a call
              </button>
            </p>
          ),
          question: "What happens if I exceed my monthly workflow run limit?",
        },
        {
          answer: (
            <p>
              No. Billing is per workflow run, not per user or message.
              Subscribers are unlimited on paid plans.
            </p>
          ),
          question: "Do you charge per notification or per user?",
        },
        {
          answer: (
            <p>
              Yes. Novu Cloud is free up to 10,000 workflow runs per month. You
              can also self‑host the open‑source Novu Project.
            </p>
          ),
          question: "Can I use Novu free of charge?",
        },
        {
          answer: (onScheduleClick) => (
            <p>
              Yes. We offer reduced annual pricing and volume‑based tiers.
              Enterprise customers receive custom bundle pricing.{" "}
              {renderScheduleCallButton(onScheduleClick)}
            </p>
          ),
          question: "Do you offer annual or volume discounts?",
        },
        {
          answer: (onScheduleClick) => (
            <p>
              All plans support US and EU regions. Enterprise can use additional
              regions (Singapore, UK, Australia, Japan, South Korea) or request
              custom regions/VPC hosting.{" "}
              {renderScheduleCallButton(onScheduleClick)}
            </p>
          ),
          question:
            "Which regions do you support and how is data residency handled?",
        },
        {
          answer: (onScheduleClick) => (
            <p>
              Our Enterprise plan supports HIPAA compliance and BAAs.{" "}
              {renderScheduleCallButton(onScheduleClick)}
            </p>
          ),
          question: "Is Novu HIPAA compliant? Do you sign BAAs?",
        },
        {
          answer: (onScheduleClick) => (
            <p>
              We store only the data needed to deliver and display notifications
              (subscriber identifiers, channel addresses, metadata). Enterprise
              can request custom logging, deletion workflows, or bring‑your‑own
              database. {renderScheduleCallButton(onScheduleClick)}
            </p>
          ),
          question: "What data does Novu store and log?",
        },
        {
          answer: (
            <p>
              Cloud uptime SLA is 99.9%. Business and Enterprise plans include a
              support ticket SLA and a private Slack channel. Free tier and the
              Novu Project are supported via{" "}
              <a
                href="https://discord.novu.co"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </a>
            </p>
          ),
          question: "What is your Service Level Agreement (SLA)?",
        },
        {
          answer: (onScheduleClick) => (
            <p>
              Enterprise adds SLAs, advanced compliance and controls, and
              deployment options. {renderScheduleCallButton(onScheduleClick)}
            </p>
          ),
          question: "Do you offer an Enterprise plan?",
        },
        {
          answer: (onScheduleClick) => (
            <p>
              <a
                href="https://github.com/novuhq/novu"
                target="_blank"
                rel="noopener noreferrer"
              >
                The Novu Project
              </a>{" "}
              is the open‑source core you can run yourself. Novu Cloud is our
              managed, scalable service with SLAs and business features.
              Enterprise Self‑Hosted adds SSO, RBAC, audit logs, branding
              removal, Helm/Kubernetes tooling, and priority support.{" "}
              {renderScheduleCallButton(onScheduleClick)} to discuss which
              option fits your needs.
            </p>
          ),
          question:
            "What are the differences between Novu Cloud, Open Source, and Enterprise Self‑Hosted?",
        },
        {
          answer: (
            <p>
              Yes. Multi‑tenancy is supported with Contexts for per‑tenant
              providers, preferences, environments, and inbox segregation.
            </p>
          ),
          question: "Does Novu support multi‑tenant applications?",
        },
        {
          answer: (onScheduleClick) => (
            <p>
              Most teams migrate in stages: simple events → advanced workflows →
              preferences and Inbox. We can guide architecture reviews and
              transition planning. {renderScheduleCallButton(onScheduleClick)}
            </p>
          ),
          question: "How hard is it to migrate to Novu?",
        },
        {
          answer: (
            <p>
              Use our ready‑made Inbox or build your own with React, React
              Native, or any JS framework using our hooks‑only approach. Custom
              renderers and themes are supported.
            </p>
          ),
          question:
            "What is included in the Inbox component? Can I bring my own UI?",
        },
        {
          answer: (
            <p>
              Practically as many as you need. Throughput is usually constrained
              by your configured providers, not Novu Cloud.
            </p>
          ),
          question: "How many notifications can I send on Novu Cloud?",
        },
      ],
    },
    title: "Frequently asked questions",
  },
  hero: {
    _type: "pricingHero",
    title: "Flexible pricing for companies and developers",
    plans: [
      {
        _type: "pricingHeroCard",
        description:
          "A complete starter toolkit for exploring Novu and sending your first notifications.",
        details: (
          <>
            <p>Includes:</p>
            <ul>
              <li>10,000 workflow runs / month</li>
              <li>All channels: Email, In-app, SMS, Chat, Push</li>
              <li>US + EU data residency</li>
              <li>Up to 20 workflows</li>
              <li>2 environments (Dev + Prod)</li>
              <li>Activity feed retention: 24 hours</li>
              <li>Up to 3 team members</li>
            </ul>
          </>
        ),
        extraInfo: "No credit card required",
        isFeatured: false,
        link: {
          href: "https://dashboard.novu.co/auth/sign-up?utm_campaign=ws_pricing",
          isExternal: true,
          text: "Get started",
        },
        price: [
          {
            _key: "59a5504deacb",
            _type: "numericPrice",
            paymentPeriod: "month",
            value: 0,
          },
        ],
        title: "Free",
      },
      {
        _type: "pricingHeroCard",
        description:
          "More scale and flexibility - ideal for teams moving beyond experimentation.",
        details: (
          <>
            <p>Everything in Free, plus:</p>
            <ul>
              <li>30,000+ workflow runs / month</li>
              <li>7-day activity feed retention</li>
              <li>Remove Novu branding</li>
              <li>Advanced email editor (blocks, layouts)</li>
              <li>Higher rate limits & faster processing</li>
            </ul>
          </>
        ),
        isFeatured: true,
        link: {
          href: "https://dashboard.novu.co/auth/sign-up?utm_campaign=ws_pricing",
          isExternal: true,
          text: "Get started",
        },
        price: [
          {
            _key: "421a0cf39a00",
            _type: "numericPrice",
            paymentPeriod: "month",
            value: 30,
          },
        ],
        textBeforePrice: "Starting from",
        title: "Pro",
      },
      {
        _type: "pricingHeroCard",
        description:
          "Built for growing engineering teams sending meaningful volume into production.",
        details: (
          <>
            <p>Everything in Pro, plus:</p>
            <ul>
              <li>250,000+ workflow runs / month</li>
              <li>Up to 10 environments (Staging, QA, Pre-prod…)</li>
              <li>90-day activity feed retention</li>
              <li>Unlimited team members</li>
              <li>More workflows</li>
              <li>Role-Based Access Control (RBAC)</li>
              <li>Expanded rate limits (600 RPS triggers)</li>
            </ul>
          </>
        ),
        isFeatured: false,
        link: {
          href: "https://dashboard.novu.co/auth/sign-up?utm_campaign=ws_pricing",
          isExternal: true,
          text: "Get started",
        },
        price: [
          {
            _key: "587d51b65549",
            _type: "numericPrice",
            paymentPeriod: "month",
            value: 250,
          },
        ],
        textBeforePrice: "Starting from",
        title: "Team",
      },
      {
        _type: "pricingHeroCard",
        description:
          "Enterprise-grade scale, compliance, support, and hosting options.",
        details: (
          <>
            <p>Everything in Team, plus:</p>
            <ul>
              <li>10M+ workflow runs / month (custom volume tiers)</li>
              <li>Unlimited environments</li>
              <li>Custom retention policies (feed, audit, logs)</li>
              <li>Custom delay & digest windows</li>
              <li>HIPAA BAA</li>
              <li>Dedicated SSO (SAML / OIDC, SCIM)</li>
              <li>Private Slack/Teams support channel</li>
              <li>
                Advanced data residency (SG, UK, AU, JP, KR, custom regions)
              </li>
              <li>Self-hosted + Managed VPC deployment options</li>
            </ul>
          </>
        ),
        isFeatured: false,
        link: {
          href: "https://novu.co/contact-us/?utm_campaign=ws_pricing",
          isExternal: false,
          text: "Contact us",
        },
        price: [
          {
            _key: "337353e5e6a4",
            _type: "customPrice",
            value: "Custom",
          },
        ],
        title: "Enterprise",
      },
    ],
  },
  logos: {
    description:
      "Ensuring seamless notifications from business to users, with zero hassle.",
    items: [
      { title: "Guesty", image: logoGuesty, priority: 10, rowIndex: 0 },
      { title: "Sinch", image: logoSinch, priority: 10, rowIndex: 0 },
      { title: "MongoDB", image: logoMongodb, priority: 10, rowIndex: 1 },
      { title: "Bitmex", image: logoBitmex },
      { title: "BPP", image: logoBpp },
      { title: "Checkpoint", image: logoCheckpoint, priority: 9, rowIndex: 1 },
      { title: "Cloud Software Group", image: logoCloudSoftwareGroup },
      { title: "Deriv", image: logoDeriv },
      { title: "Docplanner Group", image: logoDocplannerGroup },
      { title: "Ebury", image: logoEbury },
      { title: "El Proffen", image: logoElProffen },
      { title: "Hemnet", image: logoHemnet },
      { title: "Influencer", image: logoInfluencer },
      { title: "Joyride", image: logoJoyride },
      { title: "Kant Akademi", image: logoKantAkademi },
      { title: "KarmaCheck", image: logoKarmacheck },
      { title: "Korn Ferry", image: logoKornFerry, priority: 3, rowIndex: 1 },
      { title: "LottieFiles", image: logoLottiefiles },
      { title: "MedVol", image: logoMedvol },
      { title: "Moises", image: logoMoises },
      { title: "Namirial", image: logoNamirial },
      { title: "NEP", image: logoNep },
      { title: "Normative", image: logoNormative },
      { title: "Novacy", image: logoNovacy },
      { title: "Quorum Cyber", image: logoQuorumCyber },
      { title: "Roche", image: logoRoche, priority: 7, rowIndex: 1 },
      { title: "Sherweb", image: logoSherweb },
      { title: "Tatilbudur", image: logoTatilbudur },
      { title: "Tenderd", image: logoTenderd },
      { title: "Trustflight", image: logoTrustflight },
      { title: "Unified", image: logoUnified },
      { title: "Unity", image: logoUnity },
      { title: "UNOPS", image: logoUnops },
      { title: "Walton Enterprises", image: logoWaltonEnterprises },
      { title: "Whoppah", image: logoWhoppah },
    ],
    rows: 2,
    title: "Notifications brands count on",
  },
  pageCta: {
    actions: [
      {
        href: "https://dashboard.novu.co/?utm_campaign=gs-website-inbox",
        label: "Get started",
        kind: "primary-button",
      },
      {
        href: "/contact-us",
        label: "Contact us",
        kind: "secondary-button",
      },
    ],
    description:
      "Create a free account, send your first notification, all before your coffee gets cold... no credit card required.",
    title: "You're five minutes away from your first Novu-backed notification",
  },
  plans: {
    headings: [
      {
        buttonText: "Get started",
        buttonUrl:
          "https://dashboard.novu.co/auth/sign-up?utm_campaign=ws_pricing_table_free",
        id: "free",
        label: "Free",
        isFeatured: false,
      },
      {
        buttonText: "Get started",
        buttonUrl:
          "https://dashboard.novu.co/auth/sign-up?utm_campaign=ws_pricing_table_pro",
        id: "pro",
        isFeatured: true,
        label: "Pro",
      },
      {
        buttonText: "Get started",
        buttonUrl:
          "https://dashboard.novu.co/auth/sign-up?utm_campaign=ws_pricing_table_team",
        id: "team",
        label: "Team",
        isFeatured: false,
      },
      {
        buttonText: "Contact us",
        buttonUrl: "/",
        id: "enterprise",
        isFeatured: false,
        label: "Enterprise",
      },
    ],
    rows: [
      {
        enterprise: {
          booleanValue: false,
        },
        isGroupTitle: true,
        pro: {
          booleanValue: true,
        },
        title: "Platform & Scale",
      },
      {
        enterprise: {
          booleanValue: false,
          value: "Custom",
        },
        free: {
          value: "$0",
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
          value: "From $30",
        },
        team: {
          value: "From $250",
        },
        title: "Monthly cost",
      },
      {
        enterprise: {
          booleanValue: false,
          value: "10M+",
        },
        free: {
          booleanValue: false,
          value: "10K",
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
          value: "30K",
        },
        team: {
          booleanValue: false,
          value: "250K",
        },
        title: "Included workflow runs",
      },
      {
        enterprise: {
          booleanValue: false,
          value: "Custom",
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
          value: "$1.20 per 1K",
        },
        team: {
          booleanValue: false,
          value: "$1.20 per 1K",
        },
        title: "Additional workflow runs",
      },
      {
        enterprise: {
          booleanValue: false,
          value: "Custom",
        },
        free: {
          booleanValue: false,
          value: "20",
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
          value: "20",
        },
        team: {
          booleanValue: false,
          value: "100*",
        },
        title: "Workflow limits",
        tooltip: (
          <p>For Team tier the limit can be expanded based on request</p>
        ),
      },
      {
        enterprise: {
          booleanValue: false,
          value: "Unlimited",
        },
        free: {
          booleanValue: false,
          value: "2",
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
          value: "2",
        },
        team: {
          booleanValue: false,
          value: "Up to 10",
        },
        title: "Environments",
        tooltip: (
          <p>
            <strong>Environments</strong> allow you to separate your
            notification workflows across different stages of your development
            lifecycle.
            {"\n\n"}
            Create distinct environments like <strong>Development</strong>,{" "}
            <strong>Staging</strong>, and <strong>Production</strong> to test
            and manage your notifications safely before deploying to users.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: true,
        },
        team: {
          booleanValue: true,
        },
        title: "Environment Variables",
      },
      {
        enterprise: {
          booleanValue: false,
          value: "Unlimited",
        },
        free: {
          booleanValue: false,
          value: "Unlimited",
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
          value: "Unlimited",
        },
        team: {
          booleanValue: false,
          value: "Unlimited",
        },
        title: "Subscribers",
        tooltip: (
          <p>
            <strong>End-users or recipients</strong> who receive notifications
            through your workflows. Each subscriber has a unique subscriberId
            and can include attributes like email, phone, name, locale, and
            custom data.
            {"\n\n"}
            Subscribers can be created via API, automatically when triggering
            workflows, or in bulk (up to 500 per request). They represent the
            &quot;who&quot; in your notification system—the individuals
            receiving notifications across all channels.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: false,
          value: "Custom",
        },
        free: {
          booleanValue: false,
          value: "60",
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
          value: "240",
        },
        team: {
          booleanValue: false,
          value: "600",
        },
        title: "Throughput (events RPS)",
        tooltip: (
          <p>
            <strong>Throughput</strong> measures the maximum number of
            notification events you can trigger <strong>per second</strong> (RPS
            = Requests Per Second).
            {"\n\n"}
            Higher throughput allows you to send more notifications
            simultaneously, which is essential for{" "}
            <strong>high-volume applications</strong> and{" "}
            <strong>time-sensitive alerts</strong>.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: false,
          value: "Custom",
        },
        free: {
          booleanValue: false,
          value: "24h",
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
          value: "7 days",
        },
        team: {
          booleanValue: false,
          value: "90 days",
        },
        title: "Activity feed retention",
        tooltip: (
          <p>
            <strong>Activity feed retention</strong> determines how long
            notification data is stored and accessible in your activity feed.
            {"\n\n"}
            Longer retention periods allow you to{" "}
            <strong>review historical notifications</strong>,{" "}
            <strong>debug issues</strong>, and maintain{" "}
            <strong>audit trails</strong> for compliance purposes.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: false,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: true,
        pro: {
          booleanValue: false,
        },
        team: {
          booleanValue: false,
        },
        title: "Workflow Logic & Delivery",
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: true,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: true,
        },
        team: {
          booleanValue: true,
        },
        title: "Multi-channel support",
      },
      {
        enterprise: {
          booleanValue: false,
          value: "Custom",
        },
        free: {
          booleanValue: false,
          value: "24h",
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
          value: "7 days",
        },
        team: {
          booleanValue: false,
          value: "90 days",
        },
        title: "Delay windows",
      },
      {
        enterprise: {
          booleanValue: false,
          value: "Custom",
        },
        free: {
          booleanValue: false,
          value: "24h",
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
          value: "7 days",
        },
        team: {
          booleanValue: false,
          value: "90 days",
        },
        title: "Digest windows",
        tooltip: (
          <p>
            <strong>Aggregates multiple trigger events</strong> into a single
            notification to prevent notification fatigue. Collects events during
            a time window, then sends one consolidated message.
            {"\n\n"}
            Supports <strong>regular digest</strong> (duration-based batching)
            and <strong>scheduled digest</strong> (repeating schedule with
            cron). Use <strong>digestKey</strong> to group events by specific
            payload fields. Access digested data via step.events in subsequent
            steps.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: false,
          value: "Custom",
        },
        free: {
          booleanValue: false,
          value: "1hr",
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
          value: "24hr",
        },
        team: {
          booleanValue: false,
          value: "7d",
        },
        title: "Throttle Window",
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: true,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: true,
        },
        team: {
          booleanValue: true,
        },
        title: "Code-first workflows",
        tooltip: (
          <p>
            <strong>TypeScript SDK</strong> that allows you to define
            notification workflows as code in your application using
            @novu/framework. Define workflows programmatically with full type
            safety and version control.
            {"\n\n"}
            Benefits: <strong>Type safety</strong> with Zod schemas,{" "}
            <strong>version control</strong> in your codebase,{" "}
            <strong>unit testing</strong>, and <strong>collaboration</strong>{" "}
            where developers define structure and non-technical users modify
            content via Dashboard.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: true,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: true,
        },
        team: {
          booleanValue: true,
        },
        title: "Topics",
        tooltip: (
          <p>
            <strong>Grouping mechanism</strong> that works like mailing lists or
            broadcast groups—send notifications to multiple subscribers at once
            by targeting a topic instead of individual subscriber IDs.
            {"\n\n"}
            Create topics with unique keys, add/remove subscribers, and trigger
            workflows to entire topics. Perfect for{" "}
            <strong>announcements</strong>,{" "}
            <strong>region-based notifications</strong>, or{" "}
            <strong>role-based messaging</strong> (e.g., all admins).
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: true,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: true,
        },
        team: {
          booleanValue: true,
        },
        title: "Multi-tenancy support",
        tooltip: (
          <p>
            <strong>Multi-tenancy</strong> enables you to manage notifications
            for <strong>multiple organizations or teams</strong> within a single
            Novu account.
            {"\n\n"}
            Isolate data and configurations per tenant while maintaining{" "}
            <strong>centralized management</strong> and{" "}
            <strong>shared infrastructure</strong>.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: true,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: true,
        },
        team: {
          booleanValue: true,
        },
        title: "Throttle step",
        tooltip: (
          <p>
            The <strong>Throttle step</strong> limits the number of workflow
            executions within a specified time window to prevent{" "}
            <strong>duplicate</strong> or{" "}
            <strong>excessive notifications</strong>.{"\n\n"}
            Configure <strong>fixed</strong> or{" "}
            <strong>dynamic time windows</strong> to control notification
            frequency—perfect for limiting high-frequency alerts, preventing
            spam from cron jobs, or managing notifications across multiple
            projects or contexts.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: false,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: true,
        pro: {
          booleanValue: false,
        },
        team: {
          booleanValue: false,
        },
        title: "Components & End-User Features",
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: true,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: true,
        },
        team: {
          booleanValue: true,
        },
        title: "<Inbox /> component",
        tooltip: (
          <p>
            A <strong>pre-built, customizable in-app notification inbox</strong>{" "}
            that you can embed directly into your application.
            {"\n\n"}
            Provides a <strong>drop-in UI component</strong> with real-time
            notifications, read/unread states, and action handling—no need to
            build your own notification center from scratch.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: true,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: true,
        },
        team: {
          booleanValue: true,
        },
        title: "<Preferences /> component",
        tooltip: (
          <p>
            A <strong>pre-built UI component</strong> that allows end-users to
            manage notification preferences directly within your app.
            {"\n\n"}
            Displays <strong>global preferences</strong> (channel-level settings
            across all workflows) and <strong>workflow preferences</strong>{" "}
            (per-workflow settings), enabling users to opt in or out of specific
            notification types and channels.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: true,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: true,
        },
        team: {
          booleanValue: true,
        },
        title: "Headless components",
        tooltip: (
          <p>
            <strong>&quot;Bring your own&quot; UI components</strong> using
            custom render props and hooks that let you replace default UI
            elements with your own React components while Novu handles the
            notification logic.
            {"\n\n"}
            Includes <strong>custom render props</strong> (renderNotification,
            renderAvatar, renderSubject, renderBody, etc.) and{" "}
            <strong>hooks-only access</strong> for React Native.
            Framework-agnostic support via the NovuUI class for Angular, Vue,
            and vanilla JS.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: false,
          value: "Custom",
        },
        free: {
          booleanValue: false,
          value: "30 days",
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
          value: "90 days",
        },
        team: {
          booleanValue: false,
          value: "90 days",
        },
        title: "Inbox feed retention",
        tooltip: (
          <p>
            The time period that{" "}
            <strong>notification data is stored and accessible</strong> in the
            in-app inbox feed for your end-users.
            {"\n\n"}
            Longer retention periods allow users to{" "}
            <strong>review past notifications</strong> and maintain notification
            history within your application.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: true,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: true,
        },
        team: {
          booleanValue: true,
        },
        title: "Email editor (blocks)",
        tooltip: (
          <p>
            A <strong>WYSIWYG visual editor</strong> for creating email
            templates using prebuilt content blocks like text, headings, images,
            buttons, and custom HTML.
            {"\n\n"}
            Best suited for{" "}
            <strong>
              quick prototyping and collaboration with non-technical
              stakeholders
            </strong>
            .
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: false,
          value: "Unlimited",
        },
        free: {
          booleanValue: false,
          value: "1",
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
          value: "Unlimited",
        },
        team: {
          booleanValue: false,
          value: "Unlimited",
        },
        title: "Custom layouts",
        tooltip: (
          <p>
            <strong>Reusable components</strong> used with email steps to bring
            consistency, maintainability, and efficiency to your email
            communications.
            {"\n\n"}
            Create layouts with{" "}
            <strong>headers, footers, and branding elements</strong> and reuse
            them across multiple email steps and workflows—such as
            transactional, marketing, or newsletter types.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: true,
        },
        team: {
          booleanValue: true,
        },
        title: "Remove Novu branding",
        tooltip: (
          <p>
            Remove <strong>&quot;Powered by Novu&quot;</strong> branding from
            your notification components and emails.
            {"\n\n"}
            Present a fully <strong>white-labeled experience</strong> to your
            end-users with no third-party branding visible in your notification
            interfaces.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
        },
        team: {
          booleanValue: true,
        },
        title: "Translations (i18n)",
      },
      {
        enterprise: {
          booleanValue: false,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: true,
        pro: {
          booleanValue: false,
        },
        team: {
          booleanValue: false,
        },
        title: "Administration & Security",
      },
      {
        enterprise: {
          booleanValue: false,
          value: "Unlimited",
        },
        free: {
          booleanValue: false,
          value: "3",
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
          value: "3",
        },
        team: {
          booleanValue: false,
          value: "Unlimited",
        },
        title: "Team members",
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: true,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: true,
        },
        team: {
          booleanValue: true,
        },
        title: "MFA",
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: true,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: true,
        },
        team: {
          booleanValue: true,
        },
        title: "Standard SSO (Google/GitHub)",
      },
      {
        enterprise: {
          booleanValue: false,
          value: "Full",
        },
        free: {
          booleanValue: false,
          value: "Basic",
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
          value: "Basic",
        },
        team: {
          booleanValue: false,
          value: "Enhanced",
        },
        title: "Audit logs",
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
        },
        team: {
          booleanValue: true,
        },
        title: "RBAC",
        tooltip: (
          <p>
            <strong>Role-Based Access Control</strong> allows organizations to
            manage user permissions and restrict access to system resources
            based on assigned roles.
            {"\n\n"}
            Supports <strong>Admin</strong> (full access) and{" "}
            <strong>Member</strong> (limited permissions) roles. When disabled,
            all authenticated users have full access. Securely control who can
            manage environments, API keys, integrations, and other resources.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
        },
        team: {
          booleanValue: false,
        },
        title: "Custom SSO / OIDC",
        tooltip: (
          <p>
            <strong>Enterprise authentication</strong> that allows organizations
            to integrate their own identity providers (Okta, Azure AD, Auth0,
            etc.) for user authentication.
            {"\n\n"}
            Supports <strong>SAML SSO and OIDC</strong> protocols. Enables
            centralized user management, enforcement of corporate security
            policies, and compliance with enterprise authentication
            requirements—distinct from standard built-in authentication
            (Google/GitHub).
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: false,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: true,
        pro: {
          booleanValue: false,
        },
        team: {
          booleanValue: false,
        },
        title: "Compliance & SLA",
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: true,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: true,
        },
        team: {
          booleanValue: true,
        },
        title: "GDPR",
        tooltip: (
          <p>
            <strong>General Data Protection Regulation</strong> compliance
            ensures Novu meets European data protection requirements for
            handling user data.
            {"\n\n"}
            Available on all tiers as a baseline requirement. Includes support
            for data deletion, user privacy controls, and proper data handling.
            Enterprise deployments may have additional GDPR compliance
            configurations based on specific deployment needs.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: true,
        },
        team: {
          booleanValue: true,
        },
        title: "SOC 2 / ISO 27001 Report",
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
        },
        team: {
          booleanValue: false,
        },
        title: "HIPAA BAA",
        tooltip: (
          <p>
            <strong>Business Associate Agreement</strong> - A legally binding
            contract required for healthcare organizations to ensure Protected
            Health Information (PHI) is protected according to HIPAA
            regulations.
            {"\n\n"}
            Specifies how PHI can be used, requires implementation of
            safeguards, mandates breach reporting, and ensures secure data
            handling. Essential for healthcare providers, insurers, and any
            organization handling patient data.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
        },
        team: {
          booleanValue: false,
        },
        title: "Custom security reviews",
      },
      {
        enterprise: {
          booleanValue: false,
          value: "Custom",
        },
        free: {
          booleanValue: false,
          value: "Standard",
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
          value: "Standard",
        },
        team: {
          booleanValue: false,
          value: "Custom",
        },
        title: "DPA",
        tooltip: (
          <p>
            <strong>Data Processing Agreement (DPA)</strong> - Legally binding
            contract between data controller and processor that defines how
            personal data will be handled, protected, and processed. Required
            under GDPR and privacy regulations.
            {"\n\n"}
            Specifies security measures, breach notification procedures, data
            deletion/return terms, subprocessor management, and ensures
            compliance responsibilities. Standard DPAs available on all tiers;
            Enterprise offers custom terms.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: false,
          value: "Custom",
        },
        free: {
          booleanValue: false,
          value: "99.9%",
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
          value: "99.9%",
        },
        team: {
          booleanValue: false,
          value: "99.9%",
        },
        title: "Uptime SLA",
      },
      {
        enterprise: {
          booleanValue: false,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: true,
        pro: {
          booleanValue: false,
        },
        team: {
          booleanValue: false,
        },
        title: "Data Residency",
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: true,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: true,
        },
        team: {
          booleanValue: true,
        },
        title: "\u{1F1FA}\u{1F1F8} United States",
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: true,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: true,
        },
        team: {
          booleanValue: true,
        },
        title: "\u{1F1EA}\u{1F1FA} European Union",
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
        },
        team: {
          booleanValue: false,
        },
        title: "\u{1F1F8}\u{1F1EC} Singapore",
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
        },
        team: {
          booleanValue: false,
        },
        title: "\u{1F1EC}\u{1F1E7} United Kingdom",
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
        },
        team: {
          booleanValue: false,
        },
        title: "\u{1F1E6}\u{1F1FA} Australia",
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
        },
        team: {
          booleanValue: false,
        },
        title: "\u{1F1EF}\u{1F1F5} Japan",
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
        },
        team: {
          booleanValue: false,
        },
        title: "\u{1F1F0}\u{1F1F7} South Korea",
      },
      {
        enterprise: {
          booleanValue: false,
          value: (onContactUsClick) => (
            <button
              type="button"
              className="cursor-pointer text-primary hover:text-primary-muted"
              onClick={(e) => {
                e.preventDefault()
                onContactUsClick("pricing_table_enterprise")
              }}
            >
              Contact us
            </button>
          ),
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
        },
        team: {
          booleanValue: false,
        },
        title: "Other",
      },
      {
        enterprise: {
          booleanValue: false,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: true,
        pro: {
          booleanValue: false,
        },
        team: {
          booleanValue: false,
        },
        title: "Hosting Models",
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: true,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: true,
        },
        team: {
          booleanValue: true,
        },
        title: "Novu Cloud",
        tooltip: (
          <p>
            <strong>Cloud-managed SaaS service</strong> with zero infrastructure
            management, automatic updates, and enterprise-grade capabilities
            built for high-volume notification delivery.
            {"\n\n"}
            Includes <strong>advanced security</strong> (SAML SSO, MFA),{" "}
            <strong>compliance</strong> (SOC 2, ISO 27001, HIPAA BAA), unlimited
            provider integrations, custom environments, branding removal, and
            priority support. Extends open-source capabilities with consumable,
            scalable infrastructure.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: true,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: true,
        },
        team: {
          booleanValue: true,
        },
        title: "Self-hosted (OSS)",
        tooltip: (
          <p>
            <strong>Open-source, self-deployable version</strong> (MIT licensed)
            that runs on your own infrastructure, giving you complete control
            over your notification system and data.
            {"\n\n"}
            Deploy via{" "}
            <strong>
              Docker Compose, Kubernetes/Helm, or manual installation
            </strong>
            . Ideal for organizations with strict data residency requirements,
            compliance needs, or avoiding vendor lock-in. Includes unlimited
            retention and community-driven support.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
        },
        team: {
          booleanValue: false,
        },
        title: "Self-hosted (Enterprise)",
        tooltip: (
          <p>
            <strong>Enterprise-grade self-hosted solution</strong> that combines
            full infrastructure control with premium features. Includes{" "}
            <strong>auto-translations</strong>,{" "}
            <strong>unlimited service levels</strong>,{" "}
            <strong>advanced Redis architecture</strong>, and all Enterprise
            capabilities from Novu Cloud.
            {"\n\n"}
            Ideal for large enterprises requiring both infrastructure control
            and premium features, with compliance certifications and
            professional services. Deployable via Kubernetes/Helm with
            horizontal scaling support.
          </p>
        ),
      },
      {
        enterprise: {
          booleanValue: true,
        },
        free: {
          booleanValue: false,
        },
        isGroupTitle: false,
        pro: {
          booleanValue: false,
        },
        team: {
          booleanValue: false,
          value: [],
        },
        title: "Managed On-Prem",
        tooltip: (
          <p>
            <strong>Fully managed on-premises deployment</strong> where Novu
            operates and maintains the infrastructure within your own
            environment or dedicated infrastructure. Combines the control and
            compliance benefits of on-premises hosting with the operational
            simplicity of a managed service.
            {"\n\n"}
            Provides{" "}
            <strong>
              enhanced security, compliance guarantees, and performance SLAs
            </strong>{" "}
            with complete data isolation. Includes multi-region support for data
            residency requirements. Ideal for enterprises with strict regulatory
            requirements or data sovereignty needs without the operational
            burden.
          </p>
        ),
      },
    ],
    title: "Compare our plans",
  },
  onPrem: {
    badge: "Enterprise",
    title: "On-Prem Self-Hosted",
    description:
      "Deploy Novu on your own infrastructure with full control and enterprise support.",
    features: [
      "SSO and RBAC support",
      "Custom SLAs",
      "Dedicated support",
      "All cloud features",
    ],
    buttonText: "Book a Meeting",
    buttonUrl:
      "https://go.novu.co/intro-call?utm_campaign=pricing-widget-self-host",
  },
}
