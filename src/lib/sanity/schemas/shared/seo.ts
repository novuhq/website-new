import { defineField, StringRule } from "sanity"

import { GROUP } from "./group"

export const SEO_FIELDS = defineField({
  name: "seo",
  title: "SEO",
  type: "object",
  group: GROUP.seo.name,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule: StringRule) =>
        rule.max(60).error("Title must be less than 60 characters"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      validation: (rule: StringRule) =>
        rule.max(160).error("Description must be less than 160 characters"),
    }),
    defineField({
      name: "socialImage",
      title: "Social Image",
      type: "image",
    }),
    defineField({
      name: "noIndex",
      title: "No Index",
      type: "boolean",
      initialValue: false,
    }),
  ],
})
