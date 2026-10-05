import type { Metadata } from "next"

import { getMetadata } from "@/lib/get-metadata"
import { DigestLandingPage } from "@/components/pages/legacy-landing/digest-page"

export const metadata: Metadata = getMetadata({
  title: "Streamline Notifications with Novu's Digest",
  description:
    "Consolidate notifications, reduce overload, and keep users informed with Novu's flexible Digest feature.",
  pathname: "/digest",
})

export default function DigestPage() {
  return <DigestLandingPage />
}
