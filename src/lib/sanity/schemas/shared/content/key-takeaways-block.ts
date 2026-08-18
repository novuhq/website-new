import { CheckmarkCircleIcon } from "@sanity/icons"
import { defineField, defineType, type PortableTextBlock } from "sanity"

function toPlainText(blocks: PortableTextBlock[] | undefined) {
  if (!Array.isArray(blocks)) {
    return ""
  }

  return blocks
    .map((block) =>
      block._type === "block" && Array.isArray(block.children)
        ? block.children.map((child) => child.text ?? "").join("")
        : ""
    )
    .join(" ")
    .trim()
}

const keyTakeawaysBlock = defineType({
  name: "keyTakeawaysBlock",
  type: "object",
  icon: CheckmarkCircleIcon,
  title: "Key Takeaways",
  fields: [
    defineField({
      name: "items",
      type: "array",
      title: "Takeaways",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Title",
              validation: (rule) =>
                rule.required().error("Please add a takeaway title"),
            }),
            defineField({
              name: "text",
              type: "array",
              title: "Text",
              of: [
                {
                  type: "block",
                  styles: [{ title: "Normal", value: "normal" }],
                  lists: [],
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
                          {
                            name: "href",
                            type: "url",
                            title: "URL",
                            validation: (rule) =>
                              rule.uri({
                                allowRelative: true,
                                scheme: ["http", "https", "mailto", "tel"],
                              }),
                          },
                          {
                            name: "isExternal",
                            type: "boolean",
                            title: "External link",
                            initialValue: false,
                            description:
                              "Check if the link leads to an external resource and should open in a new tab.",
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
              text: "text",
            },
            prepare({ title, text }) {
              return {
                title,
                subtitle: toPlainText(text),
              }
            },
          },
        },
      ],
      validation: (rule) =>
        rule.min(1).error("Please add at least one takeaway").required(),
    }),
  ],
  preview: {
    select: {
      items: "items",
    },
    prepare({ items }) {
      const count = Array.isArray(items) ? items.length : 0

      return {
        title: "Key Takeaways",
        subtitle: `${count} item${count === 1 ? "" : "s"}`,
      }
    },
  },
})

export default keyTakeawaysBlock
