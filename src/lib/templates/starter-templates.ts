import type { IAgentTemplateData } from "@/types/templates"
import { getAgentTemplatesByIds } from "@/lib/templates"

export async function getStarterAgentTemplates(
  ids: string[]
): Promise<IAgentTemplateData[]> {
  if (!ids.length) return []

  try {
    return await getAgentTemplatesByIds(ids)
  } catch (error) {
    console.error("Unable to load curated starter agent templates", {
      error,
      templateIds: ids,
    })
    return []
  }
}
