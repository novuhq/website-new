import type { ComponentProps, HTMLAttributes, ReactNode } from "react"
import Image from "next/image"
import NextLink from "next/link"
import productHuntIcon from "@/svgs/icons/product_hunt.svg"

import { cn } from "@/lib/utils"
import { LinkInlineArrow } from "@/components/ui/link-inline-arrow"

type ProductHuntLinkProps = Omit<
  ComponentProps<typeof NextLink>,
  "children" | "className" | "href" | "rel" | "target"
> &
  Partial<Record<`data-${string}`, string>> & {
    className?: string
    href?: ComponentProps<typeof NextLink>["href"]
    rel?: ComponentProps<typeof NextLink>["rel"]
    target?: ComponentProps<typeof NextLink>["target"]
  }

interface ProductHuntBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  label?: ReactNode
  linkProps?: ProductHuntLinkProps
  prefixText?: ReactNode
}

const DEFAULT_PRODUCT_HUNT_LAUNCH_URL =
  "https://www.producthunt.com/products/novu/launches/novu-connect"

function ProductHuntBadge({
  className,
  label = "Product Hunt",
  linkProps = {},
  prefixText = "Featured on",
  ...props
}: ProductHuntBadgeProps) {
  const {
    className: linkClassName,
    href = DEFAULT_PRODUCT_HUNT_LAUNCH_URL,
    rel = "noopener noreferrer",
    target = "_blank",
    ...productHuntLinkProps
  } = linkProps

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 whitespace-nowrap text-[15px]",
        className
      )}
      {...props}
    >
      <span className="leading-normal font-normal tracking-[-0.3px] text-gray-8">
        {prefixText}
      </span>
      <NextLink
        className={cn(
          "group inline-flex items-center gap-[3px] rounded-sm focus-visible:ring-2 focus-visible:ring-lagune-3/40 focus-visible:outline-none",
          linkClassName
        )}
        href={href}
        rel={rel}
        target={target}
        {...productHuntLinkProps}
      >
        <Image
          src={productHuntIcon}
          alt=""
          width={20}
          height={20}
          className="size-5 shrink-0"
          aria-hidden
        />
        <span className="inline-flex items-center gap-1.5 leading-snug font-book text-white transition-colors duration-200 group-hover:text-lagune-3 group-focus-visible:text-lagune-3">
          <span>{label}</span>
          <LinkInlineArrow
            className="mt-0 flex h-4 items-center group-focus-visible:w-3"
            lineClassName="bg-lagune-3 group-focus-visible:opacity-100"
          />
        </span>
      </NextLink>
    </span>
  )
}

export default ProductHuntBadge
