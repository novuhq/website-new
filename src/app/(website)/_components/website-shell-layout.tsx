import type { ReactNode } from "react"
import { cookies } from "next/headers"

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
  let authStateOverride: "loading" | "signed-in" | "signed-out" | undefined

  if (process.env.CRITICAL_FLOW_TESTING === "1") {
    const authState = (await cookies()).get(
      "novu-critical-flow-auth-state"
    )?.value

    if (
      authState === "loading" ||
      authState === "signed-in" ||
      authState === "signed-out"
    ) {
      authStateOverride = authState
    }
  }

  return (
    <WebsiteLayoutShell
      header={
        <Header githubStars={stars} authStateOverride={authStateOverride} />
      }
      footer={footer}
      bodyClassName={bodyClassName}
      wrapperClassName={wrapperClassName}
    >
      {children}
    </WebsiteLayoutShell>
  )
}

export default WebsiteShellLayout
