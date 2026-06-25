import { SEO_DATA } from "@/constants/seo-data"
import { pricingPageData } from "@/data/pages/pricing"

import { formatMarkdownLink } from "../markdown-format"
import {
  actionsMarkdown,
  asText,
  bulletList,
  ctaMarkdown,
  faqMarkdown,
  pageFromSeo,
} from "../page-utils"
import type { MarkdownPage } from "../types"

function priceToText(
  price: Array<{
    _type: string
    value: string | number
    paymentPeriod?: string
  }>
) {
  return price
    .map((item) =>
      item._type === "numericPrice"
        ? `$${item.value}/${item.paymentPeriod ?? "month"}`
        : String(item.value)
    )
    .join(", ")
}

export async function getPricing(
  pathname: string
): Promise<MarkdownPage | null> {
  if (pathname !== "/pricing") return null

  const data = pricingPageData
  const body = [
    data.hero.title,
    data.hero.description,
    `## Plans\n\n${data.hero.plans
      .map((plan) =>
        [
          `### ${plan.title}`,
          plan.description,
          `Price: ${priceToText(plan.price)}`,
          asText(plan.details),
          plan.extraInfo,
          plan.link ? formatMarkdownLink(plan.link.text, plan.link.href) : "",
        ]
          .filter(Boolean)
          .join("\n\n")
      )
      .join("\n\n")}`,
    `## ${data.onPrem.title}\n\n${data.onPrem.description}\n\n${bulletList(data.onPrem.features)}`,
    faqMarkdown(data.faq),
    [
      `## ${data.cta.text}`,
      data.cta.description,
      ctaMarkdown({
        label: data.cta.buttonText,
        href: data.cta.buttonUrl,
      }),
    ]
      .filter(Boolean)
      .join("\n\n"),
    [
      `## ${data.pageCta.title}`,
      data.pageCta.description,
      actionsMarkdown(data.pageCta.actions),
    ]
      .filter(Boolean)
      .join("\n\n"),
  ]
    .filter(Boolean)
    .join("\n\n")

  return pageFromSeo(SEO_DATA.pricing, body, false)
}
