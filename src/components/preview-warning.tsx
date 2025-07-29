"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"

const EXIT_PREVIEW_API_URL = "/api/preview?disable=true"

interface IPreviewWarningProps {
  className?: string
}

function PreviewWarning({ className }: IPreviewWarningProps) {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [pending, setPending] = useState(false)

  // Note: we don't want to show the warning when the page is opening in the iframe (preview mode in Sanity Studio)
  useEffect(() => {
    setVisible(!window.frameElement)
  }, [])

  const onClick = useCallback(async () => {
    setPending(true)

    try {
      const response = await fetch(EXIT_PREVIEW_API_URL)
      if (response.ok) {
        router.refresh()
      } else {
        throw new Error("Something went wrong while exiting preview mode")
      }
    } catch (error) {
      console.error(error)
    }
  }, [router])

  if (visible) {
    return (
      <div className={cn(className)}>
        <div className="border-b border-border px-6 py-3 text-center text-base leading-snug tracking-tight text-muted-foreground">
          You are in the Preview Mode, which means you can see drafts version of
          content&nbsp;&bull;{" "}
          <button
            type="button"
            className={cn(
              "relative text-inherit before:absolute before:-inset-x-4 before:-inset-y-2",
              {
                underline: !pending,
                italic: pending,
              }
            )}
            disabled={pending}
            onClick={onClick}
          >
            {pending ? "Exiting..." : "Exit Preview Mode"}
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default PreviewWarning
