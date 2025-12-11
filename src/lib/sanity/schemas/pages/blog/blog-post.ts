import {
  ArrayRule,
  DatetimeRule,
  defineField,
  defineType,
  ImageRule,
  ReferenceRule,
  SlugRule,
  StringRule,
} from "sanity"

import { type IAuthorData } from "@/types/blog"
import { GROUP } from "@/lib/sanity/schemas/shared/group"
import { SEO_FIELDS } from "@/lib/sanity/schemas/shared/seo"
import { basePostOrderings } from "@/lib/sanity/utils/base-post-orderings"
import { basePostPreview } from "@/lib/sanity/utils/base-post-preview"
import { customIsFeaturedUniqueValidation } from "@/lib/sanity/utils/custom-is-featured-unique-validation"
import {
  customSlugify,
  customSlugValidation,
} from "@/lib/sanity/utils/custom-slug-validation"

export default defineType({
  name: "blogPost",
  type: "document",
  title: "Blog post",
  groups: [GROUP.content, GROUP.seo],
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Titles should be catchy, descriptive, and not too long",
      group: GROUP.content.name,
      validation: (rule: StringRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "caption",
      type: "text",
      title: "Caption",
      rows: 4,
      group: GROUP.content.name,
      validation: (rule: StringRule) =>
        rule
          .required()
          .error("You have to fill in this field.")
          .max(255)
          .error("Caption must be less than 255 characters"),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      description:
        "Some frontends will require a slug to be set to be able to show the post",
      group: GROUP.content.name,
      options: {
        source: "title",
        slugify: customSlugify,
      },
      validation: (rule: SlugRule) =>
        rule.required().custom(customSlugValidation).error(),
    }),
    defineField({
      name: "isFeatured",
      type: "boolean",
      title: "Featured Post",
      description: "Is this a featured post?",
      initialValue: false,
      group: GROUP.content.name,
      validation: (Rule) =>
        Rule.custom(async (isFeatured = false, context) =>
          customIsFeaturedUniqueValidation(`blogPost`, isFeatured, context)
        ),
    }),
    defineField({
      name: "authors",
      title: "Authors",
      type: "array",
      of: [{ type: "reference", to: [{ type: "author" }] }],
      group: GROUP.content.name,
      validation: (rule: ArrayRule<IAuthorData>) =>
        rule.min(1).error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      title: "Published at",
      description: "This can be used to schedule post for publishing",
      group: GROUP.content.name,
      validation: (rule: DatetimeRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "cover",
      type: "image",
      title: "Cover Image",
      group: GROUP.content.name,
      validation: (rule: ImageRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "content",
      type: "content",
      title: "Content",
      group: GROUP.content.name,
      validation: (rule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "blogCategory" }],
      group: GROUP.content.name,
      validation: (rule: ReferenceRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    SEO_FIELDS,
  ],
  orderings: basePostOrderings,
  preview: basePostPreview,
})
