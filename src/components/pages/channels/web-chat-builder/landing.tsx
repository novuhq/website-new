import { Geist_Mono } from "next/font/google"
import type { IWebChatBuilderPage } from "@/data/pages/web-chat-builders"
import webflowHero from "@/images/pages/channels/web-chat-builder/webflow/hero.png"

import WebChatBuilderHero from "./hero"
import WebChatBuilderPrimarySection from "./primary-section"
import WebChatBuilderSecondarySection from "./secondary-section"

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
        ) : (
          <WebChatBuilderSecondarySection key={section.id} section={section} />
        )
      )}
    </div>
  )
}

export default WebChatBuilderLanding
