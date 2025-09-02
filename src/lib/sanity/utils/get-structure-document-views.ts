import { SanityDocument } from "sanity"
import { Iframe } from "sanity-plugin-iframe-pane"
import { StructureBuilder } from "sanity/structure"

import {
  DraftsSchemaTypes,
  PREVIEW_ROUTES,
} from "@/lib/sanity/constants/drafts-schema-types"

interface ExtendedSanityDocument extends SanityDocument {
  slug?: {
    current: string
  }
  link?: {
    type: string
  }
}

const host = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL

/**
 * Get preview url with api/preview
 * @param doc
 * @param schemaType
 */
const getPreviewUrl = (doc: ExtendedSanityDocument, schemaType: string) => {
  const url = new URL("/api/preview", host)
  const redirectUrl = PREVIEW_ROUTES?.[schemaType as DraftsSchemaTypes] ?? ""

  url.searchParams.append(
    "secret",
    process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET!
  )

  url.searchParams.append(
    "redirect_url",
    new URL(
      `${redirectUrl}${doc?.slug?.current ? `/${doc.slug.current}` : ""}`,
      host
    ).toString()
  )

  return url.toString()
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
      return [
        S.view.form(),
        S.view
          .component(Iframe)
          .options({
            url: (doc: ExtendedSanityDocument) => {
              // Only return preview URL if this is a customer story
              if (doc?.link?.type === "story") {
                return getPreviewUrl(doc, schemaType)
              }
              return ""
            },
            showDisplayUrl: false,
            reload: {
              button: true,
            },
          })
          .title("Preview"),
      ]
    }

    return [
      S.view.form(),
      S.view
        .component(Iframe)
        .options({
          url: (doc: ExtendedSanityDocument) => getPreviewUrl(doc, schemaType),
          showDisplayUrl: false,
          reload: {
            button: true,
          },
        })
        .title("Preview"),
    ]
  }

  return [S.view.form()]
}
