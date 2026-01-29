import { defineField, defineType, StringRule } from "sanity"

import { GROUP } from "@/lib/sanity/schemas/shared/group"

const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "object",
  groups: [{ name: GROUP.content.name }],
  validation: (rule) => rule.required(),
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule: StringRule) => rule.required().max(40),
    }),
    defineField({
      name: "accordion",
      title: "Accordion",
      type: "accordion",
      validation: (rule) => rule.required(),
    }),
  ],
})

export default faq
