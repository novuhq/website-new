import { defineField, defineType } from "sanity"

const accordion = defineType({
  name: "accordion",
  title: "Accordion",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Accordion Items",
      type: "array",
      of: [
        {
          type: "object",
          title: "Accordion Item",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "array",
              of: [
                {
                  type: "block",
                  styles: [{ title: "Normal", value: "normal" }],
                  lists: [],
                  marks: {
                    decorators: [
                      { title: "Strong", value: "strong" },
                    ],
                    annotations: [
                      {
                        name: "link",
                        type: "object",
                        title: "Link",
                        fields: [
                          {
                            name: "href",
                            title: "URL",
                            type: "url",
                            validation: (rule) =>
                              rule.uri({
                                allowRelative: true,
                                scheme: ["http", "https", "mailto", "tel"],
                              }).required(),
                          },
                          {
                            name: "isExternal",
                            title: "External Link",
                            type: "boolean",
                            description: "Check if the link leads to an external resource and should open in a new tab",
                            initialValue: false,
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              question: "question",
              answer: "answer",
            },
            prepare({ question, answer }) {
              // Extract text from rich text blocks for preview
              const answerText = answer
                ? answer
                    .map((block: any) => 
                      block._type === 'block' && block.children
                        ? block.children.map((child: any) => child.text).join('')
                        : ''
                    )
                    .join(' ')
                : '';
              
              return {
                title: question,
                subtitle: answerText ? `${answerText.substring(0, 60)}...` : "",
              }
            },
          },
        },
      ],
      validation: (rule) => rule.min(1).required(),
    }),
  ],
  preview: {
    select: {
      items: "items",
    },
    prepare({ items }) {
      const count = items?.length || 0
      return {
        title: "Accordion",
        subtitle: `${count} item${count !== 1 ? "s" : ""}`,
      }
    },
  },
})

export default accordion
