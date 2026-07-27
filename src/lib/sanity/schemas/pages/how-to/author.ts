import { UserIcon } from "@sanity/icons"
import {
  defineField,
  defineType,
  ReferenceRule,
  StringRule,
} from "sanity"

export default defineType({
  name: "howToAuthor",
  title: "How-to Author",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule: StringRule) => rule.required().max(80),
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "reference",
      to: [{ type: "howToCompany" }],
      validation: (rule: ReferenceRule) => rule.required(),
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "reference",
      to: [{ type: "templateAvatar" }],
      validation: (rule: ReferenceRule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      company: "company.name",
      media: "avatar.darkImage",
    },
    prepare({ title, company, media }) {
      return {
        title,
        subtitle: company,
        media,
      }
    },
  },
})
