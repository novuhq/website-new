import type { ReactNode } from "react"

import { getGithubInfo } from "@/lib/get-github-info"
import Header from "@/components/header"
import ConnectFooter from "@/components/pages/connect/connect-footer"
import WebsiteLayoutShell from "@/components/website-layout-shell"

export default async function ConnectLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const { stars } = await getGithubInfo()

  return (
    <WebsiteLayoutShell
      header={<Header githubStars={stars} />}
      footer={<ConnectFooter />}
      bodyClassName="bg-black"
      wrapperClassName="bg-black"
    >
      {children}
    </WebsiteLayoutShell>
  )
}
