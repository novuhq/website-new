"use client"

import { useLayoutEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

import { initializeGettingStartedFlow } from "@/lib/getting-started-flow-client"

interface GettingStartedFlowRuntimeProps {
  enabled: boolean
  qaEnabled: boolean
}

function GettingStartedFlowRuntime({
  enabled,
  qaEnabled,
}: GettingStartedFlowRuntimeProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const search = searchParams.toString()

  useLayoutEffect(() => {
    initializeGettingStartedFlow(enabled, qaEnabled)
  }, [enabled, pathname, qaEnabled, search])

  return null
}

export default GettingStartedFlowRuntime
