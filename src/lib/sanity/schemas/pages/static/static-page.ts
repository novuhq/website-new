import {
  DatetimeRule,
  defineField,
  defineType,
  SlugRule,
  StringRule,
} from "sanity"

import { GROUP } from "@/lib/sanity/schemas/shared/group"
import { SEO_FIELDS } from "@/lib/sanity/schemas/shared/seo"
import {
  customSlugify,
  customSlugValidation,
} from "@/lib/sanity/utils/custom-slug-validation"

export default defineType({
  name: "staticPage",
  type: "document",
  title: "Static page",
  groups: [GROUP.content, GROUP.seo],
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "The title of the static page",
      group: GROUP.content.name,
      validation: (rule: StringRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      description:
        "Some frontends will require a slug to be set to be able to show the post",
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
      description: "This can be used to schedule post for publishing",
      group: GROUP.content.name,
      validation: (rule: DatetimeRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "content",
      type: "staticContent",
      title: "Content",
      group: GROUP.content.name,
      validation: (rule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    SEO_FIELDS,
  ],
})
