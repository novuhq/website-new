export type WebhookType =
  (typeof REVALIDATION_TYPES)[keyof typeof REVALIDATION_TYPES]["types"][number]

export type RevalidationConfigItem = {
  type: WebhookType
  tags: readonly string[]
  paths?: readonly string[]
}

export const REVALIDATION_TYPES = {
  blog: {
    types: ["blogPost", "author", "blogCategory"],
    tags: ["blog"],
    paths: [
      "/blog",
      "/blog/[slug]",
      "/blog/page/[page]",
      "/blog/category/[category]",
      "/blog/category/[category]/page/[page]",
    ],
  },
  changelog: {
    types: ["changelogPost"],
    tags: ["changelog"],
    paths: [
      "/changelog",
      "/changelog/[slug]",
      "/changelog/category/[category]",
    ],
  },
  customer: {
    types: ["customer"],
    tags: ["customers", "customer"],
    paths: ["/customers", "/customers/[slug]"],
  },
  customers: {
    types: ["customers"],
    tags: ["customers"],
    paths: ["/customers"],
  },
  staticPage: {
    types: ["staticPage"],
    tags: ["staticPage"],
    paths: ["/[slug]"],
  },
  agentTemplate: {
    types: ["agentTemplate"],
    tags: ["agentTemplate"],
  },
  templateAvatar: {
    types: ["templateAvatar"],
    tags: ["agentTemplate", "templateAvatar"],
  },
  templateCategory: {
    types: ["templateCategory"],
    tags: ["agentTemplate", "templateCategory"],
  },
  templateChannel: {
    types: ["templateChannel"],
    tags: ["agentTemplate", "templateChannel"],
  },
  templateMcpServer: {
    types: ["templateMcpServer"],
    tags: ["agentTemplate", "templateMcpServer"],
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
