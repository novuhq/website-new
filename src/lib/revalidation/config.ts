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
    paths: ["/app/(website)/changelog/[slug]"],
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
  //   TODO: remove example with multiple types
  //   blog: {
  //     types: ["author", "blogPost", "category"],
  //     tags: ["blog", "blogPage"],
  //     paths: ["/app/(website)/blog/[slug]", "/app/(website)/blog"],
  //   },
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
          paths: group.paths,
        }
      })
      return acc
    },
    {} as Record<WebhookType, RevalidationConfigItem>
  )
