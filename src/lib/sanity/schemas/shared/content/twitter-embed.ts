import { TwitterIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

const twitterEmbed = defineType({
  name: "twitterEmbed",
  title: "Twitter Embed",
  type: "object",
  icon: TwitterIcon,
  fields: [
    defineField({
      name: "tweetUrl",
      title: "Tweet URL",
      type: "string",
      description: "Paste the URL of the tweet you want to embed",
      validation: (rule) =>
        rule.required().custom((value) => {
          const urlPattern =
            /^https?:\/\/(?:www\.)?twitter\.com\/(?:#!\/)?(?:\w+)\/status(?:es)?\/(\d+)(?:\?.*)?$/
          const xUrlPattern =
            /^https?:\/\/(?:www\.)?x\.com\/(?:#!\/)?(?:\w+)\/status(?:es)?\/(\d+)(?:\?.*)?$/

          if (!value) {
            return "The URL of the tweet is required"
          }

          if (urlPattern.test(value) || xUrlPattern.test(value)) {
            return true
          }

          return "Enter the correct URL of the tweet. For example: https://twitter.com/username/status/1234567890 or https://x.com/username/status/1234567890"
        }),
    }),
  ],
  preview: {
    select: {
      tweetUrl: "tweetUrl",
    },
    prepare({ tweetUrl }) {
      return {
        title: "Twitter Embed",
        subtitle: tweetUrl,
        media: TwitterIcon,
      }
    },
  },
})

export default twitterEmbed
