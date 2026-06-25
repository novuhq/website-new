import { SEO_DATA } from "@/constants/seo-data"

import { getCustomersPage, isCustomerStoryCard } from "@/lib/customers"
import { getCustomerBySlug } from "@/lib/customers/customer"

import { bulletList, linkList, pageFromSeo } from "../page-utils"
import { portableTextToMarkdown } from "../portable-text-to-markdown"
import type { MarkdownPage } from "../types"
import { absoluteUrl, toCanonicalPathname } from "../url"

export async function getCustomers(
  pathname: string
): Promise<MarkdownPage | null> {
  if (pathname === "/customers") {
    const page = await getCustomersPage(false)
    if (!page) return null

    const featured = page.cards.filter(isCustomerStoryCard)
    const customers = page.customersGrid.map((customer) => ({
      title: customer.name,
      href:
        customer.type === "story" && customer.slug?.current
          ? absoluteUrl(
              toCanonicalPathname(`/customers/${customer.slug.current}`)
            )
          : customer.url || absoluteUrl("/customers/"),
      description: customer.about,
    }))

    return pageFromSeo(
      SEO_DATA.customers,
      [
        featured.length
          ? `## Featured customer stories\n\n${linkList(
              featured.map((customer) => ({
                title: customer.name,
                href: absoluteUrl(
                  toCanonicalPathname(`/customers/${customer.slug.current}`)
                ),
                description: customer.quoteText,
              }))
            )}`
          : "",
        `## Customers\n\n${linkList(customers)}`,
      ]
        .filter(Boolean)
        .join("\n\n")
    )
  }

  const match = pathname.match(/^\/customers\/([^/]+)$/)
  if (!match) return null

  const customerData = await getCustomerBySlug(match[1], false)
  if (!customerData) return null

  const { customer } = customerData
  const body = [
    customer.about,
    customer.industry ? `Industry: ${customer.industry}` : "",
    customer.channelsList?.length
      ? `Channels: ${customer.channelsList.join(", ")}`
      : "",
    customer.quote?.text
      ? `> ${customer.quote.text}\n>\n> - ${[
          customer.quote.authorName,
          customer.quote.authorPosition,
        ]
          .filter(Boolean)
          .join(", ")}`
      : "",
    customer.challengesSolution?.challenges?.length
      ? `## Key Challenges\n\n${bulletList(customer.challengesSolution.challenges)}`
      : "",
    customer.challengesSolution?.solution?.length
      ? `## Novu Solution\n\n${bulletList(customer.challengesSolution.solution)}`
      : "",
    customer.body ? portableTextToMarkdown(customer.body) : "",
  ]
    .filter(Boolean)
    .join("\n\n")

  return {
    title: customer.seo?.title || customer.title,
    description: customer.seo?.description || customer.about,
    pathname: `/customers/${customer.slug?.current ?? match[1]}`,
    body,
    updatedAt: customer._createdAt,
    noIndex: customer.seo?.noIndex,
  }
}
