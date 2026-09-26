import Image, { type StaticImageData } from "next/image"
import { ROUTE } from "@/constants/routes"
import eburyLogo from "@/images/pages/pricing/logos/ebury.svg"
import hemnetLogo from "@/images/pages/pricing/logos/hemnet.svg"
import mongodbLogo from "@/images/pages/pricing/logos/mongodb.svg"
import tatilbudurLogo from "@/images/pages/pricing/logos/tatilbudur.svg"
import whoppahLogo from "@/images/pages/pricing/logos/whoppah.svg"

import { Button } from "@/components/ui/button"
import { CopyCommand } from "@/components/ui/copy-command"

import type {
  ICta,
  IProofQuote,
  ISection,
  IUseCaseDemo,
  IUseCaseLanding,
} from "./config"

const LOGOS: Record<string, StaticImageData> = {
  ebury: eburyLogo,
  mongodb: mongodbLogo,
  whoppah: whoppahLogo,
  hemnet: hemnetLogo,
  tatilbudur: tatilbudurLogo,
}

const SECTION = "px-5 md:px-8"
const INNER = "mx-auto w-full max-w-336"
const BLOCK = `${SECTION} border-t border-gray-3 py-16 md:py-20`

function CtaLink({
  cta,
  variant = "outline-transparent",
}: {
  cta: ICta
  variant?: "primary" | "outline-transparent"
}) {
  return (
    <Button
      asChild
      variant={variant === "primary" ? undefined : "outline-transparent"}
      size="none"
      className="h-11 px-5 text-base leading-none font-medium tracking-tight normal-case"
    >
      <a
        href={cta.href}
        target={cta.href.startsWith("http") ? "_blank" : undefined}
        rel={cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {cta.label}
      </a>
    </Button>
  )
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string
  title: string
  body?: string
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-sm font-medium tracking-tight text-[#7c86ff]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-[1.75rem] leading-tight font-normal tracking-plus-tight text-balance text-foreground md:text-4xl">
        {title}
      </h2>
      {body ? (
        <p className="mt-4 text-base leading-normal tracking-tight text-pretty text-[#a3a6b2] md:text-lg">
          {body}
        </p>
      ) : null}
    </div>
  )
}

function Quote({ quote }: { quote: IProofQuote }) {
  return (
    <figure className="rounded-2xl border border-gray-3 bg-[#0b0b12] p-6 md:p-8">
      <blockquote className="text-lg leading-snug tracking-tight text-pretty text-foreground md:text-xl">
        &ldquo;{quote.text}&rdquo;
      </blockquote>
      <figcaption className="mt-4 text-sm tracking-tight text-gray-50">
        {quote.attribution}
      </figcaption>
    </figure>
  )
}

function DemoCard({ demo }: { demo: IUseCaseDemo }) {
  return (
    <figure className="flex flex-col">
      <div className="relative overflow-hidden rounded-2xl border border-gray-3 bg-[#0b0b12] p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-base font-medium tracking-tight text-foreground">
            {demo.channel}
          </span>
          <span className="rounded-full border border-gray-20 px-2.5 py-1 text-xs tracking-tight text-gray-50">
            Sample conversation
          </span>
        </div>
        <div
          className="relative mx-auto aspect-[1118/850] w-full"
          style={{ filter: "drop-shadow(0 22px 55px rgba(0,8,49,0.55))" }}
        >
          <video
            className="size-full object-contain"
            poster={demo.poster}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label={`${demo.channel} demo`}
          >
            <source src={demo.webm} type="video/webm" />
            <source src={demo.mp4} type='video/mp4; codecs="hvc1"' />
          </video>
        </div>
      </div>
      <figcaption className="mt-4 text-base leading-normal tracking-tight text-pretty text-[#a3a6b2]">
        {demo.caption}
      </figcaption>
    </figure>
  )
}

function Section({ section, command }: { section: ISection; command: string }) {
  switch (section.type) {
    case "prose":
      return (
        <section className={BLOCK}>
          <div
            className={`${INNER} grid gap-8 ${section.quote ? "lg:grid-cols-2 lg:items-center lg:gap-12" : ""}`}
          >
            <div>
              <SectionHeading
                eyebrow={section.eyebrow}
                title={section.title}
                body={section.body}
              />
              {section.cta ? (
                <div className="mt-8">
                  <CtaLink cta={section.cta} />
                </div>
              ) : null}
            </div>
            {section.quote ? <Quote quote={section.quote} /> : null}
          </div>
        </section>
      )

    case "features":
      return (
        <section className={BLOCK}>
          <div className={INNER}>
            <SectionHeading
              eyebrow={section.eyebrow}
              title={section.title}
              body={section.body}
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-3 bg-[#0b0b12] p-6"
                >
                  <h3 className="text-lg font-medium tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-base leading-normal tracking-tight text-pretty text-[#a3a6b2]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            {section.cta ? (
              <div className="mt-8">
                <CtaLink cta={section.cta} />
              </div>
            ) : null}
          </div>
        </section>
      )

    case "badges":
      return (
        <section className={BLOCK}>
          <div className={INNER}>
            <SectionHeading
              eyebrow={section.eyebrow}
              title={section.title}
              body={section.body}
            />
            <div className="mt-8 flex flex-wrap gap-3">
              {section.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-lg border border-gray-20 bg-[#0b0b12] px-4 py-2 text-sm font-medium tracking-tight text-gray-90"
                >
                  {badge}
                </span>
              ))}
            </div>
            {section.cta ? (
              <div className="mt-8">
                <CtaLink cta={section.cta} />
              </div>
            ) : null}
          </div>
        </section>
      )

    case "split":
      return (
        <section className={BLOCK}>
          <div className={`${INNER} grid gap-8 lg:grid-cols-2 lg:gap-12`}>
            <SectionHeading
              eyebrow={section.eyebrow}
              title={section.title}
              body={section.body}
            />
            <ul className="flex flex-col gap-3 self-center">
              {section.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-base tracking-tight text-gray-90"
                >
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-[#7c86ff]"
                    aria-hidden
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          {section.cta ? (
            <div className={`${INNER} mt-8`}>
              <CtaLink cta={section.cta} />
            </div>
          ) : null}
        </section>
      )

    case "demos":
      return (
        <section className={BLOCK}>
          <div className={INNER}>
            <SectionHeading
              eyebrow={section.eyebrow}
              title={section.title}
              body={section.body}
            />
            {section.tagline ? (
              <p className="mt-5 max-w-2xl text-lg font-medium tracking-tight text-pretty text-foreground">
                {section.tagline}
              </p>
            ) : null}
            <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
              {section.demos.map((demo) => (
                <DemoCard key={demo.channel} demo={demo} />
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              {section.showCommand ? (
                <CopyCommand command={command} variant="highlighted" />
              ) : null}
              <p className="text-sm tracking-tight text-gray-50">
                These conversations are illustrative samples, not customers.
              </p>
            </div>
          </div>
        </section>
      )

    case "proof":
      return (
        <section className={BLOCK}>
          <div className={INNER}>
            <div className="flex flex-wrap items-center gap-5">
              {section.logos.map((logo) =>
                LOGOS[logo.key] ? (
                  <Image
                    key={logo.key}
                    src={LOGOS[logo.key]}
                    alt={logo.alt}
                    className="h-7 w-auto opacity-90"
                  />
                ) : null
              )}
              <span className="text-sm tracking-tight text-gray-50">
                {section.label}
              </span>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-6">
              {section.quotes.map((quote) => (
                <Quote key={quote.attribution} quote={quote} />
              ))}
            </div>
          </div>
        </section>
      )

    default:
      return null
  }
}

function UseCaseLanding({
  eyebrow,
  heroTitle,
  heroDescription,
  command,
  heroProof,
  sections,
  finalCta,
}: IUseCaseLanding) {
  const finalPrimaryHref = finalCta.primaryCtaLabel.startsWith("Book")
    ? String(ROUTE.bookADemoConnect)
    : String(ROUTE.dashboard)

  return (
    <div className="bg-black font-inter text-foreground">
      {/* Hero */}
      <section className={`${SECTION} pt-16 pb-14 md:pt-24 md:pb-16 lg:pt-28`}>
        <div className={INNER}>
          <p className="text-sm font-medium tracking-tight text-[#7c86ff]">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl text-[2.25rem] leading-[1.08] font-normal tracking-plus-tight text-balance text-foreground md:text-[3.25rem] md:leading-[1.1]">
            {heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-normal tracking-tight text-pretty text-[#a3a6b2] md:text-lg">
            {heroDescription}
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <CopyCommand command={command} variant="highlighted" />
            <CtaLink cta={{ label: "Book a demo", href: String(ROUTE.bookADemoConnect) }} />
          </div>
          {heroProof ? (
            <div className="mt-12 flex items-center gap-4">
              <span className="text-sm tracking-tight text-gray-50">
                {heroProof.label}
              </span>
              {heroProof.logo && LOGOS[heroProof.logo.key] ? (
                <Image
                  src={LOGOS[heroProof.logo.key]}
                  alt={heroProof.logo.alt}
                  className="h-6 w-auto opacity-80"
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      {sections.map((section, index) => (
        <Section key={index} section={section} command={command} />
      ))}

      {/* Final CTA */}
      <section className={`${SECTION} border-t border-gray-3 py-20 md:py-28`}>
        <div className={`${INNER} flex flex-col items-start`}>
          <h2 className="max-w-3xl text-[1.75rem] leading-tight font-normal tracking-plus-tight text-balance text-foreground md:text-4xl">
            {finalCta.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-normal tracking-tight text-pretty text-[#a3a6b2] md:text-lg">
            {finalCta.body}
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <CtaLink
              cta={{ label: finalCta.primaryCtaLabel, href: finalPrimaryHref }}
              variant="primary"
            />
            <CopyCommand command={command} variant="highlighted" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default UseCaseLanding
