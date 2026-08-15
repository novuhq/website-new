import mixpanel from "mixpanel-browser"

import { initMixpanel } from "./mixpanel"

/**
 * Getting-started flow A/B/C test (novu.co home hero).
 *
 * Three arms committing the primary CTA to a single flow instead of showing
 * every option at once. Assignment, splits (34/33/33) and metrics live on the
 * Mixpanel experiment; the website only reads the flag and renders the arm.
 *
 * Flag key is the exact string configured in Mixpanel (do not rename).
 */
export const GETTING_STARTED_FLOW_FLAG_KEY =
  "website-getting-started-flow-ui-vs-cli-vs-prompt-SJw6Uc"

/** Super property stamped on every event so downstream metrics carry the arm. */
export const GETTING_STARTED_FLOW_SUPER_PROPERTY = "getting_started_flow"

export type GettingStartedFlow = "ui" | "cli" | "prompt"

/** Control arm. Also the server / first-paint render before flags resolve. */
export const GETTING_STARTED_FLOW_DEFAULT: GettingStartedFlow = "ui"

/** Website-side copy events (the existing CLI/prompt events fire elsewhere). */
export const WEBSITE_CLI_COMMAND_COPIED_EVENT = "Website CLI Command Copied"
export const WEBSITE_PROMPT_COPIED_EVENT = "Website Prompt Copied"

export const isGettingStartedFlow = (
  value: unknown
): value is GettingStartedFlow =>
  value === "ui" || value === "cli" || value === "prompt"

// The mixpanel-browser 2.71 type bundle does not yet expose the feature-flag
// manager, so we describe just the method we call.
interface MixpanelFlagManager {
  get_variant_value: (
    featureName: string,
    fallbackValue: unknown
  ) => Promise<unknown>
}

const getFlagManager = (): MixpanelFlagManager | null => {
  const flags = (mixpanel as unknown as { flags?: MixpanelFlagManager }).flags
  return flags ?? null
}

/**
 * Resolve the visitor's getting-started arm from the Mixpanel feature flag.
 *
 * Reading the variant registers the exposure event that assigns the visitor to
 * the experiment, then stamps the arm as a super property. Any failure (flags
 * disabled, missing token, network) falls back to the control arm so the hero
 * always renders.
 */
export const resolveGettingStartedFlow =
  async (): Promise<GettingStartedFlow> => {
    try {
      await initMixpanel()

      const flags = getFlagManager()
      if (!flags) return GETTING_STARTED_FLOW_DEFAULT

      const value = await flags.get_variant_value(
        GETTING_STARTED_FLOW_FLAG_KEY,
        GETTING_STARTED_FLOW_DEFAULT
      )
      const flow = isGettingStartedFlow(value)
        ? value
        : GETTING_STARTED_FLOW_DEFAULT

      mixpanel.register({ [GETTING_STARTED_FLOW_SUPER_PROPERTY]: flow })

      return flow
    } catch (error) {
      console.error("Failed to resolve getting-started flow:", error)
      return GETTING_STARTED_FLOW_DEFAULT
    }
  }
