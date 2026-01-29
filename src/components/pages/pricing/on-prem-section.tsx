import Image from "next/image"
import dotSurface from "@/images/pages/pricing/cta-card/dot-surface.png"
import { Server, Shield, Headphones, CheckCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

const ON_PREM_FEATURES = [
  {
    icon: Shield,
    title: "Local Data Ownership",
    description: "Keep your data within your infrastructure with full control over security and compliance.",
  },
  {
    icon: Server,
    title: "All Cloud Features",
    description: "Access the complete Novu feature set including workflows, digests, and multi-channel delivery.",
  },
  {
    icon: Headphones,
    title: "Enterprise Support",
    description: "Dedicated support team for self-hosting with SLAs, onboarding, and priority assistance.",
  },
]

const INCLUDED_FEATURES = [
  "Unlimited team members",
  "Custom SLAs",
  "Dedicated support",
  "Security review",
  "Custom integrations",
  "Priority feature requests",
]

function OnPremSection() {
  const ctaUrl = "https://go.novu.co/contact?utm_campaign=pricing-widget"

  return (
    <section className="mx-auto mt-22 w-full max-w-6xl px-5 md:mt-27.5 md:px-8 lg:mt-32 xl:mt-33.5">
      <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(152.16deg,#0F1729_0.45%,#0A0D1A_98.47%)]">
        <div
          className="absolute inset-0 overflow-hidden rounded-[inherit]"
          aria-hidden
        >
          <div className="absolute -top-20 -left-20 h-[300px] w-[400px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(71,117,255,0.15)_0%,transparent_100%)] blur-3xl" />
          <div className="absolute -right-20 top-1/2 h-[300px] w-[400px] -translate-y-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(102,49,121,0.2)_0%,transparent_100%)] blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-[200px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(71,117,255,0.1)_0%,transparent_100%)] blur-3xl" />
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

        <div className="relative z-20 p-6 md:p-10 lg:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#4775FF]/30 bg-[#4775FF]/10 px-4 py-1.5">
              <Server className="size-4 text-[#4775FF]" />
              <span className="text-sm font-medium tracking-tight text-[#4775FF]">
                Enterprise Solution
              </span>
            </div>

            <h2 className="mt-4 max-w-2xl text-[28px] leading-tight font-medium tracking-tighter md:text-[36px] lg:text-[42px]">
              On-Prem Self-Hosted
            </h2>

            <p className="mt-3 max-w-xl text-[15px] leading-relaxed font-book tracking-tight text-gray-9 md:text-[16px]">
              Deploy Novu on your own infrastructure. Complete control, full feature parity with cloud, and enterprise-grade support for your self-hosted deployment.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
            {ON_PREM_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group relative flex flex-col items-center rounded-xl bg-white/[0.02] p-6 text-center transition-colors hover:bg-white/[0.04]"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,rgba(71,117,255,0.2)_0%,rgba(102,49,121,0.2)_100%)] ring-1 ring-white/10">
                  <feature.icon className="size-6 text-[#8AAEFF]" />
                </div>
                <h3 className="text-[17px] font-medium tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed font-book tracking-tight text-gray-8">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center">
            <div className="mb-6 flex flex-wrap justify-center gap-x-6 gap-y-3">
              {INCLUDED_FEATURES.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-[14px] font-book tracking-tight text-gray-9"
                >
                  <CheckCircle className="size-4 text-[#4775FF]" />
                  {feature}
                </div>
              ))}
            </div>

            <Button
              className={cn(
                "h-12 min-w-[200px] rounded-lg text-[14px] font-medium uppercase tracking-tight"
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

            <p className="mt-3 text-[13px] font-book tracking-tight text-gray-7">
              Talk to our team about your self-hosting requirements
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OnPremSection
