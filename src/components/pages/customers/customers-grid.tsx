import Image from "next/image"
import { ROUTE } from "@/constants/routes"
import arrowRight from "@/svgs/icons/arrow-right.svg"
import clsx from "clsx"

import { Link } from "@/components/ui/link"

function ListBackground() {
  return (
    <>
      <span className="absolute bottom-16 left-0 flex h-[203px] w-[188px] rotate-[14deg] rounded-[100%] bg-[radial-gradient(50%_50%_at_50%_50%,_#4474F2_0%,_rgba(68,116,242,0)_100%)] opacity-5 md:top-[100px] md:left-[60px] md:h-[260px] md:w-[275px] md:opacity-8 lg:top-[50px] lg:left-20 lg:h-[375px] lg:w-[375px] 2xl:top-[50px] 2xl:left-[85px] 2xl:h-[374px] 2xl:w-[491px]" />
      <span className="absolute top-1/2 left-1/2 flex h-[90%] w-full -translate-1/2 rounded-[100%] bg-[linear-gradient(163deg,#F575CA_19.98%,#7599F5_77.19%)] opacity-2 blur-[32px] md:top-[50px] md:left-[32px] md:h-[358px] md:w-[660px] md:translate-0 md:bg-[linear-gradient(253deg,_#F575CA_19.98%,_#7599F5_77.19%)] md:opacity-5 md:blur-[25px] lg:top-[34px] lg:left-6 lg:h-[358px] lg:w-[910px] 2xl:top-[42px] 2xl:-left-[140px] 2xl:h-[358px] 2xl:w-[1485px]" />
      <span className="absolute top-1/2 left-1/2 flex h-[90%] w-full -translate-1/2 rounded-[100%] bg-[linear-gradient(133deg,#F575CA_19.6%,#7599F5_80.06%)] opacity-3 blur-[22.5px] md:top-[105px] md:left-[38px] md:h-[296px] md:w-[597px] md:translate-0 md:rotate-[7deg] md:bg-[linear-gradient(186deg,_#F575CA_19.6%,_#7599F5_80.06%)] md:opacity-4 lg:top-[100px] lg:left-[35px] lg:h-[296px] lg:w-[903px] 2xl:top-[100px] 2xl:left-[100px] 2xl:h-[296px] 2xl:w-[1096px]" />
      <span className="absolute top-1/2 left-1/2 flex h-[90%] w-full -translate-1/2 rounded-[100%] mix-blend-plus-lighter blur-[25px] md:top-[85px] md:left-10 md:h-[298px] md:w-[629px] md:translate-0 md:rotate-[-13deg] md:bg-[linear-gradient(348deg,rgba(245,117,202,0.30)_0%,rgba(117,153,245,0.40)_100%)] md:opacity-5 lg:top-[66px] lg:left-[74px] lg:h-[298px] lg:w-[692px] 2xl:top-[65px] 2xl:left-[170px]" />
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
      <div className="relative mx-auto flex w-full flex-col items-center px-5 text-center md:max-w-[704px] md:px-0 lg:max-w-[960px] 2xl:max-w-[1216px]">
        <h2 className="gap-y-4 text-center text-[28px] leading-[1.125] font-medium tracking-tighter text-foreground md:text-[32px] lg:text-[40px] 2xl:text-[44px]">
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
