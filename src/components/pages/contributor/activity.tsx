"use client"

import { useState } from "react"
import Image from "next/image"
import { format } from "date-fns"

import { getContributorActivityPage } from "@/lib/contributors/actions"
import type { ContributorPull } from "@/lib/contributors/types"
import { Link } from "@/components/ui/link"

interface ActivityProps {
  github: string
  initialPulls: ContributorPull[]
  initialNextOffset: number | null
}

export default function Activity({
  github,
  initialPulls,
  initialNextOffset,
}: ActivityProps) {
  const [pulls, setPulls] = useState(initialPulls)
  const [nextOffset, setNextOffset] = useState(initialNextOffset)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  async function loadMore() {
    if (nextOffset === null || isLoading) return

    setIsLoading(true)
    setLoadError(null)

    try {
      const page = await getContributorActivityPage(github, nextOffset)
      if (page.unavailable) {
        setLoadError("Activity is temporarily unavailable. Please try again.")
        return
      }

      setPulls((current) => {
        const existingUrls = new Set(current.map((pull) => pull.htmlUrl))
        return [
          ...current,
          ...page.pulls.filter((pull) => !existingUrls.has(pull.htmlUrl)),
        ]
      })
      setNextOffset(page.nextOffset)
    } catch {
      setLoadError("Activity is temporarily unavailable. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section
      aria-busy={isLoading}
      aria-labelledby="contribution-activity-heading"
    >
      <h2
        id="contribution-activity-heading"
        className="text-3xl leading-tight font-medium md:text-[30px] lg:text-4xl"
      >
        Contribution activity
      </h2>

      {pulls.length ? (
        <ul className="mt-10 space-y-8" id="contribution-activity-list">
          {pulls.map((pull, index) => {
            const date = pull.mergedAt || pull.createdAt
            return (
              <li className="flex" key={pull.id || `${pull.htmlUrl}-${index}`}>
                <span className="mr-3.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-white to-white/60">
                  <Image
                    className="size-5"
                    src="/images/pages/contributor/activity/pull-request.svg"
                    width={20}
                    height={20}
                    alt=""
                  />
                </span>
                <div className="min-w-0 grow">
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <p className="leading-snug font-light">Pull Request</p>
                    {date && (
                      <time
                        className="shrink-0 text-sm leading-none font-light"
                        dateTime={date}
                      >
                        {format(new Date(date), "dd/MM/yyyy")}
                      </time>
                    )}
                  </div>
                  <div className="mt-4 rounded-md border border-gray-3 px-4 py-3.5">
                    <Link
                      className="text-base sm:text-lg"
                      href={pull.htmlUrl}
                      variant="foreground"
                      size="none"
                    >
                      {pull.title}
                    </Link>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="mt-8 text-gray-9">
          No contribution activity is available yet.
        </p>
      )}

      {nextOffset !== null && (
        <button
          className="mt-8 ml-13.5 rounded-sm border-b border-primary/50 pb-0.5 text-sm text-primary hover:text-primary-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:cursor-wait disabled:opacity-60 md:ml-0"
          type="button"
          aria-controls="contribution-activity-list"
          disabled={isLoading}
          onClick={loadMore}
        >
          {isLoading ? "Loading activity…" : "Show more activity"}
        </button>
      )}

      <p className="mt-3 text-sm text-[#fa736b]" aria-live="polite">
        {loadError}
      </p>
    </section>
  )
}
