import { CHANNEL_CATEGORY_TAXONOMY } from "@/content/integrations/taxonomy/channels"

import type { IIntegration } from "@/types/integration"

function channelCategoryTitle(categorySlug: string): string {
  const found = CHANNEL_CATEGORY_TAXONOMY.find((c) => c.slug === categorySlug)
  return found?.title ?? categorySlug
}

/** Default `<title>` segment before `| Novu` when `seo.title` is not set in frontmatter. */
export function getDefaultIntegrationSeoTitleSegment(integration: IIntegration): string {
  if (integration.tab === "sources") {
    return `${integration.title} Integration`
  }
  return `${integration.title} Notification Provider`
}

/** Default meta description when `seo.description` is not set in frontmatter. */
export function getDefaultIntegrationSeoDescription(integration: IIntegration): string {
  if (integration.tab === "sources") {
    return `Connect ${integration.title} with Novu to power notifications at scale. Unified API, multi-channel support, and real-time observability out of the box.`
  }

  const channel = channelCategoryTitle(integration.category)
  return `Send ${channel} notifications with ${integration.title} using Novu. Integrate in minutes with a unified API, built-in workflow engine, and full observability.`
}
