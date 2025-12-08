import { DocumentTextIcon, UserIcon } from "@sanity/icons"
import type {
  StructureBuilder,
  StructureResolverContext,
} from "sanity/structure"

import { DraftsSchemaTypes } from "@/lib/sanity/constants/drafts-schema-types"
import { getStructureDocumentViews } from "@/lib/sanity/utils/get-structure-document-views"

const pricingStructure = (
  S: StructureBuilder,
  context: StructureResolverContext
) =>
  S.listItem()
    .title("Pricing")
    .icon(UserIcon)
    .child(
      S.list()
        .title("Pricing Page Content")
        .items([
          S.listItem()
            .title("Page Content")
            .icon(DocumentTextIcon)
            .child(
              S.document()
                .schemaType(DraftsSchemaTypes.PRICING)
                .documentId("pricing-page")
                .title("Page Content")
                .views(getStructureDocumentViews(S, DraftsSchemaTypes.PRICING))
            ),
        ])
    )

export default pricingStructure
