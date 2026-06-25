import { defineField, defineType } from "sanity"

import {
  customSlugify,
  customSlugValidation,
} from "@/lib/sanity/utils/custom-slug-validation"

export default defineType({
  name: "careerJob",
  type: "document",
  title: "Career Job",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "title",
        slugify: customSlugify,
      },
      validation: (rule) =>
        rule.required().custom(customSlugValidation).error(),
    }),
    defineField({
      name: "department",
      type: "string",
      title: "Department",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "employmentType",
      type: "string",
      title: "Employment type",
      options: {
        list: [
          { title: "Full-time", value: "Full-time" },
          { title: "Part-time", value: "Part-time" },
          { title: "Contract", value: "Contract" },
          { title: "Internship", value: "Internship" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      type: "string",
      title: "Location",
      description: "Example: Fully Remote (NY-based)",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "applicationUrl",
      type: "url",
      title: "Application URL",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["http", "https", "mailto"], allowRelative: true }),
    }),
    defineField({
      name: "status",
      type: "string",
      title: "Status",
      initialValue: "draft",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Open", value: "open" },
          { title: "Closed", value: "closed" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      title: "Published at",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      type: "content",
      title: "Job description",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      department: "department",
      employmentType: "employmentType",
      location: "location",
    },
    prepare({ title, department, employmentType, location }) {
      return {
        title,
        subtitle: [department, employmentType, location]
          .filter(Boolean)
          .join(" · "),
      }
    },
  },
})
