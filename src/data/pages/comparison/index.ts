import type { IComparisonPageData } from "@/types/comparison"

import { courierComparisonData } from "./courier"
import { knockComparisonData } from "./knock"

export const comparisonPages: Record<string, IComparisonPageData> = {
  courier: courierComparisonData,
  knock: knockComparisonData,
}

export function getComparisonBySlug(
  slug: string
): IComparisonPageData | undefined {
  return comparisonPages[slug]
}

export function getAllComparisonSlugs(): string[] {
  return Object.keys(comparisonPages)
}
