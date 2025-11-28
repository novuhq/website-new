import { Metadata } from "next"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import config from "@/configs/website-config"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import {
  getCategories,
  getCategoryBySlug,
  getPaginatedPostsByCategory,
  getTotalPagesByCategory,
} from "@/lib/blog"
import { getMetadata } from "@/lib/get-metadata"
import Pagination from "@/components/pages/blog/pagination"
import PostsList from "@/components/pages/blog/posts-lists"

interface CategoryPageProps {
  params: Promise<{
    category: string
    page: string
  }>
}

export default async function CategoryPagePagination({
  params,
}: CategoryPageProps) {
  const { category, page } = await params
  const currentPage = parseInt(page, 10)
  const { isEnabled: isDraftMode } = await draftMode()

  if (isNaN(currentPage) || currentPage < 2) {
    notFound()
  }

  const [posts, totalPages, categoryData] = await Promise.all([
    getPaginatedPostsByCategory(category, currentPage, isDraftMode, {
      nonFeaturedOnly: true,
    }),
    getTotalPagesByCategory(category, isDraftMode),
    getCategoryBySlug(category, isDraftMode),
  ])

  if (totalPages === 0 || totalPages < currentPage || !categoryData) {
    notFound()
  }

  return (
    <main>
      <h1 className="sr-only">
        Blog - {categoryData.title} - page {page}
      </h1>
      <PostsList title={`Posts in ${categoryData.title}`} posts={posts} />
      {totalPages > 1 && (
        <Pagination
          className="mt-14 w-full md:mt-20 lg:ml-64 lg:w-fit"
          currentPage={currentPage}
          pageCount={totalPages}
          path={category}
        />
      )}
    </main>
  )
}

export async function generateStaticParams() {
  const categories = await getCategories(false)
  const params = []

  for (const category of categories) {
    const categorySlug = category.slug.current
    const totalPages = await getTotalPagesByCategory(categorySlug, false)

    for (let page = 2; page <= totalPages; page++) {
      params.push({
        category: categorySlug,
        page: page.toString(),
      })
    }
  }

  return params
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category, page: pageNumber } = await params
  const page = parseInt(pageNumber, 10)
  const categoryData = await getCategoryBySlug(category, false)

  if (!categoryData) {
    return {}
  }

  return getMetadata({
    title: `${SEO_DATA.blog.title}: ${categoryData.title} - page ${page} | ${config.projectName}`,
    description: `${categoryData.title} ${SEO_DATA.blog.description} ${page > 1 ? `Page ${page}` : ""}`,
    pathname: `${ROUTE.blogCategory}/${category}/page/${page}`,
  })
}
