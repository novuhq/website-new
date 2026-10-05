import "server-only"

import { cache } from "react"

import { getContributorsResult } from "@/lib/contributors"

import type {
  CommunityIssue,
  CommunityIssueTag,
  CommunityMember,
  CommunityStats,
} from "./types"

const CONTRIBUTORS_API_URL = (
  process.env.CONTRIBUTORS_API_URL || "https://contributors.novu.co"
).replace(/\/$/, "")

const FALLBACK_STATS: CommunityStats = {
  count: 36597,
  commits: 19511,
  closedIssues: 7544,
  contributors: 2470,
  forks: 3986,
  pullRequests: 6254,
  openIssues: 268,
}

const TEAM_MEMBERS = new Set(
  [
    "ainouzgali",
    "AliaksandrRyzhou",
    "americano98",
    "andrewgolovanov",
    "antonjoel82",
    "BiswaViraj",
    "ChmaraX",
    "Cliftonz",
    "ComBarnea",
    "davidsoderberg",
    "denis-kralj-novu",
    "djabarovgeorge",
    "iampearceman",
    "jainpawan21",
    "justnems",
    "LetItRock",
    "rgozdzialski",
    "rifont",
    "sashasushko",
    "scopsy",
    "SokratisVidros",
    "stephenward21",
    "sumitsaurabh927",
    "tatarco",
    "unicodeveloper",
    "yasell",
  ].map((name) => name.toLowerCase())
)

function isExternalCommunityContributor({
  github,
  teammate,
}: {
  github: string
  teammate: boolean
}) {
  const name = github.toLowerCase()
  return (
    !teammate &&
    !TEAM_MEMBERS.has(name) &&
    !name.endsWith("[bot]") &&
    !name.includes("dependabot") &&
    name !== "github-actions" &&
    name !== "renovate"
  )
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined
}

async function fetchJson(
  url: string,
  options: RequestInit & { next?: { revalidate: number } } = {}
): Promise<{ ok: boolean; data: unknown }> {
  const headers = new Headers(options.headers)
  headers.set("Accept", "application/json")
  const response = await fetch(url, {
    ...options,
    headers,
    signal: options.signal || AbortSignal.timeout(10_000),
    next: options.next || { revalidate: 3600 },
  })

  return {
    ok: response.ok,
    data: response.ok ? await response.json() : null,
  }
}

function inferIssueType(title: string): CommunityIssueTag[] {
  const normalized = title.toLowerCase()

  if (normalized.includes("bug report:")) return ["bug"]
  if (normalized.includes("docs feedback:")) return ["docs feedback"]
  if (normalized.includes("feature:")) return ["feature"]
  return []
}

function knownLabels(value: unknown): CommunityIssueTag[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((label): CommunityIssueTag[] => {
    const name =
      typeof label === "string" ? label : asString(asRecord(label)?.name)
    const normalized = name?.toLowerCase()

    return normalized === "good first issue" || normalized === "help wanted"
      ? [normalized]
      : []
  })
}

function normalizeIssue(
  value: unknown,
  extraTags: CommunityIssueTag[] = []
): CommunityIssue | null {
  const issue = asRecord(value)
  if (!issue) return null

  const title = asString(issue.title)
  const url = asString(issue.html_url) || asString(issue.url)
  if (!title || !url) return null

  const urlMatch = url.match(/github\.com\/[^/]+\/([^/]+)\/issues\/(\d+)\/?$/)
  const number = asNumber(issue.number) ?? Number(urlMatch?.[2])
  if (!Number.isFinite(number)) return null

  const rawCreatedAt = asString(issue.created_at)
  const createdAt =
    rawCreatedAt && Number.isFinite(Date.parse(rawCreatedAt))
      ? rawCreatedAt
      : new Date(0).toISOString()

  return {
    title,
    number,
    url,
    createdAt,
    repositoryName: urlMatch?.[1] || "novu",
    tags: [
      ...new Set([
        ...inferIssueType(title),
        ...knownLabels(issue.labels),
        ...extraTags,
      ]),
    ],
  }
}

function sortIssues(issues: CommunityIssue[]) {
  return issues.sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  )
}

export const getContributorIssues = cache(
  async (): Promise<CommunityIssue[]> => {
    try {
      const { ok, data } = await fetchJson(`${CONTRIBUTORS_API_URL}/issues`)
      if (!ok) return []

      const payload = asRecord(data)
      const issues =
        payload && Array.isArray(payload.issues) ? payload.issues : []

      return sortIssues(
        issues
          .map((issue) => normalizeIssue(issue))
          .filter((issue): issue is CommunityIssue => !!issue)
      )
    } catch {
      return []
    }
  }
)

const COMMUNITY_ISSUE_LABELS = ["good first issue", "help wanted"] as const

async function getLabeledCommunityIssues(): Promise<CommunityIssue[] | null> {
  const settled = await Promise.allSettled(
    COMMUNITY_ISSUE_LABELS.map(async (label) => {
      const query = `org:novuhq is:issue is:open label:"${label}"`
      const { ok, data } = await fetchJson(
        `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=100&sort=created&order=desc`,
        { headers: githubHeaders() }
      )
      const items = asRecord(data)?.items

      if (!ok || !Array.isArray(items)) {
        throw new Error(`GitHub issue search failed for ${label}`)
      }

      return items
        .map((issue) => normalizeIssue(issue, [label]))
        .filter((issue): issue is CommunityIssue => !!issue)
    })
  )

  const successful = settled.filter(
    (result): result is PromiseFulfilledResult<CommunityIssue[]> =>
      result.status === "fulfilled"
  )
  if (!successful.length) return null

  const issuesByUrl = new Map<string, CommunityIssue>()
  for (const result of successful) {
    for (const issue of result.value) {
      const existing = issuesByUrl.get(issue.url)
      issuesByUrl.set(
        issue.url,
        existing
          ? {
              ...existing,
              tags: [...new Set([...existing.tags, ...issue.tags])],
            }
          : issue
      )
    }
  }

  return sortIssues([...issuesByUrl.values()])
}

export const getCommunityIssues = cache(async (): Promise<CommunityIssue[]> => {
  try {
    return (await getLabeledCommunityIssues()) ?? getContributorIssues()
  } catch {
    return getContributorIssues()
  }
})

export const getCommunityMembers = cache(
  async (): Promise<CommunityMember[]> => {
    const { contributors, unavailable } = await getContributorsResult()
    if (unavailable) return []

    return contributors
      .filter(isExternalCommunityContributor)
      .sort((a, b) => b.totalPulls - a.totalPulls)
      .slice(0, 22)
      .map(({ github, totalPulls }) => ({
        login: github,
        avatarUrl: `https://avatars.githubusercontent.com/${github}?v=4`,
        pullRequests: totalPulls,
      }))
  }
)

function githubHeaders(): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  }
}

async function githubCount(query: string): Promise<number | undefined> {
  const { ok, data } = await fetchJson(
    `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=1`,
    { headers: githubHeaders() }
  )
  const total = asNumber(asRecord(data)?.total_count)
  return ok ? total : undefined
}

function lastPageFromLink(link: string | null): number | undefined {
  const last = link
    ?.split(",")
    .find((part) => part.includes('rel="last"'))
    ?.match(/[?&]page=(\d+)/)?.[1]
  return last ? Number(last) : undefined
}

export const getCommunityStats = cache(async (): Promise<CommunityStats> => {
  const contributorsResult = await getContributorsResult()
  const settled = await Promise.allSettled([
    fetch("https://api.github.com/repos/novuhq/novu", {
      headers: githubHeaders(),
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10_000),
    }),
    fetch("https://api.github.com/repos/novuhq/novu/commits?per_page=1", {
      headers: githubHeaders(),
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10_000),
    }),
    githubCount("repo:novuhq/novu is:issue is:closed"),
    githubCount("repo:novuhq/novu is:issue is:open"),
    githubCount("repo:novuhq/novu is:pr"),
  ])

  const result = { ...FALLBACK_STATS }
  if (!contributorsResult.unavailable) {
    result.contributors = contributorsResult.contributors.filter(
      isExternalCommunityContributor
    ).length
  }
  const repoResult = settled[0]
  if (repoResult.status === "fulfilled" && repoResult.value.ok) {
    const repo = asRecord(await repoResult.value.json())
    result.count = asNumber(repo?.stargazers_count) ?? result.count
    result.forks = asNumber(repo?.forks_count) ?? result.forks
  }

  const commitsResult = settled[1]
  if (commitsResult.status === "fulfilled" && commitsResult.value.ok) {
    result.commits =
      lastPageFromLink(commitsResult.value.headers.get("link")) ??
      result.commits
  }

  const closedIssuesResult = settled[2]
  if (closedIssuesResult.status === "fulfilled") {
    result.closedIssues = closedIssuesResult.value ?? result.closedIssues
  }
  const openIssuesResult = settled[3]
  if (openIssuesResult.status === "fulfilled") {
    result.openIssues = openIssuesResult.value ?? result.openIssues
  }
  const pullsResult = settled[4]
  if (pullsResult.status === "fulfilled") {
    result.pullRequests = pullsResult.value ?? result.pullRequests
  }

  return result
})

export type { CommunityIssue, CommunityMember, CommunityStats }
