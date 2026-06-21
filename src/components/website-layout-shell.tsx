import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import { draftMode } from "next/headers"
import Script from "next/script"
import { Providers } from "@/contexts"

import { cn } from "@/lib/utils"
import DemoBookingTracker from "@/components/demo-booking-tracker"
import Fonts from "@/components/fonts"
import MixpanelTracking from "@/components/mixpanel-tracking"
import PreviewWarning from "@/components/preview-warning"
import Scripts, { GTM_ID } from "@/components/scripts"
import UtmForwarder from "@/components/utm-forwarder"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
})

interface WebsiteLayoutShellProps {
  children: ReactNode
  header: ReactNode
  footer: ReactNode
  bodyClassName?: string
  wrapperClassName?: string
}

async function WebsiteLayoutShell({
  children,
  header,
  footer,
  bodyClassName,
  wrapperClassName,
}: WebsiteLayoutShellProps) {
  const { isEnabled: isDraftMode } = await draftMode()

  return (
    <>
      <head>
        <Scripts />
        <Fonts />
      </head>
      <body
        className={cn(
          inter.variable,
          "flex min-h-svh flex-col bg-background font-sans antialiased",
          bodyClassName
        )}
      >
        <MixpanelTracking />
        <UtmForwarder />
        <DemoBookingTracker />
        <Providers>
          <div
            className={cn(
              "flex grow flex-col rounded-none bg-background aria-hidden:[-webkit-mask-image:-webkit-radial-gradient(white,black)]",
              wrapperClassName
            )}
            vaul-drawer-wrapper=""
          >
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg focus:ring-2 focus:ring-ring"
            >
              Skip to content
            </a>
            {header}
            {isDraftMode && <PreviewWarning />}
            <main id="main-content" className="grow">
              {children}
            </main>
            {footer}
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
        <Script id="plain-live-chat" strategy="afterInteractive">
          {`
            (function(d, script) {
              script = d.createElement('script');
              script.async = false;
              script.onload = function(){
                Plain.init({
                  appId: 'liveChatApp_01KJAVQQ5YRKY7NNZDEZV6KHED',
                  hideBranding: true,
                  threadDetails: { tierIdentifier: { externalId: 'marketing_page' } },
                });
              };
              script.src = 'https://chat.cdn-plain.com/index.js';
              d.getElementsByTagName('head')[0].appendChild(script);
            }(document));
          `}
        </Script>
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

export default WebsiteLayoutShell
