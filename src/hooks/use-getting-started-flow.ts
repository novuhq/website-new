"use client"

import { useEffect, useState } from "react"

import {
  GETTING_STARTED_FLOW_DEFAULT,
  type GettingStartedFlow,
  isGettingStartedFlow,
  resolveGettingStartedFlow,
} from "@/lib/experiments"

/** QA override: append ?gsf=cli (or ui / prompt) to force an arm locally. */
const QA_OVERRIDE_PARAM = "gsf"

const readQaOverride = (): GettingStartedFlow | null => {
  if (typeof window === "undefined") return null
  const value = new URLSearchParams(window.location.search).get(
    QA_OVERRIDE_PARAM
  )
  return isGettingStartedFlow(value) ? value : null
}

/**
 * Returns the visitor's getting-started arm.
 *
 * Renders the control on the server and first paint so the CTA area is stable,
 * then swaps to the assigned arm once the flag resolves. A ?gsf= query param
 * forces an arm for QA without touching experiment assignment.
 */
export function useGettingStartedFlow(): GettingStartedFlow {
  const [flow, setFlow] = useState<GettingStartedFlow>(
    GETTING_STARTED_FLOW_DEFAULT
  )

  useEffect(() => {
    const override = readQaOverride()
    if (override) {
      setFlow(override)
      return
    }

    let active = true
    resolveGettingStartedFlow().then((resolved) => {
      if (active) setFlow(resolved)
    })

    return () => {
      active = false
    }
  }, [])

  return flow
}
