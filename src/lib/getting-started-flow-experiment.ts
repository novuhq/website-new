export const GETTING_STARTED_FLOW_EXPERIMENT_KEY =
  "website-getting-started-flow-ui-vs-cli-vs-prompt-SJw6Uc"

export const GETTING_STARTED_FLOW_ASSIGNMENT_VERSION = "1"
export const GETTING_STARTED_FLOW_COOKIE_NAME = "novu_getting_started_flow_v1"
export const GETTING_STARTED_FLOW_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 60
export const GETTING_STARTED_FLOW_EVENT_ENDPOINT =
  "/api/experiments/getting-started-flow/"
export const GETTING_STARTED_FLOW_QA_PARAM = "gsf"
export const SEGMENT_ANONYMOUS_ID_COOKIE_NAME = "ajs_anonymous_id"
export const SEGMENT_ANONYMOUS_ID_MAX_AGE_SECONDS = 60 * 60 * 24 * 365
export const GETTING_STARTED_FLOW_ASSIGNMENT_EVENT =
  "novu:getting-started-flow-assignment"

export const GETTING_STARTED_FLOW_VARIANTS = ["ui", "cli", "prompt"] as const

export type GettingStartedFlow = (typeof GETTING_STARTED_FLOW_VARIANTS)[number]
export type GettingStartedFlowAssignmentSource = "cookie" | "qa" | "random"

export interface GettingStartedFlowAssignment {
  isQa: boolean
  source: GettingStartedFlowAssignmentSource
  variant: GettingStartedFlow
}

export const GETTING_STARTED_FLOW_EXPOSED_EVENT =
  "Website Getting Started Flow Exposed"
export const GETTING_STARTED_FLOW_SELECTED_EVENT =
  "Website Getting Started Flow Selected"
export const WEBSITE_CLI_COMMAND_COPIED_EVENT = "Website CLI Command Copied"
export const WEBSITE_PROMPT_COPIED_EVENT = "Website Prompt Copied"

export const GETTING_STARTED_FLOW_EVENTS = [
  GETTING_STARTED_FLOW_EXPOSED_EVENT,
  GETTING_STARTED_FLOW_SELECTED_EVENT,
  WEBSITE_CLI_COMMAND_COPIED_EVENT,
  WEBSITE_PROMPT_COPIED_EVENT,
] as const

export type GettingStartedFlowEvent =
  (typeof GETTING_STARTED_FLOW_EVENTS)[number]

export const GETTING_STARTED_FLOW_UI_UPPER_BOUND = 0.34
export const GETTING_STARTED_FLOW_CLI_UPPER_BOUND = 0.67

export function isGettingStartedFlow(
  value: unknown
): value is GettingStartedFlow {
  return GETTING_STARTED_FLOW_VARIANTS.some((variant) => variant === value)
}

export function isGettingStartedFlowEvent(
  value: unknown
): value is GettingStartedFlowEvent {
  return GETTING_STARTED_FLOW_EVENTS.some((event) => event === value)
}

export function getGettingStartedFlowForRandomValue(
  randomValue: number
): GettingStartedFlow {
  if (!Number.isFinite(randomValue) || randomValue < 0 || randomValue >= 1) {
    throw new RangeError("randomValue must be between 0 (inclusive) and 1")
  }

  if (randomValue < GETTING_STARTED_FLOW_UI_UPPER_BOUND) return "ui"
  if (randomValue < GETTING_STARTED_FLOW_CLI_UPPER_BOUND) return "cli"

  return "prompt"
}
