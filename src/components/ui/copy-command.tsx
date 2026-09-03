"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"

const COPY_COMMAND_HIGHLIGHTED_GLOW_BLURS = [
  "blur-[18px]",
  "blur-[14px]",
  "blur-[10px]",
  "blur-[6px]",
  "blur-[3.5px]",
  "blur-[2px]",
  "blur-[1px]",
] as const

const copyCommandContainerVariants = cva("relative w-full", {
  variants: {
    variant: {
      default: "",
      highlighted: "isolate max-w-full sm:w-70.5",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const copyCommandVariants = cva(
  "inline-flex w-full items-center justify-between rounded-md border font-mono",
  {
    variants: {
      variant: {
        default:
          "h-10 gap-4 border-border bg-background pl-3 text-sm tracking-tight text-muted-foreground transition-colors lg:h-11",
        highlighted:
          "relative z-10 h-11 gap-4 border-white/50 bg-background pr-1 pl-5 text-white transition-none focus-within:ring-2 focus-within:ring-white/30 lg:h-11",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CopyCommandProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof copyCommandVariants> {
  command: string
  commandClassName?: string
  controlClassName?: string
  copiedContent?: React.ReactNode
  copyButtonClassName?: string
  copyButtonProps?: Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "aria-label" | "className" | "onClick" | "type"
  > & {
    "data-click-location"?: string
    "data-click-text"?: string
    "data-getting-started-flow-action"?: string
    "data-getting-started-flow-copy-value"?: string
  }
  onCopySuccess?: () => void
}

function CopyCommand({
  command,
  commandClassName,
  controlClassName,
  copiedContent,
  copyButtonClassName,
  copyButtonProps,
  onCopySuccess,
  variant,
  className,
  ...props
}: CopyCommandProps) {
  const { isCopied, handleCopy } = useCopyToClipboard(2000)

  const copy = () => {
    if (handleCopy(command)) onCopySuccess?.()
  }

  return (
    <div
      className={cn(copyCommandContainerVariants({ variant }), className)}
      {...props}
    >
      {variant === "highlighted" && (
        <span className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          {COPY_COMMAND_HIGHLIGHTED_GLOW_BLURS.map((blur) => (
            <span
              className={cn(
                "absolute inset-0 rounded-md border border-white opacity-50",
                blur
              )}
              key={blur}
            />
          ))}
        </span>
      )}

      <div className={cn(copyCommandVariants({ variant }), controlClassName)}>
        <span
          className={cn(
            "truncate text-sm leading-snug tracking-tight text-muted-foreground",
            variant === "highlighted" &&
              "min-w-0 flex-1 text-base leading-[1.2] font-normal tracking-normal text-white",
            commandClassName
          )}
        >
          {command}
        </span>
        <button
          {...copyButtonProps}
          className={cn(
            "flex size-10 shrink-0 cursor-pointer items-center justify-center text-foreground transition-colors hover:text-foreground/85 lg:size-11",
            variant === "highlighted" &&
              "!h-9 !w-19.75 rounded-sm bg-white font-inter text-base leading-none font-medium tracking-[-0.4px] text-black hover:bg-gray-10 hover:text-black lg:!h-9 lg:!w-19.75",
            copyButtonClassName
          )}
          type="button"
          onClick={copy}
          aria-label={isCopied ? "Copied" : "Copy to clipboard"}
        >
          {isCopied ? (
            (copiedContent ?? <Check className="size-5" strokeWidth={2.5} />)
          ) : variant === "highlighted" ? (
            "Copy"
          ) : (
            <Copy className="size-5" />
          )}
        </button>
        <span className="sr-only" aria-live="polite">
          {isCopied ? "Command copied to clipboard" : ""}
        </span>
      </div>

      {variant === "highlighted" && (
        <span
          className="pointer-events-none absolute inset-0 z-20 rounded-md border-gradient bg-[radial-gradient(30.74%_144.53%_at_59.44%_100%,#fff_3%,#ccd7ff_22%,#c2b2ff_100%)]"
          aria-hidden
        />
      )}
    </div>
  )
}

export { CopyCommand }
