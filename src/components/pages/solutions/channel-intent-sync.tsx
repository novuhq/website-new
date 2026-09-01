"use client"

import { useEffect } from "react"

import {
  HOME_CHANNEL_SELECT_EVENT,
  type IHomeChannelSelectDetail,
} from "@/components/pages/home/channel-navigation"

// Maps a visitor's intent to the right Features tab without scrolling. If the
// URL carries a channel hint (?channel=whatsapp, or a utm_term that names a
// channel), preselect that channel in the Features demo on load. Renders
// nothing. Never scrolls; it only sets the active tab so the demo matches
// what the visitor came for.
const CHANNEL_KEYS: Record<string, string> = {
  slack: "slack",
  teams: "teams",
  "microsoft-teams": "teams",
  msteams: "teams",
  whatsapp: "whatsapp",
  telegram: "telegram",
  email: "email",
}

function resolveChannelKey(): string | null {
  const params = new URLSearchParams(window.location.search)
  const candidates = [
    params.get("channel"),
    params.get("utm_term"),
    params.get("utm_content"),
  ]

  for (const raw of candidates) {
    if (!raw) continue
    const normalized = raw.toLowerCase()
    for (const [needle, key] of Object.entries(CHANNEL_KEYS)) {
      if (normalized.includes(needle)) return key
    }
  }

  return null
}

function ChannelIntentSync() {
  useEffect(() => {
    const key = resolveChannelKey()
    if (!key) return

    // Defer so the Features section has mounted and is listening.
    const timeout = window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent<IHomeChannelSelectDetail>(HOME_CHANNEL_SELECT_EVENT, {
          detail: { key },
        })
      )
    }, 150)

    return () => window.clearTimeout(timeout)
  }, [])

  return null
}

export default ChannelIntentSync
