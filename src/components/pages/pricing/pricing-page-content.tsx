"use client"

import { useState } from "react"
import { pricingPageData } from "@/data/pages/pricing"

import CTA from "@/components/pages/cta"
import FAQ from "@/components/pages/faq"
import ComparisonTable from "@/components/pages/pricing/comparison-table"
import OnPremSection from "@/components/pages/pricing/on-prem-section"
import PricingPlansCards from "@/components/pages/pricing/pricing-plans-cards"
import SchedulingModal from "@/components/pages/pricing/scheduling-modal"
import SectionWithLogosAnimated from "@/components/pages/pricing/section-with-logos-animated"

function PricingPageContent() {
  const { hero, logos, plans, onPrem, faq, pageCta } = pricingPageData
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false)
  const [utmSource, setUtmSource] = useState<string | null>(null)

  const openSchedulingModal = (source: string) => {
    setUtmSource(source)
    // Force toggle to ensure the modal opens even if state was already true
    setIsSchedulingModalOpen(false)
    setTimeout(() => setIsSchedulingModalOpen(true), 0)
  }

  const closeSchedulingModal = () => {
    setIsSchedulingModalOpen(false)
  }

  return (
    <>
      <PricingPlansCards {...hero} onContactUsClick={openSchedulingModal} />
      <SectionWithLogosAnimated {...logos} />
      <ComparisonTable {...plans} onContactUsClick={openSchedulingModal} />
      <OnPremSection {...onPrem} />
      <FAQ
        {...faq}
        className="mt-13.5 md:mt-22 lg:mt-34 xl:mt-28"
        onScheduleClick={openSchedulingModal}
      />
      <CTA
        {...pageCta}
        className="text-center"
        containerClassName="max-w-192"
        descriptionClassName="max-w-176"
      />
      <SchedulingModal
        key={utmSource}
        isOpen={isSchedulingModalOpen}
        utmSource={utmSource}
        onClose={closeSchedulingModal}
      />
    </>
  )
}

export default PricingPageContent
