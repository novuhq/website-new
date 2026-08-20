import type { Metadata } from "next"

import { getMetadata } from "@/lib/get-metadata"
import { InboxLandingPage } from "@/components/pages/legacy-landing/inbox-page"

export const metadata: Metadata = getMetadata({
  title: "Novu - Full-stack Inbox for In-app notifications",
  description:
    "Novu's Inbox is the easiest way to add a highly customizable notifications Inbox to your application or website.",
  pathname: "/inbox",
  imagePath: "/images/pages/inbox/og-novu-inbox.jpg",
  imageAlt: "Novu Inbox",
})

export default function InboxPage() {
  return <InboxLandingPage />
}
