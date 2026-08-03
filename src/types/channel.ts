import { StaticImageData } from "next/image"

/**
 * Data model for a per-channel Novu Connect landing page
 * (e.g. /channels/slack). One entry per launched channel lives in
 * `src/data/pages/channels/`.
 */

export type ChannelOnRampType = "keyless" | "oauth"

export type ChannelTranscriptRole = "customer" | "agent" | "system"

export interface IChannelTranscriptLine {
  /** Speaker label, e.g. "Maya (Vantage)" or "Helix Agent". */
  from: string
  role: ChannelTranscriptRole
  text: string
}

export interface IChannelUseCase {
  /** Fictional company that owns the agent. */
  company: string
  /** Who the agent talks to. */
  audience: string
  /** One-line summary of the scenario. */
  summary: string
  transcript: IChannelTranscriptLine[]
}

export interface IChannelFaqItem {
  question: string
  answer: string
}

export interface IChannelPageData {
  slug: string
  /** Display name in external copy, e.g. "Microsoft Teams". */
  channelName: string
  /** Slug passed to `npx novu connect --channel <cliSlug>`. */
  cliSlug: string
  icon: StaticImageData
  seoTitle: string
  seoDescription: string
  hero: {
    eyebrow: string
    heading: string
    subheading: string
  }
  /** Short, quotable, plain-language answer for answer engines. */
  citation: string
  useCase: IChannelUseCase
  capabilities: string[]
  /** Copy-paste prompt a developer hands to their coding agent. */
  prompt: string
  onRamp: {
    type: ChannelOnRampType
    note: string
  }
  faq: IChannelFaqItem[]
  /**
   * Curated agent-template ids (Sanity `agentTemplate.id`) to feature as
   * one-click starter agents on this channel page, in display order.
   */
  starterTemplateIds: string[]
}
