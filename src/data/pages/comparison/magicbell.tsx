import codeSectionIllustration from "@/images/pages/comparison/courier/code/illustration.jpg"
import codeIllustration from "@/images/pages/comparison/courier/difference/code.png"
import digestIllustration from "@/images/pages/comparison/courier/difference/digest.png"
import inboxIllustration from "@/images/pages/comparison/courier/difference/inbox.png"
import notificationsIllustration from "@/images/pages/comparison/courier/difference/notifications.png"
import regionsIllustration from "@/images/pages/comparison/courier/difference/regions.png"
import workflowIllustration from "@/images/pages/comparison/courier/difference/workflow.png"
import heroIllustration from "@/images/pages/comparison/magicbell/hero/illustration.jpg"
import cloudIcon from "@/svgs/pages/comparison/courier/difference/cloud.svg"
import digestIcon from "@/svgs/pages/comparison/courier/difference/digest.svg"
import inboxIcon from "@/svgs/pages/comparison/courier/difference/inbox.svg"
import notificationsIcon from "@/svgs/pages/comparison/courier/difference/notifications.svg"
import regionsIcon from "@/svgs/pages/comparison/courier/difference/regions.svg"
import workflowIcon from "@/svgs/pages/comparison/courier/difference/workflow.svg"
import architectureIcon from "@/svgs/pages/comparison/courier/frustrations/architecture.svg"
import lockIcon from "@/svgs/pages/comparison/courier/frustrations/lock.svg"
import starsIcon from "@/svgs/pages/comparison/courier/frustrations/stars.svg"

import type { IComparisonPageData } from "@/types/comparison"

export const magicbellComparisonData: IComparisonPageData = {
  slug: "magicbell",
  competitor: "MagicBell",
  title: "Novu vs MagicBell",
  description:
    "Compare Novu and MagicBell notification infrastructure platforms. See how Novu's open-source approach, deployment flexibility, and pricing compare to MagicBell.",
  hero: {
    heading: {
      prefix: "Novu",
      highlight:
        "vs MagicBell: The best MagicBell alternative for end-to-end notifications",
    },
    subheading:
      "All your notification infrastructure needs, workflows, routing, preferences, and <Inbox /> in one platform, open source and built for builders and teams.",
    primaryCta: {
      label: "Start for Free",
      href: "https://dashboard.novu.co/auth/sign-up",
      clickLocation: "comparison_magicbell_hero",
      clickText: "start_for_free",
    },
    secondaryCta: {
      label: "Jump to Comparison",
      href: "#comparison",
      clickLocation: "comparison_magicbell_hero",
      clickText: "jump_to_comparison",
    },
    note: (
      <>
        Free up to 10k events / month. <span>No credit card required</span>
      </>
    ),
    illustration: {
      className:
        "absolute w-[152.1739%] h-[169.7674%] top-[-56.8%] left-[-36.8%]",
      src: heroIllustration,
      width: 1120,
      height: 730,
      wrapperClassName:
        "w-full max-w-184 lg:w-1/2 2xl:w-184 aspect-736/430 h-auto",
    },
  },
  intro: {
    title: "Open Notification Infrastructure",
    description:
      "An open, opinionated platform that orchestrates the full notification lifecycle and unifies it into a programmable <Inbox /> experience you can ship fast and fully customize, giving builders complete control. We handle notification infrastructure so you can focus on building your product.",
    switchLabel: (
      <>
        Why teams switch to <span>Novu:</span>
      </>
    ),
    benefits: [
      "Open-source with self-host options",
      "Code-first workflow ownership",
      "Tenant-aware from day one",
    ],
    cta: {
      label: "Get Started",
      href: "https://dashboard.novu.co/auth/sign-up",
      clickLocation: "comparison_magicbell_intro",
      clickText: "get_started",
    },
  },
  frustrations: {
    title: "The frustrations that bring teams to Novu",
    subtitle:
      "If you're evaluating alternatives, you've probably lived at least one of these.",
    items: [
      {
        title: "Visual workflow ownership",
        description:
          "MagicBell workflows are defined via JSON and API calls. Novu supports creating workflows in the dashboard and also offers a Framework for code-first development.",
        icon: architectureIcon,
      },
      {
        title: "No way to self-host",
        description:
          "Your notification data lives on MagicBell's infrastructure. When compliance or data residency requirements change, there's no self-hosting path and no open-source fallback.",
        icon: lockIcon,
      },
      {
        title: "Missing core notification features",
        description:
          "No built-in digest engine to batch notifications. No translation support for a global user base. These are capabilities you'll have to build yourself or go without.",
        icon: lockIcon,
      },
      {
        title: "Every channel costs you twice",
        description:
          "MagicBell counts per-delivery, per-channel. One notification trigger sent to in-app and email counts as two deliveries \u2014 costs become unpredictable as you add channels.",
        icon: starsIcon,
      },
    ],
    cta: {
      label: "Switch to Novu",
      href: "https://dashboard.novu.co/auth/sign-up",
      clickLocation: "comparison_magicbell_frustrations",
      clickText: "switch_to_novu",
    },
  },
  difference: {
    title: "The Novu difference",
    subtitle:
      "Ship tenant-aware experiences cleanly. Contexts, topics, and Inbox scoping help map notification behavior to real B2B product structure.",
    cards: [
      {
        title: "Everything you need in one <Inbox/>",
        description:
          "An in-app notification inbox wrapped in a single <Inbox />. Use the drop-in component or go headless and build your own UI.",
        image: inboxIllustration,
        icon: inboxIcon,
      },
      {
        title: "Every step in one place",
        description:
          "Build your workflow visually in the Novu dashboard or define it in code with Novu Framework. Content, routing, delays.",
        image: workflowIllustration,
        icon: workflowIcon,
      },
      {
        title: "Self-host or use our cloud",
        description:
          "Run Novu on your own infrastructure with Docker Compose. Move between cloud and self-host anytime with the same codebase.",
        image: codeIllustration,
        icon: cloudIcon,
      },
      {
        title: "Data residency from day one",
        description:
          "Novu Cloud offers US and EU data residency on the free tier, with additional global regions and Managed VPC on Enterprise.",
        image: regionsIllustration,
        icon: regionsIcon,
      },
      {
        title: "Ship tenant-aware experiences cleanly",
        description:
          "Contexts, topics, and Inbox scoping help map notification behavior to real B2B product structure.",
        image: digestIllustration,
        icon: digestIcon,
      },
      {
        title: "What users see in minutes",
        description:
          "Real-time delivery, unread counts, snooze controls, and preferences. Styled out of the box and customizable with the appearance prop.",
        image: notificationsIllustration,
        icon: notificationsIcon,
      },
    ],
    cta: {
      label: "Explore Novu",
      href: "https://dashboard.novu.co/auth/sign-up",
      clickLocation: "comparison_magicbell_difference",
      clickText: "explore_novu",
    },
  },
  codeSection: {
    title: "Add notifications with just a few lines of code",
    subtitle:
      "Trigger workflows, add an in-app inbox, and manage user notification preferences — all using simple components and minimal setup.",
    image: {
      src: codeSectionIllustration,
      width: 870,
      height: 789,
      className: "top-[-80.8%] left-[-36%] w-[135.9375%] h-auto",
    },
    items: [
      {
        title: "Trigger notifications from your backend",
        description:
          "Send notifications across email, SMS, push, and in-app channels with a single API call.",
      },
      {
        title: "Add an in-app notification inbox",
        description:
          "Drop in a pre-built <Inbox /> component or go headless and build your own notification center UI.",
      },
      {
        title: "Let users control their notifications",
        description:
          "Give subscribers full control over their notification preferences with a built-in preferences component.",
      },
    ],
  },
  comparisonTable: {
    title: "Novu vs MagicBell comparison",
    subtitle:
      "Compare ownership, deployment flexibility, pricing, and feature access.",
    columnHeaders: ["Feature", "Novu", "MagicBell", "What this means for you"],
    rows: [
      [
        "Open-source availability",
        "Open-source notification infrastructure",
        "Proprietary managed platform",
        <>
          More control over your stack and a clearer <span>fallback path</span>{" "}
          if your infrastructure, compliance, or vendor requirements change
        </>,
      ],
      [
        "Deployment model",
        "Cloud, self-hosted, and Managed VPC options",
        "Cloud only",
        <>
          Choose the deployment model that fits your requirements instead of
          adapting to a <span>hosted-only setup</span>
        </>,
      ],
      [
        "Pricing metric",
        "Workflow runs",
        "Deliveries counted per channel",
        <>
          You get pricing that is easier to predict when one notification fans
          out across <span>multiple channels</span>
        </>,
      ],
      [
        "Free tier",
        "10,000 workflow runs/month",
        "1,000 deliveries/month",
        <>
          Novu&apos;s free tier gives you 10x the capacity to build and validate
          before committing to a paid plan
        </>,
      ],
      [
        "Workflow creation",
        "Build workflows visually in the Novu dashboard or in code with Novu Framework",
        "Workflows defined via JSON and API/CLI",
        <>
          With Novu, both engineers and non-technical teammates can see,
          understand, and contribute to notification logic
        </>,
      ],
      [
        "Digest and throttle engine",
        "Built-in digest, delay, and throttle steps in the workflow",
        "No native digest or throttle support",
        <>
          Batch multiple events into a single summary notification and
          rate-limit per subscriber without custom code
        </>,
      ],
      [
        "Workflow translations (i18n)",
        "Available on Team and Enterprise. Auto-serves by subscriber locale.",
        "No built-in translation support",
        <>
          Localize notification content for a global user base without building{" "}
          i18n logic yourself
        </>,
      ],
      [
        "Multi-tenancy support",
        "Tenant-aware scoping across templates, preferences, and Inbox",
        "No native multi-tenancy primitives",
        <>
          Support tenant-specific notification experiences for B2B SaaS products
          without workarounds
        </>,
      ],
      [
        "Workflow testing and preview",
        "Dashboard editor and Local Studio for local workflow work",
        "Current docs show dashboard broadcast testing and external CLI-based workflow testing",
        <>
          You can iterate on workflow logic and preview changes faster before
          they hit production
        </>,
      ],
      [
        "Data residency",
        "Free: US + EU. Enterprise adds SG, UK, AU, JP, KR, VPC, On-Prem.",
        "US-hosted infrastructure",
        <>
          Novu gives teams with data localisation requirements more options from
          day one
        </>,
      ],
    ],
  },
  banner: {
    title: "Migrate from MagicBell to Novu",
    description:
      "Bring your workflows, templates, and notification logic to Novu with a more flexible, open infrastructure. Reduce vendor lock-in and gain full control with self-hosting and developer-first workflows.",
    cta: {
      label: "Migration Guide",
      href: "https://docs.novu.co/guides/migrate-from-magicbell-to-novu",
      clickLocation: "comparison_magicbell_banner",
      clickText: "migration_guide",
    },
  },
  reviewsSection: {
    title: "Don't just take our word for it...",
  },
  faqSection: {
    accordion: {
      items: [
        {
          question: "How long does it take to migrate from MagicBell to Novu?",
          answer: (
            <p>
              Most teams get their first notification running in minutes. If
              you&apos;re using MagicBell primarily for the in-app inbox,
              Novu&apos;s {"<Inbox />"} component is a direct replacement that
              ships with real-time delivery, unread counts, preference
              management, and snooze, all in six lines of code.
            </p>
          ),
        },
        {
          question: "Do I need to self-host Novu to get value from it?",
          answer: (
            <p>
              No. You can use Novu in the cloud on Free, Pro, or Team, and move
              to self-hosted or Managed VPC later if your requirements change.
            </p>
          ),
        },
        {
          question:
            "Do I have to use Novu Framework, or can I stay in the dashboard?",
          answer: (
            <p>
              You can stay in the dashboard. Novu supports creating workflows
              directly in the dashboard, and Framework is there for teams that
              want code-first workflows and local development.
            </p>
          ),
        },
        {
          question:
            "How does Novu pricing compare when one notification sends across multiple channels?",
          answer: (
            <p>
              Novu&apos;s cloud pricing is based on workflow runs. MagicBell
              counts deliveries across channels, and its pricing page gives the
              example that 100 in-app notifications plus 50 emails equals 150
              deliveries.
            </p>
          ),
        },
      ],
    },
    title: "Frequently asked questions",
  },
  ctaSection: {
    title: "Switch to Novu",
    description:
      "Adding notification infrastructure into your application shouldn't be complicated.",
    hint: "Free for 10K workflow runs/month",
    actions: [
      {
        kind: "primary-button",
        label: "Start Free",
        href: "https://dashboard.novu.co/",
        clickLocation: "comparison_magicbell_cta",
        clickText: "start_free",
      },
      {
        kind: "secondary-button",
        label: "Talk To Sales",
        href: "/contact-us",
        clickLocation: "comparison_magicbell_cta",
        clickText: "talk_to_sales",
      },
    ],
  },
}
