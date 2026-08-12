import { Iframe } from "sanity-plugin-iframe-pane"
import { StructureBuilder } from "sanity/structure"

import { DraftsSchemaTypes } from "@/lib/sanity/constants/drafts-schema-types"
import { getPreviewPath, type PreviewDocument } from "@/lib/sanity/preview-path"

function getIframeOptions(schemaType: string) {
  return {
    url: {
      origin: "same-origin" as const,
      preview: (doc: PreviewDocument | null) => getPreviewPath(doc, schemaType),
      draftMode: "/api/preview",
    },
    showDisplayUrl: false,
    reload: {
      button: true,
    },
  }
}

/**
 * Get document views array
 * - add iframe preview only if document schemaType in DraftsSchemaTypes
 * @param S
 * @param schemaType
 */
export const getStructureDocumentViews = (
  S: StructureBuilder,
  schemaType: string
) => {
  const draftsSchemaTypesArr = Object.values(DraftsSchemaTypes)

  if (draftsSchemaTypesArr.includes(schemaType as DraftsSchemaTypes)) {
    // For customer schema, only show preview if link.type === "story"
    if (schemaType === DraftsSchemaTypes.CUSTOMER) {
      const iframeOptions = getIframeOptions(schemaType)

      return [
        S.view.form(),
        S.view
          .component(Iframe)
          .options({
            ...iframeOptions,
            url: {
              ...iframeOptions.url,
              preview: (doc: PreviewDocument | null) =>
                doc?.link?.type === "story"
                  ? getPreviewPath(doc, schemaType)
                  : new Error("Preview is only available for customer stories"),
            },
          })
          .title("Preview"),
      ]
    }

    return [
      S.view.form(),
      S.view
        .component(Iframe)
        .options(getIframeOptions(schemaType))
        .title("Preview"),
    ]
  }

  return [S.view.form()]
}
