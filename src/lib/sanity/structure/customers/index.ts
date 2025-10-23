import { DocumentTextIcon, TagIcon, UserIcon } from "@sanity/icons"
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list"
import type {
  StructureBuilder,
  StructureResolverContext,
} from "sanity/structure"

import { DraftsSchemaTypes } from "@/lib/sanity/constants/drafts-schema-types"
import { getStructureDocumentViews } from "@/lib/sanity/utils/get-structure-document-views"

const customersStructure = (
  S: StructureBuilder,
  context: StructureResolverContext
) =>
  S.listItem()
    .title("Customers")
    .icon(UserIcon)
    .child(
      S.list()
        .title("Customers")
        .items([
          S.listItem()
            .title("Page Content")
            .icon(DocumentTextIcon)
            .child(
              S.document()
                .schemaType(DraftsSchemaTypes.CUSTOMERS)
                .documentId("customers-page")
                .title("Page Content")
                .views(
                  getStructureDocumentViews(S, DraftsSchemaTypes.CUSTOMERS)
                )
            ),
          S.divider(),
          orderableDocumentListDeskItem({
            type: "customer",
            title: "Customers",
            icon: UserIcon,
            S,
            context,
          }),
          S.listItem()
            .title("Categories")
            .icon(TagIcon)
            .child(S.documentTypeList("customer_category").title("Category")),
        ])
    )

export default customersStructure
