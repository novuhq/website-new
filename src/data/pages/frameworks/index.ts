import type { IAgentFrameworkData } from "@/types/framework"

import { aiSdkFrameworkData } from "./ai-sdk"
import { chatSdkFrameworkData } from "./chat-sdk"
import { claudeFrameworkData } from "./claude"
import { claudeAwsFrameworkData } from "./claude-aws"
import { customCodeFrameworkData } from "./custom-code"
import { langchainFrameworkData } from "./langchain"

export const frameworkPages: Record<string, IAgentFrameworkData> = {
  langchain: langchainFrameworkData,
  "ai-sdk": aiSdkFrameworkData,
  "chat-sdk": chatSdkFrameworkData,
  "custom-code": customCodeFrameworkData,
  claude: claudeFrameworkData,
  "claude-aws": claudeAwsFrameworkData,
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
