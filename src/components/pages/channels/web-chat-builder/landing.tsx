import type { IWebChatBuilderPage } from "@/data/pages/web-chat-builders"

function WebChatBuilderLanding({ page }: { page: IWebChatBuilderPage }) {
  return (
    <main>
      <h1>{page.hero.title}</h1>
    </main>
  )
}

export default WebChatBuilderLanding
