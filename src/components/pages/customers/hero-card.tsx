import Image from "next/image"
import { ROUTE } from "@/constants/routes"
import blueCardMob from "@/images/pages/customers/hero/blue-card-mob.png"
import blueCard from "@/images/pages/customers/hero/blue-card.png"
import purpleCardMob from '@/images/pages/customers/hero/purple-card-mob.png'
import purpleCardBg from "@/images/pages/customers/hero/purple-card.png"
import chevronRight from "@/svgs/icons/chevron-right.svg"

import { TCustomerCard } from "@/types/customers"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"

const CARDS_CONFIG = [
  {
    backgroundClassName:
      "bg-[linear-gradient(147deg,#1C0F1F_0%,#141221_59%,#14141F_84%)]",
    borderClassName:
      "bg-[linear-gradient(132deg,#ECD1FA_-37%,#362341_3%,#1C2039_55%)]",
    shine: [
      "w-51 bg-[linear-gradient(88deg,rgba(255,255,255,0)_0%,#FFFFFF_34%,rgba(255,255,255,0)_100%)] blur-[2px]",
      "w-51 bg-[linear-gradient(88deg,rgba(255,255,255,0)_0%,#FFFFFF_37%,rgba(255,255,255,0)_100%)] blur-[3px]",
      "w-54.5 bg-[linear-gradient(89deg,rgba(255,186,244,0)_0%,#FFBAF4_36%,rgba(255,186,244,0)_100%)] blur-[5px]",
      "w-66 bg-[linear-gradient(89deg,rgba(255,186,244,0)_0%,#FFBAF4_36%,rgba(255,186,244,0)_100%)] blur-[5px]",
    ],
    glowImage: {
      desktop: purpleCardBg,
      mobile: purpleCardMob,
    },
  },
  {
    backgroundClassName: "bg-[#14141F]",
    borderClassName: "bg-[linear-gradient(232.32deg,rgba(43,43,59,0.5)_41.4%,rgba(51,51,71,0.9)_92.68%)]",
    glowClassName:
      "rotate-[-56deg] blur-[32px] lg:bg-[#344387] lg:opacity-30 lg:-bottom-25 lg:-left-9 lg:h-47 lg:w-42 md:w-130 md:h-62 md:-bottom-14 md:-left-22 md:opacity-60 md:rotate-0 md:bg-[radial-gradient(50%_50%_at_50%_50%,_#344387_0%,_rgba(52,67,135,0)_100%)]",
  },
  {
    backgroundClassName: "bg-[#14141F]",
    borderClassName: "bg-[linear-gradient(224.97deg,rgba(255,255,255,0.15)_1.05%,rgba(43,43,59,0.4)_32.26%)]",
    glowClassName:
      "h-62 w-72 opacity-70 blur-[32px] bg-[linear-gradient(180deg,#344387_0%,rgba(52,67,135,0)_100%)] -left-22 -bottom-19 rounded-[100%] lg:rotate-[36deg] lg:bg-[linear-gradient(180deg,#344387_0%,rgba(52,67,135,0)_100%)] lg:opacity-20 lg:-top-21 lg:left-45 lg:h-62 lg:w-72 md:h-47 md:w-42 md:-rotate-[56deg] md:bg-[#344387] md:opacity-30 md:-left-17 md:-bottom-24",
  },
  {
    backgroundClassName: "bg-[linear-gradient(152deg,#0B1122_0.45%,#10101E_70%,#14141F_104%)]",
    borderClassName: "bg-[linear-gradient(116.22deg,#ECD1FA_-27.51%,#1B2549_18.82%,#161A32_69.8%)]",
    shine: [
      "w-51 bg-[linear-gradient(88deg,rgba(255,255,255,0)_0%,#FFFFFF_34%,rgba(255,255,255,0)_100%)] blur-[2px]",
      "w-51 bg-[linear-gradient(88deg,rgba(255,255,255,0)_0%,#FFFFFF_37%,rgba(255,255,255,0)_100%)] blur-[3px]",
      "w-54.5 bg-[linear-gradient(89deg,rgba(186,203,255,0)_0%,#BACBFF_36%,rgba(186,203,255,0)_100%)] blur-[5px]",
      "w-66 bg-[linear-gradient(88deg,rgba(186,203,255,0)_0%,#BACBFF_38%,rgba(186,203,255,0)_100%)] blur-[5px]",
    ],
    glowImage: {
      desktop: blueCard,
      mobile: blueCardMob,
    },
  },
]

type TCustomerCardProps = TCustomerCard & { index: number }

function HeroCard({
  logo,
  name,
  card_type: cardType,
  title,
  author,
  author_position,
  index,
  link,
  slug,
}: TCustomerCardProps) {
  const config = CARDS_CONFIG[index]

  return (
    <li
      className={cn(
        "group relative w-full cursor-pointer list-none rounded-xl",
        {
          "h-[350px] md:h-[320px] lg:max-w-[576px] xl:max-w-[590px]":
            cardType === "big",
          "h-[320px] bg-[#14141F] md:max-w-[338px] lg:max-w-[347px]":
            cardType === "small",
        }
      )}
    >
      <article
        className={cn(
          "relative flex h-full w-full flex-grow flex-col items-start rounded-xl p-6 md:p-[27px]",
          {
            "md:pr-[14px] xl:pr-7": cardType === "big",
          }
        )}
      >
        <Link
          href={
            link.type === "external"
              ? link.url!
              : `${ROUTE.customers}/${slug.current}`
          }
          className="group absolute top-0 left-0 z-10 h-full w-full"
        >
          <span className="sr-only">Read story</span>
        </Link>

        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-xl",
            config.borderClassName
          )}
          aria-hidden
        >
          <div
            className={cn(
              "absolute inset-px overflow-hidden rounded-xl",
              config.backgroundClassName
            )}
          >
            {config.glowClassName && (
              <span
                className={cn("absolute flex", config.glowClassName)}
                aria-hidden
              />
            )}
          </div>

          {config.glowImage && (
            <>
              <Image
                src={config.glowImage.desktop}
                alt=""
                width={590}
                height={320}
                priority
                className="pointer-events-none absolute inset-0 hidden h-full w-full rounded-xl select-none sm:block"
                quality={100}
                sizes="(max-width: 768px) 100vw, 1180px"
              />
              <Image
                src={config.glowImage.mobile}
                alt=""
                width={320}
                height={350}
                priority
                className="pointer-events-none absolute inset-0 h-full w-full rounded-xl select-none sm:hidden"
                quality={100}
                sizes="(max-width: 768px) 100vw, 640px"
              />
            </>
          )}

          {config.shine &&
            config.shine.map((shine, index) => (
              <span
                key={index}
                className={cn(
                  "absolute top-0 left-0 h-px mix-blend-plus-lighter",
                  shine
                )}
                aria-hidden
              />
            ))}
        </div>

        <Image
          className="pointer-events-none relative"
          src={logo.asset.url}
          alt=""
          width={logo.asset.metadata.dimensions.width || 180}
          height={logo.asset.metadata.dimensions.height || 40}
          priority
        />
        <h1 className="relative mt-auto text-xl leading-snug font-normal tracking-tighter md:max-w-[530px] md:text-2xl">
          “{title}”
        </h1>
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
              aria-hidden
            />
            <span className="absolute top-1/2 right-px h-px w-full -translate-y-1/2 bg-lagune-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </span>
        </span>
      </article>
    </li>
  )
}

export default HeroCard
