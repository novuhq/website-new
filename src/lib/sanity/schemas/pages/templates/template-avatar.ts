import { UserIcon } from "@sanity/icons"
import { orderRankField } from "@sanity/orderable-document-list"
import {
  defineField,
  defineType,
  ImageRule,
  SlugRule,
  StringRule,
} from "sanity"

import { customImageFileSizeValidation } from "@/lib/sanity/utils/custom-image-file-size-validation"
import {
  customSlugify,
  customSlugValidation,
} from "@/lib/sanity/utils/custom-slug-validation"

const avatarImageFields = [
  defineField({
    name: "alt",
    title: "Alt text",
    type: "string",
    validation: (rule: StringRule) => rule.max(120),
  }),
]

export default defineType({
  name: "templateAvatar",
  title: "Template Avatar",
  type: "document",
  icon: UserIcon,
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
      name: "darkImage",
      title: "Dark image",
      description: "Website / novu.co variant.",
      type: "image",
      fields: avatarImageFields,
      validation: (rule: ImageRule) =>
        rule.required().custom(customImageFileSizeValidation()),
    }),
    defineField({
      name: "lightImage",
      title: "Light image",
      description: "In-product variant.",
      type: "image",
      fields: avatarImageFields,
      validation: (rule: ImageRule) =>
        rule.required().custom(customImageFileSizeValidation()),
    }),
    orderRankField({ type: "templateAvatar" }),
  ],
  preview: {
    select: {
      title: "name",
      media: "darkImage",
    },
    prepare({ title, media }) {
      return {
        title,
        subtitle: "Dark + light variants",
        media,
      }
    },
  },
})
