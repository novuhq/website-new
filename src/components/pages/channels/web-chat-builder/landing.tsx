import { Geist_Mono } from "next/font/google"
import {
  resolveWebChatBuilderMedia,
  type IWebChatBuilderPage,
} from "@/data/pages/web-chat-builders"

import FAQ from "@/components/pages/faq"
import Cta from "@/components/pages/home/cta"

import WebChatBuilderHero from "./hero"
import { WEB_CHAT_BUILDER_MEDIA } from "./media"
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
  const media = resolveWebChatBuilderMedia(page.media, WEB_CHAT_BUILDER_MEDIA)

  return (
    <div className={`bg-black font-inter ${geistMono.variable}`}>
      <WebChatBuilderHero hero={page.hero} image={media.hero} />
      {page.sections.map((section) =>
        section.type === "primary" ? (
          <WebChatBuilderPrimarySection key={section.id} section={section} />
        ) : section.type === "secondary" ? (
          <WebChatBuilderSecondarySection key={section.id} section={section} />
        ) : (
          <WebChatBuilderTertiarySection
            key={section.id}
            section={section}
            image={media.channels}
          />
        )
      )}
      <FAQ
        id="web-chat-builder-faq"
        title={page.faqTitle}
        accordion={{ items: page.faq }}
        variant="minimal"
        defaultOpenFirst
        className="mt-24 pt-0 pb-0 sm:pb-0 md:mt-32 md:min-h-90.5 md:pt-0 md:pb-0 lg:pb-0 xl:mt-52"
        titleClassName="font-normal tracking-(--tracking-plus-tight) md:text-[44px]"
        containerClassName="max-w-256 gap-y-4.5 md:gap-y-10"
        itemClassName="md:relative md:mb-10 md:border-b-0 md:after:pointer-events-none md:after:absolute md:after:inset-x-0 md:after:-bottom-5 md:after:h-px md:after:bg-gray-3 md:last:mb-0 md:last:after:hidden"
        triggerClassName="md:min-h-6.5 md:py-0.75 md:[&>svg]:size-3.5"
        contentClassName="md:pt-4 md:pb-2"
      />
      <Cta {...page.cta} promptButtonVariant="default" />
    </div>
  )
}

export default WebChatBuilderLanding
