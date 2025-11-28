import { Metadata } from "next"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import config from "@/configs/website-config"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import { getPaginatedPosts, getTotalPages } from "@/lib/blog"
import { getMetadata } from "@/lib/get-metadata"
import Pagination from "@/components/pages/blog/pagination"
import PostsList from "@/components/pages/blog/posts-lists"

interface BlogPageProps {
  params: Promise<{
    page: string
  }>
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { page } = await params
  const currentPage = parseInt(page, 10)
  const { isEnabled: isDraftMode } = await draftMode()

  if (isNaN(currentPage) || currentPage < 1) {
    notFound()
  }

  if (currentPage === 1) {
    notFound()
  }

  const [posts, totalPages] = await Promise.all([
    getPaginatedPosts(currentPage, isDraftMode, {
      nonFeaturedOnly: true,
    }),
    getTotalPages(isDraftMode),
  ])

  if (totalPages === 0 || totalPages < currentPage) {
    notFound()
  }

  return (
    <>
      <main>
        <h1 className="sr-only">Blog - page {currentPage}</h1>
        <PostsList title="All posts" posts={posts} />
        {totalPages > 1 && (
          <Pagination
            className="mt-14 w-full md:mt-20 lg:ml-64 lg:w-fit"
            currentPage={currentPage}
            pageCount={totalPages}
          />
        )}
      </main>
    </>
  )
}

export async function generateStaticParams() {
  const totalPages = await getTotalPages(false)
  const params = []

  for (let page = 2; page <= totalPages; page++) {
    params.push({
      page: page.toString(),
    })
  }

  return params
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { page: pageNumber } = await params
  const page = parseInt(pageNumber, 10)

  return getMetadata({
    title: `${SEO_DATA.blog.title}${page > 1 ? ` - Page ${page}` : ""} | ${config.projectName}`,
    description: `${SEO_DATA.blog.description} ${page > 1 ? `Page ${page}` : ""}`,
    pathname: `${ROUTE.blog}/page/${page}`,
  })
}
