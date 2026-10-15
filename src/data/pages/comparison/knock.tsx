import codeSectionIllustration from "@/images/pages/comparison/courier/code/illustration.jpg";
import codeIllustration from "@/images/pages/comparison/courier/difference/code.png";
import digestIllustration from "@/images/pages/comparison/courier/difference/digest.png";
import inboxIllustration from "@/images/pages/comparison/courier/difference/inbox.png";
import notificationsIllustration from "@/images/pages/comparison/courier/difference/notifications.png";
import regionsIllustration from "@/images/pages/comparison/courier/difference/regions.png";
import workflowIllustration from "@/images/pages/comparison/courier/difference/workflow.png";
import heroIllustration from "@/images/pages/comparison/knock/hero/illustration.jpg";
import cloudIcon from "@/svgs/pages/comparison/courier/difference/cloud.svg";
import digestIcon from "@/svgs/pages/comparison/courier/difference/digest.svg";
import inboxIcon from "@/svgs/pages/comparison/courier/difference/inbox.svg";
import notificationsIcon from "@/svgs/pages/comparison/courier/difference/notifications.svg";
import regionsIcon from "@/svgs/pages/comparison/courier/difference/regions.svg";
import workflowIcon from "@/svgs/pages/comparison/courier/difference/workflow.svg";
import architectureIcon from "@/svgs/pages/comparison/courier/frustrations/architecture.svg";
import lockIcon from "@/svgs/pages/comparison/courier/frustrations/lock.svg";
import starsIcon from "@/svgs/pages/comparison/courier/frustrations/stars.svg";



import type { IComparisonPageData } from "@/types/comparison";





export const knockComparisonData: IComparisonPageData = {
  slug: "knock",
  competitor: "Knock",
  title: "Novu vs. Knock",
  description:
    "Compare Novu and Knock for multi-channel notifications, provider routing, preferences, delivery retries, deployment, and agent communication.",
  // The page ranks on this title, so it stays fixed while the heading changes.
  metaTitle:
    "Novu vs Knock: The best Knock alternative for end-to-end notifications",
  hero: {
    heading: {
      prefix: "Novu",
      highlight:
        "vs. Knock: Best Knock alternative for customer engagement infrastructure",
    },
    subheading:
      "Build multi-channel workflows with routing, preferences, and <Inbox /> in Novu Notify. Add Novu Connect when users need to reply to your agent. Choose managed cloud or evaluate self-hosted deployment.",
    primaryCta: {
      label: "Start for Free",
      href: "https://dashboard.novu.co",
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
        Free up to 10k workflow runs / month.{" "}
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
      "Novu and Knock both support multi-channel workflows, user preferences, and in-app notifications. With Novu, you can build workflows in the dashboard or define them in code with Novu Framework. Our open-source core and deployment options give you control over how you build and run your notification system. Novu Connect adds conversation infrastructure for your agent.",
    switchLabel: (
      <>
        Why teams switch to <span>Novu:</span>
      </>
    ),
    benefits: [
      "Open-source with self-host options",
      "Dashboard workflows or code definitions",
      "Notifications and agent conversations",
    ],
    cta: {
      label: "Get Started",
      href: "https://dashboard.novu.co",
      clickLocation: "comparison_knock_intro",
      clickText: "get_started",
    },
  },
  frustrations: {
    title: "When Novu fits your requirements",
    subtitle:
      "Choose Novu when deployment ownership, application logic, or agent conversations shape your notification system.",
    items: [
      {
        title: "Choose where your infrastructure runs",
        description:
          "Use Novu Cloud for managed infrastructure or evaluate self-hosted deployment. Features, licensing, and support differ by edition, so choose against your production requirements.",
        icon: architectureIcon,
      },
      {
        title: "Start with a smaller paid plan",
        description:
          "Novu Pro starts at $30 per month with 30,000 workflow runs. Knock Starter costs $250 per month with 50,000 messages. Compare included usage and features alongside the starting price.",
        icon: lockIcon,
      },
      {
        title: "Localize notification content",
        description:
          "Manage translated notification content in Novu. Knock lists translation support on Enterprise. Compare translation management and current plan availability for the locales your product needs.",
        icon: starsIcon,
      },
      {
        title: "Continue from a user's reply",
        description:
          "Assign an agent to a workflow so supported replies can continue as a conversation with notification context. Novu Connect handles communication while your agent controls its model and tools.",
        icon: lockIcon,
      },
      {
        title: "Run custom workflow logic from your codebase",
        description:
          "Define TypeScript workflows with Novu Framework and retrieve content through a bridge endpoint in your application. Knock also supports source-controlled workflow definitions through its CLI. Compare the execution model your team needs.",
        icon: starsIcon,
      },
    ],
    cta: {
      label: "Switch to Novu",
      href: "https://dashboard.novu.co",
      clickLocation: "comparison_knock_frustrations",
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
          "Use Novu Cloud or deploy Novu on your infrastructure. Compare Community Self-Hosted and commercial editions for the features, licensing, and support your team needs.",
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
        title: "Ship tenant-aware experiences cleanly",
        description:
          "Contexts, topics, and Inbox scoping help map notification behavior to real B2B product structure.",
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
      clickLocation: "comparison_knock_difference",
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
          "Drop in a pre-built <Inbox /> component or go headless and build your own notification center UI.",
      },
      {
        title: "Let users control their notifications",
        description:
          "Let subscribers manage global and per-workflow channel preferences in Inbox. Critical workflows bypass subscriber preferences.",
      },
    ],
  },
  comparisonTable: {
    title: "Novu vs. Knock comparison",
    subtitle:
      "Compare channel coverage, routing, failure behavior, and agent communication alongside deployment and pricing.",
    columnHeaders: ["Feature", "Novu", "Knock", "What this means for you"],
    rows: [
      [
        "Notification channels",
        "Inbox, email, SMS, push, chat, and Tool integrations for on-call services and webhooks. Chat integrations include Slack, Teams, WhatsApp Business, Telegram, and Discord.",
        "Email, SMS, push, in-app feeds and guides, chat, and webhooks. Chat integrations include Slack, Teams, WhatsApp, and Discord.",
        "Confirm the specific provider and message format your product needs. Both cover the core notification channels.",
      ],
      [
        "Provider routing",
        "Email and SMS integration conditions select providers using subscriber, context, and workflow data. Chat and push have channel-specific routing behavior.",
        "Channel groups combine providers of the same type. Ordered rules can route to the first matching channel or every matching channel.",
        "Test provider-selection rules separately from the conditions that decide which workflow steps run.",
      ],
      [
        "Timing and conditional delivery",
        "Workflow conditions, delay steps, and digests control when a notification step runs.",
        "Workflow conditions, delays, and batching control when a notification step runs.",
        "Both support timed and conditional workflows. Model your actual follow-up rules before choosing.",
      ],
      [
        "Provider retries and recovery",
        "Standard provider sends receive one attempt, with provider-specific exceptions. No automatic provider failover.",
        "Retryable provider and network failures are retried up to eight times over 30 minutes. Undelivered messages can also be retried manually in the dashboard.",
        <>
          Compare provider retries separately from workflow follow-ups. Review
          the{" "}
          <a href="https://docs.novu.co/platform/developer/delivery-retries">
            Novu retry policy
          </a>{" "}
          and{" "}
          <a href="https://docs.knock.app/send-notifications/delivering-notifications">
            Knock delivery policy
          </a>
          .
        </>,
      ],
      [
        "Preferences experience",
        "Global and per-workflow channel preferences, with notifications and preferences in the default Inbox UI.",
        "Channel, category, and workflow preferences, with APIs and preference-center options.",
        "Compare your notification categories, preference precedence, and user-facing controls. Availability of tenant-admin controls is a separate question.",
      ],
      [
        "Delivery observability",
        "Activity Feed shows workflow runs, step outcomes, trigger data, and provider errors.",
        "Workflow debugging, message logs, provider requests and responses, and delivery-status tracking where supported.",
        "Check that your team can explain a skipped step, a failed provider request, and a later delivery outcome.",
      ],
      [
        "Agent communication",
        "Novu Connect handles user-agent conversations and reply delivery. Supported workflow replies can carry the originating notification context.",
        "Agent Toolkit exposes workflows as tools and supports human input and approvals. AI agent functions can enrich workflow data.",
        "Evaluate ongoing conversations, notification-triggered replies, and approval flows against your actual agent use case.",
      ],
      [
        "Open-source availability",
        "Open-source core, with commercially licensed enterprise modules.",
        "Managed platform.",
        "Novu's core can be inspected and extended. Review the license for the modules you intend to use.",
      ],
      [
        "Deployment model",
        "Novu Cloud, Community Self-Hosted, and commercial self-hosted options.",
        "Hosted platform, with dedicated infrastructure listed on Enterprise.",
        "Novu offers self-hosted deployment. Features and support differ by edition.",
      ],
      [
        "Pricing metric",
        "Novu Notify Cloud plans are based on workflow runs.",
        "Developer and Starter plans count messages successfully sent. Enterprise can offer monthly notified-user pricing.",
        "Estimate usage from complete workflows. In-app plus email counts as two messages on Knock. Provider charges remain separate.",
      ],
      [
        "Workflow authoring and source control",
        "Dashboard workflows or TypeScript definitions with Novu Framework and a bridge endpoint for custom execution.",
        "Dashboard workflows, CLI-managed local definitions and templates, and Management API support.",
        "Both support developer-managed workflows. Compare custom execution, content retrieval, and your deployment process.",
      ],
      [
        "Tenant-aware notification experiences",
        "Contexts scope Inbox feeds and subscriber preferences per tenant. Context data can personalize branding, and topics organize recipient groups.",
        "Built-in multi-tenancy. Per-customer branding and tenant-admin preferences are listed on Enterprise.",
        "Compare delivery and feed scoping separately from tenant-admin default or locked preferences. These are different capabilities.",
      ],
      [
        "Workflow translations",
        "Translated notification content with locale-based rendering. Check current plan availability.",
        "Translation support is listed on Enterprise.",
        "Compare locale management, fallback behavior, and plan availability for your localization requirements.",
      ],
      [
        "In-app evaluation path",
        "Inbox keyless mode for temporary evaluation, plus configured production setup.",
        "Prebuilt feed components and APIs for a custom in-app experience.",
        "Novu's keyless mode uses temporary data. Connect your environment and subscriber before using Inbox in production.",
      ],
    ],
  },
  banner: {
    title: "Migrate from Knock to Novu",
    description:
      "Plan how to move your workflows, templates, subscribers, and preferences to Novu. Start with one representative workflow and verify its content, delivery rules, and in-app behavior.",
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
              Novu Notify Cloud has a Free plan with 10,000 workflow runs per
              month, email, in-app, SMS, chat, and push channels, plus US and EU
              data residency. Provider services can have their own charges. Novu
              Connect has separate usage and availability to evaluate.
            </p>
          ),
        },
        {
          question:
            "How does Novu pricing compare when one workflow sends on multiple channels?",
          answer: (
            <p>
              Novu Notify Cloud plans count workflow runs. Knock&apos;s
              Developer and Starter plans count messages successfully sent to
              one user on one channel. A workflow that sends an in-app
              notification and an email counts as two messages on Knock. Knock
              does not count failed or bounced messages toward billable message
              usage, and Enterprise can offer monthly notified-user pricing.
              Compare your expected workflow and message volumes alongside
              current plan prices.
            </p>
          ),
        },
        {
          question: "Do I need to self-host Novu to get value from it?",
          answer: (
            <p>
              No. Novu Cloud provides managed infrastructure. Self-hosted
              deployment is available when your requirements call for it.
              Community Self-Hosted and commercial editions differ in features,
              licensing, and support, so evaluate the edition before planning a
              deployment or migration.
            </p>
          ),
        },
        {
          question: "How long does it take to migrate from Knock to Novu?",
          answer: (
            <p>
              Migration time depends on your workflows, providers, preference
              model, and in-app integration. Start by mapping those
              requirements, then test one workflow before expanding the
              migration. Include subscriber identity, preference data, delivery
              behavior, and production cutover in the plan. Use our{" "}
              <a href="https://docs.novu.co/guides/migrate-from-knock-to-novu">
                Knock migration guide
              </a>{" "}
              to prepare the move.
            </p>
          ),
        },
        {
          question:
            "Does Novu support tenant-specific notification experiences for B2B SaaS?",
          answer: (
            <p>
              Yes. Use contexts to associate notifications with a tenant and
              scope Inbox feeds and subscriber preferences to that context.
              Topics can group subscribers for notification targeting. Feed and
              delivery scoping should be evaluated separately from tenant-admin
              preference defaults and locks. Knock also supports multi-tenancy,
              so compare the specific tenant controls your product needs.
            </p>
          ),
        },
        {
          question:
            "Do I have to use Framework, or can I stay in the dashboard?",
          answer: (
            <p>
              You can build workflows in the dashboard. Novu Framework is an
              optional TypeScript workflow model for teams that need custom
              execution and content retrieval through a bridge endpoint. Knock
              also supports local workflow definitions and templates through its
              CLI, so source control alone is not the differentiator.
            </p>
          ),
        },
        {
          question:
            "Knock has an in-app component. What is different about Novu's Inbox?",
          answer: (
            <p>
              Novu&apos;s Inbox combines a notification feed and preferences in
              the default UI, with customization and headless options. Keyless
              mode lets you evaluate it using temporary data that expires after
              24 hours and is not tied to real subscribers. Production setup
              requires your environment and subscriber configuration. Knock also
              provides prebuilt feed components, so compare the controls and
              integration your product needs.
            </p>
          ),
        },
        {
          question:
            "Can both Novu and Knock deliver notifications across multiple channels?",
          answer: (
            <p>
              Yes. Both support email, SMS, push, in-app notifications, and
              chat. Compare the actual providers and content formats you need,
              then test conditions, user preferences, and follow-up messages in
              a complete workflow.
            </p>
          ),
        },
        {
          question: "How do Novu and Knock handle provider delivery failures?",
          answer: (
            <p>
              Knock retries retryable provider and network failures up to eight
              times over 30 minutes. Novu&apos;s standard provider sends receive
              one attempt, with provider-specific exceptions, and no automatic
              provider failover. Novu records failures in Activity Feed. On
              plans with outbound webhooks, your application can subscribe to
              messages.failed and implement a recovery policy. A configured
              workflow follow-up is different from retrying a rejected provider
              request.
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
              Your agent controls its model and business logic. Novu handles the
              communication. Reply behavior depends on the channel. Web Chat
              does not inherit workflow notification origin. Knock also supports
              agent-triggered workflows and human input and approvals through
              Agent Toolkit.
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