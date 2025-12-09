import { ReactNode } from "react"
import { defineField } from "sanity"

const staticContent = defineField({
  title: "Static content",
  name: "staticContent",
  type: "array",
  of: [
    {
      type: "block",
      title: "Block",
      // Styles let you set what your user can mark up blocks with. These
      // corresponds with HTML tags, but you can set any title or value
      // you want and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Number", value: "number" },
      ],
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
          { title: "Underline", value: "underline" },
          {
            title: "H2",
            value: "h2",
            icon: () => <span>H2</span>,
            component: (props: { children: ReactNode }) => (
              <h2 style={{ fontSize: "2rem", fontWeight: "bold" }}>
                {props.children}
              </h2>
            ),
          },
          {
            title: "H3",
            value: "h3",
            icon: () => <span>H3</span>,
            component: (props: { children: ReactNode }) => (
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                {props.children}
              </h3>
            ),
          },
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
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
                validation: (Rule) =>
                  Rule.uri({
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
    { type: "tableBlock" },
  ],
})

export default staticContent
