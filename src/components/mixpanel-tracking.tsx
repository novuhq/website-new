"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { initMixpanel, trackEvent } from "@/lib/mixpanel"

function MixpanelTracking() {
  const pathname = usePathname()

  useEffect(() => {
    const trackPageVisit = async () => {
      try {
        await initMixpanel()

        await trackEvent("Market Page Visit", {
          path: pathname,
        })
      } catch (error) {
        console.error("Failed to track page visit:", error)
      }
    }

    trackPageVisit()
  }, [pathname])

  return null
}

export default MixpanelTracking
