import { IStaticPage, IStaticPageWithTableOfContents } from "@/types/static"
import { sanityFetch } from "@/lib/sanity/client"
import {
  staticPageBySlugQuery,
  staticPagesQuery,
} from "@/lib/sanity/queries/static"
import { getTableOfContents } from "@/lib/sanity/utils/get-table-of-contents"

const REVALIDATE_STATIC_TAG = "staticPage"

/**
 * Fetches all static pages from Sanity
 * @param preview - Whether to use preview mode
 *
 * @returns Array of formatted static page objects
 */
export async function getAllStaticPages(
  preview = false
): Promise<IStaticPage[]> {
  const staticPages = await sanityFetch<IStaticPage[]>({
    query: staticPagesQuery,
    preview,
    tags: [REVALIDATE_STATIC_TAG],
  })
  return staticPages
}

/**
 * Fetches a single post by its slug
 * @param slug - The static page slug
 * @param preview - Whether to use preview mode
 *
 * @returns The static page or null if not found
 */
export async function getStaticPageBySlug(
  slug: string,
  preview = false
): Promise<IStaticPageWithTableOfContents | null> {
  const staticPage = await sanityFetch<IStaticPage>({
    query: staticPageBySlugQuery,
    qParams: { slug },
    preview,
    tags: [REVALIDATE_STATIC_TAG],
  })

  if (!staticPage) return null

  return {
    ...staticPage,
    tableOfContents: getTableOfContents(staticPage.content),
  }
}
