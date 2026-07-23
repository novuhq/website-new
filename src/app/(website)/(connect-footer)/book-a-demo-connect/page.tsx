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
import { CONNECT_FAQ } from "@/components/pages/connect/faq-data"
import FAQ from "@/components/pages/faq"

export default async function BookADemoConnectPage() {
  const customersPage = await getCustomersPage()
  const customerStories = customersPage?.cards.filter(isCustomerStoryCard) || []

  return (
    <BookADemoSchedulingProvider utmCampaign="book_a_demo_connect">
      <div className="bg-black">
        <BookADemoConnectHero />
        <BookADemoConnectLogos />
        <BookADemoConnectControlLayer />
        <BookADemoConnectEnterprise />
        <BookADemoConnectEnterpriseReady />
        <BookADemoConnectChannels />
        <BookADemoCustomerStories
          articleClassName="xl:mt-63"
          className="bg-black"
          customers={customerStories}
          trackingLocation="book_a_demo_connect_customer_stories"
        />
        <FAQ
          {...CONNECT_FAQ}
          id="faq"
          className="scroll-mt-16 bg-black pt-28 md:pt-36 lg:pt-44 xl:pt-63 xl:pb-0"
          titleClassName="text-center text-[1.75rem] md:text-[40px] lg:text-left"
          containerClassName="lg:max-w-227 md:max-w-[796px] lg:px-0"
        />
        <BookADemoConnectFinalCta />
      </div>
    </BookADemoSchedulingProvider>
  )
}

export const metadata: Metadata = getMetadata({
  ...SEO_DATA.bookADemoConnect,
  markdownPathname: true,
})
