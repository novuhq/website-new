import type { Route } from "next"
import Image from "next/image"
import NextLink from "next/link"

import { cn } from "@/lib/utils"

export interface IIntegrationCardProps {
  title: string
  description: string
  iconSrc: string
  iconAlt?: string
  category?: string
  href?: string | Route
  className?: string
}

function IntegrationCard({
  title,
  description,
  iconSrc,
  iconAlt,
  category,
  href,
  className,
}: IIntegrationCardProps) {
  const label = iconAlt ?? title

  const shellClass = cn(
    "group relative flex h-full flex-col gap-4 overflow-hidden rounded-xl border border-integration-card-border bg-integration-card p-5",
    "transition-[background] duration-200 hover:[background:var(--integration-card-hover-bg)]",
    className
  )

  const body = (
    <>
      <div className="relative z-10 flex flex-col gap-4">
        <div className="relative flex h-6 w-full shrink-0 items-start">
          <div className="relative size-6 shrink-0 overflow-hidden">
            <Image
              src={iconSrc}
              alt={label}
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          {category ? (
            <span
              className={cn(
                "pointer-events-none absolute top-0 right-0 rounded-xl border border-integration-card-category-border bg-integration-card-category-bg px-2.5 pt-[0.3125rem] pb-[0.4375rem] text-xs leading-none tracking-tighter whitespace-nowrap text-gray-9",
                "opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              )}
            >
              {category}
            </span>
          ) : null}
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <h3 className="text-base leading-dense font-medium tracking-tighter text-foreground">
            {title}
          </h3>
          <p className="line-clamp-2 text-[0.9375rem] leading-snug font-book tracking-tighter text-gray-8">
            {description}
          </p>
        </div>
      </div>
    </>
  )

  if (href) {
    return (
      <NextLink
        href={href}
        className={cn(shellClass, "block text-left no-underline")}
        data-slot="integration-card"
      >
        {body}
      </NextLink>
    )
  }

  return (
    <article className={shellClass} data-slot="integration-card">
      {body}
    </article>
  )
}

export default IntegrationCard
