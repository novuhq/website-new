import type { Metadata } from "next"

import { getMetadata } from "@/lib/get-metadata"
import Community from "@/components/pages/community"

export default function CommunityPage() {
  return <Community />
}

export const metadata: Metadata = getMetadata({
  title: "Community - Novu",
  description:
    "Join the Novu community, contribute code, meet new friends, learn, create and innovate with us!",
  pathname: "/community",
})
