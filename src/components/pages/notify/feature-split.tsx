import Image, { type StaticImageData } from "next/image"
import NextLink from "next/link"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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

          {links && links.length > 0 && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              {links.map((link) => (
                <Button
                  className="h-11 px-5 text-base leading-none tracking-tight normal-case max-sm:w-full"
                  variant="outline-transparent"
                  size="none"
                  key={link.href}
                  asChild
                >
                  <NextLink
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    data-click-location={linkClickLocation}
                    data-click-text={link.label}
                  >
                    {link.label}
                  </NextLink>
                </Button>
              ))}
            </div>
          )}
        </div>

        <div
          className={cn(
            "relative overflow-hidden rounded-xl border border-gray-20 bg-[#0B0C0E]",
            reverse && "lg:order-1"
          )}
        >
          <Image
            className="h-auto w-full"
            src={image}
            alt=""
            sizes="(min-width: 1024px) 608px, 100vw"
            quality={100}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  )
}

export default NotifyFeatureSplit
