/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentIcon } from "@sanity/icons"
import { ArrayRule, defineField, defineType } from "sanity"

export default defineType({
  name: "customers",
  title: "Customers Page Content",
  type: "document",
  icon: DocumentIcon,
  initialValue: () => ({
    _id: "customers-page",
    _type: "customers",
  }),
  fields: [
    defineField({
      name: "cardsSmall",
      title: "Small Cards",
      description: "2 small customer cards",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "customer" }],
          options: {
            filter: ({ document }: { document: any }) => {
              const excludedIds =
                document?.cardsBig?.map((ref: any) => ref._ref) || []
              return {
                filter:
                  "!(_id in $excludedIds) && defined(type) && type == 'story'",
                params: { excludedIds },
              }
            },
          },
        },
      ],
      validation: (rule: ArrayRule<any[]>) =>
        rule.length(2).error("This list must contain exactly 2 elements"),
    }),
    defineField({
      name: "cardsBig",
      title: "Big Cards",
      description: "2 big customer cards",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "customer" }],
          options: {
            filter: ({ document }: { document: any }) => {
              const excludedIds =
                document?.cardsSmall?.map((ref: any) => ref._ref) || []
              return {
                filter:
                  "!(_id in $excludedIds) && defined(type) && type == 'story'",
                params: { excludedIds },
              }
            },
          },
        },
      ],
      validation: (rule: ArrayRule<any[]>) =>
        rule.length(2).error("This list must contain exactly 2 elements"),
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
              title: "text",
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
      validation: (rule: ArrayRule<any[]>) =>
        rule
          .required()
          .error("Tweets is required")
          .min(4)
          .error("Tweets must contain at least 4 elements."),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Customers Page Content",
      }
    },
  },
})
