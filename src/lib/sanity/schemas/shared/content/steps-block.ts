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
        { type: "tableBlock" },
        {
          type: "image",
          icon: ImageIcon,
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt text",
              description: "Describe the image for accessibility and SEO",
            },
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
    defineField({
      name: "startNumber",
      type: "number",
      title: "Start numbering at",
      description:
        "Use it to continue numbering from a previous steps block, e.g. when one walkthrough is split across several sections.",
      initialValue: 1,
      validation: (rule) => rule.min(1).integer(),
    }),
  ],
  preview: {
    select: {
      steps: "steps",
      startNumber: "startNumber",
    },
    prepare({ steps, startNumber }) {
      const stepsCount = Array.isArray(steps) ? steps.length : 0
      const start = typeof startNumber === "number" ? startNumber : 1

      return {
        title: `${stepsCount} step${stepsCount === 1 ? "" : "s"}`,
        subtitle:
          start > 1
            ? `Numbered ${start}–${start + Math.max(stepsCount - 1, 0)}`
            : undefined,
      }
    },
  },
})

const stepsBlockSchemas = [step, stepsBlock]

export default stepsBlockSchemas
