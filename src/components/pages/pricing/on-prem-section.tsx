import Image from "next/image"
import dotSurface from "@/images/pages/pricing/cta-card/dot-surface.png"
import { Server, CheckCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

const INCLUDED_FEATURES = [
  "SSO and RBAC support",
  "Custom SLAs",
  "Dedicated support",
  "All cloud features",
]

function OnPremSection() {
  const ctaUrl = "https://go.novu.co/contact?utm_campaign=pricing-widget"

  return (
    <section className="mx-auto mt-22 w-full max-w-4xl px-5 md:mt-27.5 md:px-8 lg:mt-32 xl:mt-33.5">
      <div className="relative overflow-hidden rounded-xl bg-[linear-gradient(152.16deg,#0F1729_0.45%,#0A0D1A_98.47%)]">
        <div
          className="absolute inset-0 overflow-hidden rounded-[inherit]"
          aria-hidden
        >
          <div className="absolute -top-10 -left-10 h-[200px] w-[300px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(71,117,255,0.15)_0%,transparent_100%)] blur-3xl" />
          <div className="absolute -right-10 top-1/2 h-[200px] w-[300px] -translate-y-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(102,49,121,0.2)_0%,transparent_100%)] blur-3xl" />
          <Image
            src={dotSurface}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        </div>

        <span
          className="absolute inset-0 z-11 rounded-[inherit] border-gradient bg-[linear-gradient(135deg,rgba(71,117,255,0.3)_0%,rgba(95,82,122,0.2)_50%,rgba(102,49,121,0.3)_100%)]"
          aria-hidden
        />

        <div className="relative z-20 flex flex-col items-center gap-6 p-6 md:flex-row md:justify-between md:p-8">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#4775FF]/30 bg-[#4775FF]/10 px-3 py-1">
              <Server className="size-3.5 text-[#4775FF]" />
              <span className="text-xs font-medium tracking-tight text-[#4775FF]">
                Enterprise
              </span>
            </div>

            <h2 className="text-[22px] leading-tight font-medium tracking-tighter md:text-[24px]">
              On-Prem Self-Hosted
            </h2>

            <p className="mt-1.5 max-w-md text-[14px] leading-snug font-book tracking-tight text-gray-9">
              Deploy Novu on your own infrastructure with full control and enterprise support.
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-start">
              {INCLUDED_FEATURES.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-1.5 text-[13px] font-book tracking-tight text-gray-9"
                >
                  <CheckCircle className="size-3.5 text-[#4775FF]" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <Button
            className={cn(
              "h-10 shrink-0 rounded-md px-6 text-[13px] font-medium uppercase tracking-tight"
            )}
            asChild
          >
            <Link
              variant="white"
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Meeting
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default OnPremSection
