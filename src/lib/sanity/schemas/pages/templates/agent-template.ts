import { RobotIcon } from "@sanity/icons"
import {
  defineField,
  defineType,
  ReferenceRule,
  SlugRule,
  StringRule,
} from "sanity"

import AvatarReferenceInput from "@/lib/sanity/components/avatar-reference-input"
import {
  customSlugify,
  customSlugValidation,
} from "@/lib/sanity/utils/custom-slug-validation"

const TEMPLATE_GROUP = {
  marketplace: {
    title: "Marketplace",
    name: "marketplace",
    default: true,
  },
  provisioning: {
    title: "Provisioning",
    name: "provisioning",
  },
} as const

export default defineType({
  name: "agentTemplate",
  title: "Agent Template",
  type: "document",
  icon: RobotIcon,
  groups: [TEMPLATE_GROUP.marketplace, TEMPLATE_GROUP.provisioning],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Display name shown on the marketplace card.",
      group: TEMPLATE_GROUP.marketplace.name,
      validation: (rule: StringRule) => rule.required().max(80),
    }),
    defineField({
      name: "id",
      title: "Template ID",
      type: "slug",
      description: "Slug passed to signup as the template identifier.",
      group: TEMPLATE_GROUP.marketplace.name,
      options: {
        source: "name",
        slugify: customSlugify,
      },
      validation: (rule: SlugRule) =>
        rule.required().custom(customSlugValidation).error(),
    }),
    defineField({
      name: "agentName",
      title: "Agent name",
      type: "string",
      group: TEMPLATE_GROUP.marketplace.name,
      validation: (rule: StringRule) => rule.required().max(40),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "Short quoted text shown on the marketplace card.",
      group: TEMPLATE_GROUP.marketplace.name,
      validation: (rule: StringRule) => rule.required().max(180),
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "reference",
      description: "Preset avatar used on the website and in-product.",
      to: [{ type: "templateAvatar" }],
      group: TEMPLATE_GROUP.marketplace.name,
      components: {
        input: AvatarReferenceInput,
      },
      validation: (rule: ReferenceRule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "templateCategory" }],
      group: TEMPLATE_GROUP.marketplace.name,
      validation: (rule: ReferenceRule) => rule.required(),
    }),
    defineField({
      name: "mcpServerList",
      title: "MCP servers",
      type: "array",
      of: [{ type: "reference", to: [{ type: "templateMcpServer" }] }],
      group: TEMPLATE_GROUP.marketplace.name,
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: "channels",
      title: "Channels",
      type: "array",
      of: [{ type: "reference", to: [{ type: "templateChannel" }] }],
      group: TEMPLATE_GROUP.marketplace.name,
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: "skillsList",
      title: "Skills",
      type: "array",
      of: [{ type: "string" }],
      group: TEMPLATE_GROUP.provisioning.name,
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: "tools",
      title: "Tools",
      type: "array",
      description: "Optional until the final tools contract is confirmed.",
      of: [{ type: "reference", to: [{ type: "templateTool" }] }],
      group: TEMPLATE_GROUP.provisioning.name,
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "systemPrompt",
      title: "System prompt",
      type: "text",
      rows: 12,
      group: TEMPLATE_GROUP.provisioning.name,
      validation: (rule: StringRule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      category: "category.title",
      agentName: "agentName",
    },
    prepare({ title, category, agentName }) {
      return {
        title,
        subtitle: [category, agentName].filter(Boolean).join(" · "),
        media: RobotIcon,
      }
    },
  },
})
