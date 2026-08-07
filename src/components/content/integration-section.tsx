import type { ReactNode } from "react"
import { Eye, RefreshCw, Settings, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const ICON_MAP: Record<string, LucideIcon> = {
  eye: Eye,
  "refresh-cw": RefreshCw,
  settings: Settings,
}

interface IntegrationSectionProps {
  title: string
  icon: string
  children: ReactNode
  className?: string
}

function IntegrationSection({
  title,
  icon,
  children,
  className,
}: IntegrationSectionProps) {
  const Icon = ICON_MAP[icon] ?? Eye

  return (
    <section className={cn("flex flex-col gap-2.5", className)}>
      <h2 className="font-display flex items-center gap-2.5 text-lg leading-snug tracking-tight text-foreground">
        <Icon
          className="size-[1.375rem] shrink-0 text-foreground"
          aria-hidden
        />
        {title}
      </h2>
      <div
        className={cn(
          "text-sm leading-snug font-book tracking-tight text-gray-9",
          "[&_p]:text-sm [&_p]:leading-snug [&_p]:tracking-tight",
          "[&_code]:inline-flex [&_code]:items-center [&_code]:rounded [&_code]:border [&_code]:border-border [&_code]:bg-gray-3 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8125rem] [&_code]:leading-snug [&_code]:whitespace-nowrap [&_code]:text-foreground"
        )}
      >
        {children}
      </div>
    </section>
  )
}

export default IntegrationSection
