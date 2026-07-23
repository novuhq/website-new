import { PlugIcon } from "@sanity/icons"
import { orderRankField } from "@sanity/orderable-document-list"
import {
  defineField,
  defineType,
  ImageRule,
  SlugRule,
  StringRule,
  UrlRule,
} from "sanity"

import {
  customSlugify,
  customSlugValidation,
} from "@/lib/sanity/utils/custom-slug-validation"

export default defineType({
  name: "templateMcpServer",
  title: "Template MCP Server",
  type: "document",
  icon: PlugIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule: StringRule) => rule.required().max(64),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        slugify: customSlugify,
      },
      validation: (rule: SlugRule) =>
        rule.required().custom(customSlugValidation).error(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule: StringRule) => rule.max(240),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule: UrlRule) =>
        rule.uri({
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
      validation: (rule: ImageRule) => rule.required(),
    }),
    orderRankField({ type: "templateMcpServer" }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
      media: "icon",
    },
  },
})
