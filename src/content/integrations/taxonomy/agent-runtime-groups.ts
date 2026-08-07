export interface IAgentRuntimeGroupTaxonomy {
  slug: string
  title: string
  description: string
  order: number
}

export const AGENT_RUNTIME_GROUP_TAXONOMY: IAgentRuntimeGroupTaxonomy[] = [
  {
    slug: "custom-code-runtimes",
    title: "Custom code runtimes",
    description:
      "Bring the framework, SDK, or application code you already run. Novu Connect adds the channel bridge without changing how your agent thinks.",
    order: 0,
  },
  {
    slug: "managed-agent-runtimes",
    title: "Managed agent runtimes",
    description:
      "Create a hosted agent from one CLI command with no agent server or bridge code to run yourself.",
    order: 1,
  },
]
