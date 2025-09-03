import { draftMode } from "next/headers"
import { ROUTE } from "@/constants/routes"
import { Providers } from "@/contexts"

import { brother1816 } from "@/lib/fonts"
import { getGithubInfo } from "@/lib/get-github-info"
import { getLatestChangelogPost, getLatestWpPost } from "@/lib/get-header-data"
import Footer from "@/components/footer"
import Header from "@/components/header"
import PreviewWarning from "@/components/preview-warning"
import Scripts, { GTM_ID } from "@/components/scripts"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isEnabled: isDraftMode } = await draftMode()
  const [{ stars }, changelog, blog] = await Promise.all([
    getGithubInfo(),
    getLatestChangelogPost(),
    getLatestWpPost(),
  ])

  return (
    <>
      <head>
        <Scripts />
      </head>
      <body
        className={`flex min-h-svh flex-col bg-background ${brother1816.variable} font-sans antialiased`}
      >
        <Providers>
          <div
            className="flex grow flex-col rounded-none bg-background aria-hidden:[-webkit-mask-image:-webkit-radial-gradient(white,black)]"
            vaul-drawer-wrapper=""
          >
            <Header githubStars={stars} changelog={changelog} blog={blog} />
            {isDraftMode && <PreviewWarning />}
            <div className="grow">{children}</div>
            <Footer />
          </div>
        </Providers>
        {/* Google Tag Manager noscript */}
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
