import { COLORS } from "@/constants/colors"
import { defineField, defineType, StringRule } from "sanity"

import { ChangeItemPreview } from "@/lib/sanity/components/change-block-preview"
import ColorPicker from "@/lib/sanity/components/color-picker"

export default defineType({
  name: "tag",
  type: "document",
  title: "Tag",
  initialValue: { color: "lightSilver" },
  fields: [
    defineField({
      name: "text",
      type: "string",
      title: "Text",
      validation: (rule: StringRule) =>
        rule.required().error("Please enter tag text"),
    }),
    defineField({
      name: "color",
      type: "string",
      title: "Color",
      options: {
        list: Object.keys(COLORS).map((key) => ({
          title: key,
          value: key,
        })),
        layout: "radio",
      },
      components: {
        input: ColorPicker,
      },
      validation: (rule) => rule.required().error("Please select a color"),
    }),
  ],
  preview: {
    select: {
      text: "text",
      color: "color",
    },
    prepare({ text, color }: { text?: string; color?: keyof typeof COLORS }) {
      return {
        title: text,
        media: () => ChangeItemPreview({ color }),
      }
    },
  },
})
