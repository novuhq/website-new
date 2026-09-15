import { Geist_Mono } from "next/font/google"
import type { IWebChatBuilderPage } from "@/data/pages/web-chat-builders"
import webflowChannels from "@/images/pages/channels/web-chat-builder/webflow/channels-mascot.png"
import webflowHero from "@/images/pages/channels/web-chat-builder/webflow/hero.png"

import FAQ from "@/components/pages/faq"

import WebChatBuilderFinalCta from "./final-cta"
import WebChatBuilderHero from "./hero"
import WebChatBuilderPrimarySection from "./primary-section"
import WebChatBuilderSecondarySection from "./secondary-section"
import WebChatBuilderTertiarySection from "./tertiary-section"

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-geist-mono",
})

function WebChatBuilderLanding({ page }: { page: IWebChatBuilderPage }) {
  return (
    <div className={`bg-black font-inter ${geistMono.variable}`}>
      <WebChatBuilderHero hero={page.hero} image={webflowHero} />
      {page.sections.map((section) =>
        section.type === "primary" ? (
          <WebChatBuilderPrimarySection key={section.id} section={section} />
        ) : section.type === "secondary" ? (
          <WebChatBuilderSecondarySection key={section.id} section={section} />
        ) : (
          <WebChatBuilderTertiarySection
            key={section.id}
            section={section}
            image={webflowChannels}
          />
        )
      )}
      <FAQ
        id="web-chat-builder-faq"
        title={page.faqTitle}
        accordion={{ items: page.faq }}
        variant="minimal"
        defaultOpenFirst
        className="mt-24 pt-0 pb-0 sm:pb-0 md:mt-32 md:pt-0 md:pb-0 lg:pb-0 xl:mt-52"
        titleClassName="font-normal tracking-(--tracking-plus-tight) md:text-[44px]"
        containerClassName="max-w-256 gap-y-4.5"
      />
      {page.finalCta && <WebChatBuilderFinalCta cta={page.finalCta} />}
    </div>
  )
}

export default WebChatBuilderLanding
