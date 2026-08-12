import {
  DraftsSchemaTypes,
  PREVIEW_ROUTES,
} from "@/lib/sanity/constants/drafts-schema-types"

export interface PreviewDocument {
  slug?: {
    current: string
  }
  link?: {
    type: string
  }
}

const SLUG_REQUIRED_SCHEMA_TITLES: Partial<Record<DraftsSchemaTypes, string>> =
  {
    [DraftsSchemaTypes.BLOG_POST]: "A blog post",
    [DraftsSchemaTypes.CUSTOMER]: "A customer story",
  }

export function getPreviewPath(
  document: PreviewDocument | null,
  schemaType: string
) {
  const previewRoute = PREVIEW_ROUTES[schemaType as DraftsSchemaTypes]
  if (!previewRoute) {
    return new Error(`Preview route is not configured for ${schemaType}`)
  }

  const schemaTitle =
    SLUG_REQUIRED_SCHEMA_TITLES[schemaType as DraftsSchemaTypes]
  const slug = document?.slug?.current

  if (schemaTitle && !slug) {
    return new Error(`${schemaTitle} needs a slug before it can be previewed`)
  }

  return `${String(previewRoute)}${slug ? `/${encodeURIComponent(slug)}` : ""}`
}
