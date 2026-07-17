import Image from "next/image"
import NextLink from "next/link"
import gdprCertification from "@/images/pages/home/certifications/gdpr.svg"
import hipaaCertification from "@/images/pages/home/certifications/hipaa.svg"
import isoCertification from "@/images/pages/home/certifications/iso-27001.svg"
import socCertification from "@/images/pages/home/certifications/soc-2-type-2.svg"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface IComplianceItem {
  question: string
  answer: string
}

interface IComplianceProps {
  className?: string
  title: string
  description: string
  items: IComplianceItem[]
}

const certifications = [
  {
    name: "SOC 2 Type II certification",
    image: socCertification,
  },
  {
    name: "ISO 27001 certification",
    image: isoCertification,
  },
  {
    name: "GDPR compliance",
    image: gdprCertification,
  },
  {
    name: "HIPAA compliance",
    image: hipaaCertification,
  },
]

function Compliance({
  className,
  title,
  description,
  items,
}: IComplianceProps) {
  return (
    <section
      className={cn(
        "compliance mt-24 font-inter md:mt-28 lg:mt-32 xl:mt-55",
        className
      )}
      aria-labelledby="enterprise-heading"
    >
      <div className="mx-auto grid w-full max-w-3xl gap-16 px-5 md:px-8 lg:max-w-288 lg:grid-cols-[minmax(0,34rem)_minmax(0,28rem)] lg:gap-24">
        <div className="flex flex-col gap-y-12 lg:justify-between">
          <div className="flex max-w-136 flex-col items-start">
            <header>
              <h2
                id="enterprise-heading"
                className="text-[2.5rem] leading-[1.125] font-normal tracking-plus-tight text-balance text-foreground md:text-5xl md:leading-[1.125] xl:max-w-136 xl:text-[3.5rem]"
              >
                {title}
              </h2>
              <p className="mt-4 max-w-xl text-base font-normal tracking-tighter text-gray-60 md:text-lg md:leading-normal lg:max-w-121 xl:text-xl xl:leading-normal">
                {description}
              </p>
            </header>

            <Button
              className="mt-8 h-12 rounded-md px-6 text-sm leading-none font-semibold tracking-normal uppercase"
              size="none"
              asChild
            >
              <NextLink href="/book-a-demo-connect/">Book a call</NextLink>
            </Button>
          </div>

          <ul
            className="mt-auto flex w-full items-center gap-x-10"
            aria-label="Compliance certifications"
          >
            {certifications.map(({ name, image }) => (
              <li className="min-w-0" key={name}>
                <Image className="h-20 w-auto" src={image} alt={name} />
              </li>
            ))}
          </ul>
        </div>

        <dl className="w-full lg:pt-5">
          {items.map((item) => (
            <div
              key={item.question}
              className="border-b border-gray-20 py-6 first:pt-0 lg:py-10"
            >
              <dt className="text-xl leading-none font-medium tracking-tighter text-foreground md:text-2xl">
                {item.question}
              </dt>
              <dd className="mt-2.5 text-base leading-6 font-normal tracking-tighter text-gray-50 md:text-lg md:leading-[1.5]">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default Compliance
