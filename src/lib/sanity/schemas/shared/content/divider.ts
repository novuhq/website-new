import { TruncateIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

const dividerBlock = defineType({
  name: "dividerBlock",
  type: "object",
  title: "Divider",
  icon: TruncateIcon,
  fields: [
    defineField({
      name: "hidden",
      type: "boolean",
      title: "Hide everything below",
      initialValue: true,
      readOnly: true,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Divider",
        subtitle:
          "Everything under this block will be hidden under 'Read more' button",
      }
    },
  },
})

export default dividerBlock
