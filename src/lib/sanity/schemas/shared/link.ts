import { defineField, defineType } from "sanity"

const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Link Text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      validation: (rule) =>
        rule.uri({
          allowRelative: true,
          scheme: ["http", "https", "mailto", "tel"],
        }).required(),
    }),
    defineField({
      name: "isExternal",
      title: "External Link",
      type: "boolean",
      description: "Check if the link leads to an external resource and should open in a new tab",
      initialValue: false,
    }),
    defineField({
      name: "variant",
      title: "Link Variant",
      type: "string",
      options: {
        list: [
          { title: "Filled", value: "filled" },
          { title: "Outlined", value: "outlined" },
        ],
      },
      initialValue: "outlined",
    }),
  ],
  preview: {
    select: {
      text: "text",
      href: "href",
    },
    prepare({ text, href }) {
      return {
        title: text || "Link",
        subtitle: href,
      }
    },
  },
})

export default link
