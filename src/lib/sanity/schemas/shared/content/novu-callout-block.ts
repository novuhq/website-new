import { SparklesIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

import { portableToPlain } from "@/lib/sanity/utils/portable-to-plain"

const novuCalloutBlock = defineType({
  name: "novuCalloutBlock",
  type: "object",
  icon: SparklesIcon,
  title: "Novu Callout",
  description:
    "A branded callout card with the Novu logo and GitHub stars banner",
  fields: [
    defineField({
      name: "content",
      type: "array",
      title: "Content",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
        },
      ],
      validation: (rule) => rule.required().error("Please add callout content"),
    }),
  ],
  preview: {
    select: {
      content: "content",
    },
    prepare({ content }) {
      const contentPreview = content
        ? portableToPlain(content)
        : "No content yet"

      return {
        title: "Novu Callout",
        subtitle:
          contentPreview.length > 64
            ? contentPreview.slice(0, 64) + "..."
            : contentPreview,
      }
    },
  },
})

export default novuCalloutBlock
