import { Metadata } from "next"
import { SEO_DATA } from "@/constants/seo-data"

import { getCustomersPage, isCustomerStoryCard } from "@/lib/customers"
import { getMetadata } from "@/lib/get-metadata"
import BookADemoConnectChannels from "@/components/pages/book-a-demo-connect/channels"
import BookADemoConnectControlLayer from "@/components/pages/book-a-demo-connect/control-layer"
import BookADemoConnectEnterprise from "@/components/pages/book-a-demo-connect/enterprise"
import BookADemoConnectEnterpriseReady from "@/components/pages/book-a-demo-connect/enterprise-ready"
import BookADemoConnectFinalCta from "@/components/pages/book-a-demo-connect/final-cta"
import BookADemoConnectHero from "@/components/pages/book-a-demo-connect/hero"
import BookADemoConnectLogos from "@/components/pages/book-a-demo-connect/logos"
import BookADemoCustomerStories from "@/components/pages/book-a-demo/customer-stories"
import { BookADemoSchedulingProvider } from "@/components/pages/book-a-demo/scheduling-provider"
import ConnectFaq from "@/components/pages/connect/faq"

export default async function BookADemoConnectPage() {
  const customersPage = await getCustomersPage()
  const customerStories = customersPage?.cards.filter(isCustomerStoryCard) || []

  return (
    <BookADemoSchedulingProvider utmCampaign="book_a_demo_connect">
      <BookADemoConnectHero />
      <BookADemoConnectLogos />
      <BookADemoConnectControlLayer />
      <BookADemoConnectEnterprise />
      <BookADemoConnectEnterpriseReady />
      <BookADemoConnectChannels />
      <BookADemoCustomerStories
        articleClassName="xl:mt-63"
        customers={customerStories}
        trackingLocation="book_a_demo_connect_customer_stories"
      />
      <ConnectFaq className="xl:pt-63 xl:pb-0" />
      <BookADemoConnectFinalCta />
    </BookADemoSchedulingProvider>
  )
}

export const metadata: Metadata = getMetadata(SEO_DATA.bookADemoConnect)
