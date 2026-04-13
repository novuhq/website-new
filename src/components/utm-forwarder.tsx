"use client"

import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

import { TRACKING_PARAMS } from "@/constants/forms"

const SIGNUP_HOST = "dashboard.novu.co"
const STORAGE_KEY = "novu_utm_params"

function getStoredUtmParams(): Record<string, string> {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function UtmForwarderInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const utms: Record<string, string> = {}
    TRACKING_PARAMS.forEach((key) => {
      const value = searchParams.get(key)
      if (value) utms[key] = value
    })

    if (Object.keys(utms).length > 0) {
      try {
        const existing = getStoredUtmParams()
        const merged = { ...existing, ...utms }
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged))

        // Also write individual keys for compatibility with subscription-form.tsx
        Object.entries(merged).forEach(([key, value]) => {
          sessionStorage.setItem(key, value)
        })
      } catch {
        // sessionStorage unavailable
      }
    }
  }, [searchParams])

  useEffect(() => {
    const utms = getStoredUtmParams()
    if (Object.keys(utms).length === 0) return

    document.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((link) => {
      try {
        const url = new URL(link.href)
        if (url.hostname !== SIGNUP_HOST) return
        Object.entries(utms).forEach(([key, value]) => {
          if (!url.searchParams.has(key)) {
            url.searchParams.set(key, value)
          }
        })
        link.href = url.toString()
      } catch {
        // skip malformed URLs
      }
    })
  }, [pathname])

  return null
}

export default function UtmForwarder() {
  return (
    <Suspense>
      <UtmForwarderInner />
    </Suspense>
  )
}
