import { draftMode } from "next/headers"
import { Providers } from "@/contexts"

import { brother1816 } from "@/lib/fonts"
import { getGithubInfo } from "@/lib/get-github-info"
import { getHeaderData } from "@/lib/get-header-data"
import Footer from "@/components/footer"
import Header from "@/components/header"
import PreviewWarning from "@/components/preview-warning"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isEnabled: isDraftMode } = await draftMode()
  const { stars } = await getGithubInfo()
  const headerData = await getHeaderData()

  return (
    <>
      <head></head>
      <body
        className={`flex min-h-svh flex-col bg-background ${brother1816.variable} font-sans antialiased`}
      >
        <Providers>
          <div
            className="flex grow flex-col rounded-none bg-background aria-hidden:[-webkit-mask-image:-webkit-radial-gradient(white,black)]"
            vaul-drawer-wrapper=""
          >
            <Header githubStars={stars} data={headerData} />
            {isDraftMode && <PreviewWarning />}
            <div className="grow">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </>
  )
}
