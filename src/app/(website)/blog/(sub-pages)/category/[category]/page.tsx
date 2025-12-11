import { Metadata } from "next"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import config from "@/configs/website-config"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import { ICategory } from "@/types/blog"
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
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const currentPage = 1
  const { isEnabled: isDraftMode } = await draftMode()

  const [posts, totalPages, categoryData] = await Promise.all([
    getPaginatedPostsByCategory(category, currentPage, isDraftMode),
    getTotalPagesByCategory(category, isDraftMode),
    getCategoryBySlug(category, isDraftMode),
  ])

  console.log(categoryData)

  if (totalPages === 0 || !categoryData) {
    notFound()
  }

  return (
    <main>
      <h1 className="sr-only">Blog - {categoryData.title}</h1>
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

  return categories.map((category: ICategory) => ({
    category: category.slug.current,
  }))
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categoryData = await getCategoryBySlug(category, false)

  if (!categoryData) {
    return {}
  }

  return getMetadata({
    title: `${SEO_DATA.blog.title}: ${categoryData.title} | ${config.projectName}`,
    description: `${categoryData.title} ${SEO_DATA.blog.description}`,
    pathname: `${ROUTE.blogCategory}/${category}`,
  })
}
