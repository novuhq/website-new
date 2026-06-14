"use client"

import { useRef } from "react"
import Image from "next/image"
import type { StaticImageData } from "next/image"
import dimaGrossmanAvatar from "@/images/pages/aci/founders/dima-grossman.jpg"
import tomerBarneaAvatar from "@/images/pages/aci/founders/tomer-barnea.jpg"

import { cn } from "@/lib/utils"

interface IFounderTestimonial {
  id: string
  quote: string
  authorAvatar: StaticImageData
  authorName: string
  authorRole: string
  linkLabel: string
  linkHref: string
  clickText: string
}

interface IFounderStat {
  value: string
  label: string
}

const FOUNDER_TESTIMONIALS: Omit<IFounderTestimonial, "id">[] = [
  {
    quote:
      "The real work is everything that makes the conversation feel human. Why we're building ACI, and why we're doing it in the open source",
    authorAvatar: dimaGrossmanAvatar,
    authorName: "Dima Grossman",
    authorRole: "Co-founder & CTO, Novu",
    linkLabel: "Read Dima’s essay",
    linkHref: "/blog/the-missing-layer-between-agents-and-people/",
    clickText: "read_dimas_essay",
  },
  {
    quote:
      "The hardest part of shipping an AI agent isn't building it. It's getting it in front of the people it works for.",
    authorAvatar: tomerBarneaAvatar,
    authorName: "Tomer Barnea",
    authorRole: "Co-founder, Novu",
    linkLabel: "Read Tomer’s essay",
    linkHref: "/blog/agents-can-think-now-they-can-talk/",
    clickText: "read_tomers_essay",
  },
]

const TESTIMONIALS: IFounderTestimonial[] = FOUNDER_TESTIMONIALS.map(
  (testimonial, index) => ({
    ...testimonial,
    id: `${testimonial.authorName}-${index}`,
  })
)

const STATS: IFounderStat[] = [
  { value: "39,8k", label: "Stars on GitHub" },
  { value: "412B+", label: "Messages a month" },
  { value: "12", label: "Channels" },
  { value: "6", label: "Regions" },
]

const DESKTOP_CONTENT_WIDTH_CLASS_NAME =
  "lg:max-w-[calc(100%-6rem)] 2xl:max-w-240"

function SliderArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      className={cn(
        "h-auto w-full shrink-0 text-gray-6 transition-colors duration-300 group-hover:text-foreground",
        className
      )}
      aria-hidden
    >
      <path
        d="M17.6641 21.332L12.3307 15.9987L17.6641 10.6654"
        stroke="currentColor"
        strokeWidth={1.33333}
        strokeMiterlimit={10}
        strokeLinecap="square"
      />
    </svg>
  )
}

function LinkArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={6}
      height={16}
      viewBox="0 0 6 16"
      fill="none"
      aria-hidden
      className="h-4 w-1.5"
    >
      <path
        d="M1 5.5L3.5 8L1 10.5"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="square"
      />
    </svg>
  )
}

function SliderArrow({
  direction,
  onClick,
}: {
  direction: "previous" | "next"
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        "group absolute top-1/2 z-20 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[#333347]/60 to-[#2B2B3B]/40 p-px transition-all duration-300 hover:from-[#272730] hover:via-[#5C638A]/50 hover:to-[#5C638A] lg:flex",
        direction === "previous" ? "left-0" : "right-0"
      )}
      type="button"
      aria-label={
        direction === "previous"
          ? "Previous founder testimonial"
          : "Next founder testimonial"
      }
      onClick={onClick}
    >
      <span className="flex size-full items-center justify-center rounded-full bg-[#111018] transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#111018] group-hover:via-[#302D43] group-hover:to-[#464C6D]">
        <SliderArrowIcon
          className={direction === "next" ? "rotate-180" : undefined}
        />
      </span>
    </button>
  )
}

function FounderTestimonialCard({
  quote,
  authorAvatar,
  authorName,
  authorRole,
  linkLabel,
  linkHref,
  clickText,
}: IFounderTestimonial) {
  return (
    <article className="flex h-full min-h-56.5 w-full flex-col justify-between rounded-xl border border-[rgba(51,51,71,0.6)] bg-[#111018] px-6 pt-5 pb-6">
      <p className="max-w-100 text-base leading-[1.375] font-book text-white">
        {quote}
      </p>

      <footer className="mt-6 flex w-full max-w-100 flex-col gap-4">
        <div className="h-px w-full bg-[#262626]" aria-hidden />

        <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src={authorAvatar}
              alt=""
              width={36}
              height={36}
              className="size-9 shrink-0 rounded-full object-cover"
              aria-hidden
            />

            <div className="min-w-0">
              <p className="truncate text-base leading-none font-book text-gray-9">
                {authorName}
              </p>
              <p className="mt-1 truncate text-sm leading-[1.375] font-light text-gray-8">
                {authorRole}
              </p>
            </div>
          </div>

          <a
            href={linkHref}
            className="group inline-flex items-end gap-1.5 text-sm leading-[1.375] font-book whitespace-nowrap text-lagune-3 transition-colors hover:text-lagune-2 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-lagune-3/50 focus-visible:outline-none"
            data-click-location="aci_founders_testimonials"
            data-click-text={clickText}
          >
            {linkLabel}
            <LinkArrowIcon />
          </a>
        </div>
      </footer>
    </article>
  )
}

function FoundersTestimonials() {
  const sliderRef = useRef<HTMLUListElement>(null)
  const hasMobileSlider = TESTIMONIALS.length > 1
  const hasDesktopSlider = TESTIMONIALS.length > 2

  const scrollTestimonials = (direction: "previous" | "next") => {
    const slider = sliderRef.current
    const card = slider?.querySelector<HTMLElement>("[data-testimonial-card]")

    if (!slider || !card) {
      return
    }

    const styles = window.getComputedStyle(slider)
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0")
    const offset = card.offsetWidth + (Number.isNaN(gap) ? 0 : gap)

    slider.scrollBy({
      left: direction === "next" ? offset : -offset,
      behavior: "smooth",
    })
  }

  return (
    <section className="relative isolate mt-26 bg-black text-white md:mt-48 lg:mt-70">
      <div
        className="pointer-events-none absolute top-36 left-1/2 z-0 h-80 w-[42rem] -translate-x-1/2 md:top-30 md:h-100 md:w-[56rem] lg:top-19.5 lg:h-118 lg:w-248.75"
        aria-hidden
      >
        <div
          className="absolute inset-[-21.19%_-10.05%] rounded-full opacity-[0.07] blur-[50px] [background:linear-gradient(77.81deg,rgba(245,117,224,0.56)_26.46%,rgba(164,123,243,0.609)_40.2%,rgba(178,129,242,0.56)_53.94%,rgba(117,153,245,0.665)_79.63%)]"
          data-aci-founders-glow
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-272 px-5 pt-2 md:px-8 md:pt-0 2xl:px-0">
        <div
          className={cn("mx-auto max-w-240", DESKTOP_CONTENT_WIDTH_CLASS_NAME)}
        >
          <div className="flex max-w-152 flex-col gap-5">
            <h2 className="text-[2rem] leading-dense font-medium tracking-tighter text-balance text-white md:text-[2.5rem] lg:text-[2.75rem]">
              We&apos;ve been the notification layer for half a decade.
            </h2>
            <p className="max-w-150.5 text-base leading-normal font-book tracking-tighter text-gray-8 md:text-lg">
              Channels, identity, and delivery — we built the infrastructure so
              you don&apos;t have to.{" "}
              <span className="text-white">
                ACI brings it to agents. Hear from the founders.
              </span>
            </p>
          </div>
        </div>

        <div className="relative mt-8.75 lg:mt-8.75">
          {hasDesktopSlider && (
            <>
              <SliderArrow
                direction="previous"
                onClick={() => scrollTestimonials("previous")}
              />
              <SliderArrow
                direction="next"
                onClick={() => scrollTestimonials("next")}
              />
            </>
          )}

          <div
            className={cn(
              "relative left-1/2 w-screen -translate-x-1/2 lg:static lg:mx-auto lg:w-full lg:translate-x-0",
              DESKTOP_CONTENT_WIDTH_CLASS_NAME
            )}
          >
            <ul
              ref={sliderRef}
              className={cn(
                "scrollbar-hidden flex gap-5 px-5 md:gap-8 md:px-8 lg:scroll-px-0 lg:px-0",
                hasMobileSlider &&
                  "snap-x snap-mandatory scroll-px-5 overflow-x-auto scroll-smooth md:scroll-px-8",
                !hasDesktopSlider && "lg:snap-none lg:overflow-visible"
              )}
            >
              {TESTIMONIALS.map((testimonial) => (
                <li
                  className="flex w-[calc(100vw-4rem)] max-w-116 shrink-0 snap-start last:snap-end md:w-116 lg:w-[calc((100%-2rem)/2)] lg:max-w-none 2xl:w-116"
                  key={testimonial.id}
                  data-testimonial-card
                >
                  <FounderTestimonialCard {...testimonial} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className={cn(
            "mx-auto mt-14 max-w-240 md:mt-17.25",
            DESKTOP_CONTENT_WIDTH_CLASS_NAME
          )}
        >
          <dl className="grid grid-cols-2 gap-x-8 gap-y-8 md:flex md:gap-13.5">
            {STATS.map((stat) => (
              <div className="w-full md:w-38.5" key={stat.label}>
                <dt className="text-[2rem] leading-none font-normal tracking-[-0.05em] text-white md:text-[2.5rem] lg:text-[2.75rem]">
                  {stat.value}
                </dt>
                <dd className="mt-1.5 text-base leading-normal font-book tracking-tighter text-gray-8 md:text-lg">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

export default FoundersTestimonials
