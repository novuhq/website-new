import type { StaticImageData } from "next/image"
import gdprBadge from "@/images/pages/home/certifications/gdpr.svg"
import hipaaBadge from "@/images/pages/home/certifications/hipaa.svg"
import isoBadge from "@/images/pages/home/certifications/iso-27001.svg"
import soc2Badge from "@/images/pages/home/certifications/soc-2-type-2.svg"
import awsLogo from "@/svgs/pages/channels/web-chat/frameworks/aws-mark.svg"
import chatSdkVercelLogo from "@/svgs/pages/channels/web-chat/frameworks/chat-sdk-vercel-mark.svg"
import claudeLogo from "@/svgs/pages/channels/web-chat/frameworks/claude-mark.svg"
import customCodeLogo from "@/svgs/pages/channels/web-chat/frameworks/custom-code-mark.svg"
import langchainLogo from "@/svgs/pages/channels/web-chat/frameworks/langchain-mark.svg"

/**
 * §6 "Deploy the ACI, not just chat" (Task 13). Figma desktop `45487-81046`,
 * mobile `45497-147576` (found inside the full mobile page `45487-98982`,
 * at y 5474 — the section isn't broken out as its own top-level frame on
 * mobile). Framework logo set `45497-146963`. Not personalized: no
 * `HueLayer`, no `--wc-accent*` custom properties.
 */

// Heading (`45487-81490` desktop, `45497-147506` mobile — identical text at
// both breakpoints, only size/line-height differ).
export const DEPLOY_ACI_HEADING = "Deploy the ACI, not just chat"

// Description (`45487-81491` desktop `#A3A6B2`, `45497-147507` mobile
// `rgba(255,255,255,0.8)` — same divergence pattern noted for §5).
export const DEPLOY_ACI_DESCRIPTION =
  "Add your agent. ACI handles identity, threads, delivery, compliance, and scale. Production-ready in under two minutes."

// Illustration alt text — the flattened illustration bakes in the text
// "Your agent" / "Your stack" and the "ACI LAYER" pill (`45487-81072`,
// `45487-81488`), which this describes for screen readers.
export const DEPLOY_ACI_ILLUSTRATION_ALT =
  "Diagram of your agent and stack connecting through Novu's ACI layer to every channel: web chat, Slack, Microsoft Teams, Telegram, WhatsApp, and email."

export interface IDeployAciItem {
  title: string
  body: string
}

// Items list (`45487-81492` desktop, `45497-147550` mobile — same five,
// same copy at both breakpoints, only type sizes differ).
export const DEPLOY_ACI_ITEMS: IDeployAciItem[] = [
  {
    title: "Identity & subscribers",
    body: "Every user identified and secured with HMAC. No auth or user store to build.",
  },
  {
    title: "One durable thread",
    body: "Context and history follow each user across every channel, on their own subscriber.",
  },
  {
    title: "Delivery that lands",
    body: "Retries, fallbacks, and deliverability from four years of notification infrastructure.",
  },
  {
    title: "Compliance, built in",
    body: "SOC 2 Type II, HIPAA, ISO 27001, and GDPR, in US and EU data regions.",
  },
  {
    title: "Scale from day one",
    body: "The same rails the open-source Novu, ~40K GitHub stars, runs in production.",
  },
]

export interface IDeployAciComplianceBadge {
  label: string
  icon: StaticImageData
}

// Compliance badge row (`45487-81517` desktop, `45497-147508` mobile),
// reading left to right: SOC 2 Type II, ISO 27001, GDPR, HIPAA. Reuses the
// existing marks from `src/images/pages/home/certifications/` rather than
// re-exporting from Figma — same vectors (same fill `#C2C4CC`), and this
// avoids a second, driftable copy of the same icon set.
export const DEPLOY_ACI_COMPLIANCE_BADGES: IDeployAciComplianceBadge[] = [
  { label: "SOC 2 Type II", icon: soc2Badge },
  { label: "ISO 27001", icon: isoBadge },
  { label: "GDPR", icon: gdprBadge },
  { label: "HIPAA", icon: hipaaBadge },
]

export interface IDeployAciFrameworkLogo {
  name: string
  icon: StaticImageData
}

// Center order follows the downward desktop / left-to-right mobile track.
// At first paint: Vercel in the center, LangChain outgoing, Claude incoming.
// Marks and corner frames stay together throughout the track, including the plate.
export const DEPLOY_ACI_FRAMEWORK_LOGOS: IDeployAciFrameworkLogo[] = [
  { name: "Chat SDK & Vercel", icon: chatSdkVercelLogo },
  { name: "Claude", icon: claudeLogo },
  { name: "AWS", icon: awsLogo },
  { name: "Custom code", icon: customCodeLogo },
  { name: "LangChain", icon: langchainLogo },
]
