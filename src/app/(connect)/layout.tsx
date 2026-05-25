import type { ReactNode } from "react"

import ConnectFooter from "@/components/pages/connect/connect-footer"
import ConnectHeader from "@/components/pages/connect/connect-header"
import WebsiteLayoutShell from "@/components/website-layout-shell"

export default function ConnectLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <WebsiteLayoutShell
      header={<ConnectHeader />}
      footer={<ConnectFooter />}
      bodyClassName="bg-black"
      wrapperClassName="bg-black"
    >
      {children}
    </WebsiteLayoutShell>
  )
}
