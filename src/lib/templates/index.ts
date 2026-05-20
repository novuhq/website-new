import {
  type IAgentTemplateData,
  type ITemplateAvatarData,
  type ITemplateCategoryData,
} from "@/types/templates"
import { sanityFetch } from "@/lib/sanity/client"
import {
  agentTemplateByIdQuery,
  agentTemplatesQuery,
  templateAvatarsQuery,
  templateCategoriesQuery,
} from "@/lib/sanity/queries/templates"

export const getAgentTemplates = (preview = false) =>
  sanityFetch<IAgentTemplateData[]>({
    query: agentTemplatesQuery,
    preview,
    tags: ["agentTemplate"],
  })

export const getAgentTemplateById = (id: string, preview = false) =>
  sanityFetch<IAgentTemplateData | null>({
    query: agentTemplateByIdQuery,
    qParams: { id },
    preview,
    tags: ["agentTemplate"],
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
