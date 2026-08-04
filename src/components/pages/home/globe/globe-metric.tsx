export default function GlobeMetric() {
  return (
    <div className="relative flex h-6 w-fit items-center justify-center border border-gray-20 bg-[#0B0C0E] px-2 font-mono text-[10px] leading-none tracking-tighter text-white uppercase sm:text-xs md:h-7.5 md:px-3 md:text-sm">
      <span className="absolute inset-x-8 -top-16 h-20 bg-[radial-gradient(ellipse_at_center,rgba(159,74,255,0.24),transparent_70%)] blur-lg" />
      <span className="relative">
        1.5b messages just sent out in the last month
      </span>
    </div>
  )
}
