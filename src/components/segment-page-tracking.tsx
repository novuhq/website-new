"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

declare global {
  interface Window {
    analytics?: {
      page: () => void
    }
  }
}

export function SegmentPageTracking() {
  const pathname = usePathname()
  const previousPathnameRef = useRef(pathname)

  useEffect(() => {
    if (pathname === previousPathnameRef.current) return

    previousPathnameRef.current = pathname
    window.analytics?.page()
  }, [pathname])

  return null
}
