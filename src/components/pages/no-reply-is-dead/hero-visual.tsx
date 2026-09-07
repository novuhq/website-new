import Image from "next/image"
import heroVisual from "@/images/pages/no-reply-is-dead/hero-visual.jpg"

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-152 lg:mx-0">
      <Image
        src={heroVisual}
        alt="A phone lock screen showing an “Order shipped” notification with tracking #TN4471, arriving Thursday."
        width={608}
        height={532}
        className="w-full rounded-2xl"
        sizes="(min-width: 1024px) 608px, 100vw"
        priority
      />
    </div>
  )
}
