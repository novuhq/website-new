import codeSectionIllustration from "@/images/pages/comparison/courier/code/illustration.jpg"
import codeIllustration from "@/images/pages/comparison/courier/difference/code.png"
import digestIllustration from "@/images/pages/comparison/courier/difference/digest.png"
import inboxIllustration from "@/images/pages/comparison/courier/difference/inbox.png"
import notificationsIllustration from "@/images/pages/comparison/courier/difference/notifications.png"
import regionsIllustration from "@/images/pages/comparison/courier/difference/regions.png"
import workflowIllustration from "@/images/pages/comparison/courier/difference/workflow.png"
import heroIllustration from "@/images/pages/comparison/courier/hero/illustration.jpg"
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

export const courierComparisonData: IComparisonPageData = {
  slug: "courier",
  competitor: "Courier",
  title: "Novu vs. Courier",
  description:
    "Compare Novu and Courier for multi-channel notifications, provider routing, failover, preferences, deployment, and agent communication.",
  // The page ranks on this title, so it stays fixed while the heading changes.
  metaTitle:
    "Novu vs Courier: The best Courier alternative for end-to-end notifications",
  hero: {
    heading: {
      prefix: "Novu",
      highlight:
        "vs. Courier: Best Courier alternative for customer messaging platform for humans & agents",
    },
    subheading:
      "Build multi-channel workflows with routing, preferences, and <Inbox /> in Novu Notify. Choose dashboard authoring or TypeScript, and add Novu Connect when users need to reply to your agent.",
    primaryCta: {
      label: "Start for Free",
      href: "https://dashboard.novu.co",
      clickLocation: "comparison_courier_hero",
      clickText: "start_for_free",
    },
    secondaryCta: {
      label: "Jump to Comparison",
      href: "#comparison",
      clickLocation: "comparison_courier_hero",
      clickText: "jump_to_comparison",
    },
    note: (
      <>
        Free up to 10,000 workflow runs per month.{" "}
        <span>No credit card required</span>
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
      "Novu is open-source notification infrastructure. Build a workflow once and deliver it to in-app, email, SMS, push, and chat, with digests, delays, and user preferences built in. Design it in the dashboard or define it in code, run it on Novu Cloud or your own servers, and let users reply to your AI agent through Novu Connect.",
    switchLabel: (
      <>
        Why teams switch to <span>Novu:</span>
      </>
    ),
    benefits: [
      "Create workflows via dashboard or code",
      "Open-source core and deployment options",
      "Notifications and agent conversations",
    ],
    cta: {
      label: "Get Started",
      href: "https://dashboard.novu.co",
      clickLocation: "comparison_courier_intro",
      clickText: "get_started",
    },
  },
  frustrations: {
    title: "The frustrations that bring teams to Novu",
    subtitle:
      "If you're on Courier and evaluating alternatives, you've probably run into at least one of these.",
    items: [
      {
        title: "Split Notification Architecture",
        description:
          "Courier is cloud-only at every tier. If you need regional data residency or want to run your own infrastructure, there's simply no path to self-hosting today.",
        icon: architectureIcon,
      },
      {
        title: "No Path to Self-Hosting",
        description:
          "Courier is cloud-only at every tier. If you need regional data residency or want to run your own infrastructure, there's still no path to self-hosting.",
        icon: lockIcon,
      },
      {
        title: "Features Locked Behind Plans",
        description:
          "Courier is cloud-only at every tier. If you need regional data residency or want to run your own infrastructure, there's currently no path to self-hosting.",
        icon: starsIcon,
      },
      {
        title: "No Agent to Answer Replies",
        description:
          "Users reply to notifications with questions. With Novu, assign an agent to a workflow and supported replies continue as a conversation with your AI agent, with the original notification as context.",
        icon: starsIcon,
      },
    ],
    cta: {
      label: "Switch to Novu",
      href: "https://dashboard.novu.co",
      clickLocation: "comparison_courier_frustrations",
      clickText: "switch_to_novu",
    },
  },
  difference: {
    title: "The Novu difference",
    subtitle:
      "Build delivery rules around your product. Control workflow steps, provider selection, and the in-app experience, with deployment options for your infrastructure requirements.",
    cards: [
      {
        title: "Notifications and preferences in one <Inbox />",
        description:
          "An in-app notification inbox wrapped in a single <Inbox />. Use the drop-in component or go headless and build your own UI.",
        image: inboxIllustration,
        icon: inboxIcon,
      },
      {
        title: "Every step in one place",
        description:
          "Build workflows in the dashboard or define them with Novu Framework. Configure channel content, conditions, delays, and digests in the same workflow.",
        image: workflowIllustration,
        icon: workflowIcon,
      },
      {
        title: "Self-host or use our cloud",
        description:
          "Use Novu Cloud or deploy Novu on your infrastructure. Features, licensing, and support differ by edition. Evaluate those requirements before choosing a deployment or planning a migration.",
        image: codeIllustration,
        icon: cloudIcon,
      },
      {
        title: "Data residency from day one",
        description:
          "Novu Cloud includes US and EU data residency on Free. Enterprise offers additional regional and self-hosted deployment options.",
        image: regionsIllustration,
        icon: regionsIcon,
      },
      {
        title: "Delivery logic for your product",
        description:
          "Combine channel steps with conditions, delays, and digests. Use contexts for tenant-aware notifications and translated content for the locales your product supports. Check the plan and edition for the features you need.",
        image: digestIllustration,
        icon: digestIcon,
      },
      {
        title: "Notifications users can act on",
        description:
          "Real-time delivery, unread counts, snooze controls, and preferences. Styled out of the box and customizable with the appearance prop.",
        image: notificationsIllustration,
        icon: notificationsIcon,
      },
    ],
    cta: {
      label: "Explore Novu",
      href: "https://dashboard.novu.co",
      clickLocation: "comparison_courier_difference",
      clickText: "explore_novu",
    },
  },
  codeSection: {
    title: "Add notifications with just a few lines of code",
    subtitle:
      "Trigger configured workflows from your backend, add an in-app Inbox, and let users manage their notification preferences.",
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
          "Trigger one configured workflow to send through its email, SMS, push, chat, and in-app steps.",
      },
      {
        title: "Add an in-app notification inbox",
        description:
          "Drop in the prebuilt <Inbox /> component or go headless and build your own notification center UI.",
      },
      {
        title: "Let users control their notifications",
        description:
          "Let subscribers manage global and per-workflow channel preferences in Inbox. Critical workflows bypass subscriber preferences.",
      },
    ],
  },
  comparisonTable: {
    title: "Novu vs Courier Comparison",
    subtitle:
      "A detailed look at infrastructure, workflows, and platform flexibility.",
    columnHeaders: ["Feature", "Novu", "Courier", "What this means for you"],
    rows: [
      [
        "Open source",
        "Open source with community-backed distributions.",
        "Proprietary platform",
        <>
          Reduces <span>vendor lock-in</span> and gives you{" "}
          <span>full control.</span>
        </>,
      ],
      [
        "Cloud or Self-hosted",
        <>
          <span>Novu</span> Cloud or self-host on your own infrastructure.
        </>,
        "Cloud only",
        <>
          Deploy in <span>cloud or self-host</span> when needed.
        </>,
      ],
      [
        "Workflow mode",
        <>
          <span>Novu</span> unifies notifications, routing, and orchestration.
        </>,
        "Send API for messages, with Journeys as a separate layer for orchestration.",
        <>
          <span>One workflow per use case</span> keeps content, routing, and
          timing together.
        </>,
      ],
      [
        "Code-first workflows",
        "Define workflows and add notifications in code.",
        "Visual designer, with APIs to manage templates and journeys.",
        <>
          For engineering teams treating notification logic as{" "}
          <span>product logic.</span>
        </>,
      ],
      [
        "Agent conversations",
        "Novu Connect lets users reply to notifications and talk to your AI agent.",
        "Agents can send notifications through MCP.",
        <>
          Turn notifications into <span>two-way conversations</span> with your
          agent.
        </>,
      ],
      [
        "Data residency",
        "Free: US + EU. Enterprise adds SG, UK, AU, JP, KR, VPC, On-Prem.",
        "US or EU. EU datacenter on Business and Enterprise plans.",
        <>
          Novu gives you <span>EU residency on the Free plan</span>, plus global
          and On-Prem options as you grow.
        </>,
      ],
      [
        "Multi-tenant support",
        "Available on both free and paid plans.",
        "Tenant objects for brands, overrides, and defaults.",
        <>
          Novu gives you <span>tenant context on every plan.</span>
        </>,
      ],
      [
        "User preferences",
        "Included in standard plans, configurable from Inbox.",
        "Preference center with topic opt-ins.",
        <>
          Users control notifications <span>from day one</span> with Novu.
        </>,
      ],
      [
        "Pricing at scale",
        "Usage-based, counted per workflow run.",
        "$0.005 per send (~$500/mo at 100k sends)",
        <>
          Start with <span>10,000 free workflow runs</span> a month, then pay
          for what you run.
        </>,
      ],
    ],
  },
  banner: {
    title: "Migrate from Courier to Novu",
    description:
      "Plan how to move your workflows, templates, subscribers, and preferences to Novu. Start with one representative workflow and verify its content, routing, failure behavior, and in-app experience.",
    cta: {
      label: "Migration Guide",
      href: "https://docs.novu.co/guides/migrate-from-courier-to-novu",
      clickLocation: "comparison_courier_banner",
      clickText: "migration_guide",
    },
  },
  reviewsSection: {
    title: "Don’t just take our word for it...",
  },
  faqSection: {
    accordion: {
      items: [
        {
          question: "Is Novu really free to use?",
          answer: (
            <p>
              Novu Notify Cloud has a Free plan with 10,000 workflow runs per
              month, email, in-app, SMS, chat, and push channels, plus US and EU
              data residency. Provider services can have their own charges.
              Evaluate Novu Connect usage and availability separately.
            </p>
          ),
        },
        {
          question: "How long does it take to migrate from Courier to Novu?",
          answer: (
            <p>
              Migration time depends on your templates, journeys, providers,
              preference model, and in-app integration. Map those requirements,
              then test one workflow before expanding the migration. Include
              subscriber identity and production cutover in the plan. Review
              provider recovery carefully because Courier and Novu have
              different retry and failover behavior. Use our{" "}
              <a href="https://docs.novu.co/guides/migrate-from-courier-to-novu">
                Courier migration guide
              </a>{" "}
              to prepare the move.
            </p>
          ),
        },
        {
          question: "Can I self-host Novu if I need deployment control?",
          answer: (
            <p>
              Yes. Novu offers Community Self-Hosted and commercial self-hosted
              options. Features, licensing, and support differ by edition.
              Evaluate the edition against your production requirements and
              account for operating the infrastructure. Novu Cloud remains
              available if you prefer managed infrastructure.
            </p>
          ),
        },
        {
          question:
            "Does Novu support multi-tenant architectures for B2B SaaS products?",
          answer: (
            <p>
              Yes. Use contexts to associate notifications with a tenant and
              scope Inbox feeds and subscriber preferences to that context.
              Context data can also personalize notification content and
              branding. Courier supports tenant objects with their own brands,
              defaults, and content. Compare the specific tenant controls your
              product needs and confirm current plan availability.
            </p>
          ),
        },
        {
          question: "What is Novu Framework, and do I have to use it?",
          answer: (
            <p>
              Novu Framework is an optional TypeScript workflow model that lets
              you run custom workflow code and retrieve content through a bridge
              endpoint in your application. You can also build workflows in the
              Novu dashboard. Choose the authoring model that fits your team and
              the application logic your notifications need.
            </p>
          ),
        },
        {
          question:
            "Can a user reply to a notification and continue with an AI agent?",
          answer: (
            <p>
              With Novu Connect, you can assign an agent to a workflow.
              Supported replies can open or continue a conversation with the
              originating notification context. For example, a user can reply in
              the Slack thread for an export-failed alert, and your agent can
              use the context to look up that export through an authorized tool.
              Novu handles communication. Your agent controls its model and
              business logic. Reply behavior depends on the channel. Web Chat
              does not inherit workflow notification origin. Courier also
              provides agent-driven notification sending through MCP.
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
      "Build one workflow from your product, connect your providers, and inspect the results. Talk to our team about deployment requirements or migration planning.",
    hint: "Novu Notify Free includes 10,000 workflow runs per month",
    actions: [
      {
        kind: "primary-button",
        label: "Start Free",
        href: "https://dashboard.novu.co/",
        clickLocation: "comparison_courier_cta",
        clickText: "start_free",
      },
      {
        kind: "secondary-button",
        label: "Talk To Sales",
        href: "/contact-us",
        clickLocation: "comparison_courier_cta",
        clickText: "talk_to_sales",
      },
    ],
  },
}
