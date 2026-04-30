import Image from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import circleNumberIcon from "@/images/pages/mcp/icons/circle-number.svg"

import { Button } from "@/components/ui/button"

interface ICopilotHowItWorksStep {
  title: string
  description: string
}

const STEPS: ICopilotHowItWorksStep[] = [
  {
    title: "Describe",
    description:
      "One sentence is enough. The more detail you give, the closer the output lands.",
  },
  {
    title: "Review",
    description:
      "Keep it, Discard it, or Re-run with a tweaked prompt. Nothing ships until you say so.",
  },
  {
    title: "Deploy to production",
    description:
      "The workflow lands in your dev environment. Test, edit, and promote it to production like any other.",
  },
]

function HowItWorks() {
  return (
    <section
      className="section-container mt-26 scroll-mt-[calc(var(--sticky-header-height)+5rem)] md:mt-48 lg:mt-60"
      id="how-it-works"
    >
      <div className="flex flex-col gap-14 md:gap-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
          <div className="flex max-w-[42rem] flex-col gap-4 md:gap-5">
            <div className="flex items-center gap-2">
              <span className="size-1.5 bg-blue-3" />
              <span className="text-sm leading-none tracking-tight text-blue-1 uppercase">
                How it works
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-[1.75rem] leading-[1.125] font-medium tracking-tighter text-foreground md:text-[2.5rem] lg:text-[2.75rem]">
                Write it like a brief. Get back a real Novu workflow.
              </h2>
              <p className="max-w-[38rem] text-base leading-normal font-book tracking-tighter text-pretty text-gray-8 md:text-lg">
                Copilot reads your prompt and assembles the steps inside Novu,
                picking channels, timing, and conditions to match what you
                described.
              </p>
            </div>
          </div>

          <Button
            variant="default"
            size="lg"
            className="w-full sm:w-fit lg:mb-0.5 lg:self-end"
            asChild
          >
            <NextLink
              href={ROUTE.dashboard as string}
              target="_blank"
              rel="noopener noreferrer"
              data-click-location="copilot_how_it_works"
              data-click-text="generate_your_first_workflow"
            >
              Generate your first workflow
            </NextLink>
          </Button>
        </div>

        <ol className="grid gap-10 md:grid-cols-3 md:gap-8 xl:grid-cols-[17rem_17rem_20.5rem] xl:justify-between xl:gap-0">
          {STEPS.map((step, index) => (
            <li
              className="relative pl-13 before:pointer-events-none before:absolute before:top-10 before:bottom-[-2.5rem] before:left-5 before:w-px before:bg-gray-3 before:content-[''] last:before:hidden md:pl-0 md:before:top-5 md:before:right-0 md:before:bottom-auto md:before:left-13 md:before:h-px md:before:w-auto md:last:before:block xl:not-last:before:right-[-4.625rem] xl:last:before:right-0"
              key={step.title}
            >
              <span className="absolute top-0 left-0 z-10 inline-flex size-10 items-center justify-center font-inter text-xl leading-none font-bold text-white md:relative">
                <Image
                  src={circleNumberIcon}
                  alt=""
                  width={40}
                  height={40}
                  className="absolute inset-0 size-full"
                  aria-hidden
                />
                <span className="relative">{index + 1}</span>
              </span>

              <div className="flex max-w-[20.5rem] flex-col gap-2.5 md:mt-4.5">
                <h3 className="text-xl leading-snug font-medium tracking-tighter text-foreground">
                  {step.title}
                </h3>
                <p className="text-base leading-snug font-light text-gray-9">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default HowItWorks
