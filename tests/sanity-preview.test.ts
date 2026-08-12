import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  DraftsSchemaTypes,
  PREVIEW_ROUTES,
} from "@/lib/sanity/constants/drafts-schema-types"
import { getPreviewPath } from "@/lib/sanity/preview-path"

describe("Sanity preview paths", () => {
  it("opens blog post drafts on their website route", () => {
    assert.equal(PREVIEW_ROUTES[DraftsSchemaTypes.BLOG_POST], "/blog")
    assert.equal(
      getPreviewPath(
        { slug: { current: "draft post" } },
        DraftsSchemaTypes.BLOG_POST
      ),
      "/blog/draft%20post"
    )
  })

  it("requires a slug before previewing a blog post draft", () => {
    assert.match(
      String(getPreviewPath({}, DraftsSchemaTypes.BLOG_POST)),
      /needs a slug/
    )
  })
})
