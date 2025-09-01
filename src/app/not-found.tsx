import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"
import { Providers } from "@/contexts"

import { brother1816 } from "@/lib/fonts"
import { getGithubInfo } from "@/lib/get-github-info"
import { getLatestChangelogPost, getLatestWpPost } from "@/lib/get-header-data"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"
import Header from "@/components/header"
import Scripts, { GTM_ID } from "@/components/scripts"

export default async function NotFound() {
  const { stars } = await getGithubInfo()
  const [changelog, blog] = await Promise.all([
    getLatestChangelogPost(),
    getLatestWpPost(),
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
      </head>
      <body
        className={`flex min-h-svh flex-col bg-background ${brother1816.variable} font-sans antialiased`}
      >
        <Providers>
          <Header githubStars={stars} changelog={changelog} blog={blog} />
          <main className="flex grow">
            <section className="not-found flex grow items-center justify-center px-5 py-20 md:px-8">
              <div className="flex max-w-md flex-col items-center justify-center md:max-w-lg">
                <h1 className="text-8xl leading-none font-semibold tracking-tighter text-foreground md:text-9xl md:leading-none">
                  <span className="sr-only">Error</span>404
                  <span className="sr-only">: Page Not Found</span>
                </h1>
                <p className="mt-2.5 text-center text-base leading-normal tracking-tight text-foreground md:text-lg md:leading-normal">
                  We know this isn&apos;t where you intended to land, but we
                  hope you have some fun while you&apos;re here.
                </p>
                <Button className="mt-6 xl:mt-8" variant="outline" asChild>
                  <NextLink href={ROUTE.index}>Go back home</NextLink>
                </Button>
              </div>
            </section>
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
