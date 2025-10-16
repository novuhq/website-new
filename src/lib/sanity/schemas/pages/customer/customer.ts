import { UserIcon } from "@sanity/icons"
import { orderRankField } from "@sanity/orderable-document-list"
import {
  defineField,
  defineType,
  ImageRule,
  SlugRule,
  StringRule,
  UrlRule,
} from "sanity"

import { GROUP } from "@/lib/sanity/schemas/shared/group"
import { SEO_FIELDS } from "@/lib/sanity/schemas/shared/seo"

export default defineType({
  name: "customer",
  type: "document",
  title: "Customer",
  icon: UserIcon,
  groups: [GROUP.content, GROUP.seo],
  fieldsets: [
    {
      name: "quote",
      title: "Quote",
      options: { collapsible: true },
    },
  ],
  fields: [
    orderRankField({ type: "customer" }),
    defineField({
      name: "name",
      type: "string",
      title: "Customer Name",
      group: GROUP.content.name,
      validation: (rule: StringRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "type",
      type: "string",
      title: "Link Type",
      description:
        "Choose whether this is an external link to customer or a story on Novu's site",
      options: {
        list: [
          { title: "External Link", value: "external" },
          { title: "Story", value: "story" },
        ],
        layout: "radio",
      },
      group: GROUP.content.name,
      validation: (rule: StringRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "url",
      type: "url",
      title: "External URL",
      group: GROUP.content.name,
      hidden: ({ document }) => document?.type !== "external",
      validation: (rule: UrlRule) =>
        rule.custom((value, context) => {
          const document = context.document as { type?: string }
          if (document?.type === "external" && !value) {
            return "External link is required when link type is external"
          }
          return true
        }),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      group: GROUP.content.name,
      hidden: ({ document }) => document?.type !== "story",
      validation: (rule: SlugRule) =>
        rule.custom((value, context) => {
          const document = context.document as { type?: string }
          if (document?.type === "story" && !value) {
            return "Slug is required when link type is story"
          }
          return true
        }),
      options: {
        source: "name",
      },
    }),
    defineField({
      name: "logo",
      type: "image",
      title: "Logo",
      description: "Should be white with slight transparency",
      group: GROUP.content.name,
      validation: (rule: ImageRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      group: GROUP.content.name,
      hidden: ({ document }) => document?.type !== "story",
      validation: (rule: StringRule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string }
          if (parent?.type === "story" && !value) {
            return "About field is required when link type is story"
          }
          return true
        }),
    }),
    defineField({
      name: "about",
      type: "text",
      title: "About",
      rows: 2,
      group: GROUP.content.name,
      validation: (rule: StringRule) =>
        rule.required().error("You have to fill in this field."),
    }),
    defineField({
      name: "category",
      type: "array",
      title: "Category",
      group: GROUP.content.name,
      of: [
        {
          type: "reference",
          to: [{ type: "customer_category" }],
        },
      ],
      validation: (rule) =>
        rule
          .required()
          .error("You have to fill in this field.")
          .max(1)
          .error("You can select only 1 category."),
    }),
    defineField({
      name: "is_featured",
      title: "Is Featured",
      type: "boolean",
      description: "Check if this customer should be in the featured category",
      initialValue: false,
      group: GROUP.content.name,
    }),
    defineField({
      name: "channels_list",
      title: "Channels",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Email", value: "Email" },
          { title: "Inbox", value: "Inbox" },
          { title: "SMS", value: "SMS" },
        ],
      },
      group: GROUP.content.name,
    }),
    defineField({
      name: "storyPhoto",
      type: "image",
      title: "Illustration",
      description: "Main illustrations for the story (optional)",
      group: GROUP.content.name,
      hidden: ({ document }) => document?.type !== "story",
    }),
    defineField({
      name: "industry",
      type: "string",
      title: "Industry",
      group: GROUP.content.name,
      hidden: ({ document }) => document?.type !== "story",
      validation: (rule: StringRule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string }
          if (parent?.type === "story" && !value) {
            return "Industry is required when link type is story"
          }
          return true
        }),
    }),
    defineField({
      name: "quote_text",
      type: "text",
      title: "Text",
      rows: 3,
      group: GROUP.content.name,
      fieldset: "quote",
      hidden: ({ document }) => document?.type !== "story",
    }),
    defineField({
      name: "quote_photo",
      type: "image",
      title: "Author Photo",
      group: GROUP.content.name,
      fieldset: "quote",
      hidden: ({ document }) => document?.type !== "story",
    }),
    defineField({
      name: "quote_name",
      type: "string",
      title: "Author Name",
      group: GROUP.content.name,
      fieldset: "quote",
      hidden: ({ document }) => document?.type !== "story",
      validation: (rule: StringRule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string }
          if (parent?.type === "story" && !value) {
            return "Author name is required when link type is story"
          }
          return true
        }),
    }),
    defineField({
      name: "quote_position",
      type: "string",
      title: "Author Position",
      group: GROUP.content.name,
      fieldset: "quote",
      hidden: ({ document }) => document?.type !== "story",
      validation: (rule: StringRule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string }
          if (parent?.type === "story" && !value) {
            return "Author position is required when link type is story"
          }
          return true
        }),
    }),
    defineField({
      name: "challengesSolution",
      type: "object",
      title: "Challenges & Solution",
      group: GROUP.content.name,
      hidden: ({ document }) => document?.type !== "story",
      options: { collapsible: true, collapsed: false },
      validation: (rule) =>
        rule.custom(
          (
            value: { challenges?: string[]; solution?: string[] } | undefined
          ) => {
            if (!value) return true

            const challenges = value.challenges || []
            const solution = value.solution || []

            if (challenges.length > 0 && solution.length === 0) {
              return "If you add challenges, you must also add at least one solution"
            }

            if (solution.length > 0 && challenges.length === 0) {
              return "If you add solutions, you must also add at least one challenge"
            }

            return true
          }
        ),
      fields: [
        defineField({
          name: "challenges",
          type: "array",
          title: "Key Challenges",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "solution",
          type: "array",
          title: "Novu Solution",
          of: [{ type: "string" }],
        }),
      ],
    }),
    defineField({
      name: "body",
      type: "content",
      title: "Body",
      group: GROUP.content.name,
      hidden: ({ document }) => document?.type !== "story",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string }
          if (parent?.type === "story" && !value) {
            return "Body is required when link type is story"
          }
          return true
        }),
    }),
    defineField({
      name: "related",
      type: "array",
      title: "Related Stories",
      hidden: ({ document }) => document?.type !== "story",
      validation: (rule) =>
        rule.custom((value) => {
          if (value && value.length > 0 && value.length < 4) {
            return "You should choose at least 4 related stories"
          }
          return true
        }),
      of: [
        {
          type: "reference",
          to: [{ type: "customer" }],
          options: {
            filter: ({ document }: { document: { _id?: string } }) => {
              const baseId = document._id?.replace(/^drafts\./, "")

              return {
                filter:
                  'type == "story" && !(_id in [$documentId, "drafts." + $documentId])',
                params: {
                  documentId: baseId,
                },
              }
            },
          },
        },
      ],
      group: GROUP.content.name,
    }),
    SEO_FIELDS,
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "type",
      media: "logo",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title,
        subtitle: `${subtitle === "external" ? "External Link" : "Story"}`,
        media: media,
      }
    },
  },
})
