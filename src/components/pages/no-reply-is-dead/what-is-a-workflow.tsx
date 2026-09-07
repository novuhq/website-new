import Image from "next/image"
import workflowFlow from "@/images/pages/no-reply-is-dead/workflow-flow.jpg"

const STAGES = [
  {
    title: "Trigger from your app",
    detail: "Call the workflow by name with a recipient and payload.",
  },
  {
    title: "Run the workflow",
    detail:
      "Novu applies the message, timing, and delivery logic defined once.",
  },
  {
    title: "Deliver across channels",
    detail:
      "Send notifications through the configured channels from the same trigger.",
  },
]

export function WhatIsAWorkflow() {
  return (
    <section
      id="what-is-a-workflow"
      className="mt-24 scroll-mt-24 md:mt-32 lg:mt-40"
    >
      <div className="mx-auto max-w-304 px-5 md:px-8 2xl:px-0">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <h2 className="max-w-152 text-[2rem] leading-[1.13] font-normal tracking-plus-tight text-balance text-white md:text-[2.5rem] lg:text-5xl">
            Move from notification <br className="hidden lg:inline" />
            to conversation
          </h2>
          <p className="max-w-120 text-base leading-[1.5] tracking-tight text-gray-70 md:text-lg">
            Define the message and delivery logic once. Trigger the notification
            to the subscriber, and allow them to directly respond and converse
            with the agent.
          </p>
        </div>

        <Image
          src={workflowFlow}
          alt="A trigger call from your app runs through notification settings — delivery timing, message template, and the assigned agent — then reaches the user on Telegram, iMessage, Microsoft Teams, WhatsApp, email, or Slack."
          width={1216}
          height={420}
          className="mt-8 w-full rounded-2xl border border-illustration-border md:mt-14"
          sizes="(min-width: 1536px) 1216px, (min-width: 768px) calc(100vw - 4rem), 100vw"
        />

        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {STAGES.map(({ title, detail }) => (
            <li key={title} className="rounded-xl bg-card-surface px-6 py-5">
              <h3 className="text-xl leading-[1.38] font-medium tracking-tighter text-white">
                {title}
              </h3>
              <p className="mt-1 text-base leading-[1.38] tracking-tighter text-gray-50 md:text-lg">
                {detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
