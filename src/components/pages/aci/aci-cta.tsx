import CTA from "@/components/pages/cta"

import AciCtaActions from "./aci-cta-actions"

function AciCta() {
  return (
    <CTA
      title="One command and connect your agent to your customers."
      titleClassName="!max-w-176 !text-4xl md:!text-[2.5rem]"
      description="Run it in your terminal or hand the prompt to Claude and let it wire up the SDK for you. Either way, no plumbing to own."
      descriptionClassName="max-w-136"
      className="bg-black py-32 md:py-44 lg:pt-52 lg:pb-71"
      containerClassName="!max-w-184 !translate-x-0"
      actions={[]}
      actionSlot={<AciCtaActions />}
    />
  )
}

export default AciCta
