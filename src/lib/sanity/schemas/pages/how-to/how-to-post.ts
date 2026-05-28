import { RobotIcon } from "@sanity/icons"
import { format } from "date-fns"
import {
  ArrayRule,
  DatetimeRule,
  defineField,
  defineType,
  ImageRule,
  ReferenceRule,
  SlugRule,
  SortOrdering,
  StringRule,
} from "sanity"

import { GROUP } from "@/lib/sanity/schemas/shared/group"
import { SEO_FIELDS } from "@/lib/sanity/schemas/shared/seo"
import {
  customSlugify,
  customSlugValidation,
} from "@/lib/sanity/utils/custom-slug-validation"

const HOW_TO_POST_ORDERINGS: SortOrdering[] = [
  {
    name: "publishingDateDesc",
    title: "Publishing date New -> Old",
    by: [
      { field: "publishedAt", direction: "desc" },
      { field: "title", direction: "asc" },
    ],
  },
  {
    name: "publishingDateAsc",
    title: "Publishing date Old -> New",
    by: [
      { field: "publishedAt", direction: "asc" },
      { field: "title", direction: "asc" },
    ],
  },
]

const HOW_TO_POST_PREVIEW = {
  select: {
    title: "title",
    publishedAt: "publishedAt",
    media: "avatar.darkImage",
    category: "category.title",
    agentName: "agentName",
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prepare(selection: Record<string, any>) {
    const { title, publishedAt, media, category, agentName } = selection
    const dateSegment = publishedAt
      ? format(new Date(publishedAt), "yyyy/MMMM")
      : "No date"

    return {
      title,
      media,
      subtitle: [category, agentName, `Published: ${dateSegment}`]
        .filter(Boolean)
        .join(" · "),
    }
  },
}

export default defineType({
  name: "howToPost",
  title: "How-to Post",
  type: "document",
  icon: RobotIcon,
  groups: [GROUP.content, GROUP.seo],
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Main article heading.",
      group: GROUP.content.name,
      validation: (rule: StringRule) => rule.required().max(120),
    }),
    defineField({
      name: "caption",
      type: "text",
      title: "Caption",
      rows: 4,
      group: GROUP.content.name,
      validation: (rule: StringRule) => rule.required().max(260),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      group: GROUP.content.name,
      options: {
        source: "title",
        slugify: customSlugify,
      },
      validation: (rule: SlugRule) =>
        rule.required().custom(customSlugValidation).error(),
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      title: "Published at",
      group: GROUP.content.name,
      validation: (rule: DatetimeRule) => rule.required(),
    }),
    defineField({
      name: "agentName",
      title: "Agent name",
      type: "string",
      group: GROUP.content.name,
      validation: (rule: StringRule) => rule.required().max(40),
    }),
    defineField({
      name: "summary",
      title: "Card summary",
      type: "text",
      rows: 3,
      description: "Short quote shown on how-to cards.",
      group: GROUP.content.name,
      validation: (rule: StringRule) => rule.required().max(180),
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "reference",
      to: [{ type: "templateAvatar" }],
      group: GROUP.content.name,
      validation: (rule: ReferenceRule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "howToCategory" }],
      group: GROUP.content.name,
      validation: (rule: ReferenceRule) => rule.required(),
    }),
    defineField({
      name: "mcpServerList",
      title: "MCP servers",
      type: "array",
      of: [{ type: "reference", to: [{ type: "templateMcpServer" }] }],
      group: GROUP.content.name,
      validation: (rule: ArrayRule<unknown>) => rule.required().min(1).unique(),
    }),
    defineField({
      name: "channels",
      title: "Channels",
      type: "array",
      of: [{ type: "reference", to: [{ type: "templateChannel" }] }],
      group: GROUP.content.name,
      validation: (rule: ArrayRule<unknown>) => rule.required().min(1).unique(),
    }),
    defineField({
      name: "cover",
      type: "image",
      title: "Cover Image",
      group: GROUP.content.name,
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          description: "Describe the image for accessibility and SEO",
        }),
      ],
      validation: (rule: ImageRule) => rule.required(),
    }),
    defineField({
      name: "content",
      type: "content",
      title: "Content",
      group: GROUP.content.name,
      validation: (rule) => rule.required(),
    }),
    SEO_FIELDS,
  ],
  orderings: HOW_TO_POST_ORDERINGS,
  preview: HOW_TO_POST_PREVIEW,
})
