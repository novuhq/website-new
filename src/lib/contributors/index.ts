import "server-only"

import { cache } from "react"
import { unstable_cache } from "next/cache"
import achievementsData from "@/content/contributors/wordpress-achievements.json"

import { normalizeContributorGithub } from "./image-urls"
import type {
  Contributor,
  ContributorAchievement,
  ContributorPull,
} from "./types"

const CONTRIBUTORS_API_URL = (
  process.env.CONTRIBUTORS_API_URL || "https://contributors.novu.co"
).replace(/\/$/, "")

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

function asDateString(value: unknown): string | undefined {
  const date = asString(value)
  return date && Number.isFinite(Date.parse(date)) ? date : undefined
}

function pullTimestamp(pull: ContributorPull) {
  return Date.parse(pull.mergedAt || pull.createdAt || "") || 0
}

function normalizePull(value: unknown): ContributorPull | null {
  const pull = asRecord(value)
  if (!pull) return null

  const title = asString(pull.title)
  const htmlUrl = asString(pull.html_url) || asString(pull.url)
  if (!title || !htmlUrl) return null

  const id =
    typeof pull.id === "string" || typeof pull.id === "number"
      ? pull.id
      : undefined

  return {
    id,
    title,
    htmlUrl,
    createdAt: asDateString(pull.created_at),
    mergedAt: asDateString(pull.merged_at),
  }
}

function normalizeContributor(value: unknown): Contributor | null {
  const item = asRecord(value)
  if (!item) return null

  const github = normalizeContributorGithub(asString(item.github) || "")
  if (!github) return null

  const pulls = Array.isArray(item.pulls)
    ? item.pulls
        .map(normalizePull)
        .filter((pull): pull is ContributorPull => !!pull)
        .sort((a, b) => pullTimestamp(b) - pullTimestamp(a))
    : []

  return {
    github,
    name: asString(item.name),
    bio: asString(item.bio),
    location: asString(item.location),
    website: asString(item.url),
    twitter: asString(item.twitter),
    teammate: item.teammate === true,
    totalPulls: asNumber(item.totalPulls) ?? pulls.length,
    pulls,
  }
}

async function fetchJson(
  url: string,
  options: RequestInit & { next?: { revalidate: number } } = {}
): Promise<{ ok: boolean; status: number; data: unknown }> {
  const headers = new Headers(options.headers)
  headers.set("Accept", "application/json")

  const response = await fetch(url, {
    ...options,
    headers,
    signal: options.signal || AbortSignal.timeout(10_000),
    next:
      options.cache === "no-store"
        ? undefined
        : options.next || { revalidate: 3600 },
  })

  if (!response.ok) {
    return { ok: false, status: response.status, data: null }
  }

  return { ok: true, status: response.status, data: await response.json() }
}

const loadContributorsCached = unstable_cache(
  async (): Promise<Contributor[]> => {
    const { ok, data } = await fetchJson(
      `${CONTRIBUTORS_API_URL}/contributors`,
      { cache: "no-store" }
    )
    if (!ok) throw new Error("Contributors API list is unavailable")

    const payload = asRecord(data)
    const list = payload && Array.isArray(payload.list) ? payload.list : []
    const contributors = list
      .map(normalizeContributor)
      .filter((item): item is Contributor => !!item)
      .map((contributor) => ({
        ...contributor,
        pulls: contributor.pulls.slice(0, 1),
      }))

    if (!contributors.length) {
      throw new Error("Contributors API returned an empty list")
    }

    return contributors
  },
  ["contributors-list-v2", CONTRIBUTORS_API_URL],
  { revalidate: 3600, tags: ["contributors"] }
)

interface ContributorsResult {
  contributors: Contributor[]
  unavailable: boolean
}

export const getContributorsResult = cache(
  async (): Promise<ContributorsResult> => {
    try {
      return {
        contributors: await loadContributorsCached(),
        unavailable: false,
      }
    } catch {
      return { contributors: [], unavailable: true }
    }
  }
)

export const getContributors = cache(
  async () => (await getContributorsResult()).contributors
)

const loadContributorCached = unstable_cache(
  async (safeGithub: string): Promise<Contributor | null> => {
    const { ok, status, data } = await fetchJson(
      `${CONTRIBUTORS_API_URL}/contributor/${encodeURIComponent(safeGithub)}`,
      { cache: "no-store" }
    )

    if (status === 404 || (ok && data === null)) return null
    if (!ok) throw new Error("Contributor API detail is unavailable")

    const contributor = normalizeContributor(data)
    if (!contributor) {
      throw new Error("Contributor API returned malformed detail data")
    }
    if (contributor.teammate) return null

    return contributor
  },
  ["contributor-detail-v1", CONTRIBUTORS_API_URL],
  { revalidate: 3600, tags: ["contributors"] }
)

export const getContributor = cache(
  async (
    github: string
  ): Promise<{ contributor: Contributor | null; unavailable: boolean }> => {
    const safeGithub = normalizeContributorGithub(github)
    if (!safeGithub) {
      return { contributor: null, unavailable: false }
    }

    try {
      return {
        contributor: await loadContributorCached(safeGithub),
        unavailable: false,
      }
    } catch {
      return { contributor: null, unavailable: true }
    }
  }
)

type AchievementData = (typeof achievementsData.contributors)[number]

export function getContributorAchievements(
  github: string
): ContributorAchievement[] {
  const entry = achievementsData.contributors.find(
    (item: AchievementData) =>
      item.github.toLowerCase() === github.toLowerCase()
  )

  return (entry?.achievements || []).map((achievement) => ({
    date: achievement.date,
    title: achievement.title,
    slug: achievement.slug,
    tooltip: achievement.tooltip,
    badge: {
      alt: achievement.badge.altText || `${achievement.title} badge`,
      src: `/images/pages/contributors/achievements/wordpress/${achievement.badge.localPath.split("/").pop()}`,
      width: achievement.badge.width,
      height: achievement.badge.height,
    },
  }))
}

export type { Contributor, ContributorAchievement }
export {
  getContributorEmbedImageUrl,
  getContributorSocialImageUrl,
} from "./image-urls"
