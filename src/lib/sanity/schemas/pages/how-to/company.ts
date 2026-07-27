import { TagIcon } from "@sanity/icons"
import { defineField, defineType, StringRule } from "sanity"

export default defineType({
  name: "howToCompany",
  title: "How-to Company",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule: StringRule) => rule.required().max(80),
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
  },
})
