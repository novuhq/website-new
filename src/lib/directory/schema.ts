import { z } from "zod"

export const directoryFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  authors: z
    .array(
      z.object({
        name: z.string().min(1),
        avatar: z.string().min(1),
      })
    )
    .min(1),
  images: z.array(z.string().min(1)).min(1),
  ghSourceLink: z.string().url(),
  demoLink: z.string().url(),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  license: z.string().min(1),
})
