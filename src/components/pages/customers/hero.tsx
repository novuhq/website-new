import Image from "next/image"
import { ROUTE } from "@/constants/routes"
import blueBgMob from "@/images/pages/customers/hero/blue-bg-mob.png"
import blueBg from "@/images/pages/customers/hero/blue-bg.png"
import purpleBgMob from "@/images/pages/customers/hero/purple-bg-mob.png"
import purpleBg from "@/images/pages/customers/hero/purple-bg.png"
import chevronRight from "@/svgs/icons/chevron-right.svg"
import shineCorner from "@/svgs/pages/customers/hero/shine.svg"

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
      "rotate-[-57.684deg] lg:bg-[#344387] lg:opacity-30 blur-[32px] lg:-bottom-[100px] lg:-left-[35px] lg:h-[187px] lg:w-[170px] md:w-[522px] md:h-[250px] md:-bottom-14 md:-left-22 md:opacity-60 md:rotate-0 md:bg-[radial-gradient(50%_50%_at_50%_50%,_#344387_0%,_rgba(52,67,135,0)_100%)]",
  },
  2: {
    showShine: false,
    glowClassName:
      "h-[250px] w-[290px] opacity-75 lg:rotate-[35deg] bg-[radial-gradient(50%_50%_at_50%_50%,_#344387_0%,_rgba(52,67,135,0)_100%)] -left-[90px] -bottom-[75px] rounded-[100%] lg:bg-[linear-gradient(180deg,#344387_0%,rgba(52,67,135,0)_100%)] lg:opacity-70 blur-[32px] lg:top-[-85px] lg:left-[180px] lg:h-[250px] lg:w-[290px] md:h-[187px] md:w-[170px] md:-rotate-[57.684deg] md:bg-[#344387] md:opacity-30 md:-left-[70px] md:-bottom-[96px]",
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
      <span className="absolute -top-10 -left-[30px] flex h-[278px] w-[379px] rounded-[100%] bg-[linear-gradient(171deg,_#F575E0_21.93%,_rgba(117,153,245,0.70)_84.89%)] opacity-[0.01] blur-[150px] md:-top-[54px] md:-left-[172px] md:h-[315px] md:w-[1021px] md:bg-[linear-gradient(81deg,#F575E0_21.93%,rgba(117,153,245,0.70)_84.89%)] md:opacity-[0.02] md:blur-[32px] lg:-top-[123px] lg:-left-[252px] lg:h-[405px] lg:w-[1472px]" />
      <span className="absolute -top-[30px] -left-1 flex h-[337px] w-[331px] rounded-[100%] bg-[linear-gradient(171deg,_#F575E0_21.93%,_#7599F5_84.89%)] opacity-[0.01] blur-[100px] md:-top-[31px] md:-left-[82px] md:h-[331px] md:w-[848px] md:bg-[linear-gradient(81deg,#F575E0_21.93%,#7599F5_84.89%)] md:opacity-[0.04] md:blur-[32px] lg:-top-[82px] lg:-left-[84px] lg:h-[331px] lg:w-[1136px]" />
      <span className="absolute -top-[66px] -left-[94px] flex h-[180px] w-[213px] rounded-[100%] bg-[radial-gradient(130.45%_66.34%_at_74.29%_61.64%,_#FFB7E2_27.2%,_#FF96FB_80.5%,_#F047FF_100%)] opacity-[0.13] blur-[75px] md:-top-30 md:-left-[100px] md:h-[322px] md:w-[385px] md:bg-[radial-gradient(130.45%_66.34%_at_74.29%_61.64%,#FFB7E2_27.2%,#FF96FB_67.79%,#F047FF_88.46%,rgba(240,71,255,0)_99.52%)] md:opacity-5 md:blur-[32px] xl:-top-[170px] xl:-left-[178px] xl:h-[410px] xl:w-[537px]" />
      <span className="md:blur-0 absolute bottom-[100px] -left-[60px] flex h-[382px] w-[370px] rounded-[100%] bg-[radial-gradient(130.45%_66.34%_at_74.29%_61.64%,_#B7C9FF_27.2%,_#4775FF_80.5%,_#4775FF_100%)] opacity-15 blur-[160px] md:bottom-[112px] md:left-[78px] md:h-[433px] md:w-[584px] md:rotate-[5deg] md:bg-[radial-gradient(50%_50%_at_50%_50%,#A1B6F8_0%,rgba(183,201,255,0)_100%)] md:opacity-[0.08] xl:bottom-[40px] xl:left-[165px] xl:opacity-20" />
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
  link_type: linkType,
  external_link: externalLink,
  slug,
}: any) {
  const config = CARD_CONFIG[index]

  const glowClasses = cn("absolute flex", config.glowClassName)

  const listItemClasses = cn(
    "relative group cursor-pointer rounded-xl w-full list-none",
    {
      "xl:max-w-[590px] lg:max-w-[576px] h-[350px] md:h-[320px]":
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
        <Image
          src={shineCorner}
          alt=""
          width={265}
          height={77}
          priority
          className="pointer-events-none absolute -top-[10px] -left-[20px] h-[77px] w-[265px]"
          quality={100}
        />
      )}
      <article className={cardClasses}>
        <Link
          href={
            linkType === "external"
              ? externalLink
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
              quality={100}
            />
            <Image
              src={BACKGROUNDS[config.background].mob}
              alt={config.backgroundAlt || ""}
              width={320}
              height={350}
              priority
              className="pointer-events-none absolute top-0 left-0 h-full w-full rounded-xl sm:hidden"
              quality={100}
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
          {linkType === "story" ? "Read story" : "Visit site"}
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

function Hero({ customers }: { customers: any[] }) {
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
