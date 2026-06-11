import Image from "next/image"
import infrastructureImage from "@/images/pages/book-a-demo-connect/hero/infrastructure.png"
import heroLightBg from "@/images/pages/book-a-demo-connect/hero/light-bg.svg"

import BookADemoSchedulingButton from "@/components/pages/book-a-demo/scheduling-button"

function BookADemoConnectHero() {
  return (
    <section
      id="book-a-demo-connect"
      className="relative isolate overflow-x-clip overflow-y-visible bg-background pt-12 pb-16 md:pt-20 md:pb-24 lg:min-h-183 lg:pt-10 lg:pb-0"
    >
      <div className="relative mx-auto w-full max-w-304 px-5 md:px-8 lg:grid lg:min-h-183 lg:grid-cols-[minmax(0,min(38.75rem,48vw))_minmax(0,1fr)] lg:items-center lg:gap-0 2xl:px-0">
        <div className="relative z-10 mx-auto flex w-full max-w-155 flex-col items-center gap-8 text-center lg:mx-0 lg:items-start lg:text-left">
          <div className="flex w-full flex-col items-center gap-5 lg:items-start">
            <div className="flex items-center gap-2">
              <span className="size-1.5 bg-lagune-3" />
              <span className="overflow-visible text-sm leading-none font-normal tracking-normal text-lagune-1 uppercase">
                Novu connect
              </span>
            </div>

            <div className="flex w-full flex-col items-center gap-4 lg:items-start">
              <h1 className="w-full text-4xl leading-[1.125] font-medium tracking-tighter text-foreground md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem]">
                The infrastructure layer
                <br className="hidden lg:block" aria-hidden />
                <span className="lg:hidden"> </span>
                connecting AI agents
                <br className="hidden lg:block" aria-hidden />
                <span className="lg:hidden"> </span>
                to customers
              </h1>

              <p className="max-w-131 text-base leading-normal font-normal tracking-normal text-pretty text-gray-8 md:text-lg">
                Connect existing agents to customer channels with the control,
                security, and reliability enterprise teams expect.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center sm:gap-6 lg:justify-start">
            <BookADemoSchedulingButton
              variant="default"
              size="lg"
              className="w-full px-5 sm:w-auto"
              clickLocation="book_a_demo_connect_hero"
              clickText="book_a_demo"
              source="book_a_demo_connect"
            >
              Book a demo
            </BookADemoSchedulingButton>
            <BookADemoSchedulingButton
              variant="outline"
              size="lg"
              className="w-full overflow-visible sm:w-auto"
              clickLocation="book_a_demo_connect_hero"
              clickText="book_a_call"
              source="book_a_demo_connect"
            >
              Book a Call
            </BookADemoSchedulingButton>
          </div>
        </div>

        <div
          className="pointer-events-none relative top-4 left-1/2 z-0 mx-auto mt-4 aspect-[832/730] w-[calc(100%+6rem)] max-w-208 -translate-x-1/2 md:left-auto md:mt-0 md:w-full md:translate-x-0 lg:mx-0 lg:w-[min(52rem,54vw)] lg:max-w-none lg:translate-x-4 lg:justify-self-center xl:translate-x-6 2xl:translate-x-[2.625rem]"
          aria-hidden
        >
          <Image
            className="pointer-events-none absolute top-[-17.2%] left-[-28.9%] z-0 h-auto w-[128.9%] max-w-none select-none"
            src={heroLightBg}
            alt=""
            priority
            sizes="(max-width: 1023px) 129vw, 1072px"
            aria-hidden
          />
          <Image
            className="relative z-10 size-full object-contain"
            src={infrastructureImage}
            alt=""
            priority
            sizes="(max-width: 1023px) 100vw, 832px"
            quality={95}
          />
        </div>
      </div>
    </section>
  )
}

export default BookADemoConnectHero
