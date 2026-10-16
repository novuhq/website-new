import { Bell, Clock, Mail, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import CodeBlock from "@/components/content/code-block"

import { WORKFLOW_DEMO } from "./data"
import {
  BODY_TEXT,
  CONTAINER,
  SECTION_SPACING,
  SectionHeading,
  TextLinks,
} from "./sections"

const STEP_ICONS: Record<
  (typeof WORKFLOW_DEMO.steps)[number]["icon"],
  LucideIcon
> = {
  "in-app": Bell,
  delay: Clock,
  email: Mail,
}

function WorkflowDemo() {
  return (
    <section className={SECTION_SPACING}>
      <div className={CONTAINER}>
        <SectionHeading className="max-w-3xl">
          {WORKFLOW_DEMO.title}
        </SectionHeading>
        <p className={cn(BODY_TEXT, "mt-4 max-w-3xl")}>
          {WORKFLOW_DEMO.description}
        </p>

        <div className="mt-8 grid items-start gap-10 md:mt-12 lg:grid-cols-[2fr_3fr]">
          <ol>
            {WORKFLOW_DEMO.steps.map(({ icon, step, description }, index) => {
              const Icon = STEP_ICONS[icon]
              const isLast = index === WORKFLOW_DEMO.steps.length - 1

              return (
                <li className="flex gap-4" key={step}>
                  <div className="flex flex-col items-center">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-gray-4 bg-gray-2">
                      <Icon
                        className="size-5 text-primary"
                        aria-hidden="true"
                      />
                    </span>
                    {!isLast && (
                      <span
                        className="w-px flex-1 bg-gray-4"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <p className={cn("pt-1", !isLast && "pb-7")}>
                    <strong className="block text-lg font-medium text-white">
                      {step}
                    </strong>
                    <span className="leading-normal font-book text-gray-9">
                      {description}
                    </span>
                  </p>
                </li>
              )
            })}
          </ol>

          <div className="min-w-0">
            <h3 className="mb-5 text-xl leading-snug font-medium text-white md:text-2xl">
              {WORKFLOW_DEMO.codeTitle}
            </h3>
            <CodeBlock code={WORKFLOW_DEMO.code} language="typescript" />
          </div>
        </div>

        <TextLinks links={[WORKFLOW_DEMO.link]} />
      </div>
    </section>
  )
}

export default WorkflowDemo
