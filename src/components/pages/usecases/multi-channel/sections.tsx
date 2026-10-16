import type { ReactNode } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { LinkInlineArrow } from "@/components/ui/link-inline-arrow"

import {
  CHANNELS,
  CLOSING,
  DELIVERY_CONTROLS,
  type SectionImage,
  type TextLinkCopy,
  type TextSectionCopy,
} from "./data"

export const CONTAINER = "mx-auto w-full max-w-304 px-4 md:px-7 lg:px-8"
export const SECTION_SPACING = "mt-20 md:mt-28 lg:mt-36 xl:mt-44"
export const BODY_TEXT =
  "text-base leading-normal font-book text-gray-9 md:text-lg"
export const CARD =
  "rounded-2xl bg-linear-to-b from-gray-2 to-gray-2/70 p-5 xl:rounded-[20px] xl:p-8"

const INLINE_MARKS = /(`[^`]+`|\[[^\]]+\]\([^)]+\))/
const LINK_PARTS = /^\[([^\]]+)\]\(([^)]+)\)$/

/** Renders the copy's `code` and [text](url) marks. */
export function RichText({ text }: { text: string }) {
  return text.split(INLINE_MARKS).map((part, index) => {
    if (part.startsWith("`")) {
      return (
        <code
          className="rounded bg-gray-3 px-1.5 py-0.5 font-mono text-[0.875em] text-white"
          key={index}
        >
          {part.slice(1, -1)}
        </code>
      )
    }

    const link = LINK_PARTS.exec(part)
    if (link) {
      return (
        <Link className="inline" href={link[2]} size="none" key={index}>
          {link[1]}
        </Link>
      )
    }

    return part
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

export function TextLink({ text, url }: TextLinkCopy) {
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

export function TextLinks({ links }: { links: readonly TextLinkCopy[] }) {
  return (
    <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
      {links.map((link) => (
        <TextLink key={link.url} {...link} />
      ))}
    </div>
  )
}

function SectionFigure({
  image,
  className,
}: {
  image: SectionImage
  className?: string
}) {
  return (
    <Image
      className={cn(
        "h-auto w-full",
        image.placement === "below" &&
          "rounded-xl border border-gray-3 xl:rounded-2xl",
        className
      )}
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={
        image.placement === "below"
          ? "(max-width: 1216px) calc(100vw - 32px), 1152px"
          : "(max-width: 1023px) calc(100vw - 32px), 560px"
      }
    />
  )
}

/** Heading, paragraphs, links and an optional image: most sections on this page. */
export function TextSection({ data }: { data: TextSectionCopy }) {
  const { image } = data
  const isSide = image?.placement === "side"

  return (
    <section className={SECTION_SPACING}>
      <div
        className={cn(
          CONTAINER,
          isSide && "grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
        )}
      >
        <div className="max-w-3xl">
          <SectionHeading>{data.title}</SectionHeading>
          {data.paragraphs.map((paragraph) => (
            <p className={cn(BODY_TEXT, "mt-5")} key={paragraph}>
              <RichText text={paragraph} />
            </p>
          ))}
          <TextLinks links={data.links} />
        </div>
        {image && (
          <SectionFigure
            image={image}
            className={
              isSide ? "mx-auto max-w-md lg:max-w-none" : "mt-10 md:mt-12"
            }
          />
        )}
      </div>
    </section>
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

        <div className="mt-8 grid items-start gap-8 md:mt-12 lg:grid-cols-[3fr_2fr] lg:gap-12">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-3 text-xs tracking-normal text-gray-8 uppercase">
                {CHANNELS.columns.map((column) => (
                  <th
                    className="py-3 pr-6 font-medium"
                    key={column}
                    scope="col"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHANNELS.rows.map(({ channel, integrations }) => (
                <tr className="border-b border-gray-3 align-top" key={channel}>
                  <th
                    className="w-1/4 py-4 pr-6 text-lg font-medium text-white md:py-5"
                    scope="row"
                  >
                    {channel}
                  </th>
                  <td className="py-4 leading-normal font-book text-gray-9 md:py-5 md:text-lg">
                    {integrations}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <article className={CARD}>
            <h3 className="text-xl leading-snug font-medium text-white md:text-2xl">
              {CHANNELS.routing.title}
            </h3>
            <p className="mt-2.5 leading-normal font-book text-gray-9">
              {CHANNELS.routing.description}
            </p>
          </article>
        </div>

        <TextLinks links={CHANNELS.links} />
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
        <div className="mt-8 grid gap-5 md:mt-12 md:grid-cols-2 lg:gap-7">
          {DELIVERY_CONTROLS.cards.map(({ title, description }) => (
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
