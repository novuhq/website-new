import codeSectionIllustration from "@/images/pages/comparison/courier/code/illustration.jpg"
import codeIllustration from "@/images/pages/comparison/courier/difference/code.png"
import digestIllustration from "@/images/pages/comparison/courier/difference/digest.png"
import inboxIllustration from "@/images/pages/comparison/courier/difference/inbox.png"
import notificationsIllustration from "@/images/pages/comparison/courier/difference/notifications.png"
import regionsIllustration from "@/images/pages/comparison/courier/difference/regions.png"
import workflowIllustration from "@/images/pages/comparison/courier/difference/workflow.png"
import heroIllustration from "@/images/pages/comparison/knock/hero/illustration.jpg"
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

export const knockComparisonData: IComparisonPageData = {
  slug: "knock",
  competitor: "Knock",
  title: "Novu vs Knock",
  description:
    "Compare Novu and Knock notification infrastructure platforms. See how Novu's open-source approach, deployment flexibility, and pricing compare to Knock.",
  hero: {
    heading: {
      prefix: "Novu",
      highlight:
        "vs Knock: The best Knock alternative for end-to-end notifications",
    },
    subheading:
      "All your notification infrastructure needs, workflows, routing, preferences, and <Inbox /> in one platform, open source and built for builders and teams.",
    primaryCta: {
      label: "Start for Free",
      href: "https://dashboard.novu.co/auth/sign-up",
      clickLocation: "comparison_knock_hero",
      clickText: "start_for_free",
    },
    secondaryCta: {
      label: "Jump to Comparison",
      href: "#comparison",
      clickLocation: "comparison_knock_hero",
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
      clickLocation: "comparison_knock_intro",
      clickText: "get_started",
    },
  },
  frustrations: {
    title: "The frustrations that bring teams to Novu",
    subtitle:
      "If you're evaluating alternatives, you've probably lived at least one of these.",
    items: [
      {
        title: "No fallback path",
        description:
          "A hosted-only model can become a problem when security, compliance, or procurement requirements change and you need more control over where your infrastructure runs.",
        icon: architectureIcon,
      },
      {
        title: "Awkward pricing jump",
        description:
          "Moving from a free plan to a $250/month paid tier is a harder step for teams that are growing but not ready for enterprise-style pricing yet.",
        icon: lockIcon,
      },
      {
        title: "Global features gated to enterprise",
        description:
          "Translation support and per-customer branding and preferences are locked behind the enterprise plan, unavailable to growing teams that need them earlier.",
        icon: starsIcon,
      },
      {
        title: "No deployment control",
        description:
          "A fully managed platform means you can’t choose where your notification infrastructure runs. Novu offers cloud, self-hosted, and hybrid options.",
        icon: lockIcon,
      },
      {
        title: "Hosted dashboard, not code-first",
        description:
          "Teams that prefer engineering-owned workflows want workflows defined in code — not just API access layered on top of a dashboard-centric model.",
        icon: starsIcon,
      },
    ],
    cta: {
      label: "Switch to Novu",
      href: "https://dashboard.novu.co/auth/sign-up",
      clickLocation: "comparison_knock_frustrations",
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
      clickLocation: "comparison_knock_difference",
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
    title: "Novu vs Knock comparison",
    subtitle:
      "Compare ownership, deployment flexibility, pricing, and feature access.",
    columnHeaders: ["Feature", "Novu", "Knock", "What this means for you"],
    rows: [
      [
        "Open-source availability",
        "Open-source platform",
        "Proprietary managed platform",
        <>
          More control over your <span>stack</span> and a clearer fallback path
          if your infrastructure, compliance, or vendor requirements change
        </>,
      ],
      [
        "Deployment model",
        "Cloud, self-hosted, and Managed VPC options",
        "Hosted platform",
        <>
          Choose the deployment model that fits your requirements instead of
          adapting to a <span>hosted-only setup</span>
        </>,
      ],
      [
        "Pricing metric",
        <>
          <span>Workflow runs</span>
        </>,
        "Messages sent",
        <>
          You get a pricing model that is easier to predict when one
          notification flow sends across <span>multiple channels</span>
        </>,
      ],
      [
        "Code-first workflow ownership",
        "Framework lets you create workflows entirely in code and keep them alongside app code",
        "Dashboard workflows plus CLI and Management API support",
        <>
          With Novu, you can keep notification logic closer to your{" "}
          <span>application code</span> and source control when your team wants
          engineering-owned workflows
        </>,
      ],
      [
        "Tenant-specific branding and preferences",
        "Tenant-aware scoping and filtering through context-aware Inbox patterns",
        "Per-customer branding and preferences are Enterprise-only",
        <>
          You can support tenant-specific notification experiences earlier,
          without waiting for an <span>enterprise upgrade</span>
        </>,
      ],
      [
        "Workflow translations",
        "Available on Team and Enterprise",
        "Translation support is Enterprise-only",
        <>
          You can localize notification experiences for <span>end users</span>{" "}
          much earlier
        </>,
      ],
      [
        "In-app evaluation path",
        "Inbox keyless mode for instant testing",
        "Pre-built feed and inbox components",
        <>
          You can validate the <span>in-app experience</span> faster
        </>,
      ],
      [
        "Preferences experience",
        "Inbox includes notifications and preferences in the default UI",
        "Preferences are exposed through APIs and components",
        <>
          With Novu, you can ship a user-facing <span>preferences</span>{" "}
          experience faster
        </>,
      ],
      [
        "Public roadmap",
        "Community-driven with full visibility",
        "No public roadmap",
        <>Know what&apos;s coming and request features in the open</>,
      ],
    ],
  },
  banner: {
    title: "Migrate from Knock to Novu",
    description:
      "Bring your workflows, templates, and notification logic to Novu with a more flexible, open infrastructure. Reduce vendor lock-in and gain full control with self-hosting and developer-first workflows.",
    cta: {
      label: "Migration Guide",
      href: "https://docs.novu.co/guides/migrate-from-knock-to-novu",
      clickLocation: "comparison_knock_banner",
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
          question: "Is Novu really free to use?",
          answer: (
            <p>
              Novu has a free plan that includes 10,000 workflow runs per month,
              support for email, in-app, SMS, chat, and push, plus US and EU
              data residency.
            </p>
          ),
        },
        {
          question:
            "How does Novu pricing compare when one workflow sends on multiple channels?",
          answer: (
            <p>
              Novu&apos;s cloud pricing is based on workflow runs, while Knock
              bills on messages sent. Knock defines a billable message as one
              message delivered to one user on one channel, so if one workflow
              sends both an in-app message and an email, that counts as two
              messages on Knock.
            </p>
          ),
        },
        {
          question: "Do I need to self-host Novu to get value from it?",
          answer: (
            <p>
              No. You can use Novu as a cloud product on the Free, Pro, or Team
              plans, and move to self-hosted or Managed VPC only if you later
              need more control.
            </p>
          ),
        },
        {
          question: "How long does it take to migrate from Knock to Novu?",
          answer: (
            <p>
              It depends on how many workflows, providers, and in-app
              experiences you need to move. Most teams can migrate in phases
              instead of replacing everything at once, starting with core
              workflows or in-app notifications first, then moving templates,
              providers, and preferences over time. Both platforms support
              API-driven workflows and integrations, which makes a phased
              migration practical. And our team is available to help, just send
              a message.
            </p>
          ),
        },
        {
          question:
            "Does Novu support tenant-specific notification experiences for B2B SaaS?",
          answer: (
            <p>
              Yes. Novu supports multi-tenancy out of the box. You can separate
              tenants by subscriber identity, scope Inbox feeds by tenant, and
              use contexts and topics to organize tenant-aware notification
              logic and targeting.
            </p>
          ),
        },
        {
          question:
            "Do I have to use Framework, or can I stay in the dashboard?",
          answer: (
            <p>
              You can stay in the dashboard. Novu&apos;s workflows can be
              created in the dashboard, via API, or in code with Framework, so
              Framework is optional. It is there for teams that want workflows
              closer to source control and application code.
            </p>
          ),
        },
        {
          question:
            "Knock has an in-app component. What is actually different about Novu's Inbox?",
          answer: (
            <p>
              Novu&apos;s Inbox is a prebuilt in-app notification center,
              supports keyless mode for instant testing, comes with a preference
              feature and every part is fully customizable.
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
        clickLocation: "comparison_knock_cta",
        clickText: "start_free",
      },
      {
        kind: "secondary-button",
        label: "Talk To Sales",
        href: "/contact-us",
        clickLocation: "comparison_knock_cta",
        clickText: "talk_to_sales",
      },
    ],
  },
}
