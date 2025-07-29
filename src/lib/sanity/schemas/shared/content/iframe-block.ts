import { MasterDetailIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

const iframeBlock = defineType({
  name: "iframeBlock",
  title: "Iframe",
  type: "object",
  icon: MasterDetailIcon,
  fields: [
    defineField({
      name: "content",
      title: "content",
      type: "text",
      description: "Paste the full iframe embed script here.",
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) {
            return "Iframe embed script is required"
          }

          const trimmedValue = value.trim()

          const openingTags = (trimmedValue.match(/<iframe/g) || []).length
          const closingTags = (trimmedValue.match(/<\/iframe>/g) || []).length

          if (openingTags !== 1 || closingTags !== 1) {
            return "The embed script should contain exactly one iframe"
          }

          return true
        }),
    }),
  ],
  preview: {
    select: {
      content: "content",
    },
    prepare({ content }) {
      return {
        title: "Iframe Embed",
        subtitle: content ? "Iframe script added" : "No iframe script",
      }
    },
  },
})

export default iframeBlock
