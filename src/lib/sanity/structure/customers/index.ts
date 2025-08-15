import { DocumentTextIcon, TimelineIcon, UserIcon } from "@sanity/icons"
import type {
  StructureBuilder,
  StructureResolverContext,
} from "sanity/structure"

import { DraftsSchemaTypes } from "@/lib/sanity/constants/drafts-schema-types"

const customersStructure = (
  S: StructureBuilder,
  context: StructureResolverContext
) =>
  S.listItem()
    .title("Customers")
    .icon(TimelineIcon)
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
                .views([S.view.form().title("Edit")])
            ),
          S.divider(),
          S.listItem()
            .title("Customers")
            .icon(UserIcon)
            .child(S.documentTypeList("customer").title("Customers")),
        ])
    )

export default customersStructure
