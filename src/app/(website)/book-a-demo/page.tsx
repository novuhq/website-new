import { Metadata } from "next"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import type { ICustomerCardData } from "@/types/customers"
import { getCustomersPage } from "@/lib/customers"
import { getMetadata } from "@/lib/get-metadata"
import BookADemoBuiltForEnterprise from "@/components/pages/book-a-demo/built-for-enterprise"
import BookADemoCentralizeNotifications from "@/components/pages/book-a-demo/centralize-notifications"
import BookADemoCustomerStories from "@/components/pages/book-a-demo/customer-stories"
import BookADemoEnterpriseReady from "@/components/pages/book-a-demo/enterprise-ready"
import BookADemoHero from "@/components/pages/book-a-demo/hero"
import BookADemoLogos from "@/components/pages/book-a-demo/logos"
import CTA from "@/components/pages/cta"

function isCustomerStoryCard(
  customer: ICustomerCardData | null | undefined
): customer is ICustomerCardData {
  return Boolean(
    customer?._id &&
      customer.slug?.current &&
      customer.logo?.url &&
      customer.quoteText &&
      customer.quoteAuthorName
  )
}

export default async function BookADemoPage() {
  const customersPage = await getCustomersPage()
  const customerStories = customersPage?.cards.filter(isCustomerStoryCard) || []

  return (
    <>
      <BookADemoHero />
      <BookADemoLogos />
      <BookADemoBuiltForEnterprise />
      <BookADemoEnterpriseReady />
      <BookADemoCentralizeNotifications />
      <BookADemoCustomerStories customers={customerStories} />
      <CTA
        title="See how Novu fits your enterprise stack"
        titleClassName="whitespace-pre-line !text-[1.75rem] md:!text-[2.75rem]"
        className="py-32 md:py-48 lg:py-39 xl:pt-84.5"
        description="Talk with our team about your security, compliance, deployment, and notification infrastructure requirements."
        actions={[
          {
            kind: "primary-button",
            label: "Book a demo",
            href: ROUTE.bookMeeting,
            clickLocation: "book_a_demo_cta",
            clickText: "book_a_demo",
          },
          {
            kind: "secondary-button",
            label: "Book a Call",
            href: ROUTE.bookMeeting,
            clickLocation: "book_a_demo_cta",
            clickText: "book_a_call",
          },
        ]}
      />
    </>
  )
}

export const metadata: Metadata = getMetadata(SEO_DATA.bookADemo)
