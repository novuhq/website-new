import type { IComparisonPageData } from "@/types/comparison"

import { courierComparisonData } from "./courier"
import { knockComparisonData } from "./knock"
import { magicbellComparisonData } from "./magicbell"
import { suprsendComparisonData } from "./suprsend"

export const comparisonPages: Record<string, IComparisonPageData> = {
  courier: courierComparisonData,
  knock: knockComparisonData,
  magicbell: magicbellComparisonData,
  suprsend: suprsendComparisonData,
}

export function getComparisonBySlug(
  slug: string
): IComparisonPageData | undefined {
  return comparisonPages[slug]
}

export function getAllComparisonSlugs(): string[] {
  return Object.keys(comparisonPages)
}
