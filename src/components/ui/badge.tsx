import { HTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva("inline-flex w-fit items-center", {
  variants: {
    variant: {
      default: "text-muted-foreground",
      uppercase: "uppercase text-muted-foreground",
      filled: "rounded-full bg-primary text-accent",
      outline:
        "rounded-full border border-muted-foreground font-semibold text-foreground",
    },
    size: {
      sm: "text-sm leading-none",
      md: "text-sm leading-none",
      lg: "text-sm leading-none lg:text-base lg:leading-none",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "lg",
  },
})

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({
  className,
  variant = "default",
  size = "lg",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        badgeVariants({ size, variant }),
        ["outline", "filled"].includes(variant ?? "") && {
          "h-5 px-1.25": size === "sm",
          "h-5 px-2 lg:h-6 lg:px-3": size === "md",
          "h-6 px-3 lg:h-7 lg:px-3.5 lg:text-sm lg:leading-none": size === "lg",
        },
        variant === "uppercase" &&
          "text-[0.8125rem] leading-none lg:text-sm lg:leading-none",
        className
      )}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
