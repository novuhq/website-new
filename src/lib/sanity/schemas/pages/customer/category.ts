import { TagIcon } from "@sanity/icons"
import { defineField, defineType, StringRule } from "sanity"

export default defineType({
  name: "customer_category",
  type: "document",
  icon: TagIcon,
  title: "Category",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Name",
      validation: (rule: StringRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
  },
})
