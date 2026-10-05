import type { Metadata } from "next"

import { getMetadata } from "@/lib/get-metadata"
import UseCasesIndexPage from "@/components/pages/usecases/index-page"

export const metadata: Metadata = getMetadata({
  pathname: "/usecases/",
  title: "Novu Use Cases: Enhance Engagement with Multi-Channel Notifications",
  description:
    "Discover how Novu's unified platform enables teams to deliver personalized, multi-channel notifications, boosting user satisfaction and retention. Learn more about accelerating development, enhancing collaboration, and driving engagement.",
})

export default function UseCasesPage() {
  return <UseCasesIndexPage />
}
