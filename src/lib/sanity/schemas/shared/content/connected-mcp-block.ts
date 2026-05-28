import { PlugIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

const connectedMcpItem = defineType({
  name: "connectedMcpItem",
  title: "MCP connector row",
  type: "object",
  fields: [
    defineField({
      name: "connector",
      title: "Connector",
      type: "reference",
      to: [{ type: "templateMcpServer" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().max(180),
    }),
  ],
  preview: {
    select: {
      title: "connector.name",
      subtitle: "description",
      media: "connector.icon",
    },
  },
})

const connectedMcpBlock = defineType({
  name: "connectedMcpBlock",
  title: "MCP connectors used",
  type: "object",
  icon: PlugIcon,
  fields: [
    defineField({
      name: "items",
      title: "Connectors",
      type: "array",
      of: [{ type: "connectedMcpItem" }],
      validation: (rule) => rule.min(1).required(),
    }),
  ],
  preview: {
    select: {
      items: "items",
    },
    prepare({ items }) {
      const count = Array.isArray(items) ? items.length : 0

      return {
        title: "MCP connectors used",
        subtitle: `${count} connector${count === 1 ? "" : "s"}`,
      }
    },
  },
})

export default [connectedMcpItem, connectedMcpBlock]
