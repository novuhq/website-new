import { FilterIcon, RobotIcon, TagIcon, UsersIcon } from "@sanity/icons"
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list"
import type {
  StructureBuilder,
  StructureResolverContext,
} from "sanity/structure"

const howToStructure = (
  S: StructureBuilder,
  context: StructureResolverContext
) =>
  S.listItem()
    .title("How-to")
    .icon(RobotIcon)
    .child(
      S.list()
        .title("How-to")
        .items([
          S.listItem()
            .title("Posts")
            .icon(RobotIcon)
            .child(S.documentTypeList("howToPost").title("All Posts")),
          S.divider(),
          S.listItem()
            .title("Authors")
            .icon(UsersIcon)
            .child(S.documentTypeList("howToAuthor").title("All Authors")),
          S.listItem()
            .title("Companies")
            .icon(TagIcon)
            .child(S.documentTypeList("howToCompany").title("All Companies")),
          S.divider(),
          orderableDocumentListDeskItem({
            title: "Categories",
            icon: FilterIcon,
            type: "howToCategory",
            context,
            S,
          }),
        ])
    )

export default howToStructure
