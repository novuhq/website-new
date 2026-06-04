import { Metadata } from "next"
import { draftMode } from "next/headers"
import config from "@/configs/website-config"
import { SEO_DATA } from "@/constants/seo-data"

import { getMetadata } from "@/lib/get-metadata"
import { getHowToIndexData } from "@/lib/how-to"
import FinalCta from "@/components/pages/connect/final-cta"
import HowToPageContent from "@/components/pages/connect/how-to/listing/page-content"

export default async function ConnectHowToPage() {
  const { isEnabled: isDraftMode } = await draftMode()
  const data = await getHowToIndexData(isDraftMode)
  const siteUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || ""
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${SEO_DATA.connectHowTo.title} | ${config.projectName}`,
    description: SEO_DATA.connectHowTo.description,
    url: `${siteUrl}${SEO_DATA.connectHowTo.pathname}/`,
    isPartOf: {
      "@type": "WebSite",
      name: "Novu",
      url: "https://novu.co",
    },
    publisher: {
      "@type": "Organization",
      name: "Novu",
      url: "https://novu.co",
      logo: {
        "@type": "ImageObject",
        url: "https://novu.co/images/logo.svg",
      },
    },
  }

  return (
    <div className="relative overflow-clip bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="mx-auto flex w-full max-w-304 flex-col items-center px-5 pt-24 text-center md:px-8 md:pt-32 lg:pt-40 2xl:px-0">
        <div className="flex w-full max-w-247.5 flex-col items-center gap-6">
          <h1 className="w-full text-[2.25rem] leading-dense font-medium tracking-tighter text-balance text-white md:text-[2.75] lg:text-5xl/dense">
            Build agents that work across your tools
          </h1>
          <p className="w-full max-w-180 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-8">
            Step-by-step guides for connecting agents to the tools and channels
            your team already uses
          </p>
        </div>
      </section>

      <HowToPageContent data={data} />

      <FinalCta
        title={
          <>
            Build agents
            <br className="hidden sm:block" aria-hidden />
            <span className="sm:hidden"> </span>
            with Novu Connect
          </>
        }
        description={
          <>
            Connect your agents to the tools and channels
            <br className="hidden sm:block" aria-hidden />
            <span className="sm:hidden"> </span>
            your team already uses.
          </>
        }
        buttonText="Connect agent for free now"
        clickLocation="connect_how_to_final_cta"
      />
    </div>
  )
}

export const metadata: Metadata = getMetadata({
  title: `${SEO_DATA.connectHowTo.title} | ${config.projectName}`,
  description: SEO_DATA.connectHowTo.description,
  pathname: SEO_DATA.connectHowTo.pathname,
  imagePath: SEO_DATA.connectHowTo.imagePath,
  imageAlt: SEO_DATA.connectHowTo.imageAlt,
})
