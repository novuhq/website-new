import { Metadata } from "next"
import { SEO_DATA } from "@/constants/seo-data"

import { getMetadata } from "@/lib/get-metadata"
import ConnectPageContent from "@/components/pages/connect/connect-page-content"

export default function ConnectPage() {
  return <ConnectPageContent />
}

export const metadata: Metadata = getMetadata(SEO_DATA.connect)
