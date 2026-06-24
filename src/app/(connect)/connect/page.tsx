import { Metadata } from "next"
import { SEO_DATA } from "@/constants/seo-data"

import { getMetadata } from "@/lib/get-metadata"
import { getAgentTemplatesSection } from "@/lib/templates"
import ConnectPageContent from "@/components/pages/connect/connect-page-content"

export default async function ConnectPage() {
  const templatesSection = await getAgentTemplatesSection()

  return <ConnectPageContent templatesSection={templatesSection} />
}

export const metadata: Metadata = getMetadata({
  ...SEO_DATA.connect,
  markdownPathname: true,
})
