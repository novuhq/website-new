import Image from "next/image"
import codeSectionIllustration from "@/images/pages/comparison/courier/code/illustration.jpg"
import codeIllustration from "@/images/pages/comparison/courier/difference/code.png"
import digestIllustration from "@/images/pages/comparison/courier/difference/digest.png"
import inboxIllustration from "@/images/pages/comparison/courier/difference/inbox.png"
import notificationsIllustration from "@/images/pages/comparison/courier/difference/notifications.png"
import regionsIllustration from "@/images/pages/comparison/courier/difference/regions.png"
import workflowIllustration from "@/images/pages/comparison/courier/difference/workflow.png"
import heroIllustration from "@/images/pages/comparison/suprsend/hero/illustration.jpg"
import checkIcon from "@/svgs/pages/comparison/check.svg"
import cloudIcon from "@/svgs/pages/comparison/courier/difference/cloud.svg"
import digestIcon from "@/svgs/pages/comparison/courier/difference/digest.svg"
import inboxIcon from "@/svgs/pages/comparison/courier/difference/inbox.svg"
import notificationsIcon from "@/svgs/pages/comparison/courier/difference/notifications.svg"
import regionsIcon from "@/svgs/pages/comparison/courier/difference/regions.svg"
import workflowIcon from "@/svgs/pages/comparison/courier/difference/workflow.svg"
import architectureIcon from "@/svgs/pages/comparison/courier/frustrations/architecture.svg"
import lockIcon from "@/svgs/pages/comparison/courier/frustrations/lock.svg"
import starsIcon from "@/svgs/pages/comparison/courier/frustrations/stars.svg"
import crossIcon from "@/svgs/pages/comparison/cross.svg"

import type { IComparisonPageData } from "@/types/comparison"

export const suprsendComparisonData: IComparisonPageData = {
  slug: "suprsend",
  competitor: "SuprSend",
  title: "Novu vs SuprSend",
  description:
    "Compare Novu and SuprSend notification infrastructure platforms. See how Novu's open-source approach, deployment flexibility, and pricing compare to SuprSend.",
  hero: {
    heading: {
      prefix: "Novu",
      highlight:
        "vs Suprsend: The best Suprsend alternative for end-to-end notifications",
    },
    subheading:
      "All your notification infrastructure needs, workflows, routing, preferences, and <Inbox /> in one platform, open source and built for builders and teams.",
    primaryCta: {
      label: "Start for Free",
      href: "https://dashboard.novu.co/auth/sign-up",
      clickLocation: "comparison_suprsend_hero",
      clickText: "start_for_free",
    },
    secondaryCta: {
      label: "Jump to Comparison",
      href: "#comparison",
      clickLocation: "comparison_suprsend_hero",
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
      clickLocation: "comparison_suprsend_intro",
      clickText: "get_started",
    },
  },
  frustrations: {
    title: "The frustrations that bring teams to Novu",
    subtitle:
      "If you're evaluating alternatives, you've probably dealing with at least one of these.",
    items: [
      {
        title: "Code-first ownership",
        description:
          "SuprSend workflows are managed through the dashboard and API. Novu Framework lets you define workflows directly in your codebase, alongside the product logic that triggers them.",
        icon: architectureIcon,
      },
      {
        title: "Multi-tenancy locked to enterprise",
        description:
          "If you're building B2B SaaS with tenant-specific notification experiences, you can't start modelling that until you're on SuprSend's Enterprise plan.",
        icon: lockIcon,
      },
      {
        title: "Limited in-app experience",
        description:
          "SuprSend offers an in-app feed and preference tooling, but Novu's Inbox delivers a fuller default experience with notifications, preferences, and tenant-scoped feeds working together.",
        icon: starsIcon,
      },
      {
        title: "Features gated behind higher plans",
        description:
          "User preferences, digest, and batching are unavailable until you upgrade to the Business plan \u2014 capabilities that should be accessible well before that.",
        icon: lockIcon,
      },
    ],
    cta: {
      label: "Switch to Novu",
      href: "https://dashboard.novu.co/auth/sign-up",
      clickLocation: "comparison_suprsend_frustrations",
      clickText: "switch_to_novu",
    },
  },
  difference: {
    title: "The Novu difference",
    subtitle:
      "Built for developer teams who need notification infrastructure that scales without drama.",
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
      clickLocation: "comparison_suprsend_difference",
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
    title: "Novu vs SuprSend comparison",
    subtitle:
      "Compare ownership, deployment flexibility, pricing, and feature access.",
    columnHeaders: ["Feature", "Novu", "SuprSend", "What this means for you"],
    rows: [
      [
        "Open-source availability",
        "Open-source notification infrastructure",
        "Proprietary managed platform",
        <>
          You keep more control over your stack and a clearer{" "}
          <span>fallback path</span> if your infrastructure, compliance, or
          vendor requirements change
        </>,
      ],
      [
        "Deployment model",
        "Cloud, self-hosted, and Managed VPC options on all tiers",
        "Self-hosted only on Enterprise plan",
        <>
          With Novu, you can <span>self-host from day one</span> for free
        </>,
      ],
      [
        "Pricing metric",
        "Workflow runs",
        "Notifications counted per user and per channel",
        <>
          You get pricing that <span>is easier to reason</span> about when one
          workflow fans out across multiple channels
        </>,
      ],
      [
        "Digest and batching",
        "Built-in digest, delay, and throttle steps in the workflow on all plans",
        "Business plan only",
        <>
          Novu lets you reduce <span>notification fatigue</span> with digest
          logic from the free tier. SuprSend gates this behind its most
          expensive standard plan
        </>,
      ],
      [
        "User preferences access",
        <>Dedicated {"<Preferences />"} component plus Inbox preferences UI</>,
        "Business plan only",
        <>
          You can get to a <span>user-facing preferences</span> experience with
          less and in a few minutes
        </>,
      ],
      [
        "Multi-tenancy support",
        "Available on both free and paid plans",
        "Enterprise plan only",
        <>
          You can support <span>tenant-aware notification architecture</span>{" "}
          earlier, without treating multi-tenancy as a premium extension
        </>,
      ],
      [
        "Inbox experience",
        <>
          {"<Inbox />"} ships with real-time delivery, unread counts,
          per-notification snooze, preferences panel, and Snoozed tab
        </>,
        "In-app inbox with feed, filtering, and toasts",
        <>
          With Novu, you give your end users the{" "}
          <span>best Inbox notification experience</span>
        </>,
      ],
      [
        "Email layouts",
        <Image
          key="check-email"
          src={checkIcon}
          alt="Yes"
          width={20}
          height={20}
          unoptimized
        />,
        <Image
          key="cross-email"
          src={crossIcon}
          alt="No"
          width={20}
          height={20}
          unoptimized
        />,
        <>
          Update your global <span>email layout once</span> in Novu and every
          email workflow inherits it automatically
        </>,
      ],
      [
        "Inbox keyless mode",
        <Image
          key="check-keyless"
          src={checkIcon}
          alt="Yes"
          width={20}
          height={20}
          unoptimized
        />,
        <Image
          key="cross-keyless"
          src={crossIcon}
          alt="No"
          width={20}
          height={20}
          unoptimized
        />,
        <>
          You can validate the <span>in-app experience faster</span> with
          Novu&apos;s keyless mode.
        </>,
      ],
    ],
  },
  banner: {
    title: "Migrate from SuprSend to Novu",
    description:
      "Bring your workflows, templates, and notification logic to Novu with a more flexible, open infrastructure. Reduce vendor lock-in and gain full control with self-hosting and developer-first workflows.",
    cta: {
      label: "Migration Guide",
      href: "https://docs.novu.co/guides/migrate-from-suprsend-to-novu",
      clickLocation: "comparison_suprsend_banner",
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
          question: "How long does it take to migrate from SuprSend to Novu?",
          answer: (
            <p>
              Most teams get their first notification running in minutes.
              Novu&apos;s unified API, visual workflow editor, and Inbox
              component map closely to SuprSend&apos;s concepts, so the
              migration path is straightforward. The biggest lift is typically
              recreating templates, which Novu&apos;s email editor and shared
              layout system make efficient.
            </p>
          ),
        },
        {
          question: "Do I need to self-host Novu to get value from it?",
          answer: (
            <p>
              No. You can use Novu Cloud on Free, Pro, or Team, and keep
              self-hosted OSS or Enterprise hosting options available if your
              requirements change later.
            </p>
          ),
        },
        {
          question: "Does Novu include reusable email layouts?",
          answer: (
            <p>
              Yes. Novu has reusable email layouts in the dashboard, and its Pro
              tier adds advanced email blocks and layouts. SuprSend clearly
              supports email template editing and tenant email blocks, but its
              current public pricing and docs do not present reusable layouts in
              the same way.
            </p>
          ),
        },
        {
          question:
            "Do I have to use Novu Framework, or can I stay in the dashboard?",
          answer: (
            <p>
              You can stay in the dashboard. Novu supports workflow creation in
              the dashboard, and Framework is there for teams that want
              code-backed workflows and local development with Local Studio.
            </p>
          ),
        },
        {
          question: "Does Novu's Inbox support snooze?",
          answer: (
            <p>
              Yes. Novu&apos;s {"<Inbox />"} component includes per-notification
              snooze and a Snoozed tab out of the box. Users can snooze a
              notification and come back to it later, keeping their inbox clean
              without losing track of important items.
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
        clickLocation: "comparison_suprsend_cta",
        clickText: "start_free",
      },
      {
        kind: "secondary-button",
        label: "Talk To Sales",
        href: "/contact-us",
        clickLocation: "comparison_suprsend_cta",
        clickText: "talk_to_sales",
      },
    ],
  },
}
