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
  UrlRule,
} from "sanity"

import { HOW_TO_COVER_HEIGHT, HOW_TO_COVER_WIDTH } from "@/lib/how-to/cover"
import { GROUP } from "@/lib/sanity/schemas/shared/group"
import { SEO_FIELDS } from "@/lib/sanity/schemas/shared/seo"
import { customImageValidation } from "@/lib/sanity/utils/custom-image-validation"
import {
  customSlugify,
  customSlugValidation,
} from "@/lib/sanity/utils/custom-slug-validation"

const HOW_TO_COVER_ASPECT_RATIO = HOW_TO_COVER_WIDTH / HOW_TO_COVER_HEIGHT

function hasLegacyCustomCover(document: unknown) {
  const post = document as { coverMode?: unknown; cover?: unknown } | undefined

  return !post?.coverMode && Boolean(post?.cover)
}

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
    media: "author.avatar.darkImage",
    authorName: "author.name",
    category: "category.title",
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prepare(selection: Record<string, any>) {
    const { title, publishedAt, media, category, authorName } = selection
    const dateSegment = publishedAt
      ? format(new Date(publishedAt), "yyyy/MMMM")
      : "No date"

    return {
      title,
      media,
      subtitle: [category, authorName, `Published: ${dateSegment}`]
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
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "howToAuthor" }],
      group: GROUP.content.name,
      validation: (rule: ReferenceRule) => rule.required(),
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
      name: "useTemplateUrl",
      title: "Use this template URL",
      type: "url",
      group: GROUP.content.name,
      initialValue: "https://dashboard.novu.co/auth/sign-up",
      validation: (rule: UrlRule) =>
        rule
          .uri({
            allowRelative: true,
            scheme: ["http", "https"],
          })
          .required(),
    }),
    defineField({
      name: "readDocsUrl",
      title: "Read the docs URL",
      type: "url",
      group: GROUP.content.name,
      initialValue: "https://docs.novu.co/platform/additional-resources/mcp",
      validation: (rule: UrlRule) =>
        rule
          .uri({
            allowRelative: true,
            scheme: ["http", "https"],
          })
          .required(),
    }),
    defineField({
      name: "coverMode",
      type: "string",
      title: "Cover source",
      group: GROUP.content.name,
      initialValue: "generated",
      options: {
        layout: "radio",
        direction: "horizontal",
        list: [
          { title: "Generated", value: "generated" },
          { title: "Custom", value: "custom" },
          { title: "No cover", value: "none" },
        ],
      },
    }),
    defineField({
      name: "coverTemplate",
      type: "string",
      title: "Generated cover template",
      group: GROUP.content.name,
      description: "Choose a generated cover design.",
      initialValue: "template-1",
      hidden: ({ document }) =>
        document?.coverMode === "custom" ||
        document?.coverMode === "none" ||
        hasLegacyCustomCover(document),
      options: {
        layout: "radio",
        list: [
          { title: "Template 1", value: "template-1" },
          { title: "Template 2", value: "template-2" },
          { title: "Default image", value: "default" },
        ],
      },
    }),
    defineField({
      name: "coverText",
      type: "text",
      title: "Generated cover text",
      rows: 3,
      group: GROUP.content.name,
      description: "Leave empty to use the article title.",
      hidden: ({ document }) =>
        document?.coverMode === "custom" ||
        document?.coverMode === "none" ||
        document?.coverTemplate === "default" ||
        hasLegacyCustomCover(document),
      validation: (rule: StringRule) =>
        rule.max(120).custom((value) => {
          if (!value) {
            return true
          }

          const lineCount = value.split(/\r\n|\r|\n/).length

          return lineCount <= 3
            ? true
            : "Cover text must be no more than 3 lines"
        }),
    }),
    defineField({
      name: "cover",
      type: "image",
      title: "Custom cover image",
      description: `Shown when Cover source is Custom. Upload a ${HOW_TO_COVER_WIDTH}x${HOW_TO_COVER_HEIGHT}px image.`,
      group: GROUP.content.name,
      hidden: ({ document }) =>
        Boolean(document?.coverMode) && document?.coverMode !== "custom",
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          description: "Describe the image for accessibility and SEO",
        }),
      ],
      validation: (rule: ImageRule) =>
        rule.custom((value, context) => {
          const document = context.document as { coverMode?: string }

          if (document?.coverMode !== "custom") {
            return true
          }

          if (!value?.asset?._ref) {
            return "Custom cover image is required when Cover source is Custom"
          }

          return customImageValidation()
            .type("png", "jpg", "jpeg")
            .dimensions(HOW_TO_COVER_WIDTH, HOW_TO_COVER_HEIGHT)
            .aspectRatio(HOW_TO_COVER_ASPECT_RATIO)
            .validate(value, context)
        }),
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
