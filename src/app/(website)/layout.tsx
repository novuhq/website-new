import { Inter } from "next/font/google"
import { draftMode } from "next/headers"
import { Providers } from "@/contexts"

import { getGithubInfo } from "@/lib/get-github-info"
import {
  getLatestBlogPost,
  getLatestChangelogPost,
} from "@/lib/get-header-data"
import Fonts from "@/components/fonts"
import Footer from "@/components/footer"
import Header from "@/components/header"
import MixpanelTracking from "@/components/mixpanel-tracking"
import UtmForwarder from "@/components/utm-forwarder"
import PreviewWarning from "@/components/preview-warning"
import Scripts, { GTM_ID } from "@/components/scripts"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isEnabled: isDraftMode } = await draftMode()
  const [{ stars }, changelog, blog] = await Promise.all([
    getGithubInfo(),
    getLatestChangelogPost(),
    getLatestBlogPost(),
  ])

  return (
    <>
      <head>
        <Scripts />
        <Fonts />
      </head>
      <body
        className={`${inter.variable} flex min-h-svh flex-col bg-background font-sans antialiased`}
      >
        <MixpanelTracking />
        <UtmForwarder />
        <Providers>
          <div
            className="flex grow flex-col rounded-none bg-background aria-hidden:[-webkit-mask-image:-webkit-radial-gradient(white,black)]"
            vaul-drawer-wrapper=""
          >
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg focus:ring-2 focus:ring-ring"
            >
              Skip to content
            </a>
            <Header githubStars={stars} changelog={changelog} blog={blog} />
            {isDraftMode && <PreviewWarning />}
            <main id="main-content" className="grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Novu",
              url: "https://novu.co",
              logo: "https://novu.co/images/logo.svg",
              sameAs: [
                "https://github.com/novuhq/novu",
                "https://twitter.com/novaborhq",
                "https://www.linkedin.com/company/novuhq",
                "https://discord.gg/novu",
              ],
              description:
                "Open-source notification infrastructure for developers and product teams.",
            }).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Novu",
              url: "https://novu.co",
            }).replace(/</g, "\\u003c"),
          }}
        />
        <script
          key="plain-live-chat"
          dangerouslySetInnerHTML={{
            __html: `
            (function(d, script) {
              script = d.createElement('script');
              script.async = false;
              script.onload = function(){
                Plain.init({
                  appId: 'liveChatApp_01KJAVQQ5YRKY7NNZDEZV6KHED',
                  hideBranding: true,
                  threadDetails: { externalId: 'marketing_page' }, 
                });
              };
              script.src = 'https://chat.cdn-plain.com/index.js';
              d.getElementsByTagName('head')[0].appendChild(script);
            }(document));
          `,
          }}
        />
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
