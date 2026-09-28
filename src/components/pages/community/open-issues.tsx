"use client"

import { useMemo, useState } from "react"
import Image from "next/image"

import type { CommunityIssue, CommunityIssueTag } from "@/lib/community/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

const FILTERS: { name: string; value: CommunityIssueTag }[] = [
  { name: "Bug", value: "bug" },
  { name: "Feature", value: "feature" },
  { name: "Docs Feedback", value: "docs feedback" },
  { name: "Good first issue", value: "good first issue" },
  { name: "Help wanted", value: "help wanted" },
]

const LABEL_STYLES: Record<CommunityIssueTag, string> = {
  bug: "bg-[#f9493e]/10 text-[#fa736b]",
  feature: "bg-[#f05c99]/10 text-[#f05c99]",
  "docs feedback": "bg-[#00d5ff]/10 text-[#00bce2]",
  "good first issue": "bg-[#76d049]/10 text-[#76d049]",
  "help wanted": "bg-[#dd99ff]/10 text-[#dd99ff]",
}

interface OpenIssuesProps {
  issues: CommunityIssue[]
}

export default function OpenIssues({ issues }: OpenIssuesProps) {
  const [selectedTags, setSelectedTags] = useState<CommunityIssueTag[]>([])
  const [selectedRepositories, setSelectedRepositories] = useState<string[]>([])
  const repositories = useMemo(
    () => [...new Set(issues.map((issue) => issue.repositoryName))].sort(),
    [issues]
  )
  const availableFilters = useMemo(
    () =>
      FILTERS.filter(({ value }) =>
        issues.some((issue) => issue.tags.includes(value))
      ),
    [issues]
  )

  const filteredIssues = useMemo(
    () =>
      issues
        .filter(
          (issue) =>
            (selectedTags.length === 0 ||
              selectedTags.some((tag) => issue.tags.includes(tag))) &&
            (selectedRepositories.length === 0 ||
              selectedRepositories.includes(issue.repositoryName))
        )
        .slice(0, 10),
    [issues, selectedRepositories, selectedTags]
  )

  function toggleTag(tag: CommunityIssueTag) {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag]
    )
  }

  function toggleRepository(repository: string) {
    setSelectedRepositories((current) =>
      current.includes(repository)
        ? current.filter((item) => item !== repository)
        : [...current, repository]
    )
  }

  return (
    <section
      className="relative z-10 -mt-6 overflow-hidden px-5 pt-28 md:-mt-8 md:px-8 md:pt-40 lg:-mt-10 xl:pt-16"
      aria-labelledby="community-open-issues-heading"
    >
      <div className="mx-auto max-w-272">
        <header className="relative z-10 mx-auto flex max-w-220 items-end justify-between px-0 sm:px-6 lg:px-11">
          <div className="pb-8 sm:pb-12 lg:pb-14">
            <h2
              id="community-open-issues-heading"
              className="text-center text-3xl leading-tight font-medium sm:text-left md:text-[32px] lg:text-5xl"
            >
              Get involved
            </h2>
            <p className="mx-auto mt-3 max-w-136 text-center text-base leading-snug text-gray-9 sm:mx-0 sm:text-left lg:mt-5 lg:text-lg">
              Building and managing complex notifications content and workflows
              is essential, but it is also not the business’s
            </p>
          </div>
          <Image
            className="hidden h-auto w-66 shrink-0 sm:block"
            src="/images/pages/community/cyberpunk-raccoona.png"
            width={264}
            height={232}
            alt=""
            aria-hidden
          />
        </header>

        <div className="relative mx-auto flex max-w-220 overflow-hidden rounded-xl border border-white/8 bg-[linear-gradient(145deg,rgba(53,32,45,.88),rgba(15,10,14,.96))] shadow-[0_30px_100px_rgba(229,0,189,.08)]">
          <div className="min-w-0 grow p-3.5 pt-3 sm:px-6 sm:pt-6 sm:pb-8 lg:p-11">
            <div className="flex border-b border-[#ffd5ee]/13 pb-3.5 text-[10px] font-medium uppercase sm:text-sm">
              <span className="w-14 shrink-0 bg-linear-to-r from-[#e0c4d8] to-[#dfbcd7] bg-clip-text text-transparent sm:w-22 lg:w-28">
                Issue #
              </span>
              <span className="bg-linear-to-r from-[#daafc9] to-[#d7a7c3] bg-clip-text text-transparent">
                Title
              </span>
            </div>

            {filteredIssues.length ? (
              <ul aria-live="polite">
                {filteredIssues.map((issue, index) => (
                  <li
                    className="border-b border-[#ffd5ee]/13"
                    key={`${issue.repositoryName}-${issue.number}`}
                  >
                    <Link
                      className="group flex w-full gap-0 py-3.5 text-sm sm:text-base lg:py-4 lg:text-lg"
                      href={issue.url}
                      variant="clean"
                      size="none"
                    >
                      <span
                        className="w-14 shrink-0 text-[#ffdfef] sm:w-22 lg:w-28"
                        style={{ opacity: Math.max(0.45, 0.72 - index * 0.03) }}
                      >
                        #{issue.number}
                      </span>
                      <span className="min-w-0 leading-tight text-white transition-colors group-hover:text-white/70">
                        {issue.title}
                        <span className="mt-1 flex flex-wrap sm:mt-0 sm:inline">
                          {issue.tags.map((tag) => (
                            <span
                              className={cn(
                                "ml-0 inline-block rounded px-1.5 py-0.75 text-[10px] leading-none tracking-normal sm:ml-1.5 sm:text-xs",
                                LABEL_STYLES[tag]
                              )}
                              key={tag}
                            >
                              {tag}
                            </span>
                          ))}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="border-b border-[#ffd5ee]/13 py-12 text-center text-sm text-gray-9">
                No open issues match these filters.
              </p>
            )}

            <Button
              className="mt-4 bg-[linear-gradient(135deg,#ff884d,#e300bd)] text-white sm:mt-6"
              size="default"
              variant="none"
              asChild
            >
              <Link
                href="https://github.com/novuhq/novu/issues/"
                variant="clean"
                size="none"
              >
                View all open issues
              </Link>
            </Button>
          </div>

          <aside className="hidden w-60 shrink-0 border-l border-[#33282d]/80 p-11 lg:block">
            {availableFilters.length > 0 && (
              <fieldset className="border-b border-white/15 pb-5">
                <legend className="text-[15px] leading-tight">Type</legend>
                <div className="mt-4 flex flex-col gap-y-4">
                  {availableFilters.map(({ name, value }) => (
                    <label
                      className="group flex cursor-pointer items-center gap-x-2"
                      key={value}
                    >
                      <input
                        className="peer sr-only"
                        type="checkbox"
                        checked={selectedTags.includes(value)}
                        onChange={() => toggleTag(value)}
                      />
                      <span className="flex size-4 shrink-0 items-center justify-center rounded-sm border border-[#ffebff]/15 bg-[#ffebff]/5 transition-colors group-hover:border-[#ffebff]/25 group-hover:bg-[#ffebff]/10 peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary">
                        <Image
                          className="hidden w-2.5 peer-checked:block"
                          src="/images/pages/community/check.svg"
                          width={10}
                          height={8}
                          alt=""
                        />
                      </span>
                      <span className="text-sm leading-none text-[#fff9ff]/65 transition-opacity group-hover:text-[#fff9ff]/90">
                        {name}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {repositories.length > 0 && (
              <fieldset className={availableFilters.length > 0 ? "mt-5" : ""}>
                <legend className="text-[15px] leading-tight">
                  Repository
                </legend>
                <div className="mt-4 flex flex-col gap-y-4">
                  {repositories.map((repository) => (
                    <label
                      className="group flex cursor-pointer items-center gap-x-2"
                      key={repository}
                    >
                      <input
                        className="peer sr-only"
                        type="checkbox"
                        checked={selectedRepositories.includes(repository)}
                        onChange={() => toggleRepository(repository)}
                      />
                      <span className="size-4 shrink-0 rounded-sm border border-[#ffebff]/15 bg-[#ffebff]/5 peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary" />
                      <span className="text-sm leading-none text-[#fff9ff]/65">
                        {repository}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
          </aside>

          <span
            className="pointer-events-none absolute top-4 left-0 h-60 w-16 -translate-x-1/2 rounded-full bg-[radial-gradient(rgba(241,126,222,.9),rgba(241,126,222,.2))] opacity-40 blur-3xl"
            aria-hidden
          />
        </div>
      </div>
    </section>
  )
}
