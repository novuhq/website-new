import type { ReactNode } from "react"
import Image, { type StaticImageData } from "next/image"
import aicpaIcon from "@/images/pages/book-a-demo/enterprise-ready/aicpa.svg"
import gdprIcon from "@/images/pages/book-a-demo/enterprise-ready/gdpr.svg"
import hipaaIcon from "@/images/pages/book-a-demo/enterprise-ready/hipaa.svg"
import auditIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/audit.svg"
import enterpriseIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/enterprise.svg"
import ratesIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/rates.svg"
import rbacIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/rbac.svg"
import selfHostIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/self-host.svg"
import shieldIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/shield.svg"
import supportIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/support.svg"
import userLockIcon from "@/images/pages/book-a-demo/enterprise-ready/icons/user-lock.svg"
import isoIcon from "@/images/pages/book-a-demo/enterprise-ready/iso.svg"
import complianceSupportIcon from "@/images/pages/book-a-demo/enterprise-ready/support.svg"

import { cn } from "@/lib/utils"

import BookADemoSchedulingButton, {
  BookADemoSchedulingInlineButton,
} from "./scheduling-button"

interface IComplianceCard {
  title: string
  description: ReactNode
  descriptionClassName?: string
  image: StaticImageData
  imageClassName: string
}

interface IEnterpriseFeature {
  title: string
  icon: StaticImageData
}

interface IBookADemoEnterpriseReadyProps {
  className?: string
  complianceSchedulingSource?: string
  enterpriseFeatures?: IEnterpriseFeature[]
  schedulingSource?: string
  trackingBase?: string
}

function getComplianceCards(
  trackingBase: string,
  schedulingSource: string
): IComplianceCard[] {
  return [
    {
      title: "GDPR",
      description: "Built to support EU data protection requirements.",
      image: gdprIcon,
      imageClassName: "h-16 w-12.5",
    },
    {
      title: "ISO 27001",
      description:
        "International standard for information security management.",
      image: isoIcon,
      imageClassName: "h-16 w-14.5",
    },
    {
      title: "SOC 2 Type II",
      description: "Proven long-term data security through independent audits.",
      image: aicpaIcon,
      imageClassName: "h-16 w-12.5",
    },
    {
      title: "HIPAA",
      description: "Support for protected health information workflows.",
      image: hipaaIcon,
      imageClassName: "h-16 w-14.5",
    },
    {
      title: "Compliance Support",
      description: (
        <>
          If you don&apos;t see the required certification listed,{" "}
          <BookADemoSchedulingInlineButton
            clickLocation={`${trackingBase}_compliance_support`}
            clickText="talk_to_us"
            source={schedulingSource}
          >
            talk to us.
          </BookADemoSchedulingInlineButton>
        </>
      ),
      descriptionClassName: "lg:max-w-45",
      image: complianceSupportIcon,
      imageClassName: "h-16 w-14.5",
    },
  ]
}

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

function BookADemoEnterpriseReady({
  className,
  complianceSchedulingSource,
  enterpriseFeatures = ENTERPRISE_FEATURES,
  schedulingSource,
  trackingBase = "book_a_demo_enterprise_ready",
}: IBookADemoEnterpriseReadyProps) {
  const modalSource = schedulingSource || trackingBase
  const complianceModalSource =
    complianceSchedulingSource || `${trackingBase}_compliance_support`
  const complianceCards = getComplianceCards(trackingBase, complianceModalSource)

  return (
    <section className={cn("relative bg-background", className)}>
      <div className="mx-auto w-full max-w-320 px-5 md:px-8 2xl:px-0">
        <div className="mx-auto flex w-full max-w-167.25 flex-col items-center gap-8 text-center">
          <div className="flex w-full flex-col items-center gap-4">
            <h2 className="text-[1.75rem] leading-dense font-medium tracking-tighter text-balance text-white md:text-[2.5rem] xl:text-[2.75rem]">
              Enterprise-ready from day one
            </h2>
            <p className="max-w-153 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-8 md:text-lg">
              Everything your team needs to meet security, compliance,
              deployment, and support requirements at scale.
            </p>
          </div>

          <BookADemoSchedulingButton
            variant="default"
            size="lg"
            className="w-36 px-0"
            clickLocation={trackingBase}
            clickText="book_a_demo"
            source={modalSource}
          >
            Book a demo
          </BookADemoSchedulingButton>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">
          {complianceCards.map(
            ({
              title,
              description,
              descriptionClassName,
              image,
              imageClassName,
            }) => (
              <li
                key={title}
                className="flex flex-col items-start gap-11 overflow-hidden rounded-xl border border-[rgba(51,51,71,0.6)] bg-[#0f0f15] p-6 md:min-h-62.5"
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
                  <p
                    className={cn(
                      "mt-1.5 text-[0.9375rem] leading-snug font-book tracking-tighter text-gray-8",
                      descriptionClassName
                    )}
                  >
                    {description}
                  </p>
                </div>
              </li>
            )
          )}
        </ul>

        <div className="mt-9 border-y border-[rgba(51,51,71,0.6)] py-8 lg:grid lg:grid-cols-[max-content_1fr] lg:gap-x-24 [@media(min-width:80.0625rem)]:gap-x-76">
          <p className="text-base leading-none font-normal tracking-normal text-gray-7 uppercase">
            Enterprise features included
          </p>

          <ul className="mt-6 flex max-w-176 flex-wrap items-center gap-3 lg:mt-0">
            {enterpriseFeatures.map(({ title, icon }) => (
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
                <span className="text-[0.9375rem] leading-tight font-normal tracking-tighter whitespace-nowrap text-white md:text-base">
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
