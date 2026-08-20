import Image from "next/image"

import type { UseCasePageData } from "./types"

interface PainRestatementProps {
  data: UseCasePageData["painRestatement"]
}

function PainRestatement({ data }: PainRestatementProps) {
  return (
    <section className="mt-20 mb-14 md:mt-30 md:mb-22 lg:mt-37 lg:mb-31 xl:mt-48 xl:mb-44">
      <div className="mx-auto flex w-full max-w-368 flex-col items-center px-4 md:px-7 lg:px-10 2xl:px-0">
        <h2 className="mx-auto max-w-[590px] text-center text-[32px] leading-[1.125] font-medium tracking-tighter text-white md:max-w-[624px] md:text-5xl xl:max-w-none xl:text-[44px]">
          {data.title}
        </h2>
        <p className="mx-auto mt-3 max-w-[590px] text-center text-base leading-snug font-book text-gray-9 md:mt-4 md:text-lg lg:mt-5 lg:max-w-[624px] xl:mt-4 xl:max-w-[800px]">
          {data.description}
        </p>
        <div className="mt-8 grid w-full grid-cols-1 gap-y-5 md:mt-12 md:gap-y-6 lg:mt-14 lg:grid-cols-3 lg:gap-x-7 xl:mt-16 xl:gap-x-10">
          {data.cards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl bg-linear-to-b from-gray-2 to-gray-2/70 xl:rounded-[20px]"
            >
              <div className="p-5 xl:p-8">
                <div className="flex size-12 items-center justify-center md:size-14 lg:size-16 xl:size-18">
                  <Image
                    className="size-full"
                    src={card.image.src}
                    alt={card.image.alt}
                    width={card.image.width}
                    height={card.image.height}
                  />
                </div>
                <h3 className="mt-[18px] text-xl leading-snug font-medium text-white md:text-2xl lg:mt-5 xl:text-3xl">
                  {card.title}
                </h3>
                <p className="mt-1.5 leading-snug font-book text-gray-9 md:mt-2.5 xl:mt-3">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PainRestatement
