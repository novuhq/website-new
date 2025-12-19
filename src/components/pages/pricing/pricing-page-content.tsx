"use client"

import { useState } from "react"

import { IPricingPageData } from "@/types/pricing"
import CTA from "@/components/pages/cta"
import ComparisonTable from "@/components/pages/pricing/comparison-table"
import CtaCard from "@/components/pages/pricing/cta-card"
import FAQ from "@/components/pages/pricing/faq"
import PricingPlansCards from "@/components/pages/pricing/pricing-plans-cards"
import SchedulingModal from "@/components/pages/pricing/scheduling-modal"
import SectionWithLogosAnimated from "@/components/pages/pricing/section-with-logos-animated"

function PricingPageContent({ page }: { page: IPricingPageData }) {
  const { hero, logos, plans, cta, faq, pageCta } = page
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
      <CtaCard {...cta} onScheduleClick={openSchedulingModal} />
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
