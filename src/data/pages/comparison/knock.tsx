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
      "Novu is open-source notification infrastructure. Build a workflow once and deliver it to in-app, email, SMS, push, and chat, with digests, delays, and user preferences built in. Design it in the dashboard or define it in code, run it on Novu Cloud or your own servers, and let users reply to your AI agent through Novu Connect.",
    switchLabel: (
      <>
        Why teams switch to <span>Novu:</span>
      </>
    ),
    benefits: [
      "Create workflows via dashboard or code",
      "Open-source with self-host options",
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
          Compare provider retries separately from workflow follow-ups. Review
          the{" "}
          <a
            href="https://docs.novu.co/platform/developer/delivery-retries"
            target="_blank"
            rel="noopener noreferrer"
          >
            Novu retry policy
          </a>{" "}
          and{" "}
          <a
            href="https://docs.knock.app/send-notifications/delivering-notifications"
            target="_blank"
            rel="noopener noreferrer"
          >
            Knock delivery policy
          </a>
          .
          More control over your <span>stack</span> and a clearer fallback path
          if your infrastructure, compliance, or vendor requirements change
        </>,
      ],
      [
        "Deployment model",
        "Cloud and On Prem Self-Hosted",
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
        "Agent conversations",
        "Novu Connect lets users reply to notifications and talk to your AI agent.",
        "Agent Toolkit lets agents trigger workflows and request approvals.",
        <>
          Turn notification replies into <span>two-way conversations</span> with
          your agent.
        </>,
      ],
      [
        "Tenant-specific branding and preferences",
        "Tenant-aware scoping and filtering through context-aware Inbox patterns",
        "Per-customer branding and tenant-admin preferences are Enterprise-only",
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
          Try the <span>in-app experience</span> before you set up production
        </>,
      ],
      [
        "Preferences experience",
        "Inbox includes notifications and preferences in the default UI",
        "Preferences are exposed through APIs and components",
        <>
          Ship notifications and user <span>preferences</span> together in one
          Inbox
        </>,
      ],
      [
        "Public roadmap",
        "Community-driven with full visibility",
        "Changelog and support channels",
        <>Know what&apos;s coming and request features in the open</>,
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
              plans, and move to self-hosted only if you later need more
              control.
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
              <a
                href="https://docs.novu.co/guides/migrate-from-knock-to-novu"
                target="_blank"
                rel="noopener noreferrer"
              >
                Knock migration guide
              </a>{" "}
              to prepare the move.
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
