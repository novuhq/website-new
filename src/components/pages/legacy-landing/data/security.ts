import type {
  ComplianceItem,
  IconGridData,
  LinkCardData,
  PictureSectionData,
  SecurityCtaData,
} from "../types"

const ASSET_ROOT = "/images/pages/security"

export const securityHero = {
  title: "Secure and robust notifications",
  description:
    "Novu is committed to providing secure and compliant infrastructure, and makes it easy for you to access these features.",
  image: {
    src: `${ASSET_ROOT}/secure-notification.jpg`,
    alt: "",
    width: 1400,
    height: 954,
  },
} satisfies PictureSectionData

export const securityCompliance = {
  title: "Compliance where it counts",
  items: [
    {
      title: "SOC2 Type II",
      image: {
        src: `${ASSET_ROOT}/soc-2.svg`,
        alt: "",
        width: 80,
        height: 80,
      },
    },
    {
      title: "HIPAA",
      image: {
        src: `${ASSET_ROOT}/hipaa.svg`,
        alt: "",
        width: 80,
        height: 80,
      },
    },
    {
      title: "ISO 27001:2013",
      image: {
        src: `${ASSET_ROOT}/iso.svg`,
        alt: "",
        width: 80,
        height: 80,
      },
    },
    {
      title: "GDPR",
      image: {
        src: `${ASSET_ROOT}/gdpr.svg`,
        alt: "",
        width: 80,
        height: 80,
      },
    },
  ] satisfies readonly ComplianceItem[],
}

export const securityFeatures = {
  title: "The fastest way to create rich, customized application notifications",
  items: [
    {
      icon: `${ASSET_ROOT}/compliance.svg`,
      title: "Compliance certifications",
      description:
        "Novu Cloud is compliant with GDPR, SOC 2 Type II, and ISO 27001 standards.",
      link: {
        label: "Learn more",
        href: "https://trust.novu.co",
        newTab: true,
      },
    },
    {
      icon: `${ASSET_ROOT}/residency.svg`,
      title: "Data residency options",
      description:
        "Novu Cloud is deployed in North America (US) and EU (Germany), with more geographies planned soon.",
      link: {
        label: "Learn more",
        href: "https://docs.novu.co/additional-resources/security?utm_campaign=ws_security",
        newTab: true,
      },
    },
    {
      icon: `${ASSET_ROOT}/encryption.svg`,
      title: "HMAC encryption",
      description: "Data exchanges are always encrypted by default.",
      link: {
        label: "Learn more",
        href: "https://docs.novu.co/platform/sdks/react?utm_campaign=ws_security",
        newTab: true,
      },
    },
    {
      icon: `${ASSET_ROOT}/assessment.svg`,
      title: "Security assessments",
      description:
        "Regular penetration tests and evidence collection ensure we stay proactive.",
      link: {
        label: "Learn more",
        href: "https://trust.novu.co",
        newTab: true,
      },
    },
    {
      icon: `${ASSET_ROOT}/data-management.svg`,
      title: "User data management",
      description:
        "Clear data storage guidelines and examples help you do the right thing.",
      link: {
        label: "Learn more",
        href: "https://docs.novu.co/additional-resources/security#for-how-long-user-data-is-stored?utm_campaign=ws_security",
        newTab: true,
      },
    },
    {
      icon: `${ASSET_ROOT}/open-source.svg`,
      title: "Open source",
      description:
        "No other notification provider lets you see the source code.",
      link: {
        label: "Learn more",
        href: "https://docs.novu.co/community/overview?utm_campaign=ws_security",
        newTab: true,
      },
    },
  ],
} satisfies IconGridData

export const securityDeploymentModes = {
  title: "Multiple deployment modes will satisfy every security requirement",
  description:
    "Novu is the most powerful and flexible notification infrastructure platform available.",
  cards: [
    {
      title: "Novu Cloud",
      description:
        "Certifiably the best way to securely send mission-critical notifications to your users.",
      link: {
        label: "Learn more",
        href: "https://docs.novu.co/?utm_campaign=ws_security",
        newTab: true,
      },
    },
    {
      title: "Novu Cloud + Framework",
      description:
        "Cloud delivery with available local notification hydration and custom workflow management.",
      link: {
        label: "Learn more",
        href: "https://docs.novu.co/framework/introduction?utm_campaign=ws_security",
        newTab: true,
      },
    },
    {
      title: "Self-hosted project",
      description:
        "Completely run your own Novu Project in your own environment.",
      link: {
        label: "Learn more",
        href: "https://docs.novu.co/community/self-hosting-novu/overview?utm_campaign=ws_security",
        newTab: true,
      },
    },
  ] satisfies readonly LinkCardData[],
  backgroundSrc: `${ASSET_ROOT}/deployment-blur.svg`,
}

export const securityCta = {
  title: "Securely send your first code-based notification",
  primary: {
    title: "Novu Cloud",
    description:
      "Try Novu for free today, and send your first notification while your coffee is still too hot to drink.",
    action: {
      label: "Try Novu",
      href: "https://dashboard.novu.co/auth/sign-up?utm_campaign=ws_security",
    },
  },
  secondary: {
    title: "Book a Meeting",
    description:
      "Ready to chat instead? Book a meeting with us, and we'll get your questions answered.",
    action: {
      label: "Meet with Novu",
      href: "https://novu.co/contact-us/?utm_campaign=ws_security",
    },
  },
} satisfies SecurityCtaData

export const securityCtaDots = `${ASSET_ROOT}/cta-dots.png`
export const securityCtaTexture = `${ASSET_ROOT}/cta-dots-purple.jpg`
