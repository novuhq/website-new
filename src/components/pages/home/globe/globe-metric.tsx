import { cn } from "@/lib/utils"

interface IGlobeMetricProps {
  compact?: boolean
}

export default function GlobeMetric({ compact = false }: IGlobeMetricProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center border border-gray-20 bg-[#0B0C0E] font-mono leading-none tracking-tighter text-white uppercase",
        compact ? "h-6 px-2 text-[10px] sm:text-xs" : "h-7.5 px-3 text-sm"
      )}
    >
      <span className="absolute inset-x-8 -top-16 h-20 bg-[radial-gradient(ellipse_at_center,rgba(159,74,255,0.24),transparent_70%)] blur-lg" />
      <span className="relative">
        1.5b messages just sent out in the last month
      </span>
    </div>
  )
}
