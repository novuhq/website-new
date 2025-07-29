import { DocumentTextIcon, TimelineIcon, UlistIcon } from "@sanity/icons"
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list"
import type {
  StructureBuilder,
  StructureResolverContext,
} from "sanity/structure"

import { DraftsSchemaTypes } from "@/lib/sanity/constants/drafts-schema-types"

const changelogStructure = (
  S: StructureBuilder,
  context: StructureResolverContext
) =>
  S.listItem()
    .title("Changelog")
    .icon(TimelineIcon)
    .child(
      S.list()
        .title("Changelog")
        .items([
          S.listItem()
            .title("Posts")
            .icon(DocumentTextIcon)
            .child(
              S.documentTypeList(DraftsSchemaTypes.CHANGELOG_POST).title(
                "All Posts"
              )
            ),
          orderableDocumentListDeskItem({
            title: "Categories",
            icon: UlistIcon,
            type: "changelogCategory",
            context,
            S,
          }),
        ])
    )

export default changelogStructure
