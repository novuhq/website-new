import { CheckmarkCircleIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

const keyTakeawaysBlock = defineType({
  name: "keyTakeawaysBlock",
  type: "object",
  icon: CheckmarkCircleIcon,
  title: "Key Takeaways",
  fields: [
    defineField({
      name: "items",
      type: "array",
      title: "Takeaways",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Title",
              validation: (rule) =>
                rule.required().error("Please add a takeaway title"),
            }),
            defineField({
              name: "text",
              type: "string",
              title: "Text",
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "text",
            },
          },
        },
      ],
      validation: (rule) =>
        rule.min(1).error("Please add at least one takeaway").required(),
    }),
  ],
  preview: {
    select: {
      items: "items",
    },
    prepare({ items }) {
      const count = Array.isArray(items) ? items.length : 0

      return {
        title: "Key Takeaways",
        subtitle: `${count} item${count === 1 ? "" : "s"}`,
      }
    },
  },
})

export default keyTakeawaysBlock
