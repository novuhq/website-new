"use client"

import { useMemo, useState } from "react"
import * as m from "motion/react-m"

import { cn } from "@/lib/utils"
import { CONTAINER_THEMES } from "./theme-config"
import type { InboxTheme, InboxMessage, InboxMessageData } from "./types"
import MessageList from "./message-list"

interface IInboxContainerProps {
  theme: InboxTheme
  categories?: string[]
  messages: InboxMessageData[]
}

function InboxContainer({ theme, categories, messages }: IInboxContainerProps) {
  const currentTheme = CONTAINER_THEMES[theme]
  const LogoIcon = currentTheme.header.logoIcon

  const [messageList, setMessageList] = useState<InboxMessage[]>(
    messages.map((message, index) => ({
      ...message,
      isArchived: false,
      index,
    })) as InboxMessage[]
  )
  const [activeTab, setActiveTab] = useState(
    categories ? categories[0] : ""
  )

  const isUnreadMessages = messageList.some((message) => !message.isRead)

  const tabsList = useMemo(() => {
    if (!categories) return []
    const allCount = messageList.filter((m) => !m.isRead).length
    return categories.map((category, index) => ({
      label: category,
      count:
        index === 0
          ? allCount
          : messageList.filter(
              (m) =>
                "category" in m &&
                m.category.toLowerCase() === category.toLowerCase() &&
                !m.isRead
            ).length,
    }))
  }, [categories, messageList])

  const NotificationIcon = currentTheme.header.notificationIcon
  const ThemeIcon = currentTheme.header.themeIcon
  const MessageIcon = currentTheme.header.messageIcon

  return (
    <m.div
      className="absolute left-0 top-0 hidden lg:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.3 } }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative z-30 w-[531px] overflow-hidden rounded-[20px] px-5 xl:w-[608px]">
        <header className="relative z-40 flex h-[46px] items-center">
          <LogoIcon
            className={cn("size-[18px] shrink-0", currentTheme.header.logo)}
          />
          {currentTheme.header.logoText && (
            <h3
              className={cn(
                "mr-auto leading-none",
                currentTheme.header.logoTextClassName
              )}
            >
              {currentTheme.header.logoText}
            </h3>
          )}
          {NotificationIcon && (
            <div className="relative mr-3.5 shrink-0">
              <NotificationIcon
                className={cn("size-6", currentTheme.header.icon)}
              />
              {isUnreadMessages && (
                <div className="absolute right-[3px] top-1 size-2 rounded-full border border-[#151b37] bg-[linear-gradient(232.66deg,#FFDF66_9.72%,#FFB433_89.91%)]" />
              )}
            </div>
          )}
          {ThemeIcon && (
            <ThemeIcon
              className={cn("mr-3.5 size-6 shrink-0", currentTheme.header.icon)}
            />
          )}
          {MessageIcon && (
            <MessageIcon
              className={cn("mr-5 size-6 shrink-0", currentTheme.header.icon)}
            />
          )}
          {currentTheme.header.userAvatar && (
            <img
              className="size-6 shrink-0 rounded-sm"
              src={currentTheme.header.userAvatar}
              alt="User avatar"
              width="24"
              height="24"
            />
          )}
        </header>
        <div
          className={cn(
            currentTheme.container.border,
            currentTheme.container.shadow,
            "relative z-30 h-[500px] rounded-xl xl:h-[573px]",
            theme !== "linearDark" &&
              theme !== "linearLight" &&
              "p-px"
          )}
        >
          <div className="relative z-30 flex h-full flex-col overflow-hidden rounded-xl">
            <MessageList
              theme={theme}
              tabs={tabsList}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
              messages={messageList}
              setMessages={setMessageList}
            />
            <div
              className={cn(
                currentTheme.container.background,
                "absolute inset-0 rounded-xl"
              )}
            />
            {currentTheme.container.shine && (
              <div
                className={cn(
                  currentTheme.container.shine,
                  "pointer-events-none absolute -top-0.5 left-3.5 h-px w-[318px] mix-blend-plus-lighter blur-[2px]"
                )}
                aria-hidden
              />
            )}
          </div>
        </div>
      </div>
      <div
        className={cn(
          currentTheme.mainBlock.border,
          "absolute left-0 top-0 z-10 aspect-[608/573] h-[501px] w-auto shrink-0 rounded-[20px] xl:h-[573px]",
          theme !== "linearDark" &&
            theme !== "linearLight" &&
            "p-px"
        )}
      >
        <div
          className={cn(
            currentTheme.mainBlock.background,
            "relative z-20 h-full w-full overflow-hidden rounded-[20px]"
          )}
        >
          {currentTheme.mainBlock.gradients?.map((gradient, index) => (
            <div
              key={index}
              className={cn(gradient, "pointer-events-none absolute z-20")}
              aria-hidden
            />
          ))}
          {currentTheme.mainBlock.fade && (
            <div
              className={cn(
                currentTheme.mainBlock.fade,
                "pointer-events-none absolute inset-0 rounded-[20px]"
              )}
              aria-hidden
            />
          )}
        </div>
        {currentTheme.mainBlock.shine && (
          <>
            <div
              className={cn(
                currentTheme.mainBlock.shine,
                "pointer-events-none absolute left-0 top-0 z-30 h-px w-[380px] mix-blend-plus-lighter blur-[5px]"
              )}
              aria-hidden
            />
            <div
              className={cn(
                currentTheme.mainBlock.shine,
                "pointer-events-none absolute left-0 top-0 z-30 h-px w-[380px] mix-blend-plus-lighter blur-[3px]"
              )}
              aria-hidden
            />
            <div
              className={cn(
                currentTheme.mainBlock.shine,
                "pointer-events-none absolute left-0 top-0 z-30 h-px w-[380px] mix-blend-plus-lighter blur-[1px]"
              )}
              aria-hidden
            />
          </>
        )}
        {currentTheme.background && (
          <>
            {currentTheme.background.gradients.map((gradient, index) => (
              <div
                key={index}
                className={cn(gradient, "pointer-events-none absolute z-10")}
                aria-hidden
              />
            ))}
          </>
        )}
      </div>
    </m.div>
  )
}

export default InboxContainer
