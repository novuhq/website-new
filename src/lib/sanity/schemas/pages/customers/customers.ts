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
      name: "smallCards",
      title: "Small Cards",
      description: "2 small customer cards",
      type: "array",
      of: [
        {
          type: "object",
          name: "smallCard",
          title: "Small Card",
          fields: [
            {
              name: "customer",
              title: "Customer",
              type: "reference",
              to: [{ type: "customer" }],
              options: {
                filter:
                  'cardType == "small" && defined(author) && defined(authorPosition) && author != "" && authorPosition != ""',
              },
            },
          ],
          preview: {
            select: {
              title: "customer.name",
              subtitle: "customer.link.type",
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
      name: "bigCards",
      title: "Big Cards",
      description: "2 big customer cards",
      type: "array",
      of: [
        {
          type: "object",
          name: "bigCard",
          title: "Big Card",
          fields: [
            {
              name: "customer",
              title: "Customer",
              type: "reference",
              to: [{ type: "customer" }],
              options: {
                filter:
                  'cardType == "big" && defined(author) && defined(authorPosition) && author != "" && authorPosition != ""',
              },
            },
          ],
          preview: {
            select: {
              title: "customer.name",
              subtitle: "customer.link.type",
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
      name: "gridCustomers",
      title: "Customers",
      description: "Exactly 12 customers",
      type: "array",
      of: [
        {
          type: "object",
          name: "gridCustomer",
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
              subtitle: "customer.link.type",
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
          .required()
          .error("Grid Customers is required")
          .length(12)
          .error("Grid Customers must contain exactly 12 elements."),
    }),

    defineField({
      name: "tweets",
      title: "Tweets",
      description: "At least 4 tweets",
      type: "array",
      of: [
        {
          type: "object",
          name: "customerTweet",
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
              name: "tweetLink",
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
      validation: (rule: ArrayRule<any[]>) =>
        rule
          .required()
          .error("Tweets is required")
          .min(4)
          .error("Tweets must contain at least 4 elements."),
    }),
  ],
})
