import Image from "next/image"
import bgLight from "@/images/pages/careers/light.png"

function Hero() {
  return (
    <section className="relative px-5 pt-34 pb-20 md:px-8 md:pt-43 md:pb-30 lg:pt-34 lg:pb-40">
      <div
        className="pointer-events-none absolute -top-16 -left-1/2 translate-x-[calc(50%+288px)]"
        aria-hidden
      >
        <Image src={bgLight} width={1720} height={1052} alt="" />
      </div>
      <div className="relative mx-auto flex max-w-208 flex-col items-center text-center">
        <div className="flex items-center gap-2">
          <span className="size-1.5 bg-lagune-3" aria-hidden />
          <p className="text-sm leading-none tracking-normal text-lagune-1 uppercase">
            careers
          </p>
        </div>
        <h1 className="mt-5 text-[2.75rem] leading-dense font-medium tracking-tighter text-white md:text-[3.5rem]">
          Build the infrastructure behind every product update
        </h1>
        <p className="mt-4 max-w-160 text-lg leading-normal tracking-tighter text-gray-8">
          Join the team creating open-source notification infrastructure for
          developers, product teams, and the millions of users they reach.
        </p>
        <a
          className="mt-9 inline-flex h-9.5 items-center justify-center rounded-sm bg-white px-5 text-xs leading-none font-medium tracking-normal text-black uppercase transition-colors duration-300 hover:bg-secondary-foreground"
          href="#apply"
        >
          See open roles
        </a>
      </div>
    </section>
  )
}

export default Hero
