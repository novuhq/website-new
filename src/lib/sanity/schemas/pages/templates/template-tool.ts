import { WrenchIcon } from "@sanity/icons"
import { orderRankField } from "@sanity/orderable-document-list"
import { defineField, defineType, SlugRule, StringRule } from "sanity"

import {
  customSlugify,
  customSlugValidation,
} from "@/lib/sanity/utils/custom-slug-validation"

export default defineType({
  name: "templateTool",
  title: "Template Tool",
  type: "document",
  icon: WrenchIcon,
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
    orderRankField({ type: "templateTool" }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
    },
  },
})
