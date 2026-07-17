"use client"

import React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { IFaqSection } from "@/types/common"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqTriggerVariants = cva("hover:no-underline hover:text-white/85", {
  variants: {
    variant: {
      default:
        "pt-6 pb-5 text-start text-[20px] leading-snug font-medium sm:pt-5 sm:pb-4 sm:text-[18px]",
      minimal:
        "relative items-center gap-4 py-5.5 text-left text-lg leading-snug font-medium tracking-tighter md:gap-6 md:text-xl md:leading-none [&>svg]:size-5.5 [&>svg]:translate-y-0 [&>svg]:stroke-[1]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const faqContentVariants = cva(
  "[&_a]:transition-colors [&_a]:duration-300 [&_a:hover]:text-primary-muted [&_a]:text-primary [&_br]:mb-3 [&_br]:block",
  {
    variants: {
      variant: {
        default:
          "max-w-[752px] pt-2 pb-8 text-[18px] leading-relaxed font-book text-gray-8 sm:mr-7 sm:pb-6 sm:text-[16px] sm:leading-normal md:mr-14",
        minimal:
          "max-w-none pr-8 pb-6.5 tracking-tighter text-gray-50 text-base md:pr-20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type TFaqVariant = VariantProps<typeof faqContentVariants>["variant"]

interface IFAQProps extends IFaqSection {
  id?: string
  variant?: TFaqVariant
  className?: string
  titleClassName?: string
  containerClassName?: string
  defaultOpenFirst?: boolean
  onScheduleClick?: (source: string) => void
}

const FAQ = ({
  id,
  title,
  accordion,
  variant = "default",
  className,
  titleClassName,
  containerClassName = "gap-y-6 max-w-208 md:gap-y-[22px] lg:max-w-224",
  defaultOpenFirst = false,
  onScheduleClick,
}: IFAQProps) => {
  if (!title || !accordion) {
    return null
  }

  return (
    <section
      id={id}
      className={cn(
        "faq safe-paddings pt-15 pb-20 sm:pb-10 md:pt-12.5 md:pb-5 lg:pb-16",
        className
      )}
    >
      <div
        className={cn(
          "container mx-auto flex w-full flex-col px-5 md:px-8",
          containerClassName
        )}
      >
        <h2
          className={cn(
            "text-[32px] leading-dense font-medium tracking-tighter text-white md:text-[40px]",
            titleClassName
          )}
        >
          {title}
        </h2>
        <Accordion
          type="single"
          collapsible
          defaultValue={
            defaultOpenFirst ? accordion.items[0]?.question : undefined
          }
        >
          {accordion.items.map(({ question, answer }) => {
            const resolvedAnswer: React.ReactNode =
              typeof answer === "function"
                ? answer(onScheduleClick ?? (() => {}))
                : answer

            return (
              <AccordionItem
                className="border-gray-3"
                key={question}
                value={question}
              >
                <AccordionTrigger className={faqTriggerVariants({ variant })}>
                  {question}
                </AccordionTrigger>
                <AccordionContent className={faqContentVariants({ variant })}>
                  {resolvedAnswer}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </section>
  )
}

export default FAQ
