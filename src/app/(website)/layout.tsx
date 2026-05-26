import { getGithubInfo } from "@/lib/get-github-info"
import {
  getLatestBlogPost,
  getLatestChangelogPost,
} from "@/lib/get-header-data"
import Footer from "@/components/footer"
import Header from "@/components/header"
import WebsiteLayoutShell from "@/components/website-layout-shell"

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [{ stars }, changelog, blog] = await Promise.all([
    getGithubInfo(),
    getLatestChangelogPost(),
    getLatestBlogPost(),
  ])

  return (
    <WebsiteLayoutShell
      header={<Header githubStars={stars} changelog={changelog} blog={blog} />}
      footer={<Footer />}
    >
      {children}
    </WebsiteLayoutShell>
  )
}
