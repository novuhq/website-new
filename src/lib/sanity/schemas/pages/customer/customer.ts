import { UserIcon } from "@sanity/icons"
import {
  defineField,
  defineType,
  ImageRule,
  SlugRule,
  StringRule,
  UrlRule,
} from "sanity"

import { GROUP } from "../../shared/group"

export default defineType({
  name: "customer",
  type: "document",
  title: "Customer",
  icon: UserIcon,
  groups: [GROUP.content, GROUP.seo],
  fields: [
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: GROUP.seo.name,
      hidden: ({ parent }) => parent?.link?.type !== "story",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule: StringRule) =>
            rule.max(60).error("Title must be less than 60 characters"),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "string",
          validation: (rule: StringRule) =>
            rule.max(160).error("Description must be less than 160 characters"),
        }),
        defineField({
          name: "socialImage",
          title: "Social Image",
          type: "image",
        }),
        defineField({
          name: "noIndex",
          title: "No Index",
          type: "boolean",
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: "link",
      type: "object",
      title: "Link",
      group: GROUP.content.name,
      fields: [
        defineField({
          name: "type",
          type: "string",
          title: "Link Type",
          options: {
            list: [
              { title: "External Link", value: "external" },
              { title: "Story", value: "story" },
            ],
            layout: "radio",
          },
          validation: (rule: StringRule) =>
            rule.error("You have to choose a link type.").required(),
        }),
        defineField({
          name: "url",
          type: "url",
          title: "External URL",
          description:
            "External URL (only used when Link Type is External Link)",
          hidden: ({ parent }) => parent?.type !== "external",
          validation: (rule: UrlRule) =>
            rule.custom((value, context) => {
              const parent = context.parent as { type?: string }
              if (parent?.type === "external" && !value) {
                return "External link is required when link type is external"
              }
              return true
            }),
        }),
      ],
      validation: (rule) =>
        rule.custom((value) => {
          if (!value?.type) {
            return "Link type is required"
          }
          if (value.type === "external" && !value.url) {
            return "External URL is required when link type is external"
          }
          return true
        }),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      group: GROUP.content.name,
      hidden: ({ parent }) => parent?.link?.type !== "story",
      validation: (rule: SlugRule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { link?: { type?: string } }
          if (parent?.link?.type === "story" && !value) {
            return "Slug is required when link type is story"
          }
          return true
        }),
      options: {
        source: "name",
      },
    }),
    defineField({
      name: "name",
      type: "string",
      title: "Customer Name",
      group: GROUP.content.name,
      validation: (rule: StringRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "logo",
      type: "image",
      title: "Logo",
      description: "Full logo with text",
      group: GROUP.content.name,
      validation: (rule: ImageRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description:
        "Title length depends on card type: max 128 characters for Big cards, max 72 characters for small cards",
      group: GROUP.content.name,
      validation: (rule: StringRule) =>
        rule
          .required()
          .error("You have to fill in this field.")
          .custom((value, context) => {
            const parent = context.parent as { card_type?: string }
            const cardType = parent?.card_type

            if (!value) return true

            if (cardType === "big" && value.length > 128) {
              return "Title for Big card must be 128 characters or less"
            }

            if (cardType === "small" && value.length > 72) {
              return "Title for small card must be 72 characters or less"
            }

            return true
          }),
    }),
    defineField({
      name: "author",
      type: "string",
      title: "Author",
      group: GROUP.content.name,
      validation: (rule: StringRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "author_position",
      type: "string",
      title: "Author Position",
      group: GROUP.content.name,
      validation: (rule: StringRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "card_type",
      type: "string",
      title: "Card Type",
      description: "Choose the card size type",
      options: {
        list: [
          { title: "Big Card", value: "big" },
          { title: "Small Card", value: "small" },
        ],
        layout: "radio",
      },
      group: GROUP.content.name,
    }),
    defineField({
      name: "story_photo",
      type: "image",
      title: "Story Photo",
      description: "Optional main photo for the story",
      group: GROUP.content.name,
      hidden: ({ parent }) => parent?.link?.type !== "story",
    }),
    defineField({
      name: "about",
      type: "text",
      title: "About",
      description: "Text about the customer/company",
      rows: 4,
      group: GROUP.content.name,
      hidden: ({ parent }) => parent?.link?.type !== "story",
      validation: (rule: StringRule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { link?: { type?: string } }
          if (parent?.link?.type === "story" && !value) {
            return "About field is required when link type is story"
          }
          return true
        }),
    }),
    defineField({
      name: "industry",
      type: "string",
      title: "Industry",
      group: GROUP.content.name,
      hidden: ({ parent }) => parent?.link?.type !== "story",
      validation: (rule: StringRule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { link?: { type?: string } }
          if (parent?.link?.type === "story" && !value) {
            return "Industry is required when link type is story"
          }
          return true
        }),
    }),
    // Channels block
    defineField({
      name: "channels",
      type: "object",
      title: "Channels",
      group: GROUP.content.name,
      hidden: ({ parent }) => parent?.link?.type !== "story",
      options: { collapsible: true, collapsed: false },
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { link?: { type?: string } }
          if (parent?.link?.type === "story") {
            if (!value) {
              return "Channels are required when link type is story"
            }

            const { email, inbox, sms } = value
            if (!email && !inbox && !sms) {
              return "At least one channel (email, inbox, or sms) must be filled when link type is story"
            }
          }
          return true
        }),
      fields: [
        defineField({
          name: "email",
          type: "string",
          title: "Email",
        }),
        defineField({
          name: "inbox",
          type: "string",
          title: "Inbox",
        }),
        defineField({
          name: "sms",
          type: "string",
          title: "SMS",
        }),
      ],
    }),
    defineField({
      name: "socials",
      type: "object",
      title: "Socials",
      group: GROUP.content.name,
      hidden: ({ parent }) => parent?.link?.type !== "story",
      options: { collapsible: true, collapsed: false },
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { link?: { type?: string } }
          if (parent?.link?.type === "story") {
            if (!value) {
              return "Socials are required when link type is story"
            }

            const { x, linkedin, website } = value
            if (!x && !linkedin && !website) {
              return "At least one social (x, linkedin, website) must be filled when link type is story"
            }
          }
          return true
        }),
      fields: [
        defineField({
          name: "x",
          type: "string",
          title: "X",
        }),
        defineField({
          name: "linkedin",
          type: "string",
          title: "LinkedIn",
        }),
        defineField({
          name: "website",
          type: "string",
          title: "Website",
        }),
      ],
    }),
    // Quote block
    defineField({
      name: "quote",
      type: "object",
      title: "Quote",
      group: GROUP.content.name,
      hidden: ({ parent }) => parent?.link?.type !== "story",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "title",
          type: "text",
          title: "Title",
          rows: 3,
        }),
        defineField({
          name: "author_logo",
          type: "image",
          title: "Author Logo",
        }),
        defineField({
          name: "author_name",
          type: "string",
          title: "Author Name",
        }),
        defineField({
          name: "author_position",
          type: "string",
          title: "Author Position",
        }),
      ],
    }),
    // Challenges & Solution block
    defineField({
      name: "challenges_solution",
      type: "object",
      title: "Challenges & Solution",
      group: GROUP.content.name,
      hidden: ({ parent }) => parent?.link?.type !== "story",
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
      hidden: ({ parent }) => parent?.link?.type !== "story",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { link?: { type?: string } }
          if (parent?.link?.type === "story" && !value) {
            return "Body is required when link type is story"
          }
          return true
        }),
    }),
    defineField({
      name: "related",
      type: "array",
      title: "Related Stories",
      hidden: ({ parent }) => parent?.link?.type !== "story",
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
                  'link.type == "story" && !(_id in [$documentId, "drafts." + $documentId])',
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
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "card_type",
      media: "logo",
    },
    prepare({ title, subtitle, media }) {
      let cardTypeLabel = ""
      if (subtitle === "big") {
        cardTypeLabel = "Big Card"
      } else if (subtitle === "small") {
        cardTypeLabel = "Small Card"
      }

      return {
        title: title,
        subtitle: `${cardTypeLabel || "-"}`,
        media: media,
      }
    },
  },
})
