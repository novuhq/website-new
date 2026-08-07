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
    slug: "agent-runtimes",
    title: "Agent runtimes",
    description:
      "Connect an existing agent to supported communication channels without changing its core application logic.",
    order: 1,
    tab: "sources",
    defaultBadge: "Agent runtime",
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
