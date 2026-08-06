import NextLink from "next/link"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"

export interface IInboxCapability {
  description: string
  href?: string
  linkLabel?: string
  title: string
}

interface IInboxCapabilitiesProps {
  className?: string
  items: IInboxCapability[]
}

function CapabilityCardBody({ item }: { item: IInboxCapability }) {
  return (
    <>
      <h3 className="text-base leading-tight font-medium tracking-tighter text-foreground">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-normal font-normal tracking-tighter text-pretty text-gray-50">
        {item.description}
      </p>
      {item.href && item.linkLabel && (
        <span className="mt-auto flex items-center gap-1 pt-4 text-sm leading-none font-medium tracking-tighter text-blue-1">
          {item.linkLabel}
          <ArrowUpRight
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </span>
      )}
    </>
  )
}

function InboxCapabilities({ className, items }: IInboxCapabilitiesProps) {
  if (!items || items.length === 0) {
    return null
  }

  const cardClassName =
    "flex h-full flex-col rounded-xl border border-gray-20 bg-[#0B0C0E] p-5 lg:p-6"

  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-5 font-inter sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {items.map((item) => (
        <li key={item.title}>
          {item.href ? (
            <NextLink
              className={cn(
                cardClassName,
                "group transition-colors duration-300 hover:border-white/25"
              )}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              data-click-location="notify_inbox_capabilities"
              data-click-text={item.linkLabel}
            >
              <CapabilityCardBody item={item} />
            </NextLink>
          ) : (
            <div className={cardClassName}>
              <CapabilityCardBody item={item} />
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

export default InboxCapabilities
