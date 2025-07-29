import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ROUTE } from "@/constants/routes"

import { getAllChangelogPosts, getChangelogPostBySlug } from "@/lib/changelog"
import { getMetadata } from "@/lib/get-metadata"
import { Link } from "@/components/ui/link"
import DynamicIcon from "@/components/dynamic-icon"
import Authors from "@/components/pages/changelog/authors"
import Categories from "@/components/pages/changelog/categories"
import SocialShare from "@/components/pages/changelog/social-share"
import Content from "@/components/pages/content"
import Date from "@/components/pages/date"

interface ChangelogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: ChangelogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getChangelogPostBySlug(slug)

  if (!post) {
    return {}
  }

  const { title, caption, cover, seo } = post

  return getMetadata({
    title: seo?.title || title,
    description: seo?.description || caption,
    pathname: `${ROUTE.changelog}/${post.slug}`,
    imagePath: seo?.socialImage || cover,
  })
}

export async function generateStaticParams() {
  const posts = await getAllChangelogPosts()

  return posts.map(({ slug }) => ({
    slug: slug.current,
  }))
}

export default async function ChangelogPostPage({
  params,
}: ChangelogPostPageProps) {
  const { slug } = await params
  const post = await getChangelogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const {
    title,
    caption,
    cover,
    authors,
    categories,
    publishedAt,
    pathname,
    content,
  } = post

  return (
    <main className="px-5 pb-26 md:px-8 lg:pb-28 xl:pb-8">
      <section className="pt-9.5 md:pt-11.5 lg:pt-13.5 xl:pt-15.5">
        <article className="mx-auto max-w-248 xl:translate-x-36">
          <div>
            <Link
              className="group -ml-px gap-x-1 leading-none tracking-tighter"
              href={ROUTE.changelog}
              variant="muted-dark"
              size="sm"
            >
              <DynamicIcon icon="chevron-left" />
              Back to all updates
            </Link>
            <span className="mx-2.5 text-sm leading-none font-medium tracking-tight text-gray-7 md:mx-2.75">
              /
            </span>
            <p className="-mt-px text-sm tracking-tighter md:inline">{title}</p>
          </div>
          <h1 className="mt-3 text-4xl leading-[1.125] font-medium tracking-tighter text-foreground md:mt-3.5 md:text-5xl">
            {title}
          </h1>
          <p
            className="lg:m mt-4 text-lg leading-normal font-light tracking-tighter text-gray-9 md:mt-3.75 lg:mr-64 xl:max-w-176 xl:pt-px"
            dangerouslySetInnerHTML={{
              __html: caption.replace(/\n/g, "<br />"),
            }}
          />
          <div className="mt-7.75 flex flex-col gap-10.5 md:gap-12 lg:flex-row lg:gap-8">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#1C1D22] shadow-changelog-image xl:max-w-176">
              <Image className="" src={cover} alt="Cover" fill />
            </div>
            <div className="flex flex-col gap-8 md:flex-row md:justify-between md:pt-px lg:max-w-56 lg:shrink-0 lg:flex-col lg:justify-start lg:gap-5.5">
              <dl className="flex flex-col gap-5 md:flex-row md:gap-17.5 lg:flex-col lg:gap-6.5">
                <div className="flex flex-col gap-4">
                  <dt className="leading-tight font-medium tracking-tighter">
                    Contributors
                  </dt>
                  <dd>
                    <Authors
                      authors={[...authors, ...authors]}
                      variant="expanded"
                      size="xs"
                    />
                  </dd>
                </div>
                <div className="flex flex-col gap-4">
                  <dt className="leading-tight font-medium tracking-tighter">
                    Details
                  </dt>
                  <dd className="gap flex flex-col gap-3">
                    <div className="-mt-px flex items-center gap-2 lg:-mt-px">
                      <DynamicIcon
                        className="text-muted-foreground"
                        icon="calendar"
                        size={14}
                      />
                      <Date
                        publishedAt={publishedAt}
                        variant="muted"
                        size="sm"
                      />
                    </div>
                    <Categories categories={categories} />
                  </dd>
                </div>
              </dl>
              <SocialShare className="md:-mt-px" pathname={pathname} />
            </div>
          </div>
          <Content
            className="prose mt-18 [&>*:first-child]:mt-0!"
            content={content}
          />
        </article>
      </section>
    </main>
  )
}
