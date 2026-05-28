import { ToggleArrowRightIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

const faqAnswerBlock = {
  type: "block",
  styles: [{ title: "Normal", value: "normal" }],
  lists: [
    { title: "Bullet", value: "bullet" },
    { title: "Number", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Strong", value: "strong" },
      { title: "Emphasis", value: "em" },
      { title: "Code", value: "code" },
    ],
    annotations: [
      {
        name: "link",
        type: "object",
        title: "Link",
        fields: [
          defineField({
            name: "href",
            type: "url",
            title: "URL",
            validation: (rule) =>
              rule.uri({
                allowRelative: true,
                scheme: ["http", "https", "mailto", "tel"],
              }),
          }),
          defineField({
            name: "isExternal",
            type: "boolean",
            title: "External link",
            initialValue: false,
          }),
        ],
      },
    ],
  },
}

const faqBlock = defineType({
  name: "faqBlock",
  type: "object",
  icon: ToggleArrowRightIcon,
  title: "FAQ",
  fields: [
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      of: [
        {
          type: "object",
          title: "Question",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "array",
              of: [faqAnswerBlock],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "question",
            },
          },
        },
      ],
      validation: (rule) => rule.min(1).required(),
    }),
  ],
  preview: {
    select: {
      items: "items",
    },
    prepare({ items }) {
      const count = Array.isArray(items) ? items.length : 0

      return {
        title: "FAQ",
        subtitle: `${count} question${count === 1 ? "" : "s"}`,
      }
    },
  },
})

export default faqBlock
