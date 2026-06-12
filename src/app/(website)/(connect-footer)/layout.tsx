import type { ReactNode } from "react"

import ConnectFooter from "@/components/pages/connect/connect-footer"

import WebsiteShellLayout from "../_components/website-shell-layout"

export default function ConnectFooterLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <WebsiteShellLayout
      footer={<ConnectFooter />}
      bodyClassName="bg-black"
      wrapperClassName="bg-black"
    >
      {children}
    </WebsiteShellLayout>
  )
}
