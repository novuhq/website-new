import { useCallback, useEffect, useRef, useState } from "react"

export function useScrollStatus() {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)
  const [hasScroll, setHasScroll] = useState(false)
  const [element, setElement] = useState<HTMLElement | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const mutationObserverRef = useRef<MutationObserver | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollHeightRef = useRef<number>(0)

  const updateScrollStatus = useCallback((el: HTMLElement) => {
    const isScrollable = el.scrollHeight > el.clientHeight
    setHasScroll(isScrollable)

    if (!isScrollable) {
      setIsScrolledToBottom(true)
    } else {
      const bottom =
        Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 1
      setIsScrolledToBottom(bottom)
    }

    lastScrollHeightRef.current = el.scrollHeight
  }, [])

  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node)
  }, [])

  useEffect(() => {
    if (!element) {
      return
    }

    updateScrollStatus(element)

    element.addEventListener("scroll", () => updateScrollStatus(element))

    if (typeof ResizeObserver !== "undefined") {
      resizeObserverRef.current = new ResizeObserver(() => {
        updateScrollStatus(element)
      })
      resizeObserverRef.current.observe(element, { box: "content-box" })
    }

    if (typeof MutationObserver !== "undefined") {
      mutationObserverRef.current = new MutationObserver(() => {
        updateScrollStatus(element)
      })
      mutationObserverRef.current.observe(element, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
      })
    }

    intervalRef.current = setInterval(() => {
      if (element.scrollHeight !== lastScrollHeightRef.current) {
        updateScrollStatus(element)
      }
    }, 100)

    return () => {
      element.removeEventListener("scroll", () => updateScrollStatus(element))

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }

      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect()
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [element, updateScrollStatus])

  const resetScrollStatus = useCallback(() => {
    setIsScrolledToBottom(false)
    setHasScroll(false)
  }, [])

  useEffect(() => {
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect()
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      resetScrollStatus()
    }
  }, [resetScrollStatus])

  return {
    ref,
    isScrolledToBottom,
    hasScroll,
    resetScrollStatus,
  }
}
