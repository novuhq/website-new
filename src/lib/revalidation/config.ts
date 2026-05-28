export type WebhookType =
  (typeof REVALIDATION_TYPES)[keyof typeof REVALIDATION_TYPES]["types"][number]

export type RevalidationConfigItem = {
  type: WebhookType
  tags: readonly string[]
  paths?: readonly string[]
}

export const REVALIDATION_TYPES = {
  changelog: {
    types: ["changelogPost"],
    tags: ["changelog"],
    paths: ["/app/(website)/changelog", "/app/(website)/changelog/[slug]"],
  },
  customer: {
    types: ["customer"],
    tags: ["customers", "customer"],
    paths: ["/app/(website)/customers", "/app/(website)/customers/[slug]"],
  },
  customers: {
    types: ["customers"],
    tags: ["customers"],
    paths: ["/app/(website)/customers"],
  },
  staticPage: {
    types: ["staticPage"],
    tags: ["staticPage"],
    paths: ["/app/(website)/(static)/[slug]"],
  },
  agentTemplate: {
    types: ["agentTemplate"],
    tags: ["agentTemplate"],
  },
  howToPost: {
    types: ["howToPost"],
    tags: ["howTo"],
    paths: [
      "/app/(connect)/connect/how-to",
      "/app/(connect)/connect/how-to/[slug]",
    ],
  },
  howToCategory: {
    types: ["howToCategory"],
    tags: ["howTo"],
    paths: ["/app/(connect)/connect/how-to"],
  },
  templateAvatar: {
    types: ["templateAvatar"],
    tags: ["agentTemplate", "templateAvatar", "howTo"],
  },
  templateCategory: {
    types: ["templateCategory"],
    tags: ["agentTemplate", "templateCategory"],
  },
  templateChannel: {
    types: ["templateChannel"],
    tags: ["agentTemplate", "templateChannel", "howTo"],
  },
  templateMcpServer: {
    types: ["templateMcpServer"],
    tags: ["agentTemplate", "templateMcpServer", "howTo"],
  },
  templateTool: {
    types: ["templateTool"],
    tags: ["agentTemplate", "templateTool"],
  },
} as const

export const WEBHOOK_TYPES = Object.values(REVALIDATION_TYPES).flatMap(
  (group) => group.types
) as WebhookType[]

export const REVALIDATION_CONFIG: Record<WebhookType, RevalidationConfigItem> =
  Object.values(REVALIDATION_TYPES).reduce(
    (acc, group) => {
      group.types.forEach((type) => {
        acc[type] = {
          type: type,
          tags: group.tags,
          paths: "paths" in group ? group.paths : undefined,
        }
      })
      return acc
    },
    {} as Record<WebhookType, RevalidationConfigItem>
  )
