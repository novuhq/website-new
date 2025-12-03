"use client"

import React, { useCallback, useMemo } from "react"
import { PortableText, PortableTextReactComponents } from "@portabletext/react"

import { Faq } from "@/types/pricing"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"

import Question from "./question"

// const FAQ_DATA = [
//   {
//     question: "What is a workflow run?",
//     answer: (
//       <>
//         A workflow run is one execution of a workflow. Triggering a workflow to
//         a single subscriber counts as 1 run; triggering to a{" "}
//         <Link
//           to="https://docs.novu.co/concepts/topics"
//           target="_blank"
//           rel="noreferrer"
//           variant="muted"
//         >
//           topic
//         </Link>{" "}
//         with 100 subscribers counts as 100 runs after fan-out.
//       </>
//     ),
//   },
//   {
//     question: "How is pricing calculated?",
//     answer: (
//       <>
//         Pricing is based on the total number of workflow runs executed across
//         all environments each month.
//       </>
//     ),
//   },
//   {
//     question: "What happens if I exceed my monthly workflow run limit?",
//     answer: (
//       <>
//         We never stop or throttle your notifications. Usage above your plan
//         rolls into on‑demand pricing or, for Enterprise, your contract rate.{" "}
//         <Link to="#" variant="muted" data-action="schedule">
//           Schedule a call
//         </Link>
//         .
//       </>
//     ),
//   },
//   {
//     question: "Do you charge per notification or per user?",
//     answer: (
//       <>
//         No. Billing is per workflow run, not per user or message. Subscribers
//         are unlimited on paid plans.
//       </>
//     ),
//   },
//   {
//     question: "Can I use Novu free of charge?",
//     answer: (
//       <>
//         Yes. Novu Cloud is free up to 10,000 workflow runs per month. You can
//         also self‑host the open‑source Novu Project.
//       </>
//     ),
//   },
//   {
//     question: "Do you offer annual or volume discounts?",
//     answer: (
//       <>
//         Yes. We offer reduced annual pricing and volume‑based tiers. Enterprise
//         customers receive custom bundle pricing.{" "}
//         <Link to="#" variant="muted" data-action="schedule">
//           Schedule a call
//         </Link>
//         .
//       </>
//     ),
//   },
//   {
//     question: "Which regions do you support and how is data residency handled?",
//     answer: (
//       <>
//         All plans support US and EU regions. Enterprise can use additional
//         regions (Singapore, UK, Australia, Japan, South Korea) or request custom
//         regions/VPC hosting.{" "}
//         <Link to="#" variant="muted" data-action="schedule">
//           Schedule a call
//         </Link>
//         .
//       </>
//     ),
//   },
//   {
//     question: "Is Novu HIPAA compliant? Do you sign BAAs?",
//     answer: (
//       <>
//         Yes. Our Enterprise plan supports HIPAA compliance and BAAs.{" "}
//         <Link to="#" variant="muted" data-action="schedule">
//           Schedule a call
//         </Link>
//         .
//       </>
//     ),
//   },
//   {
//     question: "What data does Novu store and log?",
//     answer: (
//       <>
//         We store only the data needed to deliver and display notifications
//         (subscriber identifiers, channel addresses, metadata). Enterprise can
//         request custom logging, deletion workflows, or bring‑your‑own database.{" "}
//         <Link to="#" variant="muted" data-action="schedule">
//           Schedule a call
//         </Link>
//         .
//       </>
//     ),
//   },
//   {
//     question: "What is your Service Level Agreement (SLA)?",
//     answer: (
//       <>
//         Cloud uptime SLA is 99.9%. Business and Enterprise plans include a
//         support ticket SLA and a private Slack channel. Free tier and the Novu
//         Project are supported via{" "}
//         <Link to="https://discord.novu.co" variant="muted">
//           Discord
//         </Link>
//         .
//       </>
//     ),
//   },
//   {
//     question: "Do you offer an Enterprise plan?",
//     answer: (
//       <>
//         Yes. Enterprise adds SLAs, advanced compliance and controls, and
//         deployment options.{" "}
//         <Link to="#" variant="muted" data-action="schedule">
//           Schedule a call
//         </Link>
//         .
//       </>
//     ),
//   },
//   {
//     question:
//       "What are the differences between Novu Cloud, Open Source, and Enterprise Self‑Hosted?",
//     answer: (
//       <>
//         <Link
//           to="https://github.com/novuhq/novu"
//           target="_blank"
//           rel="noreferrer"
//           variant="muted"
//         >
//           The Novu Project
//         </Link>{" "}
//         is the open‑source core you can run yourself. Novu Cloud is our managed,
//         scalable service with SLAs and business features. Enterprise Self‑Hosted
//         adds SSO, RBAC, audit logs, branding removal, Helm/Kubernetes tooling,
//         and priority support.{" "}
//         <Link to="#" variant="muted" data-action="schedule">
//           Schedule a call
//         </Link>{" "}
//         to discuss which option fits your needs.
//       </>
//     ),
//   },
//   {
//     question: "Does Novu support multi‑tenant applications?",
//     answer: (
//       <>
//         Yes. Multi‑tenancy is supported with Contexts for per‑tenant providers,
//         preferences, environments, and inbox segregation.
//       </>
//     ),
//   },
//   {
//     question: "How hard is it to migrate to Novu?",
//     answer: (
//       <>
//         Most teams migrate in stages: simple events → advanced workflows →
//         preferences and Inbox. We can guide architecture reviews and transition
//         planning.{" "}
//         <Link to="#" variant="muted" data-action="schedule">
//           Schedule a call
//         </Link>
//         .
//       </>
//     ),
//   },
//   {
//     question: "What is included in the Inbox component? Can I bring my own UI?",
//     answer: (
//       <>
//         Use our ready‑made Inbox or build your own with React, React Native, or
//         any JS framework using our hooks‑only approach. Custom renderers and
//         themes are supported.
//       </>
//     ),
//   },
//   {
//     question: "How many notifications can I send on Novu Cloud?",
//     answer: (
//       <>
//         Practically as many as you need. Throughput is usually constrained by
//         your configured providers, not Novu Cloud.
//       </>
//     ),
//   },
// ]

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

  const handleOpenScheduling = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, source: string, faqQuestion: string) => {
      e.preventDefault()
      // // Track FAQ schedule link click analytics with granular question identifier
      // window?.analytics?.track("Pricing Event: Click Schedule a Call in FAQ", {
      //   source,
      //   question: faqQuestion,
      // })
      // if (onOpenScheduling) {
      //   onOpenScheduling(source, faqQuestion)
      // }
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

  // // Process FAQ data from Sanity
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
