import Image from "next/image"
import NextLink from "next/link"

import type { IComparisonFrustrations } from "@/types/comparison"
import { Button } from "@/components/ui/button"

function Frustrations({
  frustrations,
}: {
  frustrations: IComparisonFrustrations
}) {
  return (
    <section className="relative xl:pt-50">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-16 px-5 md:px-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="max-w-140 leading-tight font-medium tracking-tighter text-pretty text-white lg:text-[2.5rem]">
            {frustrations.title}
          </h2>
          <p className="max-w-112.5 font-book tracking-tighter text-gray-8">
            {frustrations.subtitle}
          </p>
        </div>

        <div className="flex w-full flex-col gap-14">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-15">
            {frustrations.items.map((item) => (
              <div key={item.title} className="flex flex-col gap-5">
                <Image
                  src={item.icon}
                  alt=""
                  width={40}
                  height={40}
                  aria-hidden
                  unoptimized
                />
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl leading-[1.25] font-medium tracking-tighter text-white">
                    {item.title}
                  </h3>
                  <p className="text-[15px] leading-snug font-book tracking-tighter text-gray-8">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button size="lg" variant="outline" asChild>
              <NextLink href={frustrations.cta.href}>
                {frustrations.cta.label}
              </NextLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Frustrations
