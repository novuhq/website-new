import { BookIcon, DocumentTextIcon, UlistIcon } from "@sanity/icons"
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list"
import { StructureBuilder, StructureResolverContext } from "sanity/structure"

const blogStructure = (
  S: StructureBuilder,
  context: StructureResolverContext
) =>
  S.listItem()
    .title("Blog")
    .icon(BookIcon)
    .child(
      S.list()
        .title("Posts")
        .items([
          S.listItem()
            .title("Posts")
            .icon(DocumentTextIcon)
            .child(S.documentTypeList("blogPost").title("All Posts")),
          orderableDocumentListDeskItem({
            title: "Categories",
            icon: UlistIcon,
            type: "blogCategory",
            context,
            S,
          }),
        ])
    )

export default blogStructure
