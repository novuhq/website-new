import Image, { type StaticImageData } from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import auditIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/audit.svg"
import enterpriseIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/enterprise.svg"
import ratesIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/rates.svg"
import rbacIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/rbac.svg"
import selfHostIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/self-host.svg"
import shieldIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/shield.svg"
import supportIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/support.svg"
import userLockIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/user-lock.svg"
import gdprIcon from "@/images/pages/connect/compliance/gdpr.svg"
import hipaaIcon from "@/images/pages/connect/compliance/hipaa.svg"
import isoIcon from "@/images/pages/connect/compliance/iso.svg"
import soc2Icon from "@/images/pages/connect/compliance/soc-2.svg"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface IComplianceCard {
  title: string
  description: string
  image: StaticImageData
  imageClassName: string
}

interface IEnterpriseFeature {
  title: string
  icon: StaticImageData
}

const COMPLIANCE_CARDS: IComplianceCard[] = [
  {
    title: "GDPR",
    description: "Built to support EU data protection requirements.",
    image: gdprIcon,
    imageClassName: "h-16 w-12.5",
  },
  {
    title: "ISO 27001",
    description: "International standard for information security management.",
    image: isoIcon,
    imageClassName: "h-16 w-14.25",
  },
  {
    title: "SOC 2 Type II",
    description: "Proven long-term data security through independent audits.",
    image: soc2Icon,
    imageClassName: "h-16 w-12.5",
  },
  {
    title: "HIPAA",
    description: "Support for protected health information workflows.",
    image: hipaaIcon,
    imageClassName: "h-16 w-14.5",
  },
]

const ENTERPRISE_FEATURES: IEnterpriseFeature[] = [
  {
    title: "SAML / SSO",
    icon: userLockIcon,
  },
  {
    title: "Self-hosted option",
    icon: selfHostIcon,
  },
  {
    title: "Custom rate limits",
    icon: ratesIcon,
  },
  {
    title: "RBAC",
    icon: rbacIcon,
  },
  {
    title: "Security review support",
    icon: shieldIcon,
  },
  {
    title: "Audit logs",
    icon: auditIcon,
  },
  {
    title: "Enterprise SLA",
    icon: enterpriseIcon,
  },
  {
    title: "Dedicated support",
    icon: supportIcon,
  },
]

function BookADemoEnterpriseReady() {
  return (
    <section className="relative bg-background">
      <div className="mx-auto w-full max-w-320 px-5 md:px-8 2xl:px-0">
        <div className="mx-auto flex w-full max-w-304 flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-167.25">
            <h2 className="text-[1.75rem] leading-dense font-medium tracking-tighter text-balance text-white md:text-[2.5rem] xl:text-[2.75rem]">
              Enterprise-ready from day one
            </h2>
            <p className="mt-4 max-w-143 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-8 md:text-lg">
              Everything your team needs to meet security, compliance,
              deployment, and support requirements at scale.
            </p>
          </div>

          <Button variant="default" size="lg" className="w-36 px-0" asChild>
            <NextLink
              href={ROUTE.bookMeeting}
              data-click-location="book_a_demo_enterprise_ready"
              data-click-text="book_a_demo"
            >
              Book a demo
            </NextLink>
          </Button>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {COMPLIANCE_CARDS.map(
            ({ title, description, image, imageClassName }) => (
              <li
                key={title}
                className="flex min-h-57.25 flex-col items-start gap-11 overflow-hidden rounded-xl border border-[rgba(51,51,71,0.6)] bg-[#0f0f15] p-6"
              >
                <Image
                  className={cn(
                    "shrink-0 object-fill object-left-top",
                    imageClassName
                  )}
                  src={image}
                  alt=""
                  width={64}
                  height={64}
                  loading="lazy"
                />

                <div className="w-full">
                  <h3 className="text-xl leading-tight font-medium tracking-tighter text-white">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-snug font-book tracking-tighter text-gray-8">
                    {description}
                  </p>
                </div>
              </li>
            )
          )}
        </ul>

        <div className="mt-14 border-y border-[rgba(51,51,71,0.6)] py-8 lg:grid lg:grid-cols-[max-content_1fr] lg:gap-x-24 [@media(min-width:80.0625rem)]:gap-x-76">
          <p className="text-base leading-none font-normal tracking-normal text-gray-7 uppercase">
            Enterprise features included
          </p>

          <ul className="mt-6 flex max-w-176 flex-wrap items-center gap-2 lg:mt-0">
            {ENTERPRISE_FEATURES.map(({ title, icon }) => (
              <li
                key={title}
                className="flex min-h-9 items-center justify-center gap-2 rounded-full border border-[rgba(51,51,71,0.6)] bg-[#0f0f15] py-2 pr-5 pl-4"
              >
                <Image
                  className="size-4 shrink-0"
                  src={icon}
                  alt=""
                  width={16}
                  height={16}
                  loading="lazy"
                />
                <span className="text-base leading-tight font-normal tracking-tighter whitespace-nowrap text-white">
                  {title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default BookADemoEnterpriseReady
