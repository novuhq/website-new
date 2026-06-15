import { Metadata } from "next"
import { SEO_DATA } from "@/constants/seo-data"

import { getCustomersPage, isCustomerStoryCard } from "@/lib/customers"
import { getMetadata } from "@/lib/get-metadata"
import BookADemoBuiltForEnterprise from "@/components/pages/book-a-demo/built-for-enterprise"
import BookADemoCentralizeNotifications from "@/components/pages/book-a-demo/centralize-notifications"
import BookADemoCustomerStories from "@/components/pages/book-a-demo/customer-stories"
import BookADemoEnterpriseReady from "@/components/pages/book-a-demo/enterprise-ready"
import BookADemoHero from "@/components/pages/book-a-demo/hero"
import BookADemoLogos from "@/components/pages/book-a-demo/logos"
import BookADemoSchedulingActions from "@/components/pages/book-a-demo/scheduling-actions"
import { BookADemoSchedulingProvider } from "@/components/pages/book-a-demo/scheduling-provider"
import CTA from "@/components/pages/cta"

export default async function BookADemoPage() {
  const customersPage = await getCustomersPage()
  const customerStories = customersPage?.cards.filter(isCustomerStoryCard) || []

  return (
    <BookADemoSchedulingProvider>
      <BookADemoHero />
      <BookADemoLogos />
      <BookADemoBuiltForEnterprise />
      <BookADemoEnterpriseReady />
      <BookADemoCentralizeNotifications />
      <BookADemoCustomerStories customers={customerStories} />
      <CTA
        title="See how Novu fits your enterprise stack"
        titleClassName="whitespace-pre-line !text-[1.75rem] md:!text-[2.75rem]"
        className="py-32 md:py-48 lg:py-50 xl:py-50"
        description="Talk with our team about your security, compliance, deployment, and notification infrastructure requirements."
        actions={[]}
        actionSlot={
          <BookADemoSchedulingActions className="mt-6.5 2xs:justify-center md:mt-7.75" />
        }
      />
    </BookADemoSchedulingProvider>
  )
}

export const metadata: Metadata = getMetadata(SEO_DATA.bookADemo)
