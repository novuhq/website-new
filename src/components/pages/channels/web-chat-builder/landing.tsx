import { Geist_Mono } from "next/font/google"
import type { IWebChatBuilderPage } from "@/data/pages/web-chat-builders"
import webflowHero from "@/images/pages/channels/web-chat-builder/webflow/hero.png"

import WebChatBuilderHero from "./hero"

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
    </div>
  )
}

export default WebChatBuilderLanding
