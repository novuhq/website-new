import { FilterIcon } from "@sanity/icons"
import { orderRankField } from "@sanity/orderable-document-list"
import { defineField, defineType, SlugRule, StringRule } from "sanity"

import {
  customSlugify,
  customSlugValidation,
} from "@/lib/sanity/utils/custom-slug-validation"

export default defineType({
  name: "blogCategory",
  title: "Blog Category",
  type: "document",
  icon: FilterIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule: StringRule) => rule.required().max(32),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        slugify: customSlugify,
      },
      validation: (rule: SlugRule) =>
        rule.required().custom(customSlugValidation).error(),
    }),
    orderRankField({ type: "blogCategory" }),
  ],
})
