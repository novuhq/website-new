"use client"

import { useEffect } from "react"
import { getCalApi } from "@calcom/embed-react"

import { TRACKING_PARAMS } from "@/constants/forms"

const NAMESPACE = "novu-meeting"
const STORAGE_KEY = "novu_utm_params"

function getStoredUtmParams(): Record<string, string> {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (!stored) return {}
    const parsed = JSON.parse(stored)
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {}
    return Object.fromEntries(
      TRACKING_PARAMS.flatMap((key) => {
        const value = (parsed as Record<string, unknown>)[key]
        return typeof value === "string" && value ? [[key, value]] : []
      })
    )
  } catch {
    return {}
  }
}

export default function DemoBookingTracker() {
  useEffect(() => {
    let cancelled = false
    let cal: Awaited<ReturnType<typeof getCalApi>> | null = null

    const handleBookingSuccessful = () => {
      const w = window as Window & {
        dataLayer?: Record<string, unknown>[]
      }
      w.dataLayer = w.dataLayer || []
      w.dataLayer.push({
        event: "demo_booked",
        demo_booking: {
          source: "cal.com",
          namespace: NAMESPACE,
          ...getStoredUtmParams(),
        },
      })
    }

    getCalApi({ namespace: NAMESPACE })
      .then((api) => {
        if (cancelled) return
        cal = api
        api("on", {
          action: "bookingSuccessful",
          callback: handleBookingSuccessful,
        })
      })
      .catch(() => {})

    return () => {
      cancelled = true
      cal?.("off", {
        action: "bookingSuccessful",
        callback: handleBookingSuccessful,
      })
    }
  }, [])

  return null
}
