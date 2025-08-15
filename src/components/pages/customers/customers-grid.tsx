import Image from "next/image"
import { ROUTE } from "@/constants/routes"
import arrowRight from "@/svgs/icons/arrow-right.svg"
import clsx from "clsx"

import { Link } from "@/components/ui/link"

function ListBackground() {
  return (
    <>
      <span className="absolute top-0 left-0 flex h-[374px] w-[491px] rotate-[14.23deg] opacity-8 [background:radial-gradient(50%_50%_at_50%_50%,#4474F2_0%,rgba(68,116,242,0)_100%)]" />
      <span className="absolute top-1/2 left-1/2 flex h-[260px] w-full -translate-x-1/2 -translate-y-1/2 rounded-[491.581px] bg-[linear-gradient(73deg,#F575CA_19.98%,#7599F5_77.19%)] opacity-[0.05] blur-[25px]"></span>
      <span className="absolute top-1/2 left-1/2 flex h-[296px] w-full -translate-x-1/2 -translate-y-1/2 rotate-[10deg] rounded-[1096.633px] bg-[linear-gradient(43deg,#F575CA_19.6%,#7599F5_80.06%)] opacity-[0.04] blur-[22.5px]"></span>
      <span className="absolute top-16 left-0 flex h-[298px] w-[692px] rotate-[-15deg] rounded-[692.826px] bg-[linear-gradient(257deg,rgba(245,117,202,0.3)_0%,rgba(117,153,245,0.4)_100%)] opacity-[0.05] mix-blend-plus-lighter blur-[25px] lg:left-[150px]"></span>
    </>
  )
}

function CustomerCard({
  link_type: linkType,
  external_link: externalLink,
  slug,
  logo: {
    asset: { url: logo },
  },
  name,
  customersLength,
  index,
}: any) {
  const cardClassName = clsx("border-[#534B5D] border-r", {
    "border-b": index < customersLength - 2, // mobile: last 2 elements in the last row
    "md:border-b-0": index >= 4 * 2, // tablet+: last 4 elements in the last row
    "border-r-0": (index + 1) % 2 === 0, // mobile: last element in every row
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
            linkType === "external"
              ? externalLink
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
          priority
        />
        <span className="hidden-start absolute bottom-8 flex items-center gap-x-[7px] text-white opacity-0 transition-all duration-200 group-hover:opacity-100">
          {linkType === "story" ? "Read story" : "Visit site"}
          <Image
            src={arrowRight}
            width={12}
            height={8}
            alt=""
            className="h-2 w-3"
          />
        </span>
      </article>
    </li>
  )
}

export default function CustomersGrid({ customers }: any) {
  return (
    <section className="trusted relative mt-[104px] md:mt-28 lg:mt-40">
      <div className="relative mx-auto flex w-full flex-col items-center px-5 text-center md:max-w-[704px] md:px-0 lg:max-w-[960px] xl:max-w-[1216px]">
        <h2 className="gap-y-4 text-center text-[28px] leading-[1.125] font-medium tracking-tighter text-foreground md:text-[32px] lg:text-[40px] xl:text-[44px]">
          Trusted by companies worldwide
        </h2>
        <ul className="relative mt-14 grid w-full flex-grow list-none grid-cols-2 md:grid-cols-4">
          <ListBackground />
          {customers.map(({ customer }: any, index: number) => (
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
