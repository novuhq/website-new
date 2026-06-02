import Image, { type StaticImageData } from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import accessImage from "@/images/pages/book-a-demo/built-for-enterprise/access.webp"
import deployImage from "@/images/pages/book-a-demo/built-for-enterprise/deploy.webp"
import openSourceImage from "@/images/pages/book-a-demo/built-for-enterprise/open-source.webp"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface IEnterpriseCard {
  title: string
  description: string
  image: StaticImageData
}

const ENTERPRISE_CARDS: IEnterpriseCard[] = [
  {
    title: "Security, compliance & governance",
    description:
      "Meet enterprise requirements with SSO, access controls, audit logs, compliance support, and governance features built for regulated teams.",
    image: accessImage,
  },
  {
    title: "Reliability & deployment control",
    description:
      "Monitor notification performance, scale critical communications, and choose the cloud, self-hosted, or hybrid architecture that fits your needs.",
    image: deployImage,
  },
  {
    title: "Open-source with support",
    description:
      "Get the transparency and flexibility of open source with dedicated support, onboarding, and assurances expected from an enterprise platform.",
    image: openSourceImage,
  },
]

function EnterpriseCard({
  title,
  description,
  image,
  className,
}: IEnterpriseCard & { className?: string }) {
  return (
    <article
      className={cn(
        "relative w-full max-w-102 overflow-hidden",
        className
      )}
    >
      <Image
        className="block h-auto w-full"
        src={image}
        alt=""
        loading="lazy"
        sizes="(max-width: 767px) calc(100vw - 64px), 408px"
      />

      <div className="absolute right-3 bottom-3 left-3 flex flex-col gap-1.5 min-[24.375rem]:right-4 min-[24.375rem]:bottom-4 min-[24.375rem]:left-4 min-[24.375rem]:gap-2 xs:right-5 xs:bottom-5 xs:left-5 xs:gap-2.5 md:right-6 md:bottom-6 md:left-6">
        <h3 className="text-base leading-dense font-medium tracking-tighter text-white min-[24.375rem]:text-lg xs:text-xl">
          {title}
        </h3>
        <p className="text-[0.8125rem] leading-snug font-book tracking-tighter text-gray-8 xs:text-[0.9375rem]">
          {description}
        </p>
      </div>
    </article>
  )
}

function BookADemoBuiltForEnterprise() {
  return (
    <section className="relative bg-background pb-20 md:pb-24 xl:pb-66">
      <div className="mx-auto w-full max-w-320">
        <div className="flex w-full flex-col items-start gap-8 px-5 md:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-167.25">
            <h2 className="text-[1.75rem] leading-dense font-medium tracking-tighter text-balance text-white md:text-[2.5rem] xl:text-[2.75rem]">
              Built for enterprise requirements
            </h2>
            <p className="mt-4 max-w-143 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-8 md:text-lg">
              Meet enterprise expectations for security, compliance,
              reliability, and support &mdash; without rebuilding notification
              infrastructure in-house.
            </p>
          </div>

          <Button
            variant="default"
            size="lg"
            className="h-12 px-5 text-sm"
            asChild
          >
            <NextLink
              href={ROUTE.bookMeeting}
              data-click-location="book_a_demo_built_for_enterprise"
              data-click-text="book_a_demo"
            >
              Book a demo
            </NextLink>
          </Button>
        </div>

        <div className="relative left-1/2 mt-14 w-screen -translate-x-1/2 xl:hidden">
          <ul className="enterprise-requirements-scroll flex snap-x snap-mandatory scroll-px-5 gap-7 overflow-x-auto px-5 md:scroll-px-8 md:px-8">
            {ENTERPRISE_CARDS.map((card) => (
              <li
                key={card.title}
                className="w-[calc(100vw-4rem)] max-w-102 shrink-0 snap-start last:snap-end md:w-102"
              >
                <EnterpriseCard {...card} />
              </li>
            ))}
          </ul>
        </div>

        <ul className="mt-14 hidden grid-cols-3 gap-7 xl:grid">
          {ENTERPRISE_CARDS.map(({ title, description, image }) => (
            <li key={title}>
              <EnterpriseCard
                title={title}
                description={description}
                image={image}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default BookADemoBuiltForEnterprise
