import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { LinkInlineArrow } from "@/components/ui/link-inline-arrow"

import {
  CHANNELS,
  CLOSING,
  DELIVERY_CONTROLS,
  OBSERVABILITY,
  ROUTING,
  WHY,
} from "./data"

export const CONTAINER = "mx-auto w-full max-w-304 px-4 md:px-7 lg:px-8"
export const SECTION_SPACING = "mt-20 md:mt-28 lg:mt-36 xl:mt-44"
export const BODY_TEXT =
  "text-base leading-normal font-book text-gray-9 md:text-lg"
export const CARD =
  "rounded-2xl bg-linear-to-b from-gray-2 to-gray-2/70 p-5 xl:rounded-[20px] xl:p-8"

const INLINE_LINK = /(\[[^\]]+\]\([^)]+\))/
const LINK_PARTS = /^\[([^\]]+)\]\(([^)]+)\)$/

/** Renders the copy's [text](url) marks as links. */
export function RichText({ text }: { text: string }) {
  return text.split(INLINE_LINK).map((part, index) => {
    const link = LINK_PARTS.exec(part)

    return link ? (
      <Link className="inline" href={link[2]} size="none" key={index}>
        {link[1]}
      </Link>
    ) : (
      part
    )
  })
}

export function SectionHeading({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        "text-[32px] leading-[1.125] font-medium tracking-tighter text-balance text-white md:text-[40px] xl:text-[44px]",
        className
      )}
    >
      {children}
    </h2>
  )
}

export function TextLink({ text, url }: { text: string; url: string }) {
  return (
    <Link
      className="group text-sm leading-snug tracking-normal"
      href={url}
      size="none"
    >
      {text}
      <LinkInlineArrow lineClassName="bg-primary-muted" />
    </Link>
  )
}

export function Channels() {
  return (
    <section className={SECTION_SPACING}>
      <div className={CONTAINER}>
        <SectionHeading className="max-w-3xl">{CHANNELS.title}</SectionHeading>
        <p className={cn(BODY_TEXT, "mt-4 max-w-3xl")}>
          {CHANNELS.description}
        </p>

        <table className="mt-8 w-full max-w-4xl text-left md:mt-12">
          <thead>
            <tr className="border-b border-gray-3 text-xs tracking-normal text-gray-8 uppercase">
              {CHANNELS.columns.map((column) => (
                <th className="py-3 pr-6 font-medium" key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CHANNELS.rows.map(({ channel, integrations }) => (
              <tr className="border-b border-gray-3 align-top" key={channel}>
                <th
                  className="w-1/4 py-5 pr-6 text-lg font-medium text-white md:py-6 md:text-xl"
                  scope="row"
                >
                  {channel}
                </th>
                <td className="py-5 leading-normal font-book text-gray-9 md:py-6 md:text-lg">
                  {integrations}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6">
          <TextLink {...CHANNELS.link} />
        </div>
      </div>
    </section>
  )
}

interface CardCopy {
  title: string
  description: string
}

function Cards({
  cards,
  className,
}: {
  cards: readonly CardCopy[]
  className: string
}) {
  return (
    <div className={cn("mt-8 grid gap-5 md:mt-12 lg:gap-7", className)}>
      {cards.map(({ title, description }) => (
        <article className={CARD} key={title}>
          <h3 className="text-xl leading-snug font-medium text-white md:text-2xl">
            {title}
          </h3>
          <p className="mt-2.5 leading-normal font-book text-gray-9">
            {description}
          </p>
        </article>
      ))}
    </div>
  )
}

export function Why() {
  return (
    <section className={SECTION_SPACING}>
      <div className={CONTAINER}>
        <SectionHeading className="max-w-3xl">{WHY.title}</SectionHeading>
        <p className={cn(BODY_TEXT, "mt-4 max-w-3xl")}>{WHY.description}</p>
        <Cards cards={WHY.cards} className="lg:grid-cols-3" />
      </div>
    </section>
  )
}

export function DeliveryControls() {
  return (
    <section className={SECTION_SPACING}>
      <div className={CONTAINER}>
        <SectionHeading className="max-w-3xl">
          {DELIVERY_CONTROLS.title}
        </SectionHeading>
        <p className={cn(BODY_TEXT, "mt-4 max-w-3xl")}>
          {DELIVERY_CONTROLS.description}
        </p>
        <Cards cards={DELIVERY_CONTROLS.cards} className="md:grid-cols-2" />
      </div>
    </section>
  )
}

export function Routing() {
  return (
    <section className={SECTION_SPACING}>
      <div className={CONTAINER}>
        <SectionHeading className="max-w-3xl">{ROUTING.title}</SectionHeading>
        <p className={cn(BODY_TEXT, "mt-4 max-w-3xl")}>{ROUTING.description}</p>
        <Cards cards={ROUTING.cards} className="lg:grid-cols-3" />
        <div className="mt-6">
          <TextLink {...ROUTING.link} />
        </div>
      </div>
    </section>
  )
}

export function Observability() {
  return (
    <section className={SECTION_SPACING}>
      <div className={cn(CONTAINER, "max-w-208")}>
        <SectionHeading>{OBSERVABILITY.title}</SectionHeading>
        {OBSERVABILITY.paragraphs.map((paragraph) => (
          <p className={cn(BODY_TEXT, "mt-5")} key={paragraph}>
            <RichText text={paragraph} />
          </p>
        ))}
        <div className="mt-6">
          <TextLink {...OBSERVABILITY.link} />
        </div>
      </div>
    </section>
  )
}

export function Closing() {
  return (
    <section className="bg-black py-16 md:py-24 lg:py-32">
      <div
        className={cn(
          CONTAINER,
          "flex max-w-208 flex-col items-center text-center"
        )}
      >
        <SectionHeading>{CLOSING.title}</SectionHeading>
        <p className={cn(BODY_TEXT, "mt-4")}>{CLOSING.description}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-x-7 gap-y-4 min-[501px]:flex-row">
          {CLOSING.links.map((link, index) => (
            <Button
              className="!h-12 min-w-54 !px-6 !text-sm uppercase"
              variant={index === 0 ? "default" : "outline"}
              size="none"
              key={link.text}
              asChild
            >
              <Link
                href={link.url}
                variant="clean"
                size="none"
                data-click-location="usecase_closing_cta"
                data-click-text={link.text.toLowerCase().replaceAll(" ", "_")}
              >
                {link.text}
              </Link>
            </Button>
          ))}
        </div>
        <div className="mt-7">
          <TextLink {...CLOSING.supportingLink} />
        </div>
      </div>
    </section>
  )
}
