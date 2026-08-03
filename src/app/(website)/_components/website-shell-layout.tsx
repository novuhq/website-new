import type { ReactNode } from "react"

import { getGithubInfo } from "@/lib/get-github-info"
import Header from "@/components/header"
import WebsiteLayoutShell from "@/components/website-layout-shell"

interface WebsiteShellLayoutProps {
  bodyClassName?: string
  children: ReactNode
  footer: ReactNode
  wrapperClassName?: string
}

async function WebsiteShellLayout({
  bodyClassName,
  children,
  footer,
  wrapperClassName,
}: WebsiteShellLayoutProps) {
  const { stars } = await getGithubInfo()

  return (
    <WebsiteLayoutShell
      header={<Header githubStars={stars} />}
      footer={footer}
      bodyClassName={bodyClassName}
      wrapperClassName={wrapperClassName}
    >
      {children}
    </WebsiteLayoutShell>
  )
}

export default WebsiteShellLayout
