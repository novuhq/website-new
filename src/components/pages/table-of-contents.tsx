"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useThrottleCallback } from "@react-hook/throttle"

import { ITableOfContentsItem } from "@/types/common"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"

interface ITableOfContentsProps {
  className?: string
  title?: string
  items: readonly ITableOfContentsItem[]
}

function useActiveAnchor(
  items: readonly ITableOfContentsItem[],
  viewportOffset = 0.5,
  throttleMs = 100
) {
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null)
  const headingRefs = useRef<{ id: string; getTop: () => number }[]>([])

  useEffect(() => {
    headingRefs.current = items
      .map(({ anchor }) => {
        const el = document.getElementById(anchor)
        return el
          ? { id: anchor, getTop: () => el.getBoundingClientRect().top }
          : null
      })
      .filter(Boolean) as { id: string; getTop: () => number }[]
  }, [items])

  const calcActive = useCallback(() => {
    if (!headingRefs.current.length) return

    const activationLine = window.innerHeight * viewportOffset
    let currentId: string | null = null

    if (headingRefs.current[0].getTop() > activationLine) {
      setActiveAnchor(null)
      return
    }

    for (const { id, getTop } of headingRefs.current) {
      if (getTop() <= activationLine) currentId = id
      else break
    }

    setActiveAnchor(currentId)
  }, [viewportOffset])

  const throttled = useThrottleCallback(calcActive, throttleMs)

  useEffect(() => {
    calcActive()
    window.addEventListener("scroll", throttled)
    window.addEventListener("resize", throttled)
    return () => {
      window.removeEventListener("scroll", throttled)
      window.removeEventListener("resize", throttled)
    }
  }, [throttled, calcActive])

  return activeAnchor
}

function TableOfContents({
  className,
  title = "Table of contents",
  items,
}: ITableOfContentsProps) {
  const activeAnchor = useActiveAnchor(items)

  const handleLinkClick = useCallback(
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
      history.pushState(null, "", `#${id}`)
    },
    []
  )

  if (!items.length) return null

  return (
    <nav className={cn("table-of-contents", className)} aria-label={title}>
      <h2 className="text-sm leading-tight font-medium tracking-tighter">
        {title}
      </h2>

      <ol className="mt-3.5 flex flex-col gap-y-3.5">
        {items.map(({ title, anchor, level }) => (
          <li className={cn("flex", level === 3 && "pl-2.5")} key={anchor}>
            <Link
              className={cn(
                "line-clamp-2 w-fit leading-snug font-normal",
                activeAnchor === anchor
                  ? "text-white hover:text-lagune-3"
                  : "text-gray-8 hover:text-lagune-3"
              )}
              href={`#${anchor}`}
              size="sm"
              aria-current={activeAnchor === anchor ? "location" : undefined}
              onClick={handleLinkClick(anchor)}
            >
              {title}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default TableOfContents
