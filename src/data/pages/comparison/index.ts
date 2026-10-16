import type { IComparisonPageData } from "@/types/comparison"

import { buildingInHouseComparisonData } from "./building-in-house"
import { courierComparisonData } from "./courier"
import { knockComparisonData } from "./knock"
import { magicbellComparisonData } from "./magicbell"
import { suprsendComparisonData } from "./suprsend"

export const comparisonPages: Record<string, IComparisonPageData> = {
  courier: courierComparisonData,
  knock: knockComparisonData,
  magicbell: magicbellComparisonData,
  suprsend: suprsendComparisonData,
  "building-in-house": buildingInHouseComparisonData,
}

export function getComparisonBySlug(
  slug: string
): IComparisonPageData | undefined {
  return comparisonPages[slug]
}

export function getAllComparisonSlugs(): string[] {
  return Object.keys(comparisonPages)
}

/** Page title shared by the HTML metadata and the markdown alternate. */
export function getComparisonTitle(data: IComparisonPageData): string {
  const title =
    data.metaTitle ??
    `${data.hero.heading.prefix} ${data.hero.heading.highlight}`

  return title.replace(/\u00a0/g, " ")
}
