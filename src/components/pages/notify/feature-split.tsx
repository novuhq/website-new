import Image, { type StaticImageData } from "next/image"
import NextLink from "next/link"
import { Check, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

export interface INotifyFeatureLink {
  external?: boolean
  href: string
  label: string
}

export interface INotifyFeatureSplitProps {
  bullets: string[]
  description: string
  image: StaticImageData
  label?: string
  linkClickLocation?: string
  links?: INotifyFeatureLink[]
  reverse?: boolean
  title: string
}

function NotifyFeatureSplit({
  bullets,
  description,
  image,
  label,
  linkClickLocation,
  links,
  reverse = false,
  title,
}: INotifyFeatureSplitProps) {
  return (
    <section className="mt-24 font-inter md:mt-28 lg:mt-32">
      <div className="mx-auto grid w-full max-w-3xl grid-cols-1 items-center gap-10 px-5 md:px-8 lg:max-w-7xl lg:grid-cols-2 lg:gap-16">
        <div className={cn(reverse && "lg:order-2")}>
          {label && (
            <Badge
              className="mb-5 flex h-6 w-fit justify-center border-blue-3/40 bg-blue-3/30 px-2.5 py-1.25 text-sm leading-none tracking-tighter whitespace-nowrap text-blue-1"
              size="sm"
              variant="outline-muted"
            >
              {label}
            </Badge>
          )}

          <h2 className="text-[2rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-foreground md:text-[2.5rem]">
            {title}
          </h2>

          <p className="mt-4 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-60 md:text-lg">
            {description}
          </p>

          <ul className="mt-6 flex flex-col gap-3">
            {bullets.map((bullet) => (
              <li
                className="flex items-start gap-2.5 text-sm leading-normal tracking-tighter text-gray-50 md:text-base"
                key={bullet}
              >
                <Check
                  className="mt-0.75 size-4 shrink-0 text-blue-1"
                  aria-hidden
                />
                {bullet}
              </li>
            ))}
          </ul>

          {/* Lead action is a button, anything after it is a chevron link, so
              two equally-weighted buttons never sit side by side. Mirrors
              ui/action-group.tsx. */}
          {links && links.length > 0 && (
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
              <Button
                className="h-11 px-5 text-base leading-none tracking-tight normal-case max-sm:w-full"
                variant="outline"
                size="none"
                asChild
              >
                <NextLink
                  href={links[0].href}
                  {...(links[0].external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  data-click-location={linkClickLocation}
                  data-click-text={links[0].label}
                >
                  {links[0].label}
                </NextLink>
              </Button>

              {links.slice(1).map((link) => (
                <Link
                  className="w-fit shrink-0 gap-x-1 text-base leading-none tracking-tight"
                  href={link.href}
                  size="none"
                  variant="foreground"
                  animation="arrow-right"
                  key={link.href}
                  data-click-location={linkClickLocation}
                  data-click-text={link.label}
                >
                  {link.label}
                  <ChevronRight size={16} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* These graphics are authored for the homepage bento: the artwork sits
            in the top-centre of the canvas and the lower third is empty, because
            there the card's own copy sits on top of it. Crop to the artwork the
            same way the homepage does - oversize the image and anchor it to the
            top centre - instead of letting the empty band pad out the frame. */}
        <div
          className={cn(
            "relative aspect-8/5 overflow-hidden rounded-xl border border-gray-20 bg-[#0B0C0E]",
            reverse && "lg:order-1"
          )}
        >
          <Image
            className="absolute top-0 left-1/2 h-auto w-[150%] max-w-none -translate-x-1/2"
            src={image}
            alt=""
            sizes="(min-width: 1024px) 912px, 150vw"
            quality={100}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  )
}

export default NotifyFeatureSplit
