import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

import type { UseCasePageData } from "./types"

interface UseCaseHeroProps {
  data: UseCasePageData["hero"]
}

function UseCaseHero({ data }: UseCaseHeroProps) {
  return (
    <section className="relative overflow-hidden pt-25 md:pt-30 lg:pt-32 xl:pt-[138px]">
      <div className="relative z-10 mx-auto flex w-full max-w-368 flex-col items-center px-4 md:px-7 lg:px-10 2xl:px-0">
        <h1 className="mx-auto max-w-[659px] text-center text-5xl leading-[1.125] font-medium tracking-tighter text-white md:text-[44px] lg:max-w-[717px] lg:text-6xl xl:max-w-3xl xl:text-7xl">
          {data.title}
        </h1>
        <p className="mx-auto mt-3.5 max-w-xl text-center text-base leading-snug font-book text-white/70 md:text-lg lg:mt-4 xl:max-w-[623px]">
          {data.description}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-x-7 gap-y-4 min-[501px]:flex-row lg:mt-9 xl:mt-10">
          {data.links.map((link, index) => (
            <Button
              key={link.text}
              className="-mt-px !h-12 min-w-54 !px-6 !text-sm uppercase xl:!h-14"
              variant={index === 0 ? "default" : "outline"}
              size="none"
              asChild
            >
              <Link
                href={link.url}
                variant="clean"
                size="none"
                data-click-location="usecase"
                data-click-text="book_a_call"
              >
                {link.text}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UseCaseHero
