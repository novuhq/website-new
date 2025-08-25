import Image from "next/image"
import { ROUTE } from "@/constants/routes"
import arrowRight from "@/svgs/icons/arrow-right.svg"
import bgLg from "@/svgs/pages/customers/customers-grid/background-lg.svg"
import bgMd from "@/svgs/pages/customers/customers-grid/background-md.svg"
import bgMob from "@/svgs/pages/customers/customers-grid/background-mob.svg"
import bg from "@/svgs/pages/customers/customers-grid/background.svg"
import clsx from "clsx"

import { TCustomerCard } from "@/types/customers"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"

const BACKGROUND_BREAKPOINTS = [
  {
    width: 360,
    height: 607,
    src: bgMob,
    className: "md:hidden h-[607px] w-[360px] max-w-none",
  },
  {
    width: 765,
    height: 440,
    src: bgMd,
    className: "hidden md:flex lg:hidden max-w-none",
  },
  {
    width: 953,
    height: 456,
    src: bgLg,
    className: "hidden lg:flex xl:hidden",
  },
  {
    width: 1513,
    height: 485,
    src: bg,
    className: "hidden xl:flex max-w-none",
  },
]

function CustomerCard({
  link,
  slug,
  logo: {
    asset: { url: logo },
  },
  name,
  customersLength,
  index,
}: TCustomerCard & { index: number; customersLength: number }) {
  const visibleOnMobile = customersLength - 4
  const isVisibleOnMobile = index < visibleOnMobile

  const cardClassName = clsx("border-[#534B5D] border-r", {
    "hidden md:block": !isVisibleOnMobile, // last 4 elements hidden on mobile
    "border-b": isVisibleOnMobile && index < visibleOnMobile - 2, // mobile: last 2 elements in the last row
    "md:border-b": index < customersLength - 4, // tablet+: last 4 elements без нижнего бордера
    "border-r-0": isVisibleOnMobile && (index + 1) % 2 === 0, // mobile: last element in every row
    "md:border-r-0": index === customersLength - 1,
    "md:border-r": (index + 1) % 4 !== 0, // tablet+: last element in every row
  })

  return (
    <li className={cardClassName}>
      <article
        key={index}
        className="group relative flex h-35 flex-col items-center justify-center transition-all duration-200 md:h-40"
      >
        <Link
          href={
            link.type === "external"
              ? link.url!
              : `${ROUTE.customers}/${slug.current}`
          }
          className="absolute top-0 left-0 z-10 h-full w-full"
        />
        <Image
          src={logo}
          alt={name}
          width={120}
          height={24}
          className="h-6 w-30 transition-transform duration-200 select-none group-hover:-translate-y-2 sm:h-8 sm:w-[140px] lg:h-10 lg:w-[190px]"
          loading="lazy"
        />
        <span className="hidden-start absolute bottom-8 flex items-center gap-x-[7px] text-white opacity-0 transition-all duration-200 group-hover:opacity-100">
          {link.type === "story" ? "Read story" : "Visit site"}
          <Image
            src={arrowRight}
            width={12}
            height={8}
            alt=""
            className="h-2 w-3"
            loading="lazy"
          />
        </span>
      </article>
    </li>
  )
}

export default function CustomersGrid({
  customers,
}: {
  customers: { customer: TCustomerCard }[]
}) {
  return (
    <section className="trusted relative mt-[104px] [overflow-x:clip] md:mt-28 lg:mt-40">
      <div className="relative mx-auto flex w-full flex-col items-center px-5 text-center md:max-w-[704px] md:px-0 lg:max-w-[960px] 2xl:max-w-[1216px]">
        <h2 className="gap-y-4 text-center text-[28px] leading-[1.125] font-medium tracking-tighter text-foreground md:text-[32px] lg:text-[40px] 2xl:text-[44px]">
          Trusted by companies worldwide
        </h2>
        <ul className="relative mt-14 grid w-full flex-grow list-none grid-cols-2 md:grid-cols-4">
          {BACKGROUND_BREAKPOINTS.map(
            ({ width, height, src, className }, index) => (
              <Image
                key={index}
                className={cn(
                  "pointer-events-none absolute top-1/2 left-1/2 -translate-1/2 select-none",
                  className
                )}
                src={src}
                alt=""
                width={width}
                height={height}
                quality={90}
                loading="lazy"
                aria-hidden
              />
            )
          )}
          {customers.map(({ customer }, index: number) => (
            <CustomerCard
              {...customer}
              index={index}
              key={index}
              customersLength={customers.length}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
