import { cva } from "class-variance-authority"

import { cn, getFormattedDate } from "@/lib/utils"

const authorsVariants = cva("flex", {
  variants: {
    variant: {
      default: "text-[#F5CFFC]/60",
      muted: "text-muted-foreground",
    },
    size: {
      sm: "text-sm",
      md: "text-sm lg:text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
})

interface IDateProps {
  className?: string
  publishedAt: string
  variant?: "default" | "muted"
  size?: "sm" | "md"
}

function Date({
  className,
  publishedAt,
  variant = "default",
  size = "md",
}: IDateProps) {
  return (
    <time
      className={cn(
        "flex leading-none tracking-tight whitespace-nowrap",
        authorsVariants({ variant, size }),
        className
      )}
      dateTime={publishedAt}
    >
      {getFormattedDate(publishedAt)}
    </time>
  )
}

export default Date
