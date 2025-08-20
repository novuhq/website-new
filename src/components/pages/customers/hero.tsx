import Image from "next/image"
import { ROUTE } from "@/constants/routes"
import blueBgMob from "@/images/pages/customers/hero/blue-bg-mob.png"
import blueBg from "@/images/pages/customers/hero/blue-bg.png"
import purpleBgMob from "@/images/pages/customers/hero/purple-bg-mob.png"
import purpleBg from "@/images/pages/customers/hero/purple-bg.png"
import chevronRight from "@/svgs/icons/chevron-right.svg"

import { TCustomerCard } from "@/types/customers"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"

type CardConfig = {
  showShine: boolean
  background?: "purple" | "blue"
  backgroundAlt?: string
  glowClassName?: string
}

const BACKGROUNDS = {
  purple: {
    desk: purpleBg,
    mob: purpleBgMob,
  },
  blue: {
    desk: blueBg,
    mob: blueBgMob,
  },
}

const CARD_CONFIG: Record<number, CardConfig> = {
  0: {
    showShine: true,
    background: "purple",
    backgroundAlt: "Purple background",
  },
  1: {
    showShine: false,
    glowClassName:
      "rotate-[-56deg] lg:bg-[#344387] lg:opacity-30 blur-[32px] lg:-bottom-25 lg:-left-9 lg:h-47 lg:w-42 md:w-130 md:h-62 md:-bottom-14 md:-left-22 md:opacity-60 md:rotate-0 md:bg-[radial-gradient(50%_50%_at_50%_50%,_#344387_0%,_rgba(52,67,135,0)_100%)]",
  },
  2: {
    showShine: false,
    glowClassName:
      "h-62 w-72 opacity-75 lg:rotate-[36deg] bg-[radial-gradient(50%_50%_at_50%_50%,_#344387_0%,_rgba(52,67,135,0)_100%)] -left-22 -bottom-19 rounded-[100%] lg:bg-[linear-gradient(180deg,#344387_0%,rgba(52,67,135,0)_100%)] lg:opacity-70 blur-[32px] lg:-top-21 lg:left-45 lg:h-62 lg:w-72 md:h-47 md:w-42 md:-rotate-[56deg] md:bg-[#344387] md:opacity-30 md:-left-17 md:-bottom-24",
  },
  3: {
    showShine: true,
    background: "blue",
    backgroundAlt: "Blue background",
  },
}

function ContainerEffects() {
  return (
    <>
      <span className="absolute -top-10 -left-[30px] flex h-70 w-95 rounded-[100%] bg-[linear-gradient(171deg,_#F575E0_21.93%,_rgba(117,153,245,0.70)_84.89%)] opacity-[0.01] blur-[14px] md:-top-14 md:-left-43 md:h-79 md:w-255 md:bg-[linear-gradient(81deg,#F575E0_21.93%,rgba(117,153,245,0.70)_84.89%)] md:opacity-2 md:blur-[32px] lg:-top-31 lg:-left-63 lg:h-101 lg:w-368" />
      <span className="absolute -top-8 -left-20 hidden h-83 w-212 rounded-[100%] bg-[linear-gradient(81deg,#F575E0_21.93%,#7599F5_84.89%)] opacity-4 blur-[32px] md:flex lg:-top-20 lg:-left-21 lg:h-83 lg:w-284" />
      <span className="absolute -top-16 -left-23 flex h-45 w-53 rounded-[100%] bg-[radial-gradient(130.45%_66.34%_at_74.29%_61.64%,_#FFB7E2_27.2%,_#FF96FB_80.5%,_#F047FF_100%)] opacity-13 blur-[32px] md:-top-30 md:-left-25 md:h-80 md:w-96 md:bg-[radial-gradient(130.45%_66.34%_at_74.29%_61.64%,#FFB7E2_27.2%,#FF96FB_67.79%,#F047FF_88.46%,rgba(240,71,255,0)_99.52%)] md:opacity-5 xl:-top-42 xl:-left-44 xl:h-102 xl:w-134" />
      <span className="absolute bottom-25 -left-15 flex h-95 w-92 rounded-[100%] bg-[radial-gradient(130.45%_66.34%_at_74.29%_61.64%,_#B7C9FF_27.2%,_#4775FF_80.5%,_#4775FF_100%)] opacity-8 blur-[32px] md:bottom-28 md:left-19 md:h-108 md:w-146 md:rotate-[5deg] md:bg-[radial-gradient(50%_50%_at_50%_50%,#A1B6F8_0%,rgba(183,201,255,0)_100%)] xl:bottom-10 xl:left-41 xl:opacity-20" />
    </>
  )
}

function CustomerCard({
  logo,
  name,
  card_type: cardType,
  title,
  author,
  author_position,
  index,
  link,
  slug,
}: TCustomerCard & { index: number }) {
  const config = CARD_CONFIG[index]

  const glowClasses = cn("absolute flex", config.glowClassName)

  const listItemClasses = cn(
    "relative group cursor-pointer rounded-xl w-full list-none",
    {
      "xl:max-w-[590px] lg:max-w-[576px] h-[350px] md:h-[320px] isolate":
        cardType === "big",
      "lg:max-w-[347px] bg-[#14141F] h-[320px] md:max-w-[338px] border border-[rgba(43,43,59,0.5)]":
        cardType === "small",
    }
  )

  const cardClasses = cn(
    "p-6 md:p-[27px] relative h-full w-full overflow-hidden flex flex-col flex-grow relative items-start rounded-xl",
    {
      "md:pr-[14px] xl:pr-7": cardType === "big",
    }
  )

  return (
    <li className={listItemClasses}>
      {config.showShine && (
        <>
          {/* <Image
            src={shineCorner}
            alt=""
            width={265}
            height={77}
            priority
            className="pointer-events-none absolute -top-[10px] -left-[10px]"
            quality={100}
          /> */}
          {/* <span className="absolute -top-0 left-0 z-10 flex h-[77px] w-[265px] rounded-tl-xl border-t border-[rgba(255,186,244,1)] mix-blend-plus-lighter blur-[2px]"></span>
          <span className="absolute -top-0 left-0 z-10 flex h-[28px] w-[217px] rounded-tl-xl border-t border-[rgba(255,186,244,1)] mix-blend-plus-lighter blur-[1px]"></span>
          <span className="absolute -top-0 left-0 z-10 flex h-[39px] w-[203px] rounded-tl-xl border-t border-[rgba(255,255,255,1)] mix-blend-plus-lighter blur-[2.5px]"></span>
          <span className="absolute -top-0 left-0 z-10 flex h-[39px] w-[204px] rounded-tl-xl border-t border-[rgba(255,255,255,1)] mix-blend-plus-lighter blur-[1.5px]"></span> */}
        </>
      )}
      <article className={cardClasses}>
        <Link
          href={
            link.type === "external"
              ? link.url!
              : `${ROUTE.customers}/${slug.current}`
          }
          className="group absolute top-0 left-0 z-10 h-full w-full"
        />

        {config.background && (
          <>
            <Image
              src={BACKGROUNDS[config.background].desk}
              alt={config.backgroundAlt || ""}
              width={590}
              height={320}
              priority
              className="pointer-events-none absolute top-0 left-0 hidden h-full w-full rounded-xl sm:block"
              quality={90}
            />
            <Image
              src={BACKGROUNDS[config.background].mob}
              alt={config.backgroundAlt || ""}
              width={320}
              height={350}
              priority
              className="pointer-events-none absolute top-0 left-0 h-full w-full rounded-xl sm:hidden"
              quality={90}
            />
          </>
        )}

        {config.glowClassName && <span className={glowClasses} />}

        <Image
          className="pointer-events-none relative"
          src={logo.asset.url}
          alt={name}
          width={logo.asset.metadata.dimensions.width || 180}
          height={logo.asset.metadata.dimensions.height || 40}
          priority
        />
        <h3 className="relative mt-auto text-xl leading-snug font-normal tracking-tighter md:max-w-[530px] md:text-2xl">
          “{title}”
        </h3>
        <p className="relative mt-2 text-sm leading-snug font-[350] tracking-tight text-gray-8 md:text-base">{`${author} — ${author_position}`}</p>
        <span className="hidden-start relative mt-4 flex items-center gap-x-1.5 text-lagune-3 transition-colors duration-200 group-hover:text-lagune-2">
          {link.type === "story" ? "Read story" : "Visit site"}
          <span className="relative mt-0.5 w-1 shrink-0 overflow-hidden transition-[width] duration-200 group-hover:w-3">
            <Image
              src={chevronRight}
              width={4}
              height={8}
              alt=""
              className="pointer-events-none ml-auto h-2 w-1"
            />
            <span className="absolute top-1/2 right-px h-px w-full -translate-y-1/2 bg-lagune-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </span>
        </span>
      </article>
    </li>
  )
}

function Hero({ customers }: { customers: { customer: TCustomerCard }[] }) {
  return (
    <section className="hero relative [overflow-x:clip] pt-12.5 md:pt-16 lg:pt-18.5 xl:pt-22.5 2xl:overflow-x-visible">
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
          <ContainerEffects />
          {customers.map(({ customer }, index) => (
            <CustomerCard key={customer._id} {...customer} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
