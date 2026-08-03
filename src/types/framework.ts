import { StaticImageData } from "next/image"

/**
 * Data model for an agent framework, the "connect from" axis of the
 * framework x channel matrix (e.g. /channels/slack/langchain).
 * One entry per supported framework lives in `src/data/pages/frameworks/`.
 */

/**
 * How Novu Connect wires this framework to a channel.
 * - "bridge": custom-code bridge, the agent handler runs in the user's app,
 *   Novu forwards channel messages to a bridge route. Uses `--runtime`.
 * - "managed": a hosted managed agent, no codebase wiring.
 */
export type FrameworkConnectPath = "bridge" | "managed"

export interface IFrameworkStep {
  title: string
  /** Body copy. `{channelName}` and `{cliSlug}` are substituted at render. */
  body: string
}

export interface IFrameworkFaqItem {
  question: string
  answer: string
}

export interface IAgentFrameworkData {
  slug: string
  /** Display name, e.g. "LangChain" or "Vercel AI SDK". */
  name: string
  icon: StaticImageData
  connectPath: FrameworkConnectPath
  /**
   * `--runtime` value for the bridge path (e.g. "langchain", "ai-sdk").
   * Omitted for the managed path or frameworks without a dedicated runtime.
   */
  runtimeFlag?: string
  /** One-line, plain-language description of the framework. */
  tagline: string
  /** Paragraph: what the framework is and who builds with it. */
  whatItIs: string
  /** Bullets describing the framework's strengths. */
  strengths: string[]
  /**
   * How Novu Connect bridges an agent built with this framework.
   * `{channelName}` is substituted at render.
   */
  connectIntro: string
  /** Ordered how-to steps. Placeholders substituted at render. */
  steps: IFrameworkStep[]
  /**
   * Copy-paste prompt for a coding agent. `{channelName}` and `{cliSlug}`
   * are substituted at render.
   */
  promptTemplate: string
  /** Framework-specific FAQ. `{channelName}` substituted at render. */
  faq: IFrameworkFaqItem[]
  /** Path under docs.novu.co for the framework's connect guide. */
  docsPath: string
}
