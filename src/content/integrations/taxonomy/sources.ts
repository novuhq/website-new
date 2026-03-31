import type { IntegrationTabType } from "@/types/integration"

export interface ISourceCategoryTaxonomy {
  slug: string
  title: string
  description: string
  order: number
  tab: IntegrationTabType
  defaultBadge: string
}

export const SOURCE_CATEGORY_TAXONOMY: ISourceCategoryTaxonomy[] = [
  {
    slug: "email-frameworks",
    title: "Workflow integrations",
    description:
      "Extend your workflows with code steps. Connect tools, AI, and data directly into your workflow logic.",
    order: 0,
    tab: "sources",
    defaultBadge: "Workflow",
  },
  {
    slug: "ai-sdks",
    title: "AI SDKs",
    description:
      "Use AI in code steps to generate or transform workflow content dynamically.",
    order: 1,
    tab: "sources",
    defaultBadge: "AI",
  },
  {
    slug: "feature-flags",
    title: "Feature Flags",
    description:
      "Evaluate feature flags in your workflows to control logic and personalize user experiences.",
    order: 2,
    tab: "sources",
    defaultBadge: "Flags",
  },
]
