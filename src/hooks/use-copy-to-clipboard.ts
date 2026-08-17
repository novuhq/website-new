import { useCallback, useEffect, useRef, useState } from "react"
import copyToClipboard from "copy-to-clipboard"

type UseCopyToClipboardResult = {
  isCopied: boolean
  handleCopy: (text: string | number) => boolean
  resetCopied: () => void
}

export default function useCopyToClipboard(
  resetInterval: number | null = null
): UseCopyToClipboardResult {
  const [isCopied, setCopied] = useState(false)
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearResetTimeout = useCallback(() => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current)
      resetTimeoutRef.current = null
    }
  }, [])

  const resetCopied = useCallback(() => {
    clearResetTimeout()
    setCopied(false)
  }, [clearResetTimeout])

  const handleCopy = useCallback(
    (text: string | number) => {
      clearResetTimeout()

      const didCopy =
        typeof text === "string" || typeof text === "number"
          ? copyToClipboard(text.toString())
          : false

      setCopied(didCopy)

      if (didCopy && resetInterval) {
        resetTimeoutRef.current = setTimeout(() => {
          setCopied(false)
          resetTimeoutRef.current = null
        }, resetInterval)
      }

      return didCopy
    },
    [clearResetTimeout, resetInterval]
  )

  useEffect(() => clearResetTimeout, [clearResetTimeout])

  return { isCopied, handleCopy, resetCopied }
}
