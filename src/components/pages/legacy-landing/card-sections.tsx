import Image from "next/image"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

import { LandingButtonLink } from "./action-link"
import type {
  BentoCardData,
  ComplianceItem,
  ImageCardData,
  LandingAction,
  LinkCardData,
  LogoData,
  SecurityCtaData,
} from "./types"

interface ImageCardGridProps {
  cards: readonly ImageCardData[]
  title: string
}

export function ImageCardGrid({ cards, title }: ImageCardGridProps) {
  return (
    <section className="mt-20 md:mt-25 lg:mt-30 xl:mt-40">
      <div className="mx-auto w-full max-w-304 px-5 md:px-8">
        <h2 className="mx-auto max-w-3xl text-center text-[28px] leading-dense font-medium tracking-tighter text-balance text-white md:text-[32px] lg:text-4xl">
          {title}
        </h2>
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-12 lg:mt-14 lg:grid-cols-3 lg:gap-7 xl:gap-8">
          {cards.map((card) => (
            <li
              className="flex w-full justify-center sm:last:col-span-2 sm:last:w-1/2 sm:last:justify-self-center lg:last:col-span-1 lg:last:w-full"
              key={card.title}
            >
              <article className="flex w-full max-w-96 flex-col rounded-xl bg-[linear-gradient(145deg,hsl(var(--gray-5)),hsl(var(--gray-2)))] p-px">
                <div className="aspect-[1.785] w-full shrink-0 overflow-hidden rounded-t-xl">
                  <Image
                    className="size-full object-cover"
                    src={card.image.src}
                    alt={card.image.alt}
                    width={card.image.width}
                    height={card.image.height}
                    sizes="(max-width: 767px) 100vw, 384px"
                  />
                </div>
                <div className="grow rounded-b-xl bg-gray-1 p-5 md:p-6">
                  <h3 className="text-lg leading-tight font-medium tracking-tighter text-white md:text-xl lg:text-2xl">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-snug font-book tracking-tighter text-gray-8">
                    {card.description}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

interface LogoGridProps {
  className?: string
  description: string
  logos: readonly LogoData[]
  title: string
}

export function LogoGrid({
  className,
  description,
  logos,
  title,
}: LogoGridProps) {
  return (
    <section className={className}>
      <div className="mx-auto flex w-full max-w-240 flex-col items-center px-5 text-center md:px-8">
        <h2 className="text-[28px] leading-dense font-medium tracking-tighter text-balance text-white lg:text-[32px] xl:text-[40px]">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-base leading-normal font-book tracking-tighter text-balance text-gray-8 lg:text-lg">
          {description}
        </p>
        <ul className="mt-7 grid w-full grid-cols-2 md:mt-8 md:grid-cols-5 lg:mt-10 xl:mt-11">
          {logos.map((logo, index) => (
            <li
              className={cn(
                "border-gray-2 px-7.5 py-6 md:p-5 lg:px-8 lg:py-7 xl:p-8",
                index % 2 === 0 && "border-r",
                index < 8 && "border-b",
                index % 5 !== 4 && "md:border-r",
                index % 5 === 4 && "md:border-r-0",
                index >= 5 && "md:border-b-0"
              )}
              key={logo.title}
            >
              <Image
                className="mx-auto h-11 w-32 object-contain"
                src={logo.image.src}
                alt={logo.title}
                width={logo.image.width}
                height={logo.image.height}
                unoptimized
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

interface BentoGridProps {
  cards: readonly BentoCardData[]
  className?: string
  description?: string
  title: string
}

export function BentoGrid({
  cards,
  className,
  description,
  title,
}: BentoGridProps) {
  return (
    <section className={className ?? "relative mt-22 md:mt-22 xl:mt-48"}>
      <div className="relative mx-auto w-full max-w-304 px-5 md:px-8">
        <h2 className="relative z-10 max-w-3xl text-[28px] leading-dense font-medium tracking-tighter text-balance whitespace-pre-line text-white md:text-[32px] lg:max-w-xl lg:text-4xl xl:text-[40px]">
          {title}
        </h2>
        {description ? (
          <p className="relative z-10 mt-3 max-w-xl text-base leading-snug font-book text-gray-9 lg:text-[17px]">
            {description}
          </p>
        ) : null}
        <ul className="relative z-10 mt-8 grid grid-cols-1 gap-4 md:mt-9 md:grid-cols-3 md:gap-4.5 lg:mt-11 lg:gap-6 xl:mt-15.75 xl:gap-7">
          {cards.map((card, index) => {
            const isWide = index % 2 === 0
            return (
              <li
                className={cn(
                  "relative h-62.5 overflow-hidden rounded-xl bg-gray-12 md:h-63",
                  isWide ? "md:col-span-2" : "md:col-span-1",
                  index === 2 && "md:order-4",
                  index === 3 && "md:order-3",
                  "lg:h-80.5 xl:h-95.5"
                )}
                key={card.title}
              >
                {card.imageMobile ? (
                  <Image
                    className="pointer-events-none absolute inset-0 size-full object-cover select-none md:hidden"
                    src={card.imageMobile.src}
                    alt=""
                    width={card.imageMobile.width}
                    height={card.imageMobile.height}
                    aria-hidden
                    sizes="380px"
                  />
                ) : null}
                <Image
                  className={cn(
                    "pointer-events-none absolute inset-0 size-full object-cover select-none",
                    card.imageMobile && "hidden md:block"
                  )}
                  src={card.image.src}
                  alt=""
                  width={card.image.width}
                  height={card.image.height}
                  aria-hidden
                  sizes="(max-width: 1023px) 66vw, 768px"
                />
                <div
                  className={cn(
                    "relative z-10 flex h-full flex-col justify-end p-4 md:p-4.5 lg:p-6.5 xl:p-7.5",
                    isWide &&
                      "md:max-w-75 md:justify-start lg:max-w-82.5 xl:max-w-md"
                  )}
                >
                  <h3 className="text-sm leading-snug font-medium tracking-tighter text-white md:text-[15px] lg:text-lg xl:text-xl">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-sm leading-snug font-light text-gray-9 md:mt-1 lg:mt-1.5 lg:text-[15px]">
                    {card.description}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
        <div
          className="pointer-events-none absolute top-20 -right-28 h-94 w-127 rounded-full bg-purple-2/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-36 h-93 w-130 rounded-full bg-blue-1/10 blur-3xl"
          aria-hidden
        />
      </div>
    </section>
  )
}

interface FiveBlockGridProps {
  action: LandingAction
  cards: readonly ImageCardData[]
  className?: string
  description: string
  title: string
}

const fiveBlockCardSizes = [
  "h-[305px] md:h-[223px] md:w-[234px] lg:h-[303px] lg:w-[320px] xl:h-[384px] xl:w-[402px]",
  "h-[258px] md:h-[223px] md:w-[277px] lg:h-[303px] lg:w-[378px] xl:h-[384px] xl:w-[484px]",
  "h-[454px] md:h-[223px] md:w-[157px] lg:h-[303px] lg:w-[214px] xl:h-[384px] xl:w-[270px]",
  "h-[254px] md:h-[251px] md:w-[316px] lg:h-[343px] lg:w-[430px] xl:h-[434px] xl:w-[546px]",
  "h-[218px] md:h-[251px] md:w-[370px] lg:h-[343px] lg:w-[506px] xl:h-[434px] xl:w-[640px]",
] as const

export function FiveBlockGrid({
  action,
  cards,
  className,
  description,
  title,
}: FiveBlockGridProps) {
  return (
    <section className={className ?? "mt-22 md:mt-22 xl:mt-48"}>
      <div className="relative mx-auto flex w-full max-w-304 flex-col items-center px-5 md:px-8">
        <h2 className="max-w-192 text-center text-[28px] leading-dense font-medium tracking-tighter text-balance text-white md:max-w-125 md:text-[32px] lg:max-w-135 lg:text-4xl xl:text-[40px]">
          {title}
        </h2>
        <p className="mt-4 max-w-192 text-center text-base leading-normal tracking-tighter text-pretty text-gray-8 md:max-w-144 md:text-lg xl:mt-3.5">
          {description}
        </p>
        <ul className="relative z-10 mt-10 flex w-full flex-wrap justify-center gap-4 md:mt-12 md:gap-4.5 lg:mt-15 lg:gap-6 xl:mt-14.5 xl:gap-7.5">
          {cards.map((card, index) => (
            <li
              className={cn(
                "relative w-full max-w-95 overflow-hidden rounded-[13px] bg-gray-12 md:max-w-none",
                fiveBlockCardSizes[index]
              )}
              key={card.title}
            >
              <Image
                className="pointer-events-none absolute inset-0 z-10 size-full object-cover object-center select-none"
                src={card.image.src}
                alt=""
                width={card.image.width}
                height={card.image.height}
                aria-hidden
                sizes="(max-width: 767px) 380px, 50vw"
              />
              <div className="relative z-20 flex h-full flex-col justify-end p-3 md:p-3.5 lg:p-5 xl:p-7.5">
                <h3 className="text-base leading-dense font-medium tracking-tighter text-white md:text-lg xl:text-xl">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-sm leading-snug font-light tracking-tighter text-gray-9 xl:mt-3 xl:text-[15px]">
                  {card.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <LandingButtonLink className="mt-8" action={action} secondary />
      </div>
    </section>
  )
}

interface ComplianceGridProps {
  items: readonly ComplianceItem[]
  title: string
}

export function ComplianceGrid({ items, title }: ComplianceGridProps) {
  return (
    <section className="relative z-30 mt-20 md:mt-25 lg:mt-30 xl:mt-40">
      <div className="relative mx-auto flex w-full max-w-240 flex-col items-center px-5 pt-1 text-center md:px-8">
        <h2 className="relative z-10 text-[28px] leading-dense font-medium tracking-tighter text-white md:text-3xl lg:text-[32px] xl:text-[40px]">
          {title}
        </h2>
        <ul className="relative z-10 mt-9 grid w-full max-w-192 grid-cols-1 md:grid-cols-4 md:before:absolute md:before:inset-x-0 md:before:top-12.5 md:before:h-px md:before:bg-[radial-gradient(circle,hsl(var(--gray-5)),transparent_70%)] md:after:absolute md:after:inset-x-0 md:after:bottom-12.5 md:after:h-px md:after:bg-[radial-gradient(circle,hsl(var(--gray-5)),transparent_70%)]">
          {items.map((item) => (
            <li
              className="relative flex flex-col items-center gap-y-3 py-8 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-[radial-gradient(circle,hsl(var(--gray-5)),transparent_70%)] last:after:hidden md:py-18.5 md:after:inset-y-0 md:after:right-0 md:after:left-auto md:after:h-auto md:after:w-px"
              key={item.title}
            >
              <Image
                className="h-auto w-14 lg:w-20"
                src={item.image.src}
                alt=""
                width={item.image.width}
                height={item.image.height}
                aria-hidden
                unoptimized
              />
              <p className="leading-tight font-medium tracking-tight text-white">
                {item.title}
              </p>
            </li>
          ))}
        </ul>
        <span
          className="pointer-events-none absolute -top-25 -left-1/2 h-151.75 w-240.75 rounded-full bg-blue-1/10 blur-3xl"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute -right-1/2 -bottom-25 h-151.75 w-240.75 rounded-full bg-purple-2/10 blur-3xl"
          aria-hidden
        />
      </div>
    </section>
  )
}

interface LinkCardGridProps {
  backgroundSrc: string
  cards: readonly LinkCardData[]
  className?: string
  description: string
  title: string
}

export function LinkCardGrid({
  backgroundSrc,
  cards,
  className,
  description,
  title,
}: LinkCardGridProps) {
  return (
    <section
      className={className ?? "relative mt-20 md:mt-25 lg:mt-30 xl:mt-40"}
    >
      <Image
        className="pointer-events-none absolute top-1/2 left-1/2 h-auto w-413 max-w-none -translate-1/2 select-none"
        src={backgroundSrc}
        alt=""
        width={1652}
        height={928}
        aria-hidden
        unoptimized
      />
      <div className="relative z-10 mx-auto w-full max-w-304 px-5 md:px-8">
        <h2 className="mx-auto max-w-175 text-center text-[28px] leading-dense font-medium tracking-tighter text-balance text-white md:text-[32px] lg:text-[40px] xl:text-[44px]">
          {title}
        </h2>
        <p className="mx-auto mt-2 max-w-177.5 text-center text-base leading-normal font-light tracking-tighter text-gray-8 md:mt-4 lg:text-lg">
          {description}
        </p>
        <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-7 xl:grid-cols-3 xl:gap-8">
          {cards.map((card) => (
            <li
              className="min-h-60 rounded-xl bg-[linear-gradient(145deg,hsl(var(--gray-5)),hsl(var(--gray-2)))] p-px"
              key={card.title}
            >
              <a
                className="group flex h-full flex-col items-start rounded-xl bg-gray-1 p-6 focus-visible:outline-2 focus-visible:outline-offset-2 xl:p-7"
                href={card.link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3 className="text-xl leading-dense font-medium tracking-tighter text-white xl:text-2xl">
                  {card.title}
                </h3>
                <p className="mt-2 text-base leading-snug font-light tracking-tighter text-gray-8 md:mt-2.5">
                  {card.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] leading-snug font-book text-primary">
                  {card.link.label}
                  <ChevronRight
                    className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                    aria-hidden
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

interface SecurityCtaProps extends SecurityCtaData {
  className?: string
  dotsSrc: string
  textureSrc: string
}

export function SecurityCta({
  className,
  dotsSrc,
  primary,
  secondary,
  textureSrc,
  title,
}: SecurityCtaProps) {
  return (
    <section
      className={className ?? "relative mt-20 md:mt-25 lg:mt-30 xl:mt-40"}
    >
      <div className="relative z-10 mx-auto w-full max-w-240 px-5 md:px-8">
        <h2 className="mx-auto max-w-xl text-center text-[28px] leading-dense font-medium tracking-tighter text-balance text-white md:max-w-lg md:text-[32px] lg:text-[40px] xl:text-[44px]">
          {title}
        </h2>
        <ul className="mt-12 grid grid-cols-1 gap-6 md:mt-10 md:grid-cols-2 md:gap-8">
          {[primary, secondary].map((card, index) => (
            <li
              className={cn(
                "relative overflow-hidden rounded-xl bg-[linear-gradient(145deg,hsl(var(--gray-5)),hsl(var(--gray-2)))] p-px",
                index === 1 &&
                  "bg-[linear-gradient(145deg,rgba(245,117,224,0.8),rgba(117,153,245,0.25))]"
              )}
              key={card.title}
            >
              {index === 1 ? (
                <>
                  <Image
                    className="pointer-events-none absolute inset-px z-10 size-[calc(100%-2px)] rounded-xl object-cover select-none"
                    src={textureSrc}
                    alt=""
                    width={464}
                    height={237}
                    aria-hidden
                  />
                  <Image
                    className="pointer-events-none absolute top-[-305px] left-46 z-0 hidden h-138.25 w-179.25 max-w-none select-none md:block"
                    src={dotsSrc}
                    alt=""
                    width={717}
                    height={553}
                    aria-hidden
                  />
                </>
              ) : null}
              <div
                className={cn(
                  "relative z-20 h-full rounded-xl bg-gray-1 px-5 py-7 text-center xl:py-9",
                  index === 1 && "bg-transparent"
                )}
              >
                <h3 className="text-2xl leading-dense font-medium tracking-tighter text-white lg:text-3xl xl:text-[32px]">
                  {card.title}
                </h3>
                <p className="mx-auto mt-3 max-w-80 leading-snug tracking-tighter text-gray-8">
                  {card.description}
                </p>
                <LandingButtonLink
                  className="mt-6"
                  action={card.action}
                  secondary={index === 0}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="pointer-events-none absolute -top-4 left-1/2 h-122.5 w-284 -translate-x-1/2 rounded-full bg-purple-2/5 blur-3xl"
        aria-hidden
      />
    </section>
  )
}
