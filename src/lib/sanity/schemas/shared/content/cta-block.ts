import { BoltIcon } from "@sanity/icons"
import { defineField, defineType, StringRule, UrlRule } from "sanity"

const ctaBlock = defineType({
  name: "ctaBlock",
  type: "object",
  icon: BoltIcon,
  title: "CTA",
  fields: [
    defineField({
      name: "text",
      type: "text",
      title: "Text",
      rows: 3,
      validation: (rule: StringRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      title: "Description",
    }),
    defineField({
      name: "buttonText",
      type: "string",
      title: "Button text",
      initialValue: "Get started",
      validation: (rule: StringRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "buttonUrl",
      type: "url",
      title: "Button URL",
      initialValue: "https://dashboard.novu.co/auth/sign-up",
      validation: (rule: UrlRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
  ],
  preview: {
    select: {
      text: "text",
    },
    prepare({ text }: { text: string }) {
      return {
        title: "CTA",
        subtitle: text,
      }
    },
  },
})

export default ctaBlock
