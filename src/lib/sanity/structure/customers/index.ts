import { DocumentTextIcon, TagIcon, UserIcon } from "@sanity/icons"
import type { StructureBuilder } from "sanity/structure"

import { DraftsSchemaTypes } from "@/lib/sanity/constants/drafts-schema-types"
import { getStructureDocumentViews } from "@/lib/sanity/utils/get-structure-document-views"

const customersStructure = (S: StructureBuilder) =>
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
          S.listItem()
            .title("Customers")
            .icon(UserIcon)
            .child(S.documentTypeList("customer").title("Customers")),
          S.listItem()
            .title("Categories")
            .icon(TagIcon)
            .child(S.documentTypeList("customer_category").title("Category")),
        ])
    )

export default customersStructure
