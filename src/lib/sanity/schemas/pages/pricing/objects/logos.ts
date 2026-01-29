import { defineField, defineType, NumberRule, StringRule } from "sanity"

const logos = defineType({
  name: "logos",
  title: "Logos Section",
  type: "object",
  initialValue: {
    rows: 2,
  },
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "logoItem",
          title: "Logo Item",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
            },
            {
              name: "logo",
              title: "Logo",
              type: "image",
              options: {
                hotspot: true,
              },
            },
            {
              name: "priority",
              title: "Priority",
              type: "number",
            },
            {
              name: "rowIndex",
              title: "Row Index",
              type: "number",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "number",
      validation: (rule: NumberRule) =>
        rule.min(1).max(2).error("Rows must be between 1 and 2"),
    }),
  ],
})

export default logos
