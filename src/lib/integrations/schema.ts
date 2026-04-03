import { z } from "zod"

const relatedArticleSchema = z.object({
  title: z.string().min(1),
  href: z.string().min(1),
  icon: z.string().optional(),
})

export const integrationFrontmatterSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  tab: z.enum(["channels", "sources"]),
  category: z.string().min(1),
  badge: z.string().optional(),
  icon: z.string().optional(),
  tagline: z.string().min(1),
  shortDescription: z.string().min(1),
  docsUrl: z
    .union([z.string().url(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  order: z.number().int().optional(),
  features: z.array(z.string()).optional(),
  relatedProviders: z.array(z.string()).optional(),
  relatedArticles: z.array(relatedArticleSchema).optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      noIndex: z.boolean().optional(),
    })
    .optional(),
  primaryCtaLabel: z.string().optional(),
  primaryCtaHref: z.string().optional(),
  secondaryCtaLabel: z.string().optional(),
  secondaryCtaHref: z.string().optional(),
})

export type IntegrationFrontmatterInput = z.input<
  typeof integrationFrontmatterSchema
>
export type IntegrationFrontmatter = z.output<
  typeof integrationFrontmatterSchema
>
