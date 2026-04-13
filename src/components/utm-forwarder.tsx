"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "ttclid",
  "wbraid",
]
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

function UtmForwarder() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const utms: Record<string, string> = {}
    UTM_PARAMS.forEach((key) => {
      const value = searchParams.get(key)
      if (value) utms[key] = value
    })

    if (Object.keys(utms).length > 0) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utms))
      } catch {
        // sessionStorage unavailable
      }
    }
  }, [searchParams])

  useEffect(() => {
    const utms = getStoredUtmParams()
    if (Object.keys(utms).length === 0) return

    document
      .querySelectorAll<HTMLAnchorElement>(`a[href*="${SIGNUP_HOST}"]`)
      .forEach((link) => {
        try {
          const url = new URL(link.href)
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

export default UtmForwarder
