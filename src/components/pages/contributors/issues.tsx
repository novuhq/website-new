"use client"

import { useState } from "react"
import Image from "next/image"
import { formatDistanceToNowStrict } from "date-fns"

import type { CommunityIssue } from "@/lib/community/types"
import { Link } from "@/components/ui/link"

interface IssuesProps {
  issues: CommunityIssue[]
  className?: string
}

export default function Issues({ issues, className }: IssuesProps) {
  const [showAll, setShowAll] = useState(false)
  const visibleIssues = showAll ? issues : issues.slice(0, 5)

  return (
    <section
      className={className}
      aria-labelledby="contributors-issues-heading"
    >
      <div className="mx-auto max-w-304 px-5 md:px-8 2xl:px-0">
        <div className="mx-auto max-w-196 text-center">
          <h2
            id="contributors-issues-heading"
            className="text-4xl leading-tight font-medium md:text-5xl lg:text-6xl"
          >
            Don’t know where to start?
          </h2>
          <p className="mt-6 text-base leading-snug font-light text-gray-9 md:mt-10 md:text-lg">
            Check our good first issues that help you onboard to Novu project
            and get first achievement.
          </p>
        </div>

        <div className="mx-auto max-w-226">
          {visibleIssues.length ? (
            <ul className="mt-10">
              {visibleIssues.map((issue) => (
                <li
                  className="relative flex items-center py-4 after:absolute after:right-0 after:bottom-0 after:h-px after:w-[calc(100%-54px)] after:bg-gray-3 last:after:hidden"
                  key={`${issue.repositoryName}-${issue.number}`}
                >
                  <span className="mr-3.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-white to-white/60">
                    <Image
                      src="/images/pages/community/issue.svg"
                      width={20}
                      height={20}
                      alt=""
                    />
                  </span>
                  <Link
                    className="flex min-w-0 grow justify-between gap-3 font-light"
                    href={issue.url}
                    variant="foreground"
                    size="none"
                  >
                    <span className="min-w-0">{issue.title}</span>
                    <span className="hidden shrink-0 text-sm sm:block">
                      opened{" "}
                      {formatDistanceToNowStrict(new Date(issue.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-10 text-center text-gray-9">
              Browse the Novu repository for current contribution opportunities.
            </p>
          )}

          {!showAll && issues.length > visibleIssues.length && (
            <div className="mt-8 text-center">
              <button
                className="rounded-sm border-b border-primary/50 pb-0.5 text-sm text-primary hover:text-primary-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                type="button"
                onClick={() => setShowAll(true)}
              >
                Show more issues
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
