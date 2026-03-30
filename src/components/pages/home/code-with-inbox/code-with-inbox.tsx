import nextjsIcon from "@/svgs/pages/home/inbox/nextjs.svg"
import reactIcon from "@/svgs/pages/home/inbox/react.svg"
import remixIcon from "@/svgs/pages/home/inbox/remix.svg"

import { highlightEchoCode } from "@/lib/shiki"
import { cn } from "@/lib/utils"

import CodeTabs from "./code-tabs"
import InboxComponent from "./inbox/inbox-component"

const TITLE = "Just copy and ship"
const DESCRIPTION =
  "Add a powerful notification inbox to your app with 6 lines of code. It's that simple."

const TABS = [
  {
    title: "Next.js",
    code: `import React from 'react';
import { Inbox } from '@novu/nextjs';

export function NotificationInbox() {
  return (
    <Inbox />
  );
}`,
    icon: nextjsIcon,
  },
  {
    title: "Remix",
    code: `import React from 'react';
import { Inbox } from '@novu/react';

export function NotificationInbox() {
  return (
    <Inbox />
  );
}`,
    icon: remixIcon,
  },
  {
    title: "React",
    code: `import React from 'react';
import { Inbox } from '@novu/react';

export function NotificationInbox() {
  return (
    <Inbox />
  );
}`,
    icon: reactIcon,
  },
]

interface ICodeWithInboxProps {
  className?: string
}

async function CodeWithInbox({ className }: ICodeWithInboxProps) {
  const highlightedTabs = await Promise.all(
    TABS.map(async (tab) => ({
      title: tab.title,
      icon: tab.icon,
      highlightedHtml: await highlightEchoCode(tab.code),
    }))
  )

  return (
    <section
      className={cn(
        "mt-20 pb-19 md:mt-[100px] lg:mt-[140px] xl:mt-[190px]",
        className
      )}
    >
      <div className="mx-auto grid max-w-xl grid-cols-1 items-center justify-items-center gap-y-4 px-5 md:px-8 lg:max-w-328 lg:grid-cols-[404px_auto] lg:justify-center lg:gap-x-8 lg:gap-y-0 xl:grid-cols-[auto_auto] xl:gap-x-20 2xl:gap-x-24 2xl:px-0">
        <div className="relative z-10 max-w-[398px] py-5 md:max-w-full lg:max-w-[434px] xl:max-w-[672px]">
          <div className="mb-11 md:mb-12 xl:mb-[52px]">
            <h2 className="text-center text-[28px] leading-dense font-medium tracking-tighter md:text-[32px] lg:text-left lg:text-[40px] xl:text-[48px]">
              {TITLE}
            </h2>
            <p className="mt-3 max-w-none text-center text-base leading-normal tracking-tighter text-balance text-gray-8 md:max-w-[746px] lg:text-left lg:text-lg">
              {DESCRIPTION}
            </p>
          </div>
          <CodeTabs tabs={highlightedTabs} />
        </div>
        <InboxComponent className="z-0 shrink-0" />
      </div>
    </section>
  )
}

export default CodeWithInbox
