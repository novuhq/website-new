import Image from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import heroIllustrationMobile from "@/images/pages/aci/hero/image-mobile.png"
import heroIllustration from "@/images/pages/aci/hero/image.png"

import { Button } from "@/components/ui/button"

function ACI() {
  return (
    <section className="safe-paddings overflow-x-clip bg-black pt-20 pb-49 text-white md:pt-24 md:pb-69 lg:pt-54 lg:pb-23 xl:pt-70.5">
      <div className="mx-auto w-full max-w-304 px-5 md:px-8 2xl:px-0">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-6 xl:gap-24">
          <div className="relative z-10 flex flex-col items-center gap-8 lg:items-start">
            <div className="flex flex-col items-center lg:items-start">
              <div className="flex items-center gap-2">
                <span className="size-1.5 bg-lagune-3" />
                <span className="text-sm leading-none font-normal text-lagune-1 uppercase">
                  The missing agent-user layer
                </span>
              </div>
              <h2 className="mt-5 text-center text-[1.75rem] leading-dense font-medium tracking-tighter md:text-[2rem] lg:text-start lg:text-[2.5rem] xl:text-[3rem]">
                Agent Communication Infrastructure
              </h2>
              <p className="mt-3 max-w-none text-center text-base leading-normal font-book tracking-tighter text-gray-8 md:max-w-120 lg:max-w-131 lg:text-start">
                Defining the missing agent-to-user communication layer — and the
                best-practices that come with it. One layer between every app,
                every channel, and every smart agent.
              </p>
            </div>
            <Button
              variant="default"
              size="lg"
              className="w-full max-w-[20rem] overflow-visible sm:w-36 sm:max-w-none"
              asChild
            >
              <NextLink href={ROUTE.aci}>Learn more</NextLink>
            </Button>
          </div>
          <div
            className="pointer-events-none relative flex w-full justify-center"
            aria-hidden
          >
            <div className="absolute top-1/2 left-1/2 hidden aspect-[1073/1021] w-250 -translate-x-[calc(50%+5.875rem)] -translate-y-[calc(50%-17.5rem)] lg:block lg:w-228.5 lg:-translate-x-[calc(50%+8.875rem)] lg:-translate-y-[calc(50%-1.75rem)] xl:w-242">
              <Image
                src={heroIllustration}
                alt=""
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 aspect-[768/787] w-[140%] max-w-110 -translate-x-1/2 -translate-y-[calc(50%-3.75rem)] sm:w-[109%] sm:max-w-115 md:max-w-200 md:-translate-y-[calc(50%-6.25rem)] lg:hidden lg:w-228.5">
              <Image
                src={heroIllustrationMobile}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ACI
