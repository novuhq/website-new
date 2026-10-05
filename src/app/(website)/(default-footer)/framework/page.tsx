import type { Metadata } from "next"

import { getMetadata } from "@/lib/get-metadata"
import { FrameworkLandingPage } from "@/components/pages/legacy-landing/framework-page"

export const metadata: Metadata = getMetadata({
  title: "Complete Control Over Notifications with Novu Framework",
  description:
    "Novu Framework gives developers code-backed workflows, full control, and seamless integration, while empowering non-technical teams to make safe updates.",
  pathname: "/framework",
})

export default function FrameworkPage() {
  return <FrameworkLandingPage />
}
