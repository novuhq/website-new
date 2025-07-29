import { defineField, defineType, ImageRule, StringRule } from "sanity"

export default defineType({
  name: "author",
  type: "document",
  title: "Authors",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Name",
      validation: (rule: StringRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "photo",
      type: "image",
      title: "Photo",
      validation: (rule: ImageRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "photo",
    },
  },
})
