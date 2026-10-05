import { Button } from "@/components/ui/button"

import ContactScheduleButton from "./contact-schedule-button"

const secondaryActionClassName =
  "mt-4 h-10 rounded-md border border-gray-6 bg-transparent px-5 text-sm font-medium text-white normal-case transition-colors duration-200 hover:bg-gray-1 focus-visible:ring-2 focus-visible:ring-lagune-3 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-2 focus-visible:outline-none"

function ContactUs() {
  return (
    <section className="relative -mt-16 overflow-hidden bg-black pt-24 pb-20 md:pt-32 lg:py-40 xl:py-48">
      <div className="relative z-10 mx-auto w-full max-w-368 px-4 md:px-7 lg:px-10 2xl:px-0">
        <div className="mb-24 text-center">
          <h1 className="mt-5 text-5xl leading-tight font-medium text-white">
            Talk to the Novu team
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-normal font-book tracking-tighter text-gray-8">
            Whether you&apos;re evaluating Novu, planning an integration, or
            navigating enterprise requirements - we&apos;re here to help.
          </p>
        </div>

        <div className="mx-auto mt-24 max-w-3xl">
          <div className="flex justify-center">
            <ContactScheduleButton />
          </div>

          <div className="mt-36 text-center">
            <div className="relative grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8">
              <div className="flex flex-col items-center">
                <h2 className="text-[1.75rem] leading-normal font-medium text-white">
                  Need technical support?
                </h2>
                <p className="mt-2 text-base leading-normal font-book text-gray-8">
                  Email our support team and we will help you as soon as
                  possible.
                </p>
                <Button
                  variant="none"
                  size="none"
                  className={secondaryActionClassName}
                  asChild
                >
                  <a href="mailto:support@novu.co">Email Support</a>
                </Button>
              </div>

              <div
                className="absolute top-0 left-1/2 hidden h-full w-px -translate-x-1/2 bg-gray-6 xl:block"
                aria-hidden="true"
              />

              <div className="flex flex-col items-center">
                <h2 className="text-[1.75rem] leading-normal font-medium text-white">
                  Prefer async help?
                </h2>
                <p className="mt-2 text-base leading-normal font-book text-gray-8">
                  Join our community and get answers from the team and other
                  developers.
                </p>
                <Button
                  variant="none"
                  size="none"
                  className={secondaryActionClassName}
                  asChild
                >
                  <a
                    href="https://discord.gg/novu"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join Discord
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactUs
