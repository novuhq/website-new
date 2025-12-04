"use client"

import { PortableText, PortableTextReactComponents } from "@portabletext/react"

import { Faq } from "@/types/pricing"
import { cn, getText } from "@/lib/utils"
import { Link } from "@/components/ui/link"

import Question from "./question"

function portableTextComponentsWithCTA(
  onOpenScheduling: (source: string) => void,
  faqQuestion: string
) {
  return {
    marks: {
      link: ({
        value,
        children,
      }: {
        value: { href: string; isExternal: boolean }
        children: React.ReactNode
      }) => {
        const text = getText(children).toLowerCase()
        const isSchedule = text.includes("schedule")

        if (!isSchedule) {
          return (
            <Link
              href={value.href}
              target={value.isExternal ? "_blank" : undefined}
              rel={value.isExternal ? "noopener noreferrer" : undefined}
            >
              {children}
            </Link>
          )
        }

        return (
          <button
            type="button"
            className={cn(
              "cursor-pointer text-primary hover:text-primary-muted"
            )}
            onClick={(e) => {
              e.preventDefault()
              // @ts-ignore
              window?.analytics?.track(
                "Pricing Event: Click Schedule a Call in FAQ",
                {
                  source: "pricing_faq",
                  question: faqQuestion,
                }
              )
              if (onOpenScheduling) {
                onOpenScheduling("pricing_faq")
              }
            }}
          >
            {children}
          </button>
        )
      },
    },
  }
}

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
        <h2 className="text-[32px] leading-1.125 font-medium tracking-tighter text-white md:text-[40px]">
          {title}
        </h2>
        <ul className="mt-6 divide-y divide-gray-3 border-b border-gray-3 md:mt-[22px]">
          {accordion.items.map(({ question, answer }) => (
            <Question
              key={question}
              question={question}
              answer={
                <PortableText
                  value={answer}
                  components={
                    portableTextComponentsWithCTA(
                      onScheduleClick,
                      question
                    ) as Partial<PortableTextReactComponents>
                  }
                />
              }
            />
          ))}
        </ul>
      </div>
    </section>
  )
}

export default FAQ
