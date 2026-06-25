import { defineField, defineType } from "sanity"

export default defineType({
  name: "candidateApplication",
  type: "document",
  title: "Candidate Application",
  fields: [
    defineField({
      name: "fullName",
      type: "string",
      title: "Full Name",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      type: "email",
      title: "Email",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phoneNumber",
      type: "string",
      title: "Phone number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "linkedInProfile",
      type: "url",
      title: "LinkedIn profile",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      type: "string",
      title: "Location (city and country)",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "remoteAsyncExperience",
      type: "boolean",
      title: "Previously worked in a fully remote and async company?",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cv",
      type: "file",
      title: "CV",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "personalNote",
      type: "text",
      title: "Personal note",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "department",
      type: "string",
      title: "Department",
      options: {
        list: [
          { title: "Engineering", value: "Engineering" },
          { title: "Product", value: "Product" },
          { title: "Design", value: "Design" },
          { title: "Developer relations", value: "Developer relations" },
          { title: "Marketing", value: "Marketing" },
          { title: "Operations", value: "Operations" },
        ],
      },
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
      title: "fullName",
      email: "email",
      department: "department",
      submittedAt: "submittedAt",
    },
    prepare({ title, email, department, submittedAt }) {
      const date = submittedAt
        ? new Intl.DateTimeFormat("en", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(submittedAt))
        : "No submission date"

      return {
        title,
        subtitle: [email, department, date].filter(Boolean).join(" · "),
      }
    },
  },
})
