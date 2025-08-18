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
  fieldsets: [
    {
      name: "customer_logo",
      title: "Customer logos",
      options: { collapsible: false, columns: 2 },
    },
    {
      name: "customer_link",
      title: "Link Settings",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "customer_channels",
      title: "Channels",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "customer_socials",
      title: "Social Networks",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "customer_quote",
      title: "Quote",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "customer_challenges_solution",
      title: "Challenges & Solution",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "customer_second_quote",
      title: "Second Quote",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
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
      fieldset: "customer_logo",
      validation: (rule: ImageRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "logomark",
      type: "image",
      title: "Logomark",
      description: "Symbol only, shown in About block.",
      group: GROUP.content.name,
      fieldset: "customer_logo",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description:
        "Title length depends on card type: max 128 chars for Big cards, max 72 chars for small cards",
      group: GROUP.content.name,
      validation: (rule: StringRule) =>
        rule
          .required()
          .error("You have to fill in this field.")
          .custom((value, context) => {
            const parent = context.parent as { card_type?: string }
            const cardType = parent?.card_type

            if (!value) return true // Required validation will handle this

            if (cardType === "Big" && value.length > 128) {
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
      name: "link_type",
      type: "string",
      title: "Link Type",
      options: {
        list: [
          { title: "External Link", value: "external" },
          { title: "Story", value: "story" },
        ],
        layout: "radio",
      },
      group: GROUP.content.name,
      fieldset: "customer_link",
      validation: (rule: StringRule) =>
        rule.error("You have to choose a link type.").required(),
    }),
    defineField({
      name: "external_link",
      type: "url",
      title: "External Link",
      description: "External URL (only used when Link Type is External Link)",
      group: GROUP.content.name,
      fieldset: "customer_link",
      hidden: ({ parent }) => parent?.link_type !== "external",
      validation: (rule: UrlRule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { link_type?: string }
          if (parent?.link_type === "external" && !value) {
            return "External link is required when link type is external"
          }
          return true
        }),
    }),

    // Story fields - показываются только когда link_type = "story"
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      group: GROUP.content.name,
      hidden: ({ parent }) => parent.link_type !== "story",
      validation: (rule: SlugRule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { link_type?: string }
          if (parent.link_type === "story" && !value) {
            return "Slug is required when link type is story"
          }
          return true
        }),
      options: {
        source: "name",
      },
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: GROUP.seo.name,
      hidden: ({ parent }) => parent?.link_type !== "story",
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
      name: "story_photo",
      type: "image",
      title: "Story Photo",
      description: "Optional main photo for the story",
      group: GROUP.content.name,
      hidden: ({ parent }) => parent?.link_type !== "story",
    }),
    defineField({
      name: "about",
      type: "text",
      title: "About",
      description: "Text about the customer/company",
      rows: 4,
      group: GROUP.content.name,
      hidden: ({ parent }) => parent?.link_type !== "story",
      validation: (rule: StringRule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { link_type?: string }
          if (parent?.link_type === "story" && !value) {
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
      hidden: ({ parent }) => parent?.link_type !== "story",
      validation: (rule: StringRule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { link_type?: string }
          if (parent?.link_type === "story" && !value) {
            return "Industry is required when link type is story"
          }
          return true
        }),
    }),
    // Channels block
    defineField({
      name: "email_channels",
      type: "string",
      title: "Email",
      group: GROUP.content.name,
      fieldset: "customer_channels",
      hidden: ({ parent }) => parent?.link_type !== "story",
    }),
    defineField({
      name: "inbox_channels",
      type: "string",
      title: "Inbox",
      group: GROUP.content.name,
      fieldset: "customer_channels",
      hidden: ({ parent }) => parent?.link_type !== "story",
    }),
    defineField({
      name: "sms_channels",
      type: "string",
      title: "SMS",
      group: GROUP.content.name,
      fieldset: "customer_channels",
      hidden: ({ parent }) => parent?.link_type !== "story",
    }),
    // Quote block
    defineField({
      name: "quote_title",
      type: "text",
      title: "Quote Title",
      rows: 3,
      group: GROUP.content.name,
      fieldset: "customer_quote",
      hidden: ({ parent }) => parent?.link_type !== "story",
    }),
    defineField({
      name: "quote_author_logo",
      type: "image",
      title: "Author Logo",
      group: GROUP.content.name,
      fieldset: "customer_quote",
      hidden: ({ parent }) => parent?.link_type !== "story",
    }),
    defineField({
      name: "quote_author_name",
      type: "string",
      title: "Author Name",
      group: GROUP.content.name,
      fieldset: "customer_quote",
      hidden: ({ parent }) => parent?.link_type !== "story",
    }),
    defineField({
      name: "quote_author_position",
      type: "string",
      title: "Author Position",
      group: GROUP.content.name,
      fieldset: "customer_quote",
      hidden: ({ parent }) => parent?.link_type !== "story",
    }),
    // Challenges & Solution block
    defineField({
      name: "key_challenges",
      type: "array",
      title: "Key Challenges",
      of: [{ type: "string" }],
      group: GROUP.content.name,
      fieldset: "customer_challenges_solution",
      hidden: ({ parent }) => parent?.link_type !== "story",
    }),
    defineField({
      name: "novu_solution",
      type: "array",
      title: "Novu Solution",
      of: [{ type: "string" }],
      group: GROUP.content.name,
      fieldset: "customer_challenges_solution",
      hidden: ({ parent }) => parent?.link_type !== "story",
    }),
    defineField({
      name: "body",
      type: "content",
      title: "Body",
      group: GROUP.content.name,
      hidden: ({ parent }) => parent?.link_type !== "story",
      validation: (rule) => rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "related",
      type: "array",
      title: "Related Stories",
      hidden: ({ parent }) => parent?.link_type !== "story",
      of: [
        {
          type: "reference",
          to: [{ type: "customer" }],
          options: {
            filter: ({ document }: { document: { _id?: string } }) => {
              const baseId = document._id?.replace(/^drafts\./, "")

              return {
                filter:
                  'link_type == "story" && !(_id in [$documentId, "drafts." + $documentId])',
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
      media: "logomark",
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
