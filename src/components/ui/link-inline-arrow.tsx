import { cn } from "@/lib/utils"

interface ILinkInlineArrowProps {
  className?: string
  lineClassName?: string
}

export function LinkInlineArrow({
  className,
  lineClassName,
}: ILinkInlineArrowProps) {
  return (
    <span
      className={cn(
        "relative mt-0.5 w-1.5 shrink-0 overflow-hidden transition-[width] duration-200 group-hover:w-3",
        className
      )}
    >
      <svg
        className="pointer-events-none ml-auto h-2.5 w-1.5"
        width="6"
        height="10"
        viewBox="0 0 6 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path d="M1 9L5 5L1 1" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span
        className={cn(
          "absolute top-1/2 right-px h-px w-full -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
          lineClassName
        )}
      />
    </span>
  )
}
