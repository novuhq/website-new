"use client"

interface GettingStartedFlowInlineScriptProps {
  html: string
}

/**
 * Initial HTML executes the assignment before paint. On an SPA navigation the
 * client runtime owns assignment, so React renders an inert script instead.
 */
function GettingStartedFlowInlineScript({
  html,
}: GettingStartedFlowInlineScriptProps) {
  return (
    <script
      id="getting-started-flow-bootstrap"
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default GettingStartedFlowInlineScript
