import { ROUTE } from "@/constants/routes"

import { Button } from "@/components/ui/button"
import { CopyCommand } from "@/components/ui/copy-command"

import type { IBuilderLanding, ISection } from "./config"

const SECTION = "px-5 md:px-8"
const INNER = "mx-auto w-full max-w-336"
const BLOCK = `${SECTION} border-t border-gray-3 py-16 md:py-20`

function CtaLink({
  label,
  href,
  variant = "outline-transparent",
}: {
  label: string
  href: string
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
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {label}
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

function Section({ section }: { section: ISection }) {
  switch (section.type) {
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
              {section.items.map((item) => {
                const cardClass =
                  "rounded-2xl border border-gray-3 bg-[#0b0b12] p-6"
                const inner = (
                  <>
                    <h3 className="text-lg font-medium tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-base leading-normal tracking-tight text-pretty text-[#a3a6b2]">
                      {item.description}
                    </p>
                  </>
                )
                return item.href ? (
                  <a
                    key={item.title}
                    href={item.href}
                    className={`${cardClass} transition-colors hover:border-gray-20`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={item.title} className={cardClass}>
                    {inner}
                  </div>
                )
              })}
            </div>
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
          </div>
        </section>
      )

    default:
      return null
  }
}

function BuilderLanding({
  eyebrow,
  heroTitle,
  heroDescription,
  command,
  sections,
  finalCta,
}: IBuilderLanding) {
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
            <CtaLink
              label="Book a demo"
              href={String(ROUTE.bookADemoConnect)}
            />
          </div>
        </div>
      </section>

      {sections.map((section, index) => (
        <Section key={index} section={section} />
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
              label={finalCta.primaryCtaLabel}
              href={finalPrimaryHref}
              variant="primary"
            />
            <CopyCommand command={command} variant="highlighted" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default BuilderLanding
