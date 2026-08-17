"use client"

import { useEffect, useState } from "react"

import {
  GETTING_STARTED_FLOW_DEFAULT,
  isGettingStartedFlow,
  resolveGettingStartedFlow,
  type GettingStartedFlow,
} from "@/lib/experiments"

const QA_OVERRIDE_PARAM = "gsf"

const RESOLVE_TIMEOUT_MS = 2500

const readQaOverride = (): GettingStartedFlow | null => {
  if (typeof window === "undefined") return null
  const value = new URLSearchParams(window.location.search).get(
    QA_OVERRIDE_PARAM
  )
  return isGettingStartedFlow(value) ? value : null
}

export function useGettingStartedFlow(): GettingStartedFlow | null {
  const [flow, setFlow] = useState<GettingStartedFlow | null>(null)

  useEffect(() => {
    const override = readQaOverride()
    if (override) {
      setFlow(override)
      return
    }

    let active = true

    const timeoutId = setTimeout(() => {
      if (active) setFlow((current) => current ?? GETTING_STARTED_FLOW_DEFAULT)
    }, RESOLVE_TIMEOUT_MS)

    resolveGettingStartedFlow().then((resolved) => {
      if (!active) return
      clearTimeout(timeoutId)
      setFlow(resolved)
    })

    return () => {
      active = false
      clearTimeout(timeoutId)
    }
  }, [])

  return flow
}
