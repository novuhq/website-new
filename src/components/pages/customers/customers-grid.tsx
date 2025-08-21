import Image from "next/image"
import { ROUTE } from "@/constants/routes"
import arrowRight from "@/svgs/icons/arrow-right.svg"
import bgLg from "@/svgs/pages/customers/customers-grid/background-lg.svg"
import bgMd from "@/svgs/pages/customers/customers-grid/background-md.svg"
import bgMob from "@/svgs/pages/customers/customers-grid/background-mob.svg"
import bg from "@/svgs/pages/customers/customers-grid/background.svg"
import clsx from "clsx"

import { TCustomerCard } from "@/types/customers"
import { Link } from "@/components/ui/link"

function ListBackground() {
  return (
    <>
      <Image
        src={bg}
        alt=""
        width={1485}
        height={485}
        className="pointer-events-none absolute top-1/2 left-1/2 hidden max-w-none -translate-1/2 xl:flex xl:h-[485px] xl:w-[1485px]"
        quality={90}
        loading="lazy"
      />
      <Image
        src={bgLg}
        alt=""
        width={930}
        height={455}
        className="pointer-events-none absolute top-1/2 left-1/2 hidden max-w-none -translate-1/2 lg:flex lg:h-[486px] lg:w-[1011px] xl:hidden"
        quality={90}
        loading="lazy"
      />
      <Image
        src={bgMd}
        alt=""
        width={788}
        height={486}
        className="pointer-events-none absolute top-1/2 left-1/2 hidden h-[486px] w-[788px] max-w-none -translate-1/2 md:flex lg:hidden"
        quality={90}
        loading="lazy"
      />
      <Image
        src={bgMob}
        alt=""
        width={360}
        height={607}
        className="pointer-events-none absolute top-1/2 left-1/2 flex h-[607px] w-[360px] max-w-none -translate-1/2 md:hidden"
        quality={90}
        loading="lazy"
      />
      {/* <span className="absolute bottom-16 left-0 flex h-51 w-47 rotate-14 rounded-[100%] bg-[radial-gradient(50%_50%_at_50%_50%,_#4474F2_0%,_rgba(68,116,242,0)_100%)] opacity-5 md:top-25 md:left-15 md:h-65 md:w-69 md:opacity-8 lg:top-12 lg:left-20 lg:h-94 lg:w-94 2xl:top-12 2xl:left-21 2xl:h-93 2xl:w-123" />
      <span className="absolute top-1/2 left-1/2 flex h-[90%] w-full -translate-1/2 rounded-[100%] bg-[linear-gradient(163deg,#F575CA_19.98%,#7599F5_77.19%)] opacity-2 blur-[32px] md:top-12 md:left-8 md:h-89 md:w-165 md:translate-0 md:bg-[linear-gradient(253deg,_#F575CA_19.98%,_#7599F5_77.19%)] md:opacity-5 md:blur-[25px] lg:top-8 lg:left-6 lg:h-89 lg:w-227 2xl:top-11 2xl:-left-35 2xl:h-89 2xl:w-371" />
      <span className="absolute top-1/2 left-1/2 flex h-[90%] w-full -translate-1/2 rounded-[100%] bg-[linear-gradient(133deg,#F575CA_19.6%,#7599F5_80.06%)] opacity-3 blur-[22px] md:top-26 md:left-9 md:h-74 md:w-149 md:translate-0 md:rotate-[7deg] md:bg-[linear-gradient(186deg,_#F575CA_19.6%,_#7599F5_80.06%)] md:opacity-4 lg:top-25 lg:left-9 lg:h-74 lg:w-226 2xl:left-25 2xl:h-74 2xl:w-274" />
      <span className="absolute top-1/2 left-1/2 flex h-[90%] w-full -translate-1/2 rounded-[100%] mix-blend-plus-lighter blur-[25px] md:top-21 md:left-10 md:h-74 md:w-157 md:translate-0 md:rotate-[-13deg] md:bg-[linear-gradient(348deg,rgba(245,117,202,0.30)_0%,rgba(117,153,245,0.40)_100%)] md:opacity-5 lg:top-16 lg:left-18 lg:h-74 lg:w-173 2xl:top-16 2xl:left-42" /> */}
    </>
  )
}

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
    "hidden md:flex": !isVisibleOnMobile, // last 4 elements hidden on mobile
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
          className="h-6 w-30 transition-transform duration-200 group-hover:-translate-y-2 md:h-8 md:w-[140px] lg:h-10 lg:w-[190px]"
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
    <section className="trusted relative mt-[104px] md:mt-28 lg:mt-40">
      <div className="relative mx-auto flex w-full flex-col items-center px-5 text-center md:max-w-[704px] md:px-0 lg:max-w-[960px] 2xl:max-w-[1216px]">
        <h2 className="gap-y-4 text-center text-[28px] leading-[1.125] font-medium tracking-tighter text-foreground md:text-[32px] lg:text-[40px] 2xl:text-[44px]">
          Trusted by companies worldwide
        </h2>
        <ul className="relative mt-14 grid w-full flex-grow list-none grid-cols-2 md:grid-cols-4">
          <ListBackground />
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
