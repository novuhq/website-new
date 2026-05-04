import { SEO_DATA } from "@/constants/seo-data"
import { Providers } from "@/contexts"

import { getGithubInfo } from "@/lib/get-github-info"
import {
  getLatestBlogPost,
  getLatestChangelogPost,
} from "@/lib/get-header-data"
import Fonts from "@/components/fonts"
import Footer from "@/components/footer"
import Header from "@/components/header"
import NotFoundContent from "@/components/pages/not-found"
import Scripts, { GTM_ID } from "@/components/scripts"

export default async function NotFound() {
  const [{ stars }, changelog, blog] = await Promise.all([
    getGithubInfo(),
    getLatestChangelogPost(),
    getLatestBlogPost(),
  ])

  return (
    <>
      <head>
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="description" content={SEO_DATA.notFound.description} />
        <meta name="pathname" content={SEO_DATA.notFound.pathname} />
        <title>{SEO_DATA.notFound.title}</title>
        <Scripts />
        <Fonts />
      </head>
      <body
        className={`flex min-h-svh flex-col bg-background font-sans antialiased`}
      >
        <Providers>
          <Header githubStars={stars} changelog={changelog} blog={blog} />
          <main className="flex grow">
            <NotFoundContent />
          </main>
          <Footer />
        </Providers>
        <noscript>
          <iframe
            className="invisible hidden"
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
          />
        </noscript>
      </body>
    </>
  )
}
