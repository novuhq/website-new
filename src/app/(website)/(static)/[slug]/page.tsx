import { Metadata } from "next"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import config from "@/configs/website-config"

import { getMetadata } from "@/lib/get-metadata"
import { portableToPlain } from "@/lib/sanity/utils/portable-to-plain"
import { getAllStaticPages, getStaticPageBySlug } from "@/lib/static"
import { getExcerpt } from "@/lib/utils"
import Aside from "@/components/pages/aside"
import BackToTop from "@/components/pages/back-to-top"
import Content from "@/components/pages/content"
import CTA from "@/components/pages/cta"
import SocialShare from "@/components/pages/social-share"
import TableOfContents from "@/components/pages/table-of-contents"

interface StaticPagePageProps {
  params: Promise<{ slug: string }>
}

export default async function StaticPagePage({ params }: StaticPagePageProps) {
  const { isEnabled: isDraftMode } = await draftMode()
  const { slug } = await params
  const staticPage = await getStaticPageBySlug(slug, isDraftMode)

  if (!staticPage) {
    notFound()
  }

  const {
    title,
    content,
    tableOfContents,
    publishedAt,
    seo,
    slug: staticPageSlug,
  } = staticPage

  // Google Structured Data for Blog Post @see {@link https://developers.google.com/search/docs/appearance/structured-data/article#json-ld}
  // Next.js JSON-LD @see {@link https://nextjs.org/docs/app/guides/json-ld}
  const siteUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || ""
  const staticPageUrl = `${siteUrl}/${staticPageSlug.current}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: seo?.title || title,
    description: seo?.description || "",
    datePublished: publishedAt,
    url: staticPageUrl,
  }

  return (
    <main className="pt-8 md:pt-11 lg:pt-16">
      <section className="content relative z-10">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
          <article className="grid w-full grid-cols-1 gap-y-8 md:gap-y-10 lg:grid-cols-[auto_16rem] lg:gap-y-14 xl:grid-cols-[16rem_auto_16rem]">
            <header className="col-start-1 row-start-1 w-full xl:col-start-2">
              <h1 className="mt-5 text-3xl leading-tight font-semibold tracking-tight text-balance md:text-4xl md:leading-tight lg:text-5xl lg:leading-tight lg:font-medium">
                {title}
              </h1>
            </header>
            <div className="col-start-1 row-start-2 xl:col-start-2">
              <Content
                className="prose-static [&>*:first-child]:mt-0!"
                content={content}
              />
            </div>
            <Aside
              className="col-start-2 row-start-2 hidden w-full shrink-0 flex-col pl-16 lg:flex xl:col-start-3"
              sticky
            >
              <TableOfContents
                className="mt-1.5"
                title="On this page"
                items={tableOfContents}
              />
              <BackToTop withSeparator />
              <SocialShare
                className="mt-7"
                pathname={`/${staticPageSlug.current}`}
              />
            </Aside>
          </article>
        </div>
      </section>
      <CTA
        title="Subscribe to the blog updates"
        description="Novu's latest articles, right in your inbox. Keep in touch with our news and updates."
        descriptionClassName="max-w-130 xs:text-wrap"
        actions={[
          {
            kind: "subscription-form",
            placeholder: "Your email...",
            buttonText: "Subscribe",
          },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  )
}

export async function generateStaticParams() {
  const staticPages = await getAllStaticPages(false)

  return staticPages.map((staticPage) => ({
    slug: staticPage.slug.current,
  }))
}

export async function generateMetadata({
  params,
}: StaticPagePageProps): Promise<Metadata> {
  const { slug } = await params
  const staticPage = await getStaticPageBySlug(slug, false)

  if (!staticPage) {
    return {}
  }

  const { seo } = staticPage

  const description =
    seo?.description?.length > 0
      ? seo.description
      : getExcerpt({
          content: portableToPlain(staticPage.content),
          length: 160,
        })

  const metadata = getMetadata({
    title: `${seo.title || staticPage.title} | ${config.projectName}`,
    description: description,
    pathname: `/${staticPage.slug.current}`,
    imagePath: seo?.socialImage,
    noIndex: seo?.noIndex,
  })

  return metadata
}
