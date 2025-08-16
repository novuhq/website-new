import { DocumentIcon } from "@sanity/icons"
import { ArrayRule, defineField, defineType } from "sanity"

export default defineType({
  name: "customers",
  title: "Page Content",
  type: "document",
  icon: DocumentIcon,
  initialValue: () => ({
    _id: "customers-page",
    _type: "customers",
  }),

  fieldsets: [
    {
      name: "featured_customers",
      title: "Featured Customers",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "grid_customers",
      title: "Grid Customers",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "customers_tweets",
      title: "Customers Tweets",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: "small_cards",
      title: "Small Cards",
      description: "2 small customer cards",
      type: "array",
      of: [
        {
          type: "object",
          name: "small_card",
          title: "Small Card",
          fields: [
            {
              name: "customer",
              title: "Customer",
              type: "reference",
              to: [{ type: "customer" }],
              options: {
                filter: 'card_type == "small"',
              },
            },
          ],
          preview: {
            select: {
              title: "customer.name",
              subtitle: "customer.link_type",
              media: "customer.logo",
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || "Unnamed Customer",
                subtitle:
                  subtitle === "story" ? "Customer Story" : "External Link",
                media,
              }
            },
          },
        },
      ],
      fieldset: "featured_customers",
      validation: (rule: ArrayRule<any[]>) =>
        rule
          .length(2)
          .error("Hero Small Cards must contain exactly 2 elements."),
    }),
    defineField({
      name: "big_cards",
      title: "Big Cards",
      description: "2 big customer cards",
      type: "array",
      of: [
        {
          type: "object",
          name: "big_card",
          title: "Big Card",
          fields: [
            {
              name: "customer",
              title: "Customer",
              type: "reference",
              to: [{ type: "customer" }],
              options: {
                filter: 'card_type == "big"',
              },
            },
          ],
          preview: {
            select: {
              title: "customer.name",
              subtitle: "customer.link_type",
              media: "customer.logo",
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || "Unnamed Customer",
                subtitle:
                  subtitle === "story" ? "Customer Story" : "External Link",
                media,
              }
            },
          },
        },
      ],
      fieldset: "featured_customers",
      validation: (rule: ArrayRule<any[]>) =>
        rule.length(2).error("Hero Big Cards must contain exactly 2 elements."),
    }),
    defineField({
      name: "grid_customers",
      title: "-",
      type: "array",
      of: [
        {
          type: "object",
          name: "grid_customer",
          title: "Grid Customer",
          fields: [
            {
              name: "customer",
              title: "Customer",
              type: "reference",
              to: [{ type: "customer" }],
            },
          ],
          preview: {
            select: {
              title: "customer.name",
              subtitle: "customer.link_type",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || "Unnamed Customer",
                subtitle:
                  subtitle === "story" ? "Customer Story" : "External Link",
              }
            },
          },
        },
      ],
      fieldset: "grid_customers",
      validation: (rule: ArrayRule<any[]>) =>
        rule
          .length(12)
          .error("Grid Customers must contain exactly 12 elements."),
    }),

    defineField({
      name: "tweets",
      title: "Tweets",
      type: "array",
      of: [
        {
          type: "object",
          name: "customer_tweet",
          title: "Customer Tweet",
          fields: [
            {
              name: "text",
              title: "Tweet Text",
              type: "text",
              rows: 4,
            },
            {
              name: "logo",
              title: "Author Logo",
              type: "image",
            },
            {
              name: "name",
              title: "Author Name",
              type: "string",
            },
            {
              name: "tag",
              title: "Author Tag",
              type: "string",
            },
            {
              name: "tweet_link",
              type: "url",
              title: "Tweet Link",
            },
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "tag",
              media: "logo",
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || "Unnamed Author",
                subtitle: subtitle || "No tag",
                media,
              }
            },
          },
        },
      ],
      fieldset: "customers_tweets",
    }),
  ],
})
