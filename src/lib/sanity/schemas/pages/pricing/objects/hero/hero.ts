import {
  ArrayRule,
  defineField,
  defineType,
  NumberRule,
  StringRule,
} from "sanity"

import { GROUP } from "@/lib/sanity/schemas/shared/group"

export const pricingHeroCard = defineType({
  name: "pricingHeroCard",
  title: "Pricing Card",
  type: "object",
  validation: (rule) => rule.required(),
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({
      name: "isFeatured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "textBeforePrice",
      title: "Text before price",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "array",
      of: [
        {
          type: "object",
          name: "numericPrice",
          title: "Numeric Price",
          fields: [
            defineField({
              name: "value",
              title: "Price Value (USD)",
              type: "number",
              validation: (rule: NumberRule) =>
                rule
                  .required()
                  .min(0)
                  .max(100000)
                  .integer()
                  .error(
                    "Price must be a positive integer between 0 and 100000"
                  ),
            }),
            defineField({
              name: "paymentPeriod",
              title: "Payment Period",
              type: "string",
              validation: (rule: StringRule) =>
                rule.required().custom((value) => {
                  if (value !== "month" && value !== "year") {
                    return "Payment Period must be either month or year"
                  }
                  return true
                }),
            }),
          ],
          preview: {
            select: {
              value: "value",
              period: "paymentPeriod",
            },
            prepare({ value, period }) {
              return {
                title: `$${value}${period ? ` / ${period}` : ""}`,
              }
            },
          },
        },
        {
          type: "object",
          name: "customPrice",
          title: "Custom Price",
          fields: [
            defineField({
              name: "value",
              title: "Custom Price Text",
              type: "string",
              validation: (rule: StringRule) => rule.required(),
              placeholder: "e.g., Custom, etc.",
            }),
          ],
          preview: {
            select: {
              value: "value",
            },
            prepare({ value }) {
              return {
                title: value,
              }
            },
          },
        },
      ],
      validation: (rule: ArrayRule<any>) =>
        rule.required().max(1).error("Please select only one price type"),
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "link",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "extraInfo",
      title: "Extra Info",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({
      name: "details",
      title: "Details",
      type: "array",
      of: [
        {
          type: "block",
          title: "Block",
          styles: [],
          lists: [{ title: "Bullet", value: "bullet" }],
          marks: {
            decorators: [],
            annotations: [
              {
                title: "Link",
                name: "link",
                type: "object",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "string",
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
  ],
})

export const pricingHero = defineType({
  name: "pricingHero",
  title: "Pricing Hero",
  type: "object",
  groups: [{ name: GROUP.content.name }],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "plans",
      title: "Plans",
      type: "array",
      of: [{ type: "pricingHeroCard" }],
      validation: (rule: ArrayRule<{ type: "pricingHeroCard" }>) =>
        rule.max(4).error("You can only add up to 4 cards"),
    }),
  ],
})
