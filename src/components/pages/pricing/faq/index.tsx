"use client"

import React, { useCallback, useMemo } from "react"
import { PortableText, PortableTextReactComponents } from "@portabletext/react"

import { Faq } from "@/types/pricing"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"

import Question from "./question"

const FAQ = ({
  title,
  accordion,
  className,
  onOpenScheduling,
}: Faq & {
  className?: string
  onOpenScheduling?: (source: string, faqQuestion: string) => void
}) => {
  if (!title || !accordion) {
    return null
  }

  // TODO: add analytics
  const handleOpenScheduling = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, source: string, faqQuestion: string) => {
      e.preventDefault()
    },
    [onOpenScheduling]
  )

  const portableTextComponents = useMemo(
    () => ({
      marks: {
        link: ({
          value,
          children,
        }: {
          value: { href: string; isExternal: boolean }
          children: React.ReactNode
        }) => (
          <Link
            href={value.href}
            target={value.isExternal ? "_blank" : undefined}
            rel={value.isExternal ? "noopener noreferrer" : undefined}
          >
            {children}
          </Link>
        ),
      },
    }),
    [handleOpenScheduling]
  )

  const processedFaqData = useMemo(() => {
    return accordion.items.map((item) => ({
      question: item.question,
      answer: (
        <PortableText
          value={item.answer}
          components={portableTextComponents as Partial<PortableTextReactComponents>}
        />
      ),
    }))
  }, [portableTextComponents])

  return (
    <section
      className={cn(
        "safe-paddings pt-[60px] pb-20 sm:pb-10 md:pt-[50px] md:pb-5 lg:pb-16",
        className
      )}
    >
      <div className="container mx-auto max-w-[832px] px-5 md:px-8 lg:max-w-[896px]">
        <h2 className="text-[32px] leading-1.125 font-medium tracking-tighter text-white md:text-[40px]">
          {title}
        </h2>
        <ul className="mt-6 divide-y divide-gray-3 border-b border-gray-3 md:mt-[22px]">
          {processedFaqData.map((questionItem) => (
            <Question {...questionItem} key={questionItem.question} />
          ))}
        </ul>
      </div>
    </section>
  )
}

export default FAQ
