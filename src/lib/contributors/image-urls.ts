import "server-only"

import { absoluteUrl } from "@/lib/site-url"

export const CONTRIBUTOR_EMBED_IMAGE_SIZE = {
  width: 450,
  height: 170,
} as const

export const CONTRIBUTOR_SOCIAL_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const

const GITHUB_HANDLE_PATTERN =
  /^(?!-)(?!.*--)[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i

export function normalizeContributorGithub(value: string) {
  const github = value.trim().toLowerCase()
  return GITHUB_HANDLE_PATTERN.test(github) ? github : null
}

function getContributorImageUrl(
  github: string,
  size: { width: number; height: number }
) {
  const safeGithub = normalizeContributorGithub(github)
  if (!safeGithub) throw new TypeError("Invalid GitHub handle")

  const searchParams = new URLSearchParams({
    template: "contributor",
    github: safeGithub,
    width: String(size.width),
    height: String(size.height),
  })

  return absoluteUrl(`/api/og/?${searchParams}`)
}

export function getContributorEmbedImageUrl(github: string) {
  return getContributorImageUrl(github, CONTRIBUTOR_EMBED_IMAGE_SIZE)
}

export function getContributorSocialImageUrl(github: string) {
  return getContributorImageUrl(github, CONTRIBUTOR_SOCIAL_IMAGE_SIZE)
}
