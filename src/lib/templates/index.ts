import {
  type IAgentTemplateData,
  type IAgentTemplatesSectionData,
  type ITemplateAvatarData,
  type ITemplateCategoryData,
} from "@/types/templates"
import { sanityFetch } from "@/lib/sanity/client"
import {
  agentTemplateByIdQuery,
  agentTemplatesQuery,
  agentTemplatesSectionQuery,
  templateAvatarsQuery,
  templateCategoriesQuery,
} from "@/lib/sanity/queries/templates"

const AGENT_TEMPLATE_DEPENDENCY_TAGS = [
  "agentTemplate",
  "templateAvatar",
  "templateCategory",
  "templateMcpServer",
  "templateChannel",
  "templateTool",
]

export const getAgentTemplates = (preview = false) =>
  sanityFetch<IAgentTemplateData[]>({
    query: agentTemplatesQuery,
    preview,
    tags: AGENT_TEMPLATE_DEPENDENCY_TAGS,
  })

export async function getAgentTemplatesSection(
  preview = false
): Promise<IAgentTemplatesSectionData> {
  const section = await sanityFetch<IAgentTemplatesSectionData | null>({
    query: agentTemplatesSectionQuery,
    preview,
    tags: AGENT_TEMPLATE_DEPENDENCY_TAGS,
  })

  return {
    categories: section?.categories ?? [],
    templates: section?.templates ?? [],
  }
}

export const getAgentTemplateById = (id: string, preview = false) =>
  sanityFetch<IAgentTemplateData | null>({
    query: agentTemplateByIdQuery,
    qParams: { id },
    preview,
    tags: AGENT_TEMPLATE_DEPENDENCY_TAGS,
  })

export const getTemplateCategories = (preview = false) =>
  sanityFetch<ITemplateCategoryData[]>({
    query: templateCategoriesQuery,
    preview,
    tags: ["templateCategory"],
  })

export const getTemplateAvatars = (preview = false) =>
  sanityFetch<ITemplateAvatarData[]>({
    query: templateAvatarsQuery,
    preview,
    tags: ["templateAvatar"],
  })
