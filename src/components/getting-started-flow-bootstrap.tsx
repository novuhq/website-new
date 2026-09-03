import "server-only"

import {
  buildGettingStartedFlowBootstrapScript,
  GETTING_STARTED_FLOW_VISIBILITY_CSS,
} from "@/lib/getting-started-flow-bootstrap"
import {
  isGettingStartedFlowExperimentAvailable,
  isGettingStartedFlowExperimentEnabled,
  isGettingStartedFlowQaEnabled,
} from "@/lib/getting-started-flow-server"

/**
 * The style and assignment script must precede the homepage markup so a
 * visitor never sees one CTA replaced with another after hydration.
 */
function GettingStartedFlowBootstrap() {
  if (!isGettingStartedFlowExperimentAvailable()) return null

  return (
    <>
      <style
        id="getting-started-flow-visibility"
        dangerouslySetInnerHTML={{
          __html: GETTING_STARTED_FLOW_VISIBILITY_CSS,
        }}
      />
      <script
        id="getting-started-flow-bootstrap"
        dangerouslySetInnerHTML={{
          __html: buildGettingStartedFlowBootstrapScript({
            enabled: isGettingStartedFlowExperimentEnabled(),
            qaEnabled: isGettingStartedFlowQaEnabled(),
          }),
        }}
      />
    </>
  )
}

export default GettingStartedFlowBootstrap
