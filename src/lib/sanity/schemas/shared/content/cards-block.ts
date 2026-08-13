import { BlockContentIcon, ImageIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

import { portableToPlain } from "@/lib/sanity/utils/portable-to-plain"

const card = defineType({
  name: "card",
  title: "Card",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (rule) => rule.required().error("Please add a card title"),
    }),
    defineField({
      name: "content",
      type: "array",
      title: "Content",
      of: [
        { type: "block" },
        { type: "codeBlock" },
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
      validation: (rule) => rule.required().error("Please add card content"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      content: "content",
    },
    prepare({ title, content }) {
      const contentPreview = content
        ? portableToPlain(content)
        : "No content yet"

      return {
        title: title || "No title",
        subtitle:
          contentPreview.length > 64
            ? contentPreview.slice(0, 64) + "..."
            : contentPreview,
      }
    },
  },
})

const cardsBlock = defineType({
  name: "cardsBlock",
  type: "object",
  icon: BlockContentIcon,
  title: "Cards",
  fields: [
    defineField({
      name: "cards",
      type: "array",
      title: "Cards",
      of: [{ type: "card" }],
      validation: (rule) =>
        rule.min(1).error("Please add at least one card").required(),
    }),
  ],
  preview: {
    select: {
      cards: "cards",
    },
    prepare({ cards }) {
      const cardsCount = Array.isArray(cards) ? cards.length : 0
      const firstTitle = cards?.[0]?.title

      return {
        title: `${cardsCount} card${cardsCount === 1 ? "" : "s"}`,
        subtitle: firstTitle,
      }
    },
  },
})

const cardsBlockSchemas = [card, cardsBlock]

export default cardsBlockSchemas
