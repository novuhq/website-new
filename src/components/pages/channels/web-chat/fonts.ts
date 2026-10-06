import { Geist_Mono } from "next/font/google"

/**
 * One Geist Mono instance for the Web Chat page. Sections apply it with
 * `className` or read it through `--font-web-chat-mono`; declaring it per
 * component shipped a separate copy of the font CSS for each.
 */
export const webChatMono = Geist_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-web-chat-mono",
})
