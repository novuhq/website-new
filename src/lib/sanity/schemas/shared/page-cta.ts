import { BoltIcon } from "@sanity/icons"
import { ArrayRule, defineField, defineType, StringRule, UrlRule } from "sanity"

const pageCta = defineType({
  name: "pageCta",
  type: "object",
  icon: BoltIcon,
  title: "Page CTA",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (rule: StringRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "description",
      type: "string",
      title: "Description",
    }),
    defineField({
      name: "actions",
      type: "array",
      title: "Actions",
      of: [
        {
          type: "object",
          name: "action",
          title: "Action",
          fields: [
            {
              name: "label",
              type: "string",
              title: "Label",
              validation: (rule) => rule.required(),
            },
            {
              name: "href",
              type: "url",
              title: "URL",
              validation: (rule) =>
                rule
                  .uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto", "tel"],
                  })
                  .required(),
            },
            {
              name: "isExternal",
              type: "boolean",
              title: "External Link",
              initialValue: false,
            },
          ],
        },
      ],
      validation: (rule) =>
        rule
          .required()
          .length(2)
          .error("You have to add exactly 2 actions.")
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }: { title: string }) {
      return {
        title: "Page CTA",
        subtitle: title,
      }
    },
  },
})

export default pageCta
