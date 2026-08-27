import { BoltIcon } from "@sanity/icons"
import { defineField, defineType, StringRule, UrlRule } from "sanity"

import { customImageValidation } from "@/lib/sanity/utils/custom-image-validation"

const DESKTOP_COVER_WIDTH = 1408
const DESKTOP_COVER_HEIGHT = 672
const MOBILE_COVER_WIDTH = 640
const MOBILE_COVER_HEIGHT = 992

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
      name: "cover",
      type: "image",
      title: "Desktop cover",
      description: `Minimum size: ${DESKTOP_COVER_WIDTH}x${DESKTOP_COVER_HEIGHT}px (same aspect ratio)`,
      options: { hotspot: true },
      validation: (rule) =>
        rule
          .custom((value, context) =>
            customImageValidation()
              .type("png", "jpg", "jpeg", "webp")
              .dimensions(DESKTOP_COVER_WIDTH, DESKTOP_COVER_HEIGHT)
              .aspectRatio(DESKTOP_COVER_WIDTH / DESKTOP_COVER_HEIGHT)
              .validate(value, context)
          )
          .error(
            `Desktop cover must be png, jpg, jpeg or webp, at least ${DESKTOP_COVER_WIDTH}x${DESKTOP_COVER_HEIGHT}px, with the same aspect ratio`
          ),
    }),
    defineField({
      name: "mobileCover",
      type: "image",
      title: "Mobile cover",
      description: `Minimum size: ${MOBILE_COVER_WIDTH}x${MOBILE_COVER_HEIGHT}px (same aspect ratio)`,
      options: { hotspot: true },
      validation: (rule) =>
        rule
          .custom((value, context) =>
            customImageValidation()
              .type("png", "jpg", "jpeg", "webp")
              .dimensions(MOBILE_COVER_WIDTH, MOBILE_COVER_HEIGHT)
              .aspectRatio(MOBILE_COVER_WIDTH / MOBILE_COVER_HEIGHT)
              .validate(value, context)
          )
          .error(
            `Mobile cover must be png, jpg, jpeg or webp, at least ${MOBILE_COVER_WIDTH}x${MOBILE_COVER_HEIGHT}px, with the same aspect ratio`
          ),
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
      initialValue: "https://dashboard.novu.co",
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
