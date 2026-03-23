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
  title: "Novu vs Courier",
  description:
    "Compare Novu and Courier notification infrastructure platforms. See how Novu's open-source approach, developer experience, and pricing compare to Courier.",
  hero: {
    heading: {
      prefix: "Novu",
      highlight:
        "vs Courier: The best Courier alternative for end-to-end notifications",
    },
    subheading:
      "All your notification infrastructure needs, workflows, routing, preferences, and <Inbox /> in one platform, open source and built for builders and teams.",
    primaryCta: {
      label: "Start for Free",
      href: "https://dashboard.novu.co/auth/sign-up",
    },
    secondaryCta: {
      label: "Jump to Comparison",
      href: "#comparison",
    },
    note: (
      <>
        Free up to 10k events / month <span>No credit card required</span>
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
      "Courier works well when teams are getting started with notifications. But as your product grow, its split architecture becomes harder to manage.",
    switchLabel: (
      <>
        Why teams switch to <span>Novu:</span>
      </>
    ),
    benefits: [
      "One unified workflow model",
      "Open source and self-hostable",
      "Built to scale with your product",
    ],
    cta: {
      label: "Get Started",
      href: "https://dashboard.novu.co/auth/sign-up",
    },
  },
  frustrations: {
    title: "The frustrations that bring teams to Novu",
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
    ],
    cta: {
      label: "Switch to Novu",
      href: "https://dashboard.novu.co/auth/sign-up",
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
        title: "Everything you need — open source",
        description:
          "In-app inbox, real-time delivery, and user preferences. Digest logic, multi-tenant support, and localization. All included with Novu.",
        image: digestIllustration,
        icon: digestIcon,
      },
      {
        title: "What users see — in minutes",
        description:
          "Real-time delivery, unread counts, snooze controls, and preferences. Styled out of the box and customizable with the appearance prop.",
        image: notificationsIllustration,
        icon: notificationsIcon,
      },
    ],
    cta: {
      label: "Explore Novu",
      href: "https://dashboard.novu.co/auth/sign-up",
    },
  },
  codeSection: {
    title: "Add notifications with just a few lines of code",
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
          Switch between <span>Novu</span> Cloud and self-hosted anytime.
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

        "Separate layer for content and a different layer for orchestration.",
        <>
          <span>One workflow per use case</span> makes debugging easier.
        </>,
      ],
      [
        "Code-first workflows",
        "Define workflows and add notifications in code.",
        "GUI only",
        <>
          For engineering teams treating notification logic as{" "}
          <span>product logic.</span>
        </>,
      ],
      [
        "Data residency",
        "Free: US + EU. Enterprise adds SG, UK, AU, JP, KR, VPC, On-Prem.",
        "EU datacenter available at Enterprise tier only.",
        <>
          Courier: US/EU only. Novu: <span>global + On-Prem.</span>
        </>,
      ],
      [
        "Multi-tenant support",
        "Available on both free and paid plans.",
        "Enterprise tier only.",
        <>
          Novu enables <span>tenant context earlier.</span>
        </>,
      ],
      [
        "User preferences",
        "Included in standard plans, configurable from Inbox.",
        "Enterprise tier only.",
        <>
          Users control notifications <span>from day one</span> with Novu.
        </>,
      ],
      [
        "Pricing at scale",
        "Usage-based, event-counted",
        "$0.005 per send (~$500/mo at 100k sends)",
        <>
          <span>Predictable costs</span> that don&apos;t spike as your
          notification volume grows
        </>,
      ],
    ],
  },
  banner: {
    title: "Migrate from Courier to Novu",
    description:
      "Bring your workflows, templates, and notification logic to Novu with a more flexible, open infrastructure. Reduce vendor lock-in and gain full control with self-hosting and developer-first workflows.",
    cta: {
      label: "Migration Guide",
      href: "https://docs.novu.co/",
    },
  },
  reviewsSection: {
    title: "Don’t just take our word for it...",
  },
  faqSection: {
    accordion: {
      items: [
        {
          answer: (
            <p>
              A workflow run is one execution of a workflow. Triggering a
              workflow to a single subscriber counts as 1 run; triggering to a{" "}
              <a
                href="https://docs.novu.co/concepts/topics"
                target="_blank"
                rel="noopener noreferrer"
              >
                topic
              </a>{" "}
              with 100 subscribers counts as 100 runs after fan-out.
            </p>
          ),
          question: "Is Novu really free to use?",
        },
        {
          answer: (
            <p>
              A workflow run is one execution of a workflow. Triggering a
              workflow to a single subscriber counts as 1 run; triggering to a{" "}
              <a
                href="https://docs.novu.co/concepts/topics"
                target="_blank"
                rel="noopener noreferrer"
              >
                topic
              </a>{" "}
              with 100 subscribers counts as 100 runs after fan-out.
            </p>
          ),
          question: "How long does it take to migrate from Courier to Novu?",
        },
        {
          answer: (
            <p>
              A workflow run is one execution of a workflow. Triggering a
              workflow to a single subscriber counts as 1 run; triggering to a{" "}
              <a
                href="https://docs.novu.co/concepts/topics"
                target="_blank"
                rel="noopener noreferrer"
              >
                topic
              </a>{" "}
              with 100 subscribers counts as 100 runs after fan-out.
            </p>
          ),
          question: "Can I self-hos Novu if I need full data control?",
        },
        {
          answer: (
            <p>
              A workflow run is one execution of a workflow. Triggering a
              workflow to a single subscriber counts as 1 run; triggering to a{" "}
              <a
                href="https://docs.novu.co/concepts/topics"
                target="_blank"
                rel="noopener noreferrer"
              >
                topic
              </a>{" "}
              with 100 subscribers counts as 100 runs after fan-out.
            </p>
          ),
          question:
            "Does Novu support multi-tenant architectures for B2B SaaS products?",
        },
        {
          answer: (
            <p>
              A workflow run is one execution of a workflow. Triggering a
              workflow to a single subscriber counts as 1 run; triggering to a{" "}
              <a
                href="https://docs.novu.co/concepts/topics"
                target="_blank"
                rel="noopener noreferrer"
              >
                topic
              </a>{" "}
              with 100 subscribers counts as 100 runs after fan-out.
            </p>
          ),
          question: "What is Novu Framework and do I have to use it?",
        },
      ],
    },
    title: "Frequently asked questions",
  },
  ctaSection: {
    title: "Switch to Novu",
    description:
      "Adding notification infrastructure into your application shouldn’t be complicated.",
    hint: "Free for 10K workflow runs/month",
    actions: [
      {
        kind: "primary-button",
        label: "Start Free",
        href: "https://dashboard.novu.co/?utm_campaign=gs-website-inbox",
      },
      {
        kind: "secondary-button",
        label: "Talk To Sales",
        href: "/contact-us",
      },
    ],
  },
}
