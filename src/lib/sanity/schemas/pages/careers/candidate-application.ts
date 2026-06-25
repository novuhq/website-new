import { defineField, defineType } from "sanity"

export default defineType({
  name: "candidateApplication",
  type: "document",
  title: "Candidate Application",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Name",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      type: "email",
      title: "Email",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      type: "string",
      title: "Role or area of interest",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "link",
      type: "url",
      title: "LinkedIn, GitHub, or portfolio",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "note",
      type: "text",
      title: "Note",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      type: "string",
      title: "Status",
      initialValue: "new",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Reviewed", value: "reviewed" },
          { title: "Contacted", value: "contacted" },
          { title: "Rejected", value: "rejected" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "source",
      type: "string",
      title: "Source",
      initialValue: "careers",
      readOnly: true,
    }),
    defineField({
      name: "submittedAt",
      type: "datetime",
      title: "Submitted at",
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      email: "email",
      role: "role",
      submittedAt: "submittedAt",
    },
    prepare({ title, email, role, submittedAt }) {
      const date = submittedAt
        ? new Intl.DateTimeFormat("en", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(submittedAt))
        : "No submission date"

      return {
        title,
        subtitle: [email, role, date].filter(Boolean).join(" · "),
      }
    },
  },
})
