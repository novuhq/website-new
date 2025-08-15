import Image from "next/image"
import { ROUTE } from "@/constants/routes"
//First Left Card
import dotsBg from "@/images/pages/customers/hero/dot-surface.png"
import chevronRight from "@/svgs/icons/chevron-right.svg"
import shineBg from "@/svgs/pages/customers/hero/shine.svg"
import clsx from "clsx"

import { Link } from "@/components/ui/link"

function CustomerCard({
  logo,
  name,
  card_type: cardType,
  title,
  author,
  author_position,
  index,
  link_type: linkType,
  external_link: externalLink,
  slug,
}: any) {
  const cardClassName = clsx(
    "overflow-hidden group cursor-pointer flex flex-col flex-grow p-6 md:p-7 rounded-xl w-full relative items-start border border-[rgba(236,209,250,0.1)] hover:border-[rgba(236,209,250,1)] transition-colors duration-200",
    {
      "xl:max-w-[590px] lg:max-w-[576px] h-[320px] md:pr-[14px] xl:pr-7":
        cardType === "big",
      "lg:max-w-[347px] bg-[#14141F] h-[320px] md:max-w-[338px]":
        cardType === "small",
      "bg-[linear-gradient(147deg,#1C0F1F_0.51%,#141221_58.61%,#14141F_83.55%)]":
        index === 0,
      "bg-[linear-gradient(152deg,#0B1122_0.45%,#10101E_69.9%,#14141F_103.83%)]":
        index === 3,
    }
  )

  return (
    <article className={cardClassName}>
      <Link
        href={
          linkType === "external"
            ? externalLink
            : `${ROUTE.customers}/${slug.current}`
        }
        className="group absolute top-0 left-0 z-10 h-full w-full"
      />
      {(index === 0 || index === 3) && (
        <>
          <Image
            src={shineBg}
            alt=""
            width={265}
            height={77}
            priority
            className="absolute -top-[10px] -left-[30px] h-[77px] w-[265px]"
            quality={100}
          />
          <Image
            src={dotsBg}
            alt=""
            width={590}
            height={320}
            priority
            className="absolute top-2 left-0 h-full w-full"
            quality={100}
          />
        </>
      )}
      {index === 0 && (
        <>
          <span className="absolute -top-[200px] right-0 flex h-[364px] w-[821px] rotate-[-30deg] opacity-[0.15] [mix-blend-mode:plus-lighter] [background:radial-gradient(50%_50%_at_50%_50%,_#B75BC9_0%,_rgba(183,91,201,0)_100%)]" />
          <span className="absolute -top-[120px] -left-[100px] flex h-[288px] w-[452px] [mix-blend-mode:overlay] [background:radial-gradient(50%_50%_at_50%_50%,_#D881AC_0%,_rgba(219,173,196,0)_100%)]" />
          <span className="absolute -top-[50px] -left-[60px] flex h-[127px] w-[273px] flex-shrink-0 rotate-[-20deg] bg-[#FFEDFA] opacity-15 [mix-blend-mode:plus-lighter] blur-[32px]" />
        </>
      )}
      {index === 3 && (
        <>
          <span className="absolute -top-[220px] right-2 flex h-[430px] w-[805px] rotate-[-168.888deg] bg-[radial-gradient(50%_50%_at_50%_50%,_#5370C6_0%,_rgba(83,_112,_198,_0)_100%)] opacity-25 mix-blend-plus-lighter blur-[32px]" />
          <span className="absolute right-[214px] bottom-[113px] flex h-[307px] w-[468px] [mix-blend-mode:overlay] [background:radial-gradient(50.06%_50.01%_at_54.2%_50%,#ACB8DC_0%,rgba(172,184,220,0)_100%)]" />
          <span className="absolute -top-[40px] left-0 flex h-[72px] w-[221px] fill-[#C2D1FF] opacity-[0.17] [mix-blend-mode:plus-lighter] blur-[32px]" />
          <span className="absolute -top-10 -left-20 flex h-[127px] w-[273px] bg-[#E6ECFF] opacity-[0.1] [mix-blend-mode:plus-lighter] blur-[32px]" />
        </>
      )}
      <Image
        className="relative"
        src={logo.asset.url}
        alt={name}
        width={logo.asset.metadata?.dimensions?.width || 180}
        height={logo.asset.metadata?.dimensions?.height || 40}
        priority
      />
      <h3 className="relative mt-auto text-xl leading-snug font-normal tracking-tighter md:max-w-[530px] md:text-2xl">
        {title}
      </h3>
      <p className="relative mt-2 text-sm leading-snug font-[350] tracking-tight text-gray-8 md:text-base">{`${author} — ${author_position}`}</p>
      {linkType === "story" && (
        <span className="hidden-start relative mt-4 flex items-center gap-x-1.5 text-lagune-3 transition-colors duration-200 group-hover:text-lagune-2">
          Read story
          <span className="relative mt-0.5 w-1 shrink-0 overflow-hidden transition-[width] duration-200 group-hover:w-3">
            <Image
              src={chevronRight}
              width={4}
              height={8}
              alt=""
              className="ml-auto h-2 w-1"
            />
            <span className="absolute top-1/2 right-px h-px w-full -translate-y-1/2 bg-lagune-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </span>
        </span>
      )}
    </article>
  )
}

function Hero({ customers }: { customers: any[] }) {
  return (
    <section className="hero relative pt-12.5 md:pt-16 lg:pt-18.5 xl:pt-22.5">
      <div className="relative mx-auto flex w-full flex-col items-center px-5 md:max-w-[704px] md:px-0 lg:max-w-[960px] xl:max-w-[969px] xl:px-0">
        <div className="flex flex-col items-center gap-y-4 xl:px-[130px]">
          <h1 className="gap-y-4 text-center text-[32px] leading-[1.125] font-medium tracking-tighter text-balance text-foreground md:text-[44px] lg:text-5xl xl:text-[52px]">
            The notification infrastructure behind the fastest teams
          </h1>
          <p className="text-center text-base leading-normal font-[350] tracking-tighter text-pretty text-muted-foreground md:text-lg lg:max-w-[640px]">
            Discover how engineering teams use Novu to ship faster and simplify
            their communication workflows.
          </p>
        </div>

        <div className="relative mt-10 flex w-full flex-row flex-wrap gap-4 md:mt-12 md:gap-7 lg:mt-14 lg:gap-8 xl:mt-16">
          <span className="absolute -top-[100px] -left-[160px] flex h-[300px] w-[520px] shrink-0 rounded-[537px] opacity-[0.05] [filter:blur(32px)] [background:radial-gradient(130.45%_66.34%_at_74.29%_61.64%,_#FFB7E2_27.2%,_#FF96FB_67.79%,_#F047FF_88.46%,_rgba(240,71,255,0)_99.52%)]" />
          <span className="absolute top-[50%] left-[20%] flex h-[580px] w-[430px] shrink-0 -rotate-[86.94deg] opacity-20 [background:radial-gradient(50%_50%_at_50%_50%,_#A1B6F8_0%,_rgba(183,201,255,0)_100%)] lg:top-[100px] lg:left-[280px]" />
          {customers.map(({ customer }, index) => (
            <CustomerCard key={customer._id} {...customer} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
