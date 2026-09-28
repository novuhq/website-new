import type { Metadata } from "next"

import { getMetadata } from "@/lib/get-metadata"
import { SecurityLandingPage } from "@/components/pages/legacy-landing/security-page"

export const metadata: Metadata = getMetadata({
  title:
    "Comprehensive Security Features for Novu: Protecting Your Data and Systems",
  description:
    "Explore Novu's robust security features designed to safeguard your data and ensure seamless, secure notifications. Learn about our encryption protocols, access controls, and compliance with industry standards to protect your systems and maintain privacy.",
  pathname: "/security",
})

export default function SecurityPage() {
  return <SecurityLandingPage />
}
