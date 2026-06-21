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

/**
 * Fires an attributed `demo_booked` dataLayer event when a Cal.com booking
 * completes.
 *
 * Cal.com renders the booking flow inside an app.cal.com iframe and fires its
 * own tracking from that origin, so it cannot read the novu.co Google Ads cookie
 * (gclid) and every booking lands as "direct" / unattributed. Listening for
 * Cal.com's `bookingSuccessful` event here, in the parent novu.co context, lets
 * GTM and the Ads conversion linker attribute the booking to the originating ad
 * click. One namespace-level listener covers every booking surface and fires
 * exactly once per booking.
 */
export default function DemoBookingTracker() {
  useEffect(() => {
    let cancelled = false
    let cal: Awaited<ReturnType<typeof getCalApi>> | null = null

    // Stable reference so the same callback can be passed to both `on` and
    // `off` (Cal.com requires an identical reference to unregister).
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
          // UTM/gclid captured on landing, for downstream/offline use.
          ...getStoredUtmParams(),
        },
      })
    }

    const init = async () => {
      try {
        cal = await getCalApi({ namespace: NAMESPACE })
        if (cancelled) return

        cal("on", {
          action: "bookingSuccessful",
          callback: handleBookingSuccessful,
        })
      } catch {
        // Cal.com embed unavailable; nothing to track.
      }
    }

    init()

    return () => {
      cancelled = true
      // Unregister so a remount doesn't stack listeners and double-fire the
      // conversion on a single booking.
      cal?.("off", {
        action: "bookingSuccessful",
        callback: handleBookingSuccessful,
      })
    }
  }, [])

  return null
}
