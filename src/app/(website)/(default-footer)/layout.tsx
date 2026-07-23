import type { ReactNode } from "react"

import Footer from "@/components/footer"

import WebsiteShellLayout from "../_components/website-shell-layout"

export default function DefaultFooterLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return <WebsiteShellLayout footer={<Footer />}>{children}</WebsiteShellLayout>
}
