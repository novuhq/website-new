import { Metadata } from "next"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"
import aeswibon from "@/images/pages/mcp/reviews/aeswibon.jpg"
import csabaKissi from "@/images/pages/mcp/reviews/csaba-kissi.jpg"
import doinfinehq from "@/images/pages/mcp/reviews/doinfinehq.jpg"
import levlaz from "@/images/pages/mcp/reviews/levlaz.jpg"
import lukasboehler from "@/images/pages/mcp/reviews/lukasboehler.jpg"
import madebyfabian from "@/images/pages/mcp/reviews/madebyfabian.jpg"
import nikkisiapno from "@/images/pages/mcp/reviews/nikkisiapno.jpg"
import pontusab from "@/images/pages/mcp/reviews/pontusab.jpg"
import rauchg from "@/images/pages/mcp/reviews/rauchg.jpg"

import { ICustomerTweetData } from "@/types/customers"
import { getMetadata } from "@/lib/get-metadata"
import CTA from "@/components/pages/cta"
import McpAgenticToolsSection from "@/components/pages/mcp/agentic-tools"
import McpFrameworksSection from "@/components/pages/mcp/frameworks"
import GetInvolved from "@/components/pages/mcp/get-involved"
import McpHeroSection from "@/components/pages/mcp/hero"
import McpHowItWorksSection from "@/components/pages/mcp/how-it-works"
import McpPromptsSection from "@/components/pages/mcp/prompts"
import Reviews from "@/components/pages/reviews"

const REVIEWS: ICustomerTweetData[] = [
  {
    text: "New <span>@middayai</span> engineering blog post just dropped. Learn how we are using <span>@novuhq</span> as our notification infrastructure. Link in thread 🧵⬇️",
    tweetLink: "https://x.com/pontusab/status/1785312430882714031",
    name: "Pontus Abrahamsson",
    tag: "@pontusab",
    logo: { url: pontusab.src, width: pontusab.width, height: pontusab.height },
  },
  {
    text: "So excited about the rise of the notifications infrastructure space (+ open source 🔥)",
    tweetLink: "https://twitter.com/rauchg/status/1557048605042565120",
    name: "Guillermo Rauch",
    tag: "@rauchg",
    logo: { url: rauchg.src, width: rauchg.width, height: rauchg.height },
  },
  {
    text: "Haha yeah I’m so happy my notification logic isn’t inside the database anymore. Love Novu!🚀",
    tweetLink: "https://x.com/madebyfabian/status/1603010122451746816",
    name: "Fabian B.",
    tag: "@madebyfabian",
    logo: {
      url: madebyfabian.src,
      width: madebyfabian.width,
      height: madebyfabian.height,
    },
  },
  {
    text: "Todos for today: <span>#ship</span> a <span>@GleapSDK</span> update that utilizes <span>@novuhq</span> for amazing notifications 🎉",
    tweetLink: "https://twitter.com/lukasboehler/status/1696793039841144916",
    name: "Lukas Boehler",
    tag: "@lukasboehler",
    logo: {
      url: lukasboehler.src,
      width: lukasboehler.width,
      height: lukasboehler.height,
    },
  },
  {
    text: "Novu make notification management much easier. They're doing a great job with the service they offer.",
    tweetLink: "https://twitter.com/NikkiSiapno/status/1696509202993426884",
    name: "Nikki Siapno",
    tag: "@NikkiSiapno",
    logo: {
      url: nikkisiapno.src,
      width: nikkisiapno.width,
      height: nikkisiapno.height,
    },
  },
  {
    text: "The best solution for notifications.",
    tweetLink: "https://twitter.com/csaba_kissi/status/1696056864373416109",
    name: "Csaba Kissi",
    tag: "@csaba_kissi",
    logo: {
      url: csabaKissi.src,
      width: csabaKissi.width,
      height: csabaKissi.height,
    },
  },
  {
    text: "That's awesome! Real-time notifications can really boost user engagement. Love that <span>@novuhq</span> supports multiple frameworks & customization options. Definitely giving the repo a star to show support! 🌟 <span>#OpenSource #SoftwareDevelopment</span>",
    tweetLink: "https://x.com/aeswibon/status/1696467646429147200",
    name: "Abhiuday",
    tag: "@aeswibon",
    logo: { url: aeswibon.src, width: aeswibon.width, height: aeswibon.height },
  },
  {
    text: "Novu is so dope!",
    tweetLink: "https://x.com/levlaz/status/1810734219330736300",
    name: "Lev Lazinskiy",
    tag: "@levlaz",
    logo: { url: levlaz.src, width: levlaz.width, height: levlaz.height },
  },
  {
    text: "Thanks to a great tool called <span>@novuhq</span>, we can easily implement notifications into our upcoming v0.5.0 release.",
    tweetLink: "https://twitter.com/doinfinehq/status/1671123804049874947",
    name: "Doinfine",
    tag: "@doinfinehq",
    logo: {
      url: doinfinehq.src,
      width: doinfinehq.width,
      height: doinfinehq.height,
    },
  },
]

export default function McpPage() {
  return (
    <div className="relative overflow-clip pt-10 md:pt-12 lg:pt-24.5">
      <McpHeroSection />
      <McpHowItWorksSection />
      <McpPromptsSection />
      <McpAgenticToolsSection />
      <McpFrameworksSection />
      <Reviews
        reviews={REVIEWS}
        title="Don’t just take our word for it..."
        subtitle="Explore what developers and non-technical users say about why they're fans of our open-source notifications framework."
        className="lg:mt-0"
      />
      <GetInvolved />
      <CTA
        title="Start building with MCP"
        titleClassName="whitespace-pre-line !text-[1.75rem] md:!text-[2.75rem]"
        className="py-32 md:py-48 lg:py-60"
        description="Connect your first AI agent in under 5 minutes."
        actions={[
          {
            kind: "primary-button",
            label: "GET STARTED FREE",
            href: `${ROUTE.dashboard}?utm_campaign=gs-website-mcp`,
            openInNewTab: true,
          },
          {
            kind: "secondary-button",
            label: "READ THE DOCS",
            href: ROUTE.docsMcp,
            openInNewTab: true,
          },
        ]}
      />
    </div>
  )
}

export const metadata: Metadata = getMetadata(SEO_DATA.mcp)
