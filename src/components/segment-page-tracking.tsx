"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

declare global {
  interface Window {
    __segmentLastTrackedPathname?: string
    analytics?: {
      page?: () => void
    }
  }
}

export function SegmentPageTracking() {
  const pathname = usePathname()

  useEffect(() => {
    const analytics = window.analytics
    if (
      typeof analytics?.page !== "function" ||
      pathname === window.__segmentLastTrackedPathname
    ) {
      return
    }

    window.__segmentLastTrackedPathname = pathname
    analytics.page()
  }, [pathname])

  return null
}
