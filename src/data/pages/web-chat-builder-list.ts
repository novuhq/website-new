/**
 * The published Web Chat builder pages. Kept apart from their copy in
 * `web-chat-builders.ts` so the header menu can list them without bundling
 * every page's copy into the client.
 */
export const WEB_CHAT_BUILDER_LIST = [
  { slug: "lovable", builderName: "Lovable" },
  { slug: "v0", builderName: "v0" },
] as const

export type WebChatBuilderSlug = (typeof WEB_CHAT_BUILDER_LIST)[number]["slug"]

export function getWebChatBuilderPathname(slug: string): string {
  return `/channels/web-chat/${slug}`
}
