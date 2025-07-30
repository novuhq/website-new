import { ImageIcon } from "@sanity/icons"
import { defineField } from "sanity"

const content = defineField({
  title: "Content",
  name: "content",
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
    { type: "dividerBlock" },
    { type: "codeBlock" },
    { type: "codeTabs" },
    { type: "quoteBlock" },
    { type: "noteBlock" },
    { type: "tableBlock" },
    { type: "detailsToggleBlock" },
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
        {
          name: "variant",
          type: "string",
          title: "Variant",
          options: { list: ["default", "outline"] },
          initialValue: "default",
        },
      ],
    },
    { type: "twitterEmbed", title: "Twitter Embed" },
    { type: "youtubeVideo", title: "YouTube Embed" },
    { type: "video", title: "Video" },
    { type: "iframeBlock" },
    { type: "stepsBlock", title: "Steps" },
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
  ],
})

export default content
