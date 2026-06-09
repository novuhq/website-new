import Image from "next/image"
import heroImage from "@/images/pages/book-a-demo/hero/book-demo-hero.jpg"

import BookADemoSchedulingButton from "./scheduling-button"

function BookADemoHero() {
  return (
    <section
      id="book-a-demo"
      className="relative isolate overflow-hidden bg-background pt-12 pb-0 lg:min-h-158 lg:py-0 lg:pt-5 lg:pb-0"
    >
      <div className="relative mx-auto w-full max-w-304 px-5 md:px-8 lg:grid lg:min-h-158 lg:grid-cols-[minmax(0,min(40rem,48vw))_minmax(0,1fr)] lg:items-center lg:gap-0 xl:gap-[clamp(2rem,5vw,5rem)] 2xl:px-0">
        <div className="relative z-10 mx-auto flex w-full max-w-160 flex-col items-center gap-11 text-center lg:mx-0 lg:max-w-none lg:items-start lg:text-left">
          <div className="flex w-full flex-col items-center gap-5 lg:items-start">
            <div className="flex items-center gap-2">
              <span className="size-1.5 bg-lagune-3" />
              <span className="overflow-visible text-sm leading-none font-normal tracking-normal text-lagune-1 uppercase">
                Novu Enterprise Inbox
              </span>
            </div>

            <div className="flex w-full flex-col items-center gap-4 lg:items-start">
              <h1 className="w-full text-4xl leading-dense font-medium tracking-tighter text-foreground md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem]">
                Notification infrastructure built for enterprise scale
              </h1>

              <p className="max-w-134.5 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-8 md:text-lg">
                From compliance reviews to global delivery, Novu gives
                enterprise teams the control, visibility, and reliability they
                need.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center lg:justify-start lg:gap-7">
            <BookADemoSchedulingButton
              variant="default"
              size="lg"
              className="w-full px-5 sm:w-auto"
              clickLocation="book_a_demo_hero"
              clickText="book_a_demo"
              source="book_a_demo_hero"
            >
              Book a demo
            </BookADemoSchedulingButton>
            <BookADemoSchedulingButton
              variant="outline"
              size="lg"
              className="w-full overflow-visible sm:w-auto"
              clickLocation="book_a_demo_hero"
              clickText="book_a_call"
              source="book_a_demo_hero"
            >
              Book a Call
            </BookADemoSchedulingButton>
          </div>
        </div>

        <div
          className="pointer-events-none relative left-1/2 z-0 mx-auto mt-0 aspect-[896/632] w-[calc(100%+10rem)] max-w-none -translate-x-1/2 overflow-hidden md:w-full lg:left-auto lg:mx-0 lg:mt-0 lg:w-[calc(100%+10rem)] lg:w-[min(56rem,54vw)] lg:max-w-4xl lg:max-w-none lg:translate-x-0 lg:scale-[1.3] lg:justify-self-center xl:scale-100 2xl:translate-x-10 2xl:-translate-y-3.25"
          aria-hidden
        >
          <Image
            className="size-full object-contain"
            src={heroImage}
            alt=""
            priority
            sizes="(max-width: 1023px) 100vw, 896px"
            quality={95}
          />
        </div>
      </div>
    </section>
  )
}

export default BookADemoHero
