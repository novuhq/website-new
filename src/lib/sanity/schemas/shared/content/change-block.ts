import { COLORS } from "@/constants/colors"
import { BugIcon, RocketIcon, WrenchIcon } from "@sanity/icons"
import {
  ArrayRule,
  defineField,
  defineType,
  PortableTextBlock,
  StringRule,
} from "sanity"

import { ChangeItemPreview } from "@/lib/sanity/components/change-block-preview"
import ColorPicker from "@/lib/sanity/components/color-picker"

const changeBlock = defineType({
  name: "changeBlock",
  type: "object",
  icon: WrenchIcon,
  title: "Changes",
  fields: [
    defineField({
      name: "type",
      type: "string",
      title: "List Type",
      options: {
        list: [
          { title: "Improvements", value: "improvements" },
          { title: "Fixes", value: "fixes" },
        ],
      },
      validation: (rule: StringRule) =>
        rule.required().error("Please select a list type"),
    }),
    defineField({
      name: "items",
      type: "array",
      title: "Items",
      validation: (rule) =>
        rule.required().min(1).error("Please add at least one item"),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "tag",
              type: "reference",
              to: [{ type: "tag" }],
              title: "Tag",
            }),
            defineField({
              name: "text",
              title: "Text",
              type: "array",
              of: [
                {
                  type: "block",
                  styles: [],
                  lists: [],
                  marks: {
                    decorators: [
                      { title: "Strong", value: "strong" },
                      { title: "Emphasis", value: "em" },
                      { title: "Code", value: "code" },
                      { title: "Underline", value: "underline" },
                    ],
                    annotations: [],
                  },
                },
              ],
              validation: (rule: ArrayRule<PortableTextBlock>) =>
                rule.required().error("Please fill in text for list item"),
            }),
          ],
          preview: {
            select: {
              tagText: "tag.text",
              tagColor: "tag.color",
              text: "text",
            },
            prepare({
              tagText,
              tagColor,
              text,
            }: {
              tagText?: string
              tagColor?: keyof typeof COLORS
              text?: PortableTextBlock[]
            }) {
              const textContent =
                text
                  ?.map((block) => {
                    if (
                      block._type === "block" &&
                      Array.isArray(block.children)
                    ) {
                      return block.children
                        .map((child: any) => child.text || "")
                        .join("")
                    }
                    return ""
                  })
                  .join(" ") || ""

              return {
                title: textContent,
                subtitle: tagText ? `Tag: ${tagText}` : "",
                media: () => ChangeItemPreview({ color: tagColor }),
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      name: "type",
      items: "items",
    },
    prepare({
      name,
      items,
    }: {
      name?: string
      items?: Array<{ tag?: string }>
    }) {
      const title = name
        ? `${name?.at(0)?.toUpperCase() + name?.slice(1)}`
        : "List of changes"
      const icon = name
        ? name === "improvements"
          ? RocketIcon
          : BugIcon
        : WrenchIcon
      const amount = items?.length ? `(${items.length})` : ""

      return {
        title: `${title} ${amount}`,
        media: icon,
      }
    },
  },
})

export default changeBlock
