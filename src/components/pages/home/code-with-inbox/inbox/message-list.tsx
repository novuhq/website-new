"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, domAnimation, LazyMotion } from "motion/react"
import * as m from "motion/react-m"

import { cn } from "@/lib/utils"
import { prepareAndFilterMessages } from "@/lib/linear-theme-utils"
import {
  ArchiveAllIcon,
  ArchiveReadIcon,
  ArchivedIcon,
  LinearDeleteIcon,
  LinearMarkReadIcon,
  MarkReadIcon,
  UnreadReadIcon,
  UnreadIcon,
} from "./icons"
import { MESSAGE_LIST_THEMES } from "./theme-config"
import type {
  InboxTheme,
  InboxMessage,
  INovuMessage,
  INotionMessage,
  ILinearMessage,
  ITabItem,
  IFilterItem,
  IActionItem,
} from "./types"

import NovuHeader from "./headers/novu-header"
import NotionHeader from "./headers/notion-header"
import LinearHeader from "./headers/linear-header"
import NovuTabList from "./novu-tab-list"
import NovuMessage from "./messages/novu-message"
import NotionMessage from "./messages/notion-message"
import LinearMessage from "./messages/linear-message"

const ANIMATION_DURATION = 0.2
const MOTION_EASY = [0.25, 0.1, 0.25, 1]

const deleteVariants = {
  animate: {
    height: "auto" as const,
    opacity: 1,
    transition: { duration: ANIMATION_DURATION, ease: MOTION_EASY },
  },
  exit: {
    height: 0,
    opacity: 0,
  },
}

const NOVU_NOTION_FILTERS: IFilterItem[] = [
  {
    label: "Unread & read",
    Icon: UnreadReadIcon,
    filter: (messages) => messages.filter((m) => !m.isArchived),
  },
  {
    label: "Unread",
    Icon: UnreadIcon,
    filter: (messages) =>
      messages.filter((m) => !m.isArchived && !m.isRead),
  },
  {
    label: "Archived",
    Icon: ArchivedIcon,
    filter: (messages) => messages.filter((m) => m.isArchived),
  },
]

const NOVU_NOTION_ACTIONS: IActionItem[] = [
  {
    label: "Mark all as read",
    Icon: MarkReadIcon,
    action: (messages) =>
      messages.map((m) => ({ ...m, isRead: true })),
  },
  {
    label: "Archive all",
    Icon: ArchiveAllIcon,
    action: (messages) =>
      messages.map((m) => ({ ...m, isArchived: true })),
  },
  {
    label: "Archive read",
    Icon: ArchiveReadIcon,
    action: (messages) =>
      messages.map((m) =>
        m.isRead ? { ...m, isArchived: true } : m
      ),
  },
]

const LINEAR_FILTERS = {
  ordering: [{ label: "Newest" }, { label: "Oldest" }],
  actions: [
    {
      label: "Mark all as read",
      Icon: LinearMarkReadIcon,
      action: (messages: InboxMessage[]) =>
        messages.map((m) => ({ ...m, isRead: true })),
    },
    {
      label: "Delete all notifications",
      Icon: LinearDeleteIcon,
      action: () => [] as InboxMessage[],
    },
    {
      label: "Delete all read notifications",
      Icon: LinearDeleteIcon,
      action: (messages: InboxMessage[]) =>
        messages.filter((m) => !m.isRead),
    },
  ] satisfies IActionItem[],
}

interface IMessageListProps {
  theme: InboxTheme
  tabs?: ITabItem[]
  setActiveTab: (tab: string) => void
  activeTab: string
  messages: InboxMessage[]
  setMessages: (messages: InboxMessage[]) => void
}

function MessageList({
  theme,
  tabs = [],
  setActiveTab,
  activeTab,
  messages,
  setMessages,
}: IMessageListProps) {
  const currentTheme = MESSAGE_LIST_THEMES[theme]

  const [filterIndex, setFilterIndex] = useState(0)
  const [orderingPosition, setOrderingPosition] = useState(
    LINEAR_FILTERS.ordering[0].label
  )
  const [showUnreadFirst, setShowUnreadFirst] = useState(false)
  const [showRead, setShowRead] = useState(true)

  const filteredMessageList: InboxMessage[] = useMemo(() => {
    switch (theme) {
      case "novuDark":
      case "novuLight": {
        const tabFilteredMessages = messages.filter((message) => {
          if (activeTab === "All") return true
          return "category" in message && message.category === activeTab
        })
        return NOVU_NOTION_FILTERS[filterIndex].filter(tabFilteredMessages)
      }
      case "notionDark":
      case "notionLight":
        return NOVU_NOTION_FILTERS[filterIndex].filter(messages)
      case "linearDark":
      case "linearLight": {
        const isNewest = orderingPosition === "Newest"
        return prepareAndFilterMessages(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          messages as any,
          showRead,
          showUnreadFirst,
          isNewest
        )
      }
      default:
        return messages
    }
  }, [
    theme,
    filterIndex,
    messages,
    orderingPosition,
    showRead,
    showUnreadFirst,
    activeTab,
  ])

  const readMessage = (currentId: number, newState?: boolean) => {
    setMessages(
      messages.map((message) =>
        message.index === currentId
          ? { ...message, isRead: newState ?? !message.isRead }
          : message
      )
    )
  }

  const deleteMessage = (currentId: number) => {
    setMessages(
      messages.map((message) =>
        message.index === currentId
          ? { ...message, isArchived: !message.isArchived }
          : message
      )
    )
  }

  const handleAction =
    (action: IActionItem["action"]) => () => {
      setMessages(action(messages))
    }

  const handleFilter = (filter: number) => () => {
    setFilterIndex(filter)
  }

  const handleOrdering = (value: string) => {
    setOrderingPosition(value)
  }

  const { Component: EmptyIcon, className: emptyIconClassName } =
    currentTheme.emptyInboxIcon

  return (
    <>
      {(theme === "novuDark" || theme === "novuLight") && (
        <NovuHeader
          theme={theme}
          filters={NOVU_NOTION_FILTERS}
          actions={NOVU_NOTION_ACTIONS}
          handleAction={handleAction}
          handleFilter={handleFilter}
          filterIndex={filterIndex}
        />
      )}
      {(theme === "notionDark" || theme === "notionLight") && (
        <NotionHeader
          theme={theme}
          filters={NOVU_NOTION_FILTERS}
          actions={NOVU_NOTION_ACTIONS}
          handleAction={handleAction}
          handleFilter={handleFilter}
        />
      )}
      {(theme === "linearDark" || theme === "linearLight") && (
        <LinearHeader
          theme={theme}
          ordering={LINEAR_FILTERS.ordering}
          actions={LINEAR_FILTERS.actions}
          handleAction={handleAction}
          orderingPosition={orderingPosition}
          handleOrdering={handleOrdering}
          showRead={showRead}
          showUnreadFirst={showUnreadFirst}
          toggleShowRead={() => setShowRead((prev) => !prev)}
          toggleShowUnreadFirst={() =>
            setShowUnreadFirst((prev) => !prev)
          }
        />
      )}
      {(theme === "novuDark" || theme === "novuLight") &&
        filterIndex !== 2 &&
        filteredMessageList.length > 0 && (
          <NovuTabList
            theme={theme}
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      <LazyMotion features={domAnimation}>
        <AnimatePresence mode="wait">
          <m.div
            className="scrollbar-hidden relative z-10 h-full overflow-y-auto pb-4"
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: ANIMATION_DURATION, ease: MOTION_EASY }}
          >
            {filteredMessageList.length === 0 ? (
              <div className="flex h-full flex-col items-center pt-[164px]">
                <EmptyIcon className={emptyIconClassName} />
                <p className={cn(currentTheme.text, "mt-2 text-center")}>
                  {theme === "linearDark" || theme === "linearLight"
                    ? "No notifications"
                    : "No messages yet"}
                </p>
              </div>
            ) : (
              <ul>
                <AnimatePresence>
                  {filteredMessageList.map((message) => (
                    <m.li
                      key={message.index}
                      variants={deleteVariants}
                      initial="from"
                      animate="animate"
                      exit="exit"
                      layout
                    >
                      {(theme === "novuDark" ||
                        theme === "novuLight") && (
                        <NovuMessage
                          theme={theme}
                          message={message as unknown as INovuMessage}
                          readMessage={readMessage}
                        />
                      )}
                      {(theme === "notionDark" ||
                        theme === "notionLight") && (
                        <NotionMessage
                          theme={theme}
                          message={message as unknown as INotionMessage}
                          readMessage={readMessage}
                          deleteMessage={deleteMessage}
                        />
                      )}
                      {(theme === "linearDark" ||
                        theme === "linearLight") && (
                        <LinearMessage
                          theme={theme}
                          message={message as unknown as ILinearMessage}
                          readMessage={readMessage}
                        />
                      )}
                    </m.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </m.div>
        </AnimatePresence>
      </LazyMotion>
    </>
  )
}

export default MessageList
