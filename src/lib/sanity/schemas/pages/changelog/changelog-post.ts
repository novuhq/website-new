import { format } from "date-fns"
import {
  ArrayRule,
  DatetimeRule,
  defineField,
  defineType,
  ImageRule,
  SlugRule,
  SortOrdering,
  StringRule,
} from "sanity"

import {
  type IAuthorData,
  type IChangelogCategoryData,
} from "@/types/changelog"
import { GROUP } from "@/lib/sanity/schemas/shared/group"
import { SEO_FIELDS } from "@/lib/sanity/schemas/shared/seo"
import {
  customSlugify,
  customSlugValidation,
} from "@/lib/sanity/utils/custom-slug-validation"

const BASE_POST_ORDERINGS: SortOrdering[] = []

const BASE_POST_PREVIEW = {
  select: {
    title: "title",
    publishedAt: "publishedAt",
    media: "cover",
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prepare(selection: Record<string, any>) {
    const { title, publishedAt, media } = selection
    const dateSegment = publishedAt
      ? format(new Date(publishedAt), "yyyy/MMMM")
      : "No date"

    return {
      title,
      media,
      subtitle: `Published: ${dateSegment}`,
    }
  },
}

export default defineType({
  name: "changelogPost",
  type: "document",
  title: "Changelog Post",
  groups: [GROUP.content, GROUP.seo],
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "",
      group: GROUP.content.name,
      validation: (rule: StringRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "caption",
      type: "text",
      title: "Caption",
      group: GROUP.content.name,
      rows: 3,
      validation: (rule: StringRule) =>
        rule.error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      description: "",
      group: GROUP.content.name,
      options: {
        source: "title",
        slugify: customSlugify,
      },
      validation: (rule: SlugRule) =>
        rule.required().custom(customSlugValidation).error(),
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
      name: "authors",
      title: "Authors",
      type: "array",
      of: [{ type: "reference", to: [{ type: "author" }] }],
      group: GROUP.content.name,
      validation: (rule: ArrayRule<IAuthorData>) =>
        rule.min(1).error("You have to fill in this field.").required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "changelogCategory" }] }],
      group: GROUP.content.name,
      validation: (rule: ArrayRule<IChangelogCategoryData>) =>
        rule
          .min(1)
          .error("You have to select at least one category.")
          .required(),
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
    SEO_FIELDS,
  ],
  orderings: BASE_POST_ORDERINGS,
  preview: BASE_POST_PREVIEW,
})
