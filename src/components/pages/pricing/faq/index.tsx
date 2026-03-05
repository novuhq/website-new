"use client"

import { Faq } from "@/types/pricing"
import { cn } from "@/lib/utils"

import Question from "./question"

const FAQ = ({
  title,
  accordion,
  className,
  onScheduleClick,
}: Faq & {
  className?: string
  onScheduleClick: (source: string) => void
}) => {
  if (!title || !accordion) {
    return null
  }

  return (
    <section
      className={cn(
        "safe-paddings pt-15 pb-20 sm:pb-10 md:pt-12.5 md:pb-5 lg:pb-16",
        className
      )}
    >
      <div className="container mx-auto max-w-[832px] px-5 md:px-8 lg:max-w-[896px]">
        <h2 className="text-[32px] leading-dense font-medium tracking-tighter text-white md:text-[40px]">
          {title}
        </h2>
        <ul className="mt-6 divide-y divide-gray-3 border-b border-gray-3 md:mt-[22px]">
          {accordion.items.map(({ question, answer }) => (
            <Question
              key={question}
              question={question}
              answer={
                typeof answer === "function"
                  ? answer(onScheduleClick)
                  : answer
              }
            />
          ))}
        </ul>
      </div>
    </section>
  )
}

export default FAQ
