import { type UseCasePageData, type UseCaseSlug } from "./types"

const DASHBOARD_LINK = "https://dashboard.novu.co/?utm_campaign=usecase-CTA"

export const USE_CASE_PAGES = {
  "add-notifications": {
    slug: "add-notifications",
    metadata: {
      title:
        "Add Notifications to Your App | Novu Notifications Infrastructure",
      description:
        "Easily add notifications to your app with Novu's robust infrastructure and ready-to-use components. Streamline notification delivery across multiple channels with broad framework support, type-safe workflows, and a no-code editor. Ensure reliability and scalability, integrate popular providers, and maintain full visibility and compliance. Simplify debugging and enhance innovation with a developer-friendly environment.",
    },
    hero: {
      title: "Test in minutes, go to prod before dinner",
      description:
        "Ship notifications in your app with production-ready infrastructure and out-of-the-box components.",
      links: [
        {
          text: "Create free account",
          url: DASHBOARD_LINK,
        },
        {
          text: "Book Meeting",
          url: "https://novu.co/contact-us/?utm_campaign=website-usecase-addNotification",
        },
      ],
    },
    features: [
      {
        animation: "digest",
        title: "Broad framework support",
        description:
          "Novu supports content frameworks like React Email, MJML, Vue-email, and more.",
      },
      {
        animation: "priority-management",
        title: "Type safe",
        description:
          "Zod and validation plugins ensure procuct teams won't break critical workflows as they update content.",
      },
      {
        animation: "content-management",
        title: "Code-first workflows",
        description:
          "Define workflows as code, re-use components, and deploy confidently while developing in your IDE of choice.",
      },
      {
        animation: "content-management",
        title: "No-code editor",
        description:
          "Developers start with content code in their framework of choice (React, Vue, etc.), and Product teams are presented with a no-code version to edit.",
      },
      {
        animation: "monitoring",
        title: "Dedicated environments",
        description:
          "A local preview environment that lives near your code and matching interface for Non-Technical users in production.",
      },
      {
        animation: "timezone",
        title: "Ready-to-use components",
        description:
          "Add notifications capabilities to your app through pre-built inbox and preference components--all stateful, and with DX in mind.",
      },
    ],
    painRestatement: {
      title: "DIY Notifications infrastructure is costly",
      description:
        "Building a notifications infrastructure to deliver messages gets exponentially more complex with every channel you add.",
      cards: [
        {
          title: "Challenging integrations",
          description:
            "Building notifications in-house requires near-constant effort to scope, build, and maintain... even to just make minor content updates.",
          image: {
            src: "/images/pages/usecases/add-notifications/pain-restatement/integration.svg",
            alt: "Create template",
            width: 80,
            height: 80,
          },
        },
        {
          title: "Impossible debugging",
          description:
            "Understanding why a user did or didn't get a notification is time consuming, and the more channels you must support, the harder debugging becomes",
          image: {
            src: "/images/pages/usecases/add-notifications/pain-restatement/debugging.svg",
            alt: "Connect providers",
            width: 80,
            height: 80,
          },
        },
        {
          title: "Decreased Innovation",
          description:
            "Innovation and velocity are intertwined, and When product teams need the development team's time to make even minor content changes, productivity decreases.",
          image: {
            src: "/images/pages/usecases/add-notifications/pain-restatement/innovation.svg",
            alt: "Add trigger",
            width: 80,
            height: 80,
          },
        },
      ],
    },
    benefits: {
      title: "Never build notifications again",
      description:
        "Updates, additional capabilities, superior DX, and promote more effective notifications practices, not distracting ongoing infrastructure work.",
      sections: [
        {
          title: "Extensible integrations",
          description:
            "Integrates with all popular providers and channels, and you can easily extend support to your own custom code.",
          image: {
            src: "/images/pages/usecases/add-notifications/benefits/extensible-integration.jpg",
            alt: "",
            width: 842,
            height: 560,
          },
        },
        {
          title: "Complete flexibility",
          description:
            "Product teams can freely edit content, update branding, and change images--all without any developer input.",
          image: {
            src: "/images/pages/usecases/add-notifications/benefits/complete-flexibility.jpg",
            alt: "",
            width: 842,
            height: 560,
          },
        },
        {
          title: "Scalable and reliable",
          description:
            "Deliver notifications at any scale and through any channel when needed, and get the SLA and observability to prove it.",
          image: {
            src: "/images/pages/usecases/add-notifications/benefits/scalable.jpg",
            alt: "",
            width: 842,
            height: 560,
          },
        },
        {
          title: "Full visibility and compliance",
          description:
            "Simplify debugging with complete observability and ensure compliance with ease.",
          image: {
            src: "/images/pages/usecases/add-notifications/benefits/full-visibility.jpg",
            alt: "",
            width: 842,
            height: 560,
          },
        },
        {
          title: "Open source backed",
          description:
            "Transparent, flexible and allows you to inspect, modify, and enhance the infrastructure along with the community.",
          image: {
            src: "/images/pages/usecases/add-notifications/benefits/open-source.jpg",
            alt: "",
            width: 842,
            height: 560,
          },
        },
      ],
    },
  },
  "content-management": {
    slug: "content-management",
    metadata: {
      title: "Notification Content Management for Developers",
      description:
        "Simplify content management with Novu's unified platform. Empower your product teams to manage notifications without interrupting developers. Utilize code-first workflows, a no-code editor, and broad framework support including React, Vue-email, and MJML. Ensure type-safe updates and consistent branding while delivering personalized notifications across all channels. Enhance collaboration, reduce development interruptions, and maintain a seamless user experience.",
    },
    hero: {
      title:
        "Eliminate the content dance between development and product teams",
      description:
        "Developers now empower product teams to safely interact with all of your notifications content, no interrupts needed.",
      links: [
        {
          text: "Create free account",
          url: DASHBOARD_LINK,
        },
        {
          text: "Book Meeting",
          url: "https://novu.co/contact-us/?utm_campaign=website-usecase-contentManagement",
        },
      ],
    },
    features: [
      {
        animation: "preferences",
        title: "Code-first workflows",
        description:
          "Define workflows as code, re-use content components, and deploy confidently while developing in your IDE of choice.",
      },
      {
        animation: "content-management",
        title: "No-code editor",
        description:
          "Product teams can manage workflow configurations without the risk of breaking notification flows.",
      },
      {
        animation: "digest",
        title: "Broad framework support",
        description:
          "Novu supports content frameworks like React-email, MJML, Vue-email, and more.",
      },
      {
        animation: "priority-management",
        title: "Type safe",
        description:
          "Zod and validation plugins ensure product teams won't break critical workflows as they update content.",
      },
      {
        animation: "monitoring",
        title: "Dedicated interfaces",
        description:
          "A local preview environment lives near your code, and product teams use a matching cloud interface.",
      },
      {
        animation: "timezone",
        title: "Single content source",
        description:
          "Write once, and use the same notification content across all notification channels.",
      },
    ],
    painRestatement: {
      title: "Content management issues are painful",
      description:
        "Developers build workflows, logic, and formatting, then provide editable content back to product teams.",
      cards: [
        {
          title: "Frequent developer interrupts",
          description:
            "It takes too long for product teams to get content updated when they constantly rely on developers for even minor changes.",
          image: {
            src: "/images/pages/usecases/content-management/pain-restatement/interrupts.svg",
            alt: "Create template",
            width: 80,
            height: 80,
          },
        },
        {
          title: "Inconsistent branding and customer experience",
          description:
            "When updating content is hard, branding and messaging issues slow business velocity, and confuse end users.",
          image: {
            src: "/images/pages/usecases/content-management/pain-restatement/branding.svg",
            alt: "Connect providers",
            width: 80,
            height: 80,
          },
        },
        {
          title: "Forced non-native CMS use",
          description:
            "Developers like to work in familiar technologies like React, and requiring them to ingest and use a different CMS slows everyone down.",
          image: {
            src: "/images/pages/usecases/content-management/pain-restatement/cms.svg",
            alt: "Add trigger",
            width: 80,
            height: 80,
          },
        },
      ],
    },
    benefits: {
      title: "Powerful, centralized content management in any framework",
      description:
        "From React to Vue to more. Re-use and build content once, then empower your product teams to maintain it.",
      sections: [
        {
          title: "Effortless collaboration",
          description:
            "Developers and product teams work together with unified notifications content and logic.",
          image: {
            src: "/images/pages/usecases/content-management/benefits/effortless-collaboration.jpg",
            alt: "",
            width: 842,
            height: 502,
          },
        },
        {
          title: "Reduce engineering interrupts",
          description:
            "Developers specify editable fields, show/hide toggles, and dropdown selectors for properties, empowering product teams to iterate faster.",
          image: {
            src: "/images/pages/usecases/content-management/benefits/reduce-engineering-interrupts.jpg",
            alt: "",
            width: 842,
            height: 560,
          },
        },
        {
          title: "Consistent user experience",
          description:
            "Product and marketing teams maintain ownership of messaging and branding, and can interate as fast as they need to.",
          image: {
            src: "/images/pages/usecases/content-management/benefits/consistent-user-experience.png",
            alt: "",
            width: 842,
            height: 532,
          },
        },
        {
          title: "Personalized notifications",
          description:
            "Deliver rich, personalized notifications across any channel, and know content updates will never break workflow logic.",
          image: {
            src: "/images/pages/usecases/content-management/benefits/personalized-messages.jpg",
            alt: "",
            width: 842,
            height: 495,
          },
        },
        {
          title: "Reuse content",
          description:
            "Bring your own content, no matter the format. Novu supports popular frameworks including React, Vue-email, MJML, and more.",
          image: {
            src: "/images/pages/usecases/content-management/benefits/reuse-content.jpg",
            alt: "",
            width: 842,
            height: 560,
          },
        },
      ],
    },
  },
  "improve-communication-experience": {
    slug: "improve-communication-experience",
    metadata: {
      title: "Improve User Communication Experience",
      description:
        "Enhance user communication with Novu's optimized notification experiences. Tailor interactions based on user preferences, timezones, and languages. Aggregate events into timely notifications, utilize multi-channel delivery, and centralize content management for seamless collaboration. Improve engagement, reduce notification fatigue, and maintain consistent branding. Ensure your notifications are relevant, personalized, and accessible across preferred channels.",
    },
    hero: {
      title: "Improve end user communication experiences",
      description:
        "Increase engagement with optimized notification experiences tailored to user interactions and preferences.",
      links: [
        {
          text: "Create free account",
          url: DASHBOARD_LINK,
        },
        {
          text: "Book Meeting",
          url: "https://novu.co/contact-us/?utm_campaign=website-usecase-improveComms",
        },
      ],
    },
    features: [
      {
        animation: "timezone",
        title: "Timezone awareness",
        description:
          "Send notifications based on a user's timezone and working hours.",
      },
      {
        animation: "digest",
        title: "Digest engine",
        description:
          "Aggregate multiple disparate events multiple events in to a single timely notification.",
      },
      {
        animation: "preferences",
        title: "User preferences",
        description:
          "Your end users directly set and configure their preferred communication methods, times, languages, and more.",
      },
      {
        animation: "content-management",
        title: "Translations",
        description:
          "Customize notification content to match each end user's preferred language.",
      },
      {
        animation: "monitoring",
        title: "Multi-channel",
        description:
          "Send notifications via email, SMS, push, chat, in-app, and more. Reach users through the most effective channels.",
      },
      {
        animation: "priority-management",
        title: "Content centralization",
        description:
          "Enable frictionless collaboration between developers, product teams, and marketers with centralized content management.",
      },
    ],
    painRestatement: {
      title: "Poor notifications experiences hurt your business",
      description:
        "End users expect seamless, on-brand, and timely notifications that add to their experience.",
      cards: [
        {
          title: "Missed updates",
          description:
            "Without timely notifications, users miss critical information such as order updates, password resets, or one-time password messages, leading to a poor experience with your application.",
          image: {
            src: "/images/pages/usecases/improve-communication-experience/pain-restatement/missed.svg",
            alt: "Create template",
            width: 72,
            height: 72,
          },
        },
        {
          title: "Notification fatigue",
          description:
            "Poorly targeted or excessive notifications overwhelm and annoy users, causing distractions and encouraging them to ignore notifications altogether.",
          image: {
            src: "/images/pages/usecases/improve-communication-experience/pain-restatement/notifications.svg",
            alt: "Connect providers",
            width: 72,
            height: 72,
          },
        },
        {
          title: "Negative brand perception",
          description:
            "Poorly managed notifications reflect negatively on your brand, and increase customer churn.",
          image: {
            src: "/images/pages/usecases/improve-communication-experience/pain-restatement/negative.svg",
            alt: "Add trigger",
            width: 72,
            height: 72,
          },
        },
      ],
    },
    benefits: {
      title:
        "Empower product teams to build notifications experiences that delight",
      description:
        "Novu is the easy button for notifications. Developers get the framework they need, and product teams get the content editing access they demand.",
      sections: [
        {
          title: "Relevant notifications",
          description:
            "Communicate with your users at the right time, in the right channel, and in the best language for them.",
          image: {
            src: "/images/pages/usecases/improve-communication-experience/benefits/time-relevant-notifications.jpg",
            alt: "",
            width: 842,
            height: 560,
          },
        },
        {
          title: "Personalized messages",
          description:
            "Highly-customized and tailored messages increase brand perception and customer experience.",
          image: {
            src: "/images/pages/usecases/improve-communication-experience/benefits/personalized-messages.jpg",
            alt: "",
            width: 842,
            height: 495,
          },
        },
        {
          title: "Consistent branding",
          description:
            "Product and marketing teams maintain ownership of messaging and branding, and can iterate as fast as they need to.",
          image: {
            src: "/images/pages/usecases/improve-communication-experience/benefits/consistent-branding.jpg",
            alt: "",
            width: 842,
            height: 560,
          },
        },
        {
          title: "Multi-channel Accessibility",
          description:
            "Reach your users on the channels they prefer, be it email, SMS, push notifications, Chat or in-app messages.",
          image: {
            src: "/images/pages/usecases/improve-communication-experience/benefits/multi-channel-accessibility.jpg",
            alt: "",
            width: 842,
            height: 532,
          },
        },
      ],
    },
  },
  "multi-channel-notifications": {
    slug: "multi-channel-notifications",
    metadata: {
      title: "Multi-Channel Notifications",
      description:
        "Boost user engagement and streamline notifications with Novu's multi-channel notifications. Effortlessly integrate email, SMS, push, chat, and in-app notifications into your app with centralized content management and extensive provider integrations. Enhance visibility, optimize strategies, and ensure seamless user experiences. Simplify development, reduce costs, and eliminate friction between teams.",
    },
    hero: {
      title: "Expand your reach with multi-channel notifications",
      description:
        "Add new notification channels to your app faster than you can brew a pot of coffee.",
      links: [
        {
          text: "Create free account",
          url: DASHBOARD_LINK,
        },
        {
          text: "Book Meeting",
          url: "https://novu.co/contact-us/?utm_campaign=website-usecase-multiChannel",
        },
      ],
    },
    features: [
      {
        animation: "digest",
        title: "Endless provider integrations",
        description:
          "Batteries included. Use our dozens of pre-built provider integrations, or easily extend Novu through your own custom one.",
      },
      {
        animation: "content-management",
        title: "Content centralization",
        description:
          "Enable frictionless collaboration between developers and product teams with centralized content management.",
      },
      {
        animation: "timezone",
        title: "Unified API",
        description:
          "Integrate Novu with your application once, and access any delivery provider instantly.",
      },
      {
        animation: "priority-management",
        title: "Multi-channel",
        description:
          "Send notifications via email, SMS, push, chat, in-app, and more. Reach users through the most effective channels.",
      },
      {
        animation: "monitoring",
        title: "Observability",
        description:
          "Gain clear visibility into how and why a notification was (or was not) sent so you can optimize strategies and efficiently debug.",
      },
      {
        animation: "preferences",
        title: "User preferences",
        description:
          "Your end users directly set and configure their preferred communication methods, times, languages, and more.",
      },
    ],
    painRestatement: {
      title: "Adding new notification channels is costly and complex",
      description:
        "More channels and content sources means more complexity, risk, and team friction.",
      cards: [
        {
          title: "High costs",
          description:
            "DIY notifications infrastructure requires significant engineering effort, distracting teams from adding value to their products.",
          image: {
            src: "/images/pages/usecases/multi-channel-notifications/pain-restatement/costs.svg",
            alt: "Create template",
            width: 80,
            height: 80,
          },
        },
        {
          title: "Integration complexity",
          description:
            "Every new channel comes with a new custom integration, content source requirement, and ongoing maintenance burden.",
          image: {
            src: "/images/pages/usecases/multi-channel-notifications/pain-restatement/integration.svg",
            alt: "Connect providers",
            width: 80,
            height: 80,
          },
        },
        {
          title: "Inconsistent user experiences",
          description:
            "When product teams cannot easily manage and iterate on content, user experiences suffer... and so does your brand.",
          image: {
            src: "/images/pages/usecases/multi-channel-notifications/pain-restatement/inconsistent.svg",
            alt: "Add trigger",
            width: 80,
            height: 80,
          },
        },
      ],
    },
    benefits: {
      title: "All of the flexibility of DIY, none of the hassle",
      description:
        "Increase end user engagement with multi-channel notifications and centralized content.",
      sections: [
        {
          title: "Extensible integrations",
          description:
            "Integrates with all popular providers and channels, and you can easily extend support to your own custom code.",
          image: {
            src: "/images/pages/usecases/multi-channel-notifications/benefits/extensible-integration.jpg",
            alt: "",
            width: 842,
            height: 560,
          },
        },
        {
          title: "Engage end-users regardless of channel",
          description:
            "Easily implement multi-channel notifications and flexible provider management, boosting platform user engagement.",
          image: {
            src: "/images/pages/usecases/multi-channel-notifications/benefits/engage-end-users.jpg",
            alt: "",
            width: 842,
            height: 532,
          },
        },
        {
          title: "Reduce friction between development and product teams",
          description:
            "Eliminate productivity barriers when developers provide notifications infrastructure to product teams. Development teams focus on core app value while product iterates.",
          image: {
            src: "/images/pages/usecases/multi-channel-notifications/benefits/reduce-distractions.jpg",
            alt: "",
            width: 842,
            height: 495,
          },
        },
        {
          title: "Ship faster",
          description:
            "Engineering teams easily deliver notification capabilities into the applications.",
          image: {
            src: "/images/pages/usecases/multi-channel-notifications/benefits/ship-faster.jpg",
            alt: "",
            width: 842,
            height: 532,
          },
        },
      ],
    },
  },
  "unified-platform": {
    slug: "unified-platform",
    metadata: {
      title: "Unified Development and Product Notification Platform",
      description:
        "Unify your team's notification workflows with Novu's comprehensive platform. Streamline communication with centralized content, type-safe schemas, and reusable components. Empower both developers and product teams to collaborate seamlessly using code-first and no-code tools. Enhance efficiency, reduce friction, and deliver consistent, branded user experiences across all channels. Accelerate development, minimize interruptions, and maintain full visibility and control over notification management.",
    },
    hero: {
      title:
        "Unified product notification platform for development and product teams",
      description:
        "One platform for all of your notification needs, streamlining how your teams work together, and your users experience notifications.",
      links: [
        {
          text: "Create free account",
          url: DASHBOARD_LINK,
        },
        {
          text: "Book Meeting",
          url: "https://novu.co/contact-us/?utm_campaign=website-usecase-unifiedPlatform",
        },
      ],
    },
    features: [
      {
        animation: "digest",
        title: "Centralized content",
        description:
          "Create notification content that can be used across all supported notification channels within Novu.",
      },
      {
        animation: "priority-management",
        title: "Type safe",
        description:
          "Bring your own JSON schemas for full end-to-end validation across all your team members.",
      },
      {
        animation: "preferences",
        title: "Code-first workflows",
        description:
          "Define workflows as code, re-use components, and deploy confidently while developing in your IDE of choice.",
      },
      {
        animation: "content-management",
        title: "No-code editor",
        description:
          "Product teams can manage workflow configurations without the risk of breaking notification flows.",
      },
      {
        animation: "monitoring",
        title: "Dedicated environments",
        description:
          "A local preview environment that lives near your code and a matching interface for Non-Technical users in production.",
      },
      {
        animation: "timezone",
        title: "Reusable components",
        description:
          "Leverage our library of pre-built Inbox and end user preferences components to quickly build and deploy notifications capabilities directly in your app.",
      },
    ],
    painRestatement: {
      title: "Notifications the right way are not trivial",
      description:
        "Flexible notification infrastructure is very difficult to implement. Spend your development cycles where they can best make a difference.",
      cards: [
        {
          title: "Evolving requirements",
          description:
            "Every new channel or provider requires development to build new app capabilities to new API endpoints.",
          image: {
            src: "/images/pages/usecases/unified-platform/pain-restatement/capabilities.svg",
            alt: "Create template",
            width: 80,
            height: 80,
          },
        },
        {
          title: "Endless backlog",
          description:
            "Engineering teams lag behind product team notification requirements and needs.",
          image: {
            src: "/images/pages/usecases/unified-platform/pain-restatement/backlog.svg",
            alt: "Connect providers",
            width: 80,
            height: 80,
          },
        },
        {
          title: "Constant cross-team friction",
          description:
            "Product teams want to rapidly iterate and update content, but require developer time and interrupts to be successful, causing friction from mismanaged expectations and misalignment.",
          image: {
            src: "/images/pages/usecases/unified-platform/pain-restatement/content-iteration.svg",
            alt: "Add trigger",
            width: 80,
            height: 80,
          },
        },
      ],
    },
    benefits: {
      title: "Never build notifications again",
      description:
        "Increase team velocity and customer experience by adding notifications to your existing application.",
      sections: [
        {
          title: "Ship faster",
          description:
            "Engineering teams easily deliver notification capabilities into the applications.",
          image: {
            src: "/images/pages/usecases/unified-platform/benefits/ship-faster.jpg",
            alt: "",
            width: 842,
            height: 532,
          },
        },
        {
          title: "Reduce engineering interrupts",
          description:
            "Developers specify which fields and values product teams can manipulate, empowering them to iterate faster.",
          image: {
            src: "/images/pages/usecases/unified-platform/benefits/reduce-engineering-interrupts.jpg",
            alt: "",
            width: 842,
            height: 560,
          },
        },
        {
          title: "Consistent user experience",
          description:
            "Product and marketing teams maintain ownership of messaging and branding, and can iterate as fast as they need to.",
          image: {
            src: "/images/pages/usecases/unified-platform/benefits/consistent-user-experience.png",
            alt: "",
            width: 842,
            height: 532,
          },
        },
        {
          title: "Effortless collaboration",
          description:
            "Developers and product teams work together on a platform that unifies all notifications content and logic.",
          image: {
            src: "/images/pages/usecases/unified-platform/benefits/effortless-collaboration.jpg",
            alt: "",
            width: 842,
            height: 502,
          },
        },
      ],
    },
  },
} satisfies Record<UseCaseSlug, UseCasePageData>

export function isUseCaseSlug(value: string): value is UseCaseSlug {
  return value in USE_CASE_PAGES
}
