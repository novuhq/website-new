import Image from "next/image"
import capabilityIcon from "@/images/pages/book-a-demo-connect/control-layer/icons/capability.svg"
import permissionsIcon from "@/images/pages/book-a-demo-connect/control-layer/icons/permissions.svg"
import visibilityIcon from "@/images/pages/book-a-demo-connect/control-layer/icons/visibility.svg"
import controlLayerImage from "@/images/pages/book-a-demo-connect/control-layer/сontrol-layer.jpg"

import BookADemoSchedulingButton from "@/components/pages/book-a-demo/scheduling-button"

const CONTROL_LAYER_FEATURES = [
  {
    title: "Agent permissions",
    description: (
      <>
        Control what each agent can read, write, search,
        <span className="2xl:hidden"> </span>
        <br className="hidden 2xl:block" aria-hidden />
        or execute across connected tools and
        <span className="2xl:hidden"> </span>
        <br className="hidden 2xl:block" aria-hidden />
        customer-facing workflows.
      </>
    ),
    icon: permissionsIcon,
  },
  {
    title: "Capability guardrails",
    description: (
      <>
        Disable risky actions before agents go live,
        <span className="2xl:hidden"> </span>
        <br className="hidden 2xl:block" aria-hidden />
        so every workflow stays within approved
        <span className="2xl:hidden"> </span>
        <br className="hidden 2xl:block" aria-hidden />
        operational boundaries.
      </>
    ),
    icon: capabilityIcon,
  },
  {
    title: "Operational visibility",
    description: (
      <>
        See which tools are enabled for each agent,
        <span className="2xl:hidden"> </span>
        <br className="hidden 2xl:block" aria-hidden />
        review capability changes, and keep agent
        <span className="2xl:hidden"> </span>
        <br className="hidden 2xl:block" aria-hidden />
        behavior transparent across teams.
      </>
    ),
    icon: visibilityIcon,
  },
]

function BookADemoConnectControlLayer() {
  return (
    <section className="relative isolate overflow-hidden bg-black pt-28 pb-16 md:pt-30 md:pb-20 lg:pt-40 xl:min-h-291 xl:pt-0 xl:pb-0">
      <div className="relative mx-auto flex w-full max-w-384 flex-col items-center px-5 md:px-8 xl:min-h-291 xl:px-0">
        <div className="relative z-10 mx-auto flex w-full max-w-184 flex-col items-center gap-8 text-center md:gap-10">
          <div className="flex w-full flex-col items-center gap-4">
            <h2 className="w-full text-[2rem] leading-[1.125] font-medium tracking-tighter text-balance text-white md:text-[2.5rem] xl:text-5xl">
              One control layer for
              <br className="hidden sm:block" aria-hidden />
              <span className="sm:hidden"> </span>
              every agent conversation
            </h2>
            <p className="max-w-143 text-base leading-normal font-book tracking-tighter text-pretty text-gray-8 md:text-lg">
              Meet enterprise expectations for security, compliance,
              reliability, and support without rebuilding notification
              infrastructure in-house.
            </p>
          </div>

          <BookADemoSchedulingButton
            variant="default"
            size="lg"
            className="px-5"
            clickLocation="book_a_demo_connect_control_layer"
            clickText="book_a_demo"
            source="book_a_demo_connect"
          >
            Book a demo
          </BookADemoSchedulingButton>
        </div>

        <div
          className="pointer-events-none relative z-0 -mt-4 aspect-[3840/2174] w-[140%] max-w-384 translate-x-[2vw] sm:-mt-16 md:-mt-24 md:w-[140%] md:max-w-none lg:-mt-34 lg:w-[calc(100%+28rem)] xl:absolute xl:top-19.25 xl:left-1/2 xl:mt-0 xl:w-[110rem] xl:max-w-none xl:translate-x-[calc(-50%+1.8125rem)] 2xl:w-[120rem] 2xl:-translate-x-1/2"
          aria-hidden
        >
          <Image
            className="size-full object-contain"
            src={controlLayerImage}
            alt=""
            sizes="(max-width: 767px) calc(100vw + 80px), (max-width: 1023px) calc(100vw + 128px), (max-width: 1279px) calc(100vw + 384px), 1920px"
            quality={95}
            loading="lazy"
          />
        </div>

        <ul className="relative z-10 -mt-6 grid w-full max-w-304 grid-cols-1 gap-12 text-left sm:-mt-24 sm:grid-cols-2 md:-mt-28 md:gap-10 lg:-mt-45 xl:absolute xl:bottom-25 xl:left-1/2 xl:mt-0 xl:-translate-x-1/2 xl:grid-cols-3 xl:gap-14 xl:px-0 2xl:max-w-303.5">
          {CONTROL_LAYER_FEATURES.map(({ title, description, icon }) => (
            <li key={title} className="flex flex-col items-start gap-6">
              <Image
                className="size-10 shrink-0"
                src={icon}
                width={40}
                height={40}
                alt=""
                loading="lazy"
                aria-hidden
              />

              <div className="flex flex-col gap-2.5">
                <h3 className="text-xl leading-snug font-medium tracking-tighter text-white">
                  {title}
                </h3>
                <p className="text-base leading-snug font-book tracking-tighter text-gray-9 2xl:tracking-normal">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default BookADemoConnectControlLayer
