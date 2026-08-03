import type { IAgentFrameworkData } from "@/types/framework"

import { aiSdkFrameworkData } from "./ai-sdk"
import { langchainFrameworkData } from "./langchain"

export const frameworkPages: Record<string, IAgentFrameworkData> = {
  langchain: langchainFrameworkData,
  "ai-sdk": aiSdkFrameworkData,
}

export function getFrameworkBySlug(
  slug: string
): IAgentFrameworkData | undefined {
  return frameworkPages[slug]
}

export function getAllFrameworkSlugs(): string[] {
  return Object.keys(frameworkPages)
}

export function getAllFrameworks(): IAgentFrameworkData[] {
  return Object.values(frameworkPages)
}
