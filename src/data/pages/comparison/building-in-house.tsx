import codeSectionIllustration from "@/images/pages/comparison/courier/code/illustration.jpg"
import codeIllustration from "@/images/pages/comparison/courier/difference/code.png"
import digestIllustration from "@/images/pages/comparison/courier/difference/digest.png"
import inboxIllustration from "@/images/pages/comparison/courier/difference/inbox.png"
import notificationsIllustration from "@/images/pages/comparison/courier/difference/notifications.png"
import regionsIllustration from "@/images/pages/comparison/courier/difference/regions.png"
import workflowIllustration from "@/images/pages/comparison/courier/difference/workflow.png"
import heroIllustration from "@/images/pages/comparison/in-house/hero/illustration.jpg"
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

export const buildingInHouseComparisonData: IComparisonPageData = {
  slug: "building-in-house",
  competitor: "Building in-house",
  title: "Novu vs Building in-house",
  description:
    "Compare Novu and building notification infrastructure in-house. See how Novu's open-source platform saves engineering time with workflows, routing, preferences, and Inbox.",
  hero: {
    heading: {
      prefix: "Novu",
      highlight:
        "vs Building in-house: The best alternative for end-to-end notification infrastructure",
    },
    subheading:
      "All your notification infrastructure needs, workflows, routing, preferences, and <Inbox /> in one platform, open source and built for builders and teams.",
    primaryCta: {
      label: "Start for Free",
      href: "https://dashboard.novu.co/auth/sign-up",
      clickLocation: "comparison_building_in_house_hero",
      clickText: "start_for_free",
    },
    secondaryCta: {
      label: "Jump to Comparison",
      href: "#comparison",
      clickLocation: "comparison_building_in_house_hero",
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
      clickLocation: "comparison_building_in_house_intro",
      clickText: "get_started",
    },
  },
  frustrations: {
    title: "The frustrations that bring teams to Novu",
    subtitle:
      "If you're evaluating alternatives, you've probably dealing with at least one of these.",
    items: [
      {
        title: "Notifications eat engineering time",
        description:
          "Once notifications expand beyond a single send flow, teams need multi-channel workflows, delays, digests, throttling, conditions, and provider control. Novu has solved this \u2014 just plug and play.",
        icon: architectureIcon,
      },
      {
        title: "Your inbox keeps growing",
        description:
          "Building an inbox rarely stops at a bell icon. It expands into preferences, schedule controls, snooze, and localization. Novu's <Inbox /> includes all of these out of the box.",
        icon: lockIcon,
      },
      {
        title: "Product blocked by engineering",
        description:
          "Building in-house means engineers own the workflow model, templates, and editing surface. Novu supports dashboard management for product teams and a code-first Framework path for engineering teams.",
        icon: starsIcon,
      },
      {
        title: "Maintenance cost never stops",
        description:
          "Building v1 is fast. But provider changes, new channel requirements, and edge cases add up to a steady drain on engineering time that could go toward your core product.",
        icon: lockIcon,
      },
      {
        title: "Every requirement is more work",
        description:
          "Reusable layouts, translations, tenant separation, environments, activity tracking, and topic broadcasts are all separate problems when built in-house. Novu includes them as part of the platform.",
        icon: starsIcon,
      },
    ],
    cta: {
      label: "Switch to Novu",
      href: "https://dashboard.novu.co/auth/sign-up",
      clickLocation: "comparison_building_in_house_frustrations",
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
      clickLocation: "comparison_building_in_house_difference",
      clickText: "explore_novu",
    },
  },
  codeSection: {
    title: "Add notifications with just a few lines of code",
    subtitle:
      "Trigger workflows, add an in-app inbox, and manage user notification preferences \u2014 all using simple components and minimal setup.",
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
    title: "Why builders choose Novu",
    subtitle:
      "Compare ownership, deployment flexibility, pricing, and feature access.",
    columnHeaders: [
      "Feature",
      "Novu",
      "Building in-house",
      "What this means for you",
    ],
    rows: [
      [
        "Time to first notification",
        "Minutes. One API call triggers delivery across all configured channels.",
        "Wiring up a single channel is fast. However, a multi-channel system with preference enforcement, observability, and edge-case handling takes meaningfully longer.",
        "With Novu, you get a notification infrastructure with everything you need up and running in few minutes",
      ],
      [
        "Multi-channel routing",
        "One unified API. Configure providers in the dashboard, Novu handles routing, formatting, and delivery per channel.",
        "Every new channel or provider becomes an integration to own and manage yourself",
        "Add or swap providers without touching your notification codebase",
      ],
      [
        "Multi-channel workflow engine",
        "Multi-channel workflows with Delay, Digest, Throttle, HTTP steps, and step conditions.",
        "You design and maintain your own orchestration model, scheduling logic, and execution rules.",
        "You get advanced notification logic without turning notifications into an internal platform project",
      ],
      [
        "In-app notification inbox",
        "Prebuilt Inbox for real-time in-app notifications.",
        "You build the feed UI, unread state, real-time updates, and interaction model yourself.",
        "With Novu, you can ship a usable in-app experience faster",
      ],
      [
        "Preferences, schedule, and snooze",
        "Built-in preferences, schedule controls, and snooze support in Inbox.",
        "You build the preference model, timezone logic, snooze behavior, and end-user UI yourself.",
        "You can give users more control without expanding the scope of your product team",
      ],
      [
        "Reusable email system",
        "Reusable email layouts plus channel template editors with blocks and code editing.",
        "You create your own template system, shared layouts, and editing workflow.",
        "You can standardize branded notifications without inventing a content platform internally",
      ],
      [
        "Localization",
        "Workflow translations and Inbox localization support.",
        "You manage locale resolution, translated content, and localized notification UI yourself.",
        "You can support global products earlier without adding another internal system to maintain",
      ],
      [
        "Tenant-aware architecture",
        "Built-in multi-tenancy and tenant-aware notification patterns.",
        "You define and maintain tenant separation, scoping, and tenant-aware notification behavior yourself.",
        "You get a cleaner path for B2B SaaS and workspace-based products from the start",
      ],
      [
        "Workflow debugging and delivery visibility",
        "Activity Feed plus email activity tracking.",
        "You build your own execution tracing, delivery logs, and debugging surface.",
        "You can diagnose notification failures faster without building internal tooling first",
      ],
      [
        "Delivery observability",
        "Activity feed with per-message delivery timelines, with channel or provider level status available from day one",
        "",
        "",
      ],
      [
        "Environments and safe rollout",
        "Development and Production environments for workflows, layouts, and translations.",
        "You design your own promotion flow, versioning model, and release safety checks.",
        "You can test and ship changes more safely before they reach users",
      ],
      [
        "Development model",
        "Dashboard workflows plus code-backed workflows with Novu Framework.",
        "Engineers own both the system and the editing path unless you build separate tooling.",
        "You can keep engineering control where it matters without forcing every workflow change through developers",
      ],
      [
        "Ongoing maintenance",
        "Novu maintains the infrastructure. Provider integrations, scaling, and reliability are handled for you.",
        "Every provider API change, every new channel, every scaling challenge is your team\u2019s problem.",
        "Your team gets to focus on your product instead of building a notification system from scratch",
      ],
    ],
  },
  banner: {
    title: "Switch from in-house to Novu",
    description:
      "Replace your internal notification service with Novu's unified API. Most teams start by migrating one workflow, validate it works, and progressively move the rest.",
    cta: {
      label: "Get Started",
      href: "https://dashboard.novu.co/auth/sign-up",
      clickLocation: "comparison_building_in_house_banner",
      clickText: "get_started",
    },
  },
  reviewsSection: {
    title: "Don't just take our word for it...",
  },
  faqSection: {
    accordion: {
      items: [
        {
          question: "Is Novu really free to use?",
          answer: (
            <p>
              Yes. Novu&apos;s free tier includes 10,000 workflow runs per
              month, all channels (email, in-app, SMS, chat, push), US + EU data
              residency, up to 20 workflows, and 2 environments. No credit card
              required.
            </p>
          ),
        },
        {
          question:
            "Building is faster now with modern tools. Why should I still use Novu?",
          answer: (
            <p>
              Building the initial version is faster than ever, and that&apos;s
              great. But notification infrastructure isn&apos;t a one-time
              build. It&apos;s an ongoing system that needs maintenance every
              time a provider changes its API, every time you add a channel,
              every time you need a new workflow pattern. The question
              isn&apos;t &ldquo;how fast can I build v1?&rdquo; &mdash;
              it&apos;s &ldquo;do I want my team permanently maintaining
              notification infrastructure, or do I want them building the
              product?&rdquo;
            </p>
          ),
        },
        {
          question: "I like owning my code. Can I still do that with Novu?",
          answer: (
            <p>
              Yes. Novu is open source. You can fork it, audit it, extend it,
              and self-host it on your own infrastructure. You get the control
              of owning the code without the build and maintenance burden.
              That&apos;s the best of both worlds.
            </p>
          ),
        },
        {
          question: "Can I migrate my existing in-house system to Novu?",
          answer: (
            <p>
              Yes. Novu&apos;s unified API means you replace your internal
              notification service with a single integration point. Most teams
              start by migrating one workflow, validate it works, and
              progressively move the rest. The {"<Inbox />"} component replaces
              any custom in-app notification UI you&apos;ve built.
            </p>
          ),
        },
        {
          question: "What if I need to customize beyond what Novu provides?",
          answer: (
            <p>
              Novu Framework lets you define workflows directly in your
              application code, so you can add custom logic &mdash; API calls,
              database lookups, conditional branching &mdash; at any step.
              Because Novu is open source, you can also extend the platform
              itself. You&apos;re never limited to what the dashboard offers.
            </p>
          ),
        },
        {
          question: "Does Novu handle provider failover?",
          answer: (
            <p>
              Yes. Configure multiple providers per channel. If one fails, Novu
              automatically falls back to the next. This is one of the features
              teams consistently skip when building in-house &mdash; and then
              scramble to add after their first outage.
            </p>
          ),
        },
        {
          question: "Isn't using a third-party service a lock-in risk?",
          answer: (
            <p>
              With most notification platforms, yes. Novu is different because
              it&apos;s open source. If you ever need to, you can self-host the
              entire platform on your own infrastructure. You&apos;re never
              dependent on Novu&apos;s cloud staying available. That&apos;s the
              lock-in protection of building in-house, without the build time.
            </p>
          ),
        },
        {
          question:
            "We already built a notification system. Is it too late to switch?",
          answer: (
            <p>
              No. Many Novu users migrated from in-house systems because the
              maintenance burden was pulling engineering resources away from
              their core product. Novu&apos;s API is designed to replace
              internal notification services, and most migrations complete in
              days to a few weeks depending on complexity.
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
        clickLocation: "comparison_building_in_house_cta",
        clickText: "start_free",
      },
      {
        kind: "secondary-button",
        label: "Talk To Sales",
        href: "/contact-us",
        clickLocation: "comparison_building_in_house_cta",
        clickText: "talk_to_sales",
      },
    ],
  },
}
