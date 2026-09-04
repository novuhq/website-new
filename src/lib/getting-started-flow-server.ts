import "server-only"

export function isGettingStartedFlowExperimentEnabled() {
  return (
    process.env.GETTING_STARTED_FLOW_EXPERIMENT_ENABLED === "true" &&
    process.env.GETTING_STARTED_FLOW_EXPERIMENT_RELEASE_APPROVED === "true"
  )
}

export function isGettingStartedFlowQaEnabled() {
  return (
    process.env.GETTING_STARTED_FLOW_EXPERIMENT_QA_ENABLED === "true" ||
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.CRITICAL_FLOW_TESTING === "1"
  )
}

export function isGettingStartedFlowExperimentAvailable() {
  return (
    isGettingStartedFlowExperimentEnabled() || isGettingStartedFlowQaEnabled()
  )
}
