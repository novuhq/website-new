import Image from "next/image"

import { cn } from "@/lib/utils"

import type { UseCaseBenefit, UseCasePageData } from "./types"

interface BenefitRowProps {
  benefit: UseCaseBenefit
  imageSide: "left" | "right"
}

function BenefitRow({ benefit, imageSide }: BenefitRowProps) {
  return (
    <section className="mt-14 md:mt-26 lg:mt-36 xl:mt-40">
      <div className="mx-auto w-full max-w-304 px-4 md:px-7 lg:px-8">
        <div className="grid items-center justify-items-center md:grid-cols-2">
          <div
            className={cn(
              "relative z-10 order-first mb-6 text-center md:mb-0 md:text-left",
              imageSide === "left"
                ? "md:order-last md:pl-8 lg:pl-16 xl:pl-24"
                : "md:pr-8 lg:pr-16 xl:pr-24"
            )}
          >
            <h3 className="text-3xl leading-[1.125] font-medium tracking-tighter text-white md:text-[32px] lg:text-5xl xl:text-6xl">
              {benefit.title}
            </h3>
            <p className="mt-4 text-sm font-book tracking-tighter text-gray-8 lg:text-lg">
              {benefit.description}
            </p>
          </div>
          <div
            className="relative w-full max-w-[842px] overflow-hidden"
            style={{
              aspectRatio: `${benefit.image.width} / ${benefit.image.height}`,
            }}
          >
            <Image
              className="object-cover"
              src={benefit.image.src}
              alt={benefit.image.alt}
              fill
              sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1215px) calc(50vw - 60px), 608px"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

interface BenefitsProps {
  data: UseCasePageData["benefits"]
}

function Benefits({ data }: BenefitsProps) {
  return (
    <section className="bg-gray-2 pt-12 pb-14 md:pt-18 md:pb-26 lg:pt-24 lg:pb-34 xl:pt-26 xl:pb-44">
      <h2 className="mx-auto max-w-[812px] text-center text-3xl leading-[1.125] font-medium tracking-tighter text-white md:text-5xl lg:text-[44px] xl:text-6xl">
        {data.title}
      </h2>
      <p className="mx-auto mt-3.5 max-w-[712px] text-center text-base leading-snug font-book text-gray-9 md:text-lg xl:mt-4">
        {data.description}
      </p>
      {data.sections.map((benefit, index) => (
        <BenefitRow
          key={benefit.title}
          benefit={benefit}
          imageSide={index % 2 === 0 ? "right" : "left"}
        />
      ))}
    </section>
  )
}

export default Benefits
