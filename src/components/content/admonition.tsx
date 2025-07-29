import { type IAdmonition } from "@/types/common"
import { cn } from "@/lib/utils"

interface IAdmonitionProps extends IAdmonition {
  className?: string
}

function Admonition({
  title = "Good to know",
  children,
  className,
}: IAdmonitionProps) {
  return (
    <figure
      className={cn(
        "not-prose admonition my-6 flex flex-col rounded-lg border border-gray-2 bg-background p-5",
        className
      )}
    >
      <span className="not-prose flex text-base leading-none font-medium tracking-tight text-muted-foreground">
        {title}
      </span>
      <div className="prose-inside-content prose mt-4 max-w-none border-t border-gray-2 pt-4">
        {children}
      </div>
    </figure>
  )
}

export default Admonition
