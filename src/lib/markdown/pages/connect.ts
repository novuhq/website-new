import { SEO_DATA } from "@/constants/seo-data"

import { getAgentTemplatesSection } from "@/lib/templates"
import { CONNECT_FAQ } from "@/components/pages/connect/faq-data"

import { faqMarkdown, linkList, pageFromSeo } from "../page-utils"
import type { MarkdownPage } from "../types"
import { absoluteUrl, toCanonicalPathname } from "../url"

export async function getConnect(
  pathname: string
): Promise<MarkdownPage | null> {
  if (pathname !== "/connect") return null

  const templatesSection = await getAgentTemplatesSection(false)
  const templates = templatesSection.templates.slice(0, 12)
  const body = [
    SEO_DATA.connect.description,
    "Connect existing agents to customer channels with reusable tools, templates, and channel adapters.",
    templates.length
      ? `## Agent templates\n\n${linkList(
          templates.map((template) => ({
            title: template.name,
            href: absoluteUrl(toCanonicalPathname("/connect")),
            description: template.summary,
          }))
        )}`
      : "",
    faqMarkdown(CONNECT_FAQ),
  ]
    .filter(Boolean)
    .join("\n\n")

  return pageFromSeo(SEO_DATA.connect, body)
}
