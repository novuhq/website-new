import { Bell, Bot, User, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

import { AGENT_REPLIES } from "./data"
import { BODY_TEXT, CONTAINER, SectionHeading, TextLink } from "./sections"

const EXAMPLE_ICONS: Record<
  (typeof AGENT_REPLIES.example)[number]["icon"],
  LucideIcon
> = {
  notification: Bell,
  user: User,
  agent: Bot,
}

function AgentReplies() {
  return (
    <section className="mt-20 bg-gray-2 py-14 md:mt-28 md:py-20 lg:mt-36 lg:py-28 xl:mt-44">
      <div
        className={cn(
          CONTAINER,
          "grid items-start gap-10 lg:grid-cols-2 lg:gap-16"
        )}
      >
        <div>
          <SectionHeading>{AGENT_REPLIES.title}</SectionHeading>
          {AGENT_REPLIES.paragraphs.map((paragraph) => (
            <p className={cn(BODY_TEXT, "mt-5")} key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-4 bg-background p-5 xl:rounded-[20px] xl:p-8">
          <p className="text-xs font-medium tracking-normal text-gray-8 uppercase">
            {AGENT_REPLIES.exampleLabel}
          </p>
          <ul className="mt-5 flex flex-col gap-5">
            {AGENT_REPLIES.example.map(({ icon, title, description }) => {
              const Icon = EXAMPLE_ICONS[icon]

              return (
                <li className="flex gap-4" key={title}>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-2">
                    <Icon
                      className={cn(
                        "size-5",
                        icon === "agent" ? "text-primary" : "text-white"
                      )}
                      aria-hidden="true"
                    />
                  </span>
                  <p className="leading-normal font-book text-gray-9">
                    <strong className="block font-medium text-white">
                      {title}
                    </strong>
                    {description}
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className={cn(CONTAINER, "mt-10 md:mt-14")}>
        <p className={cn(BODY_TEXT, "max-w-3xl")}>
          {AGENT_REPLIES.supportingLine}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Button
            className="!h-12 !px-6 !text-sm uppercase"
            variant="default"
            size="none"
            asChild
          >
            <Link
              href={AGENT_REPLIES.cta.url}
              variant="clean"
              size="none"
              data-click-location="usecase_agent_replies"
              data-click-text="explore_novu_connect"
            >
              {AGENT_REPLIES.cta.text}
            </Link>
          </Button>
          <TextLink {...AGENT_REPLIES.link} />
        </div>
      </div>
    </section>
  )
}

export default AgentReplies
