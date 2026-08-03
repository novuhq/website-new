import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export type ProductBadgeType = "connect" | "notify"

const PRODUCT_BADGE_LABELS: Record<ProductBadgeType, string> = {
  connect: "Novu Connect",
  notify: "Novu Notify",
}

const PRODUCT_BADGE_THEMES: Record<ProductBadgeType, string> = {
  connect: "border-purple-3/40 bg-purple-3/30 text-purple-1",
  notify: "border-blue-3/40 bg-blue-3/30 text-blue-1",
}

interface IProductBadgeProps
  extends Omit<ComponentProps<typeof Badge>, "children" | "size" | "variant"> {
  children?: string
  type: ProductBadgeType
}

function ProductBadge({
  children,
  className,
  type,
  ...props
}: IProductBadgeProps) {
  return (
    <Badge
      className={cn(
        "h-6 px-2.5 text-sm leading-none tracking-tighter whitespace-nowrap",
        PRODUCT_BADGE_THEMES[type],
        className
      )}
      variant="outline-muted"
      size="md"
      {...props}
    >
      {children ?? PRODUCT_BADGE_LABELS[type]}
    </Badge>
  )
}

export default ProductBadge
