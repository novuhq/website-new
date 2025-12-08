import { StarIcon, ToggleArrowRightIcon } from "@sanity/icons"
import { defineField, defineType, StringRule } from "sanity"

import { GROUP } from "@/lib/sanity/schemas/shared/group"

export const planHeading = defineType({
  name: "planHeading",
  title: "Plan Heading",
  type: "object",
  initialValue: {
    isFeatured: false,
  },
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({
      name: "isFeatured",
      title: "Is Featured",
      type: "boolean",
    }),
    defineField({
      name: "buttonUrl",
      title: "Button URL",
      type: "string",
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
    }),
  ],
})

export const planHeadingItem = defineType({
  name: "planHeadingItem",
  title: "Plan Heading Item",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "Plan ID",
      type: "string",
      options: {
        list: [
          { title: "Free", value: "free" },
          { title: "Pro", value: "pro" },
          { title: "Team", value: "team" },
          { title: "Enterprise", value: "enterprise" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({
      name: "isFeatured",
      title: "Is Featured",
      type: "boolean",
    }),
    defineField({
      name: "buttonUrl",
      title: "Button URL",
      type: "string",
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
    }),
  ],
  preview: {
    select: {
      id: "id",
      label: "label",
    },
    prepare({ id, label }) {
      return {
        title: label || id,
        subtitle: `Plan: ${id}`,
      }
    },
  },
})

export const tableCell = defineType({
  name: "tableCell",
  title: "Table Cell",
  type: "object",
  initialValue: {
    booleanValue: false,
  },
  fields: [
    defineField({
      name: "value",
      title: "Value",
      description:
        "Table cell text – leave blank to display an icon indicating whether this feature is included in the plan.",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [{ title: "Strong", value: "strong" }],
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
    }),
    defineField({
      name: "booleanValue",
      title: "No / Yes",
      description:
        "Icon indicating whether this feature is included in the plan.",
      type: "boolean",
    }),
  ],
})

export const row = defineType({
  name: "row",
  title: "Table Row",
  type: "object",
  initialValue: {
    isGroupTitle: false,
  },
  fields: [
    defineField({
      name: "isGroupTitle",
      title: "Is Group Title",
      type: "boolean",
    }),
    defineField({
      name: "title",
      title: "Title *",
      type: "string",
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "tooltip",
      title: "Tooltip",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [{ title: "Strong", value: "strong" }],
            annotations: [],
          },
        },
      ],
      hidden: ({ parent }) => parent?.isGroupTitle,
    }),
    defineField({
      name: "free",
      title: "Free",
      type: "tableCell",
      hidden: ({ parent }) => parent?.isGroupTitle,
    }),
    defineField({
      name: "pro",
      title: "Pro",
      type: "tableCell",
      hidden: ({ parent }) => parent?.isGroupTitle,
    }),
    defineField({
      name: "team",
      title: "Team",
      type: "tableCell",
      hidden: ({ parent }) => parent?.isGroupTitle,
    }),
    defineField({
      name: "enterprise",
      title: "Enterprise",
      type: "tableCell",
      hidden: ({ parent }) => parent?.isGroupTitle,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
      isGroupTitle: "isGroupTitle",
    },
    prepare(selection) {
      const { title, subtitle, isGroupTitle } = selection

      return {
        media: isGroupTitle ? StarIcon : ToggleArrowRightIcon,
        title: isGroupTitle ? `Group – ${title}` : title,
        subtitle: subtitle ? `Subtitle: ${subtitle}` : "",
      }
    },
  },
})

export const plans = defineType({
  name: "plans",
  title: "Plans",
  type: "object",
  groups: [{ name: GROUP.content.name }],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headings",
      title: "Table Headings",
      type: "array",
      of: [{ type: "planHeadingItem" }],
      description: "Order is important. Add plans in the order they should appear in the table.",
      validation: (rule) =>
        rule
          .required()
          .length(4)
          .error("Must have exactly 4 headings")
          .custom((headings) => {
            if (!headings || !Array.isArray(headings)) {
              return true
            }

            const requiredIds = ["free", "pro", "team", "enterprise"]
            const ids = headings.map((h: any) => h?.id).filter(Boolean)

            const uniqueIds = new Set(ids)
            if (ids.length !== uniqueIds.size) {
              return "Each plan ID must be unique (free, pro, team, enterprise)"
            }

            const missingIds = requiredIds.filter((id) => !ids.includes(id))
            if (missingIds.length > 0) {
              return `Missing required plan IDs: ${missingIds.join(", ")}`
            }

            return true
          }),
    }),
    defineField({
      name: "rows",
      title: "Table Rows",
      type: "array",
      of: [{ type: "row" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      headings: "headings",
    },
  },
})
