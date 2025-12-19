"use client"

import { useEffect, useMemo, useRef } from "react"
import { getCalApi } from "@calcom/embed-react"

const NAMESPACE = "novu-meeting"

type SchedulingModalProps = {
  isOpen: boolean
  utmSource?: string | null
  onClose?: () => void
  onOpen?: (() => void) | null
}

const SchedulingModal = ({
  isOpen,
  utmSource = null,
  onClose = () => {},
  onOpen = null,
}: SchedulingModalProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const initializedRef = useRef(false)
  const calApiRef = useRef<ReturnType<typeof getCalApi> | null>(null)
  const isCalModalOpenRef = useRef(false)
  const onCloseCallbackRef = useRef(onClose)
  const onOpenCallbackRef = useRef(onOpen)

  // Keep callback refs up to date
  useEffect(() => {
    onCloseCallbackRef.current = onClose
    onOpenCallbackRef.current = onOpen
  }, [onClose, onOpen])

  const calLink = useMemo(() => {
    const utmParams = utmSource
      ? `?utm_source=${encodeURIComponent(utmSource)}&utm_campaign=pricing_contact`
      : "?utm_campaign=pricing_contact"
    return `team/novu/intro${utmParams}`
  }, [utmSource])

  // Preload Cal.com API and set up event listeners once on mount
  useEffect(() => {
    let isCancelled = false

    const initCalApi = async () => {
      try {
        const cal = await getCalApi({ namespace: NAMESPACE })
        if (isCancelled) return

        calApiRef.current = Promise.resolve(cal)

        // Configure UI once
        cal("ui", { hideEventTypeDetails: false, layout: "month_view" })
        initializedRef.current = true

        // Set up event listeners once - they persist across open/close cycles
        cal("on", {
          // @ts-expect-error action is not defined in the cal.com API
          action: "__windowClose",
          callback: () => {
            isCalModalOpenRef.current = false
            // Use the latest callback ref
            if (onCloseCallbackRef.current) {
              onCloseCallbackRef.current()
            }
          },
        })

        cal("on", {
          action: "bookingSuccessful",
          callback: () => {
            isCalModalOpenRef.current = false
            // Use the latest callback ref
            if (onCloseCallbackRef.current) {
              onCloseCallbackRef.current()
            }
          },
        })
      } catch (e) {
        console.error("Failed to initialize Cal.com API:", e)
      }
    }

    initCalApi()

    return () => {
      isCancelled = true
    }
  }, [])

  // Handle opening/closing the modal when isOpen changes
  useEffect(() => {
    if (!isOpen) return

    let rafId: number | null = null

    const openModal = () => {
      // Mark as opening; the close listeners will reset this
      isCalModalOpenRef.current = true
      // Use the hidden button click which the Cal.com embed binds to reliably
      // Ensure the DOM has the latest calLink attribute, then click
      rafId = requestAnimationFrame(() => {
        if (!buttonRef.current) return
        buttonRef.current.click()
        if (onOpenCallbackRef.current) {
          onOpenCallbackRef.current()
        }
      })
    }

    // Open immediately if Cal API is ready, otherwise wait briefly
    if (calApiRef.current && initializedRef.current) {
      openModal()
    } else {
      // Fallback: wait for initialization (handles case where isOpen=true before Cal API loads)
      const checkInterval = setInterval(() => {
        if (calApiRef.current && initializedRef.current) {
          clearInterval(checkInterval)
          openModal()
        }
      }, 50)

      // Cleanup
      return () => {
        clearInterval(checkInterval)
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
        }
      }
    }

    // Cleanup for the immediate openModal path
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [isOpen, calLink])

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-hidden="true"
      tabIndex={-1}
      data-cal-namespace={NAMESPACE}
      data-cal-link={calLink}
      data-cal-config='{"layout":"month_view"}'
      style={{
        position: "fixed",
        left: "-99999px",
        top: "-99999px",
        width: 0,
        height: 0,
        opacity: 0,
      }}
    >
      Schedule a Call
    </button>
  )
}

export default SchedulingModal
