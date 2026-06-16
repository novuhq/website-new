import type { ReactNode } from "react"
import { getGithubInfo } from "@/lib/get-github-info"
import {
  getLatestBlogPost,
  getLatestChangelogPost,
} from "@/lib/get-header-data"
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
  const [{ stars }, changelog, blog] = await Promise.all([
    getGithubInfo(),
    getLatestChangelogPost(),
    getLatestBlogPost(),
  ])

  return (
    <WebsiteLayoutShell
      header={<Header githubStars={stars} changelog={changelog} blog={blog} />}
      footer={footer}
      bodyClassName={bodyClassName}
      wrapperClassName={wrapperClassName}
    >
      {children}
    </WebsiteLayoutShell>
  )
}

export default WebsiteShellLayout
