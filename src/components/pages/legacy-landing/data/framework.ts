import type {
  BentoCardData,
  CodeSectionData,
  DualCtaData,
  ImageCardData,
  LogoData,
  PictureSectionData,
} from "../types"

const ASSET_ROOT = "/images/pages/framework"

export const frameworkHero = {
  title: "Code-backed workflows can accomplish anything",
  description:
    "Optionally extend your Novu workflows with a locally-run Novu Framework engine. Define workflows in code, tie into local data, apply advanced logic, and solve for any notifications requirement imaginable.",
  action: {
    label: "Try Novu",
    href: "https://dashboard.novu.co/auth/sign-up?utm_campaign=ws_framework",
  },
  code: `import { workflow, CronExpression } from '@novu/framework';
import { z } from 'zod';
import { render } from '@react-email/components';

const weeklyComments = workflow('weekly-comments', async (event) => {
  await event.step.inApp('inbox-notification', async () => ({
    subject: \`**\${event.payload.userName}** commented in project\`,
    body: event.payload.comment,
  }));

  const digest = await event.step.digest('digest-comments', (controls) => ({
    cron: controls.schedule
  }), { controlSchema: z.object({ schedule: z.nativeEnum(CronExpression) }) });

  await event.step.email('digest-email', async (controls) => ({
    subject: controls.subject,
    body: render(<WeeklyDigestEmail {...controls} events={digest.events} />)
  }), {
    skip: () => !digest.events.length,
    controlSchema: z.object({
      subject: z.string().default('Hi {{subscriber.firstName}} - Acme Comments'),
      openAiModel: z.enum(['gpt-3.5-turbo', 'gpt-4o']).default('gpt-4o'),
      aiPrompt: z.string().default('Produce a concise comment digest'),
    })
  });
}, { payloadSchema: z.object({ userName: z.string(), comment: z.string() }) });

await weeklyComments.trigger({
  payload: { userName: 'John Doe', comment: 'Are you free to give me a call?' },
  to: 'jane@acme.com'
});`,
} satisfies CodeSectionData

export const frameworkDevelopers = {
  title: "Made for developers",
  cards: [
    {
      title: "Superior DX",
      description:
        "In-code customization, local IDE support, and native GitOps integrations streamline workflow management, debugging, and process alignment.",
      image: {
        src: `${ASSET_ROOT}/dx.png`,
        alt: "",
        width: 768,
        height: 428,
      },
    },
    {
      title: "Complete flexibility",
      description:
        "Build complex notification workflows that run in your environment boundary, safely access local data, and model literally any business requirement.",
      image: {
        src: `${ASSET_ROOT}/flexibility.png`,
        alt: "",
        width: 768,
        height: 428,
      },
    },
    {
      title: "Integration ready",
      description:
        "Integrates with popular application development frameworks, content templating engines, CRMs, and delivery providers.",
      image: {
        src: `${ASSET_ROOT}/integration.png`,
        alt: "",
        width: 768,
        height: 428,
      },
    },
  ] satisfies readonly ImageCardData[],
}

export const frameworkInfrastructure = {
  title: "Notification infrastructure\nfor modern teams",
  cards: [
    {
      title: "Bring your own code",
      description:
        "Define workflows as code, re-use components, and deploy confidently while developing in your IDE of choice.",
      image: {
        src: `${ASSET_ROOT}/code.jpg`,
        alt: "",
        width: 768,
        height: 380,
      },
      imageMobile: {
        src: `${ASSET_ROOT}/code-mobile.jpg`,
        alt: "",
        width: 320,
        height: 250,
      },
    },
    {
      title: "Type-Safe",
      description:
        "Bring your own JSON schemas for full end-to-end validation across all your team members.",
      image: {
        src: `${ASSET_ROOT}/type-safe.jpg`,
        alt: "",
        width: 416,
        height: 380,
      },
      imageMobile: {
        src: `${ASSET_ROOT}/type-safe-mobile.jpg`,
        alt: "",
        width: 320,
        height: 250,
      },
    },
    {
      title: "Observable and Scalable",
      description:
        "Novu handles any volume, any channel, and any team for mission-critical notifications.",
      image: {
        src: `${ASSET_ROOT}/debug.jpg`,
        alt: "",
        width: 768,
        height: 380,
      },
      imageMobile: {
        src: `${ASSET_ROOT}/debug-mobile.jpg`,
        alt: "",
        width: 320,
        height: 250,
      },
    },
    {
      title: "Consistent",
      description:
        "Notification infrastructure belongs in your CI/CD release cycle.",
      image: {
        src: `${ASSET_ROOT}/git-notification.jpg`,
        alt: "",
        width: 416,
        height: 380,
      },
      imageMobile: {
        src: `${ASSET_ROOT}/git-notification-mobile.jpg`,
        alt: "",
        width: 320,
        height: 250,
      },
    },
  ] satisfies readonly BentoCardData[],
}

export const frameworkCtaNow = {
  title: "Get started now",
  description:
    "Create complex workflows, access local data, and reuse existing content templates with Novu Framework.",
  primary: {
    label: "Try Novu",
    href: "https://dashboard.novu.co/auth/sign-up?utm_campaign=ws_framework",
  },
  secondary: {
    label: "Contact us",
    href: "https://novu.co/contact-us/?utm_campaign=ws_framework",
  },
} satisfies DualCtaData

export const frameworkIntegrations = {
  title: "Integrates with anything",
  description:
    "Built from scratch to integrate your existing tooling and content with the Novu Platform.",
  logos: [
    ["mjml", "mjml.svg"],
    ["NestJS", "nestjs.svg"],
    ["Remix", "remix.svg"],
    ["Astro", "astro.svg"],
    ["Hono", "hono.svg"],
    ["Twilio", "twilio.svg"],
    ["React Email", "react-email.svg"],
    ["Launch Darkly", "launch-darkly.svg"],
    ["Express", "express.svg"],
    ["Koa", "koa.svg"],
  ].map(([title, fileName]) => ({
    title,
    image: {
      src: `${ASSET_ROOT}/${fileName}`,
      alt: title,
      width: 128,
      height: 44,
    },
  })) satisfies readonly LogoData[],
}

export const frameworkWorkflowControl = {
  title: "Complete workflow control",
  description:
    "Development teams have complete control over customizations and workflows, and what other teams can safely edit or update.",
  action: {
    label: "Complete Control",
    href: "https://docs.novu.co/framework/introduction?utm_campaign=ws_framework",
  },
  image: {
    src: `${ASSET_ROOT}/workflow.png`,
    alt: "",
    width: 1198,
    height: 1198,
  },
} satisfies PictureSectionData

export const frameworkSelfService = {
  title: "Self service access for non-technical teams",
  description:
    "Product teams can safely make targeted content updates without breaking workflow or business logic. Reduce developer interrupts for things like content updates.",
  action: {
    label: "Do More With Controls",
    href: "https://docs.novu.co/framework/controls?utm_campaign=ws_framework",
  },
  image: {
    src: `${ASSET_ROOT}/self-service.png`,
    alt: "",
    width: 1128,
    height: 1177,
  },
} satisfies PictureSectionData

export const frameworkReuse = {
  title: "Reuse existing content and providers",
  description:
    "Integrate with legacy systems and platforms, and easily include content from any source and in any format.",
  action: {
    label: "Reuse my content",
    href: "https://docs.novu.co/framework/content/react-email",
  },
  image: {
    src: `${ASSET_ROOT}/reuse.png`,
    alt: "",
    width: 1024,
    height: 813,
  },
} satisfies PictureSectionData

export const frameworkLocalAndCloud = {
  title: "Locally run, cloud powered",
  description:
    "Your local Novu Framework integrates with Novu Cloud to power delivery, management, and analytics.",
  action: {
    label: "Local Studio",
    href: "https://docs.novu.co/framework/studio?utm_campaign=ws_framework",
  },
  image: {
    src: `${ASSET_ROOT}/cloud.png`,
    alt: "",
    width: 1081,
    height: 874,
  },
} satisfies PictureSectionData

export const frameworkCtaFree = {
  title: "Get started for free",
  description:
    "No credit card required.\nYou're just five minutes from your first Novu notification.",
  primary: {
    label: "Try Now",
    href: "https://dashboard.novu.co/auth/sign-up?utm_campaign=ws_framework",
  },
  secondary: {
    label: "Contact us",
    href: "https://novu.co/contact-us/?utm_campaign=ws_framework",
  },
} satisfies DualCtaData

export const frameworkCodeDots = `${ASSET_ROOT}/code-dots.png`
export const frameworkCtaBackground = `${ASSET_ROOT}/cta-background.svg`
