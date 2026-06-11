import type { ReactNode } from "react"
import Image, { type StaticImageData } from "next/image"
import deploymentImage from "@/images/pages/book-a-demo-connect/enterprise/deployment.jpg"
import deploymentMobileImage from "@/images/pages/book-a-demo-connect/enterprise/deployment-mobile-min.png"
import governanceImage from "@/images/pages/book-a-demo-connect/enterprise/governance.jpg"
import governanceMobileImage from "@/images/pages/book-a-demo-connect/enterprise/governance-mobile-min.png"
import oversightImage from "@/images/pages/book-a-demo-connect/enterprise/oversight.jpg"
import oversightMobileImage from "@/images/pages/book-a-demo-connect/enterprise/oversight-mobile-min.png"
import reliabilityImage from "@/images/pages/book-a-demo-connect/enterprise/reliability.jpg"
import reliabilityMobileImage from "@/images/pages/book-a-demo-connect/enterprise/reliability-mobile-min.png"

import { cn } from "@/lib/utils"
import BookADemoSchedulingButton from "@/components/pages/book-a-demo/scheduling-button"

interface IEnterpriseCard {
  title: string
  description: ReactNode
  image: StaticImageData
  mobileImage: StaticImageData
  imageSize: "wide" | "narrow"
  className: string
  descriptionClassName?: string
}

const ENTERPRISE_CARDS: IEnterpriseCard[] = [
  {
    title: "Governance & Access",
    description: (
      <>
        Control who can create, deploy, and manage
        <span className="2xl:hidden"> </span>
        <br className="hidden 2xl:block" aria-hidden />
        customer-facing agents across your organization.
      </>
    ),
    image: governanceImage,
    mobileImage: governanceMobileImage,
    imageSize: "wide",
    className:
      "md:col-span-7 lg:top-0 lg:left-0 lg:aspect-[639/434] lg:w-[52.64%]",
    descriptionClassName: "max-w-120.25",
  },
  {
    title: "Production Reliability",
    description: (
      <>
        Monitor agent status, delivery health, and communication
        <span className="2xl:hidden"> </span>
        <br className="hidden 2xl:block" aria-hidden />
        workflows before they impact customers.
      </>
    ),
    image: reliabilityImage,
    mobileImage: reliabilityMobileImage,
    imageSize: "narrow",
    className:
      "md:col-span-6 lg:top-0 lg:left-[55.11%] lg:aspect-[545/434] lg:w-[44.89%]",
    descriptionClassName: "max-w-107",
  },
  {
    title: "Human Oversight",
    description: (
      <>
        Route sensitive, failed, or high-value interactions
        <span className="2xl:hidden"> </span>
        <br className="hidden 2xl:block" aria-hidden />
        to the right team with context preserved.
      </>
    ),
    image: oversightImage,
    mobileImage: oversightMobileImage,
    imageSize: "narrow",
    className:
      "md:col-span-6 lg:top-[51.67%] lg:left-0 lg:aspect-[545/434] lg:w-[44.89%]",
    descriptionClassName: "max-w-107",
  },
  {
    title: "Deployment Flexibility",
    description: (
      <>
        Run agent communication infrastructure in the setup
        <span className="2xl:hidden"> </span>
        <br className="hidden 2xl:block" aria-hidden />
        that fits your security and scale requirements.
      </>
    ),
    image: deploymentImage,
    mobileImage: deploymentMobileImage,
    imageSize: "wide",
    className:
      "md:col-span-7 lg:top-[51.67%] lg:left-[47.36%] lg:aspect-[639/434] lg:w-[52.64%]",
    descriptionClassName: "max-w-143.75",
  },
]

function EnterpriseCard({
  title,
  description,
  image,
  mobileImage,
  imageSize,
  descriptionClassName,
}: Omit<IEnterpriseCard, "className">) {
  const cardAspectClass =
    imageSize === "wide" ? "sm:aspect-[639/434]" : "sm:aspect-[545/434]"
  const imageSizes =
    imageSize === "wide"
      ? "(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) 58vw, (max-width: 1279px) 53vw, 639px"
      : "(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) 42vw, (max-width: 1279px) 45vw, 545px"

  return (
    <article
      className={cn(
        "relative isolate w-full max-h-112 overflow-hidden rounded-[16px] bg-background sm:max-h-none md:h-full lg:aspect-auto lg:h-full",
        "aspect-[640/560]",
        cardAspectClass
      )}
    >
      <Image
        className="absolute inset-0 z-0 hidden size-full object-cover object-left-top sm:block"
        src={image}
        alt=""
        sizes={imageSizes}
        quality={95}
        loading="lazy"
      />
      <Image
        className="absolute inset-0 z-0 size-full object-cover object-left-top sm:hidden"
        src={mobileImage}
        alt=""
        sizes="(max-width: 639px) calc(100vw - 40px), 0px"
        quality={95}
        loading="lazy"
      />

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent via-background/10 to-background/55 lg:via-transparent lg:to-background/20" />
      <div className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] border border-white mix-blend-overlay" />

      <div className="absolute right-5 bottom-5 left-5 z-30 flex flex-col gap-1.5 sm:right-6 sm:bottom-6 sm:left-6 md:right-5 md:bottom-5 md:left-5 lg:right-7.75 lg:bottom-7.75 lg:left-7.75 lg:gap-2.5">
        <h3 className="text-base leading-[1.125] font-medium tracking-[-0.02em] text-white min-[31.25rem]:text-xl sm:text-2xl sm:tracking-tighter md:text-base md:leading-[1.125] lg:text-xl lg:leading-[1.125]">
          {title}
        </h3>
        <p
          className={cn(
            "text-sm leading-[1.375] font-book tracking-[-0.02em] text-gray-8 min-[31.25rem]:text-base sm:text-base sm:tracking-tighter md:text-[0.6875rem] md:leading-[1.25] lg:text-[0.9375rem] lg:leading-[1.375]",
            descriptionClassName
          )}
        >
          {description}
        </p>
      </div>
    </article>
  )
}

function BookADemoConnectEnterprise() {
  return (
    <section className="relative overflow-hidden bg-black py-20 md:py-30 xl:pt-58 xl:pb-0">
      <div className="mx-auto flex w-full max-w-304 flex-col items-center px-5 md:px-8 2xl:px-0">
        <div className="mx-auto flex w-full max-w-184 flex-col items-center gap-10 text-center">
          <div className="flex w-full flex-col items-center gap-4">
            <h2 className="text-[2rem] leading-[1.125] font-medium tracking-tighter text-balance text-white md:text-[2.5rem] xl:text-5xl">
              Built for enterprise
              <br className="hidden sm:block" aria-hidden />
              <span className="sm:hidden"> </span>
              agent communication
            </h2>
            <p className="max-w-143 text-base leading-normal font-book tracking-tighter text-pretty text-gray-8 md:text-lg md:leading-normal">
              Move agents from internal experiments to customer-facing systems
              with the controls, reliability, and visibility enterprise teams
              require.
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center sm:gap-6">
            <BookADemoSchedulingButton
              variant="default"
              size="lg"
              className="w-full px-5 sm:w-auto"
              clickLocation="book_a_demo_connect_enterprise"
              clickText="book_a_demo"
              source="book_a_demo_connect"
            >
              Book a demo
            </BookADemoSchedulingButton>
            <BookADemoSchedulingButton
              variant="outline"
              size="lg"
              className="w-full overflow-visible sm:w-auto sm:min-w-33"
              clickLocation="book_a_demo_connect_enterprise"
              clickText="book_a_call"
              source="book_a_demo_connect"
            >
              Book a Call
            </BookADemoSchedulingButton>
          </div>
        </div>

        <ul className="mt-14 grid w-full grid-cols-1 gap-6 md:mt-18 md:grid-cols-[repeat(13,minmax(0,1fr))] lg:relative lg:aspect-[1214/898] lg:max-w-303.5 lg:grid-cols-none lg:gap-0">
          {ENTERPRISE_CARDS.map((card) => (
            <li
              key={card.title}
              className={cn(
                "w-full overflow-hidden rounded-[16px] lg:absolute lg:h-auto",
                card.className
              )}
            >
              <EnterpriseCard {...card} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default BookADemoConnectEnterprise
