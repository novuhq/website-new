import {
  BellIcon,
  FilterIcon,
  PlugIcon,
  RobotIcon,
  UserIcon,
  WrenchIcon,
} from "@sanity/icons"
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list"
import type {
  StructureBuilder,
  StructureResolverContext,
} from "sanity/structure"

const templatesStructure = (
  S: StructureBuilder,
  context: StructureResolverContext
) =>
  S.listItem()
    .title("Agent templates")
    .icon(RobotIcon)
    .child(
      S.list()
        .title("Agent templates")
        .items([
          S.listItem()
            .title("Templates")
            .icon(RobotIcon)
            .child(S.documentTypeList("agentTemplate").title("All Templates")),
          S.divider(),
          orderableDocumentListDeskItem({
            title: "Avatars",
            icon: UserIcon,
            type: "templateAvatar",
            context,
            S,
          }),
          orderableDocumentListDeskItem({
            title: "Categories",
            icon: FilterIcon,
            type: "templateCategory",
            context,
            S,
          }),
          orderableDocumentListDeskItem({
            title: "MCP servers",
            icon: PlugIcon,
            type: "templateMcpServer",
            context,
            S,
          }),
          orderableDocumentListDeskItem({
            title: "Channels",
            icon: BellIcon,
            type: "templateChannel",
            context,
            S,
          }),
          orderableDocumentListDeskItem({
            title: "Tools",
            icon: WrenchIcon,
            type: "templateTool",
            context,
            S,
          }),
        ])
    )

export default templatesStructure
