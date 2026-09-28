"use server"

import { getContributor } from "@/lib/contributors"

import type { ContributorActivityPage } from "./types"

const ACTIVITY_PAGE_SIZE = 24

export async function getContributorActivityPage(
  github: string,
  offset: number
): Promise<ContributorActivityPage> {
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(github)) {
    return { pulls: [], nextOffset: null, unavailable: false }
  }

  const safeOffset =
    Number.isInteger(offset) && offset >= 0 ? Math.min(offset, 10_000) : 0
  const { contributor, unavailable } = await getContributor(github)

  if (unavailable || !contributor) {
    return { pulls: [], nextOffset: null, unavailable }
  }

  const endOffset = safeOffset + ACTIVITY_PAGE_SIZE

  return {
    pulls: contributor.pulls.slice(safeOffset, endOffset),
    nextOffset: endOffset < contributor.pulls.length ? endOffset : null,
    unavailable: false,
  }
}
