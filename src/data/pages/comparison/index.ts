import type { IComparisonPageData } from "@/types/comparison"

import { courierComparisonData } from "./courier"

export const comparisonPages: Record<string, IComparisonPageData> = {
  courier: courierComparisonData,
}

export function getComparisonBySlug(
  slug: string
): IComparisonPageData | undefined {
  return comparisonPages[slug]
}

export function getAllComparisonSlugs(): string[] {
  return Object.keys(comparisonPages)
}
