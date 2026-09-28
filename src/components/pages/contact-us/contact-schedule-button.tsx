"use client"

import { useEffect, useRef, type MouseEvent } from "react"
import { getCalApi } from "@calcom/embed-react"

import { Button } from "@/components/ui/button"

const CAL_NAMESPACE = "novu-meeting"
const CAL_LINK = "team/novu/novu-meeting"
const CAL_FALLBACK_URL = `https://cal.com/${CAL_LINK}`
const CAL_CONFIG = '{"layout":"month_view"}'
const CAL_EMBED_SCRIPT_URL = "https://app.cal.com/embed/embed.js"

type AnalyticsWindow = Window & {
  analytics?: {
    track?: (event: string, properties: Record<string, string>) => void
  }
}

function ContactScheduleButton() {
  const isCalReadyRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    let embedScript: HTMLScriptElement | null = null

    const markCalReady = () => {
      if (!cancelled) isCalReadyRef.current = true
    }

    getCalApi({ namespace: CAL_NAMESPACE })
      .then((cal) => {
        if (cancelled) return

        cal("ui", {
          hideEventTypeDetails: false,
          layout: "month_view",
        })

        if (cal.instance || window.Cal?.instance) {
          markCalReady()
          return
        }

        embedScript = document.querySelector(
          `script[src="${CAL_EMBED_SCRIPT_URL}"]`
        )
        embedScript?.addEventListener("load", markCalReady, { once: true })
      })
      .catch(() => {})

    return () => {
      cancelled = true
      embedScript?.removeEventListener("load", markCalReady)
    }
  }, [])

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const analyticsWindow = window as AnalyticsWindow

    analyticsWindow.analytics?.track?.(
      "Contact Us Event: Click Schedule a Call button",
      { source: "contact_us_page" }
    )

    if (isCalReadyRef.current) {
      event.preventDefault()
      return
    }

    event.stopPropagation()
  }

  const buttonClassName =
    "h-12 rounded-md bg-white px-8 text-base font-medium text-gray-1 normal-case transition-colors duration-200 hover:bg-gray-9 focus-visible:ring-2 focus-visible:ring-lagune-3 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-2 focus-visible:outline-none"

  return (
    <Button variant="none" size="none" className={buttonClassName} asChild>
      <a
        href={CAL_FALLBACK_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-cal-namespace={CAL_NAMESPACE}
        data-cal-link={CAL_LINK}
        data-cal-config={CAL_CONFIG}
        onClick={handleClick}
      >
        Schedule a Call
      </a>
    </Button>
  )
}

export default ContactScheduleButton
