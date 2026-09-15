import Image from "next/image"
import type { IWebChatBuilderSecondarySection } from "@/data/pages/web-chat-builders"
import stepDivider from "@/images/pages/channels/web-chat-builder/webflow/step-divider.svg"

function WebChatBuilderSecondarySection({
  section,
}: {
  section: IWebChatBuilderSecondarySection
}) {
  return (
    <section
      aria-labelledby={section.id}
      className="mx-auto mt-24 flex max-w-304 flex-col gap-10 px-5 md:mt-32 md:px-8 lg:flex-row lg:justify-between lg:gap-12 xl:mt-50"
    >
      <div className="min-w-0 lg:max-w-119.75">
        <h2
          id={section.id}
          className="text-[2rem] leading-dense font-normal tracking-plus-tight text-white md:text-5xl"
        >
          {section.title}
        </h2>
        <p className="mt-4.5 text-lg leading-normal tracking-tight text-gray-70">
          {section.description}
        </p>
      </div>
      <ol className="w-full shrink-0 lg:w-1/2">
        {section.steps.map((step, index) => (
          <li
            key={step.description}
            className="relative flex min-h-16 gap-4 pb-12 last:pb-0 md:gap-6"
          >
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-card-surface font-geist-mono text-lg leading-tight tracking-tighter text-gray-60">
              {index + 1}
            </span>
            <p className="min-w-0 pt-1.75 text-lg leading-tight tracking-tighter whitespace-pre-line text-white md:text-xl">
              {step.description}
              {step.command && (
                <span className="text-purple-2">
                  <code className="font-inter">{step.command}</code>.
                </span>
              )}
            </p>
            {index < section.steps.length - 1 && (
              <span className="pointer-events-none absolute top-16 bottom-0 left-0 w-16">
                <Image src={stepDivider} alt="" fill sizes="64px" />
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}

export default WebChatBuilderSecondarySection
