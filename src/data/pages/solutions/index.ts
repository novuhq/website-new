import type { ISolutionPageData } from "@/types/solution"

import { aiAgentsSolutionData } from "./ai-agents"
import { appNotificationsSolutionData } from "./app-notifications"
import { buildersSolutionData } from "./builders"
import { enterpriseSolutionData } from "./enterprise"

export const solutionPages: Record<string, ISolutionPageData> = {
  "ai-agents": aiAgentsSolutionData,
  "app-notifications": appNotificationsSolutionData,
  builders: buildersSolutionData,
  enterprise: enterpriseSolutionData,
}

export function getSolutionBySlug(slug: string): ISolutionPageData | undefined {
  return solutionPages[slug]
}

export function getAllSolutionSlugs(): string[] {
  return Object.keys(solutionPages)
}

export function getAllSolutions(): ISolutionPageData[] {
  return Object.values(solutionPages)
}
