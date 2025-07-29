import { ImageIcon, NumberIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

const step = defineType({
  name: "step",
  title: "Step",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      initialValue: (context) => {
        const stepNumber = (context?.parent?.steps?.length ?? 0) + 1
        return `Step ${stepNumber}`
      },
    }),
    defineField({
      name: "content",
      type: "array",
      title: "Content",
      of: [
        { type: "block" },
        { type: "codeBlock" },
        { type: "codeTabs" },
        { type: "quoteBlock" },
        {
          type: "image",
          icon: ImageIcon,
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
      ],
    }),
  ],
})

const stepsBlock = defineType({
  name: "stepsBlock",
  type: "object",
  icon: NumberIcon,
  title: "Steps",
  fields: [
    defineField({
      name: "steps",
      type: "array",
      title: "Steps",
      of: [{ type: "step" }],
      validation: (rule) =>
        rule.min(2).error("There should be at least 2 steps.").required(),
    }),
  ],
  preview: {
    select: {
      steps: "steps",
    },
    prepare({ steps }) {
      const stepsCount = Array.isArray(steps) ? steps.length : 0

      return {
        title: `${stepsCount} step${stepsCount === 1 ? "" : "s"}`,
      }
    },
  },
})

const stepsBlockSchemas = [step, stepsBlock]

export default stepsBlockSchemas
