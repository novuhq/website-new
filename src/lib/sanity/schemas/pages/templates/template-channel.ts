import { BellIcon } from "@sanity/icons"
import { orderRankField } from "@sanity/orderable-document-list"
import {
  defineField,
  defineType,
  ImageRule,
  SlugRule,
  StringRule,
} from "sanity"

import {
  customSlugify,
  customSlugValidation,
} from "@/lib/sanity/utils/custom-slug-validation"

export default defineType({
  name: "templateChannel",
  title: "Template Channel",
  type: "document",
  icon: BellIcon,
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
      name: "isComingSoon",
      title: "Coming soon",
      type: "boolean",
      description: "Marks this channel as unavailable in the marketplace UI.",
      initialValue: false,
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
    orderRankField({ type: "templateChannel" }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
      media: "icon",
    },
  },
})
