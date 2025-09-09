import { type IAdmonition } from "@/types/common"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

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
        "not-prose admonition relative my-6 flex flex-col rounded-lg bg-[#111018] p-4",
        className
      )}
    >
      <span className="not-prose flex gap-1.5 text-base leading-none font-medium tracking-tight text-gray-13">
        <Icons.lightbulb
          className="shrink-0 text-purple-2"
          size={16}
          viewBox="0 0 16 16"
        />
        <span>{title}</span>
      </span>
      <div className="prose-inside-content prose mt-5 max-w-none border-t border-[#333347]/40 pt-5">
        {children}
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-lg border-gradient bg-[image:var(--admonition-gradient)]" />
    </figure>
  )
}

export default Admonition
