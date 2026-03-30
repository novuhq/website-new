"use client"

import { cn } from "@/lib/utils"
import {
  NotionFileIcon,
  NotionUsersIcon,
  NotionReadIcon,
  NotionArchiveIcon,
} from "../icons"
import { NOTION_MESSAGE_THEMES } from "../theme-config"
import type { INotionMessage } from "../types"

interface INotionMessageProps {
  theme: "notionDark" | "notionLight"
  message: INotionMessage
  readMessage: (id: number, state?: boolean) => void
  deleteMessage: (id: number) => void
}

function NotionMessage({
  theme,
  message,
  readMessage,
  deleteMessage,
}: INotionMessageProps) {
  const { index, title, text, date, isRead } = message
  const currentTheme = NOTION_MESSAGE_THEMES[theme]

  const handleReadMessage = () => {
    readMessage(index, true)
  }

  const handleReadMessageWithPropagation = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation()
    readMessage(index, !isRead)
  }

  const handleDeleteMessage = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation()
    deleteMessage(index)
  }

  return (
    <button
      className={cn(
        currentTheme.background,
        currentTheme.text,
        "group relative block cursor-pointer px-3 text-left font-inter transition-none"
      )}
      type="button"
      onClick={handleReadMessage}
    >
      <div
        className={cn(
          currentTheme.border,
          "relative grid grid-cols-1 overflow-hidden py-4 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px group-hover:after:bg-transparent"
        )}
      >
        <div className="grid grid-cols-[48px_1fr_48px]">
          <div className="col-span-1 flex items-center gap-x-2">
            <span
              className={cn(
                isRead ? "bg-transparent" : currentTheme.dot,
                "block size-1.5 rounded-full"
              )}
              aria-hidden
            />
            <img
              className={cn(
                "size-[26px] rounded-full border",
                currentTheme.avatarBorder
              )}
              src={message.authors[0].avatar}
              alt={message.authors[0].name}
              width={26}
              height={26}
            />
          </div>
          <h4 className="col-start-2 pt-[5px] leading-none">
            <span className="inline-block font-semibold">
              {message.authors[0].name}
            </span>{" "}
            <span className="inline-block font-medium">
              {message.subtitle}
            </span>
          </h4>
          <div className="col-start-2 mt-1.5 flex h-[22px] items-center gap-x-2">
            <NotionFileIcon className={cn("size-4", currentTheme.icons)} />
            <span
              className={cn(
                "relative inline-block font-semibold leading-none after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full",
                currentTheme.fileBorder
              )}
            >
              {title}
            </span>
          </div>
          {message.authors.length > 1 && (
            <div className="col-start-2 mt-5">
              <span className="flex items-center gap-x-2 text-sm leading-none text-[#6F727B]">
                <NotionUsersIcon
                  className={cn("size-4", currentTheme.icons)}
                />
                Person
              </span>
              <ul className="mt-2.5 flex items-center gap-x-4">
                {message.authors.map((author, idx) => (
                  <li className="flex items-center gap-x-1.5" key={idx}>
                    <img
                      className={cn(
                        "size-[22px] rounded-full border",
                        currentTheme.avatarBorder
                      )}
                      src={author.avatar}
                      width={22}
                      height={22}
                      alt=""
                    />
                    <span className="text-sm leading-none">
                      {author.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="col-start-2 mt-5">
            <p
              className={cn(
                "text-sm leading-none",
                currentTheme.authorText
              )}
            >
              {message.authors[0].name}
            </p>
            <p className="mt-1.5 line-clamp-2 text-ellipsis">{text}</p>
          </div>
          <button
            className={cn(
              "col-start-2 mt-[18px] flex h-[30px] w-[58px] items-center justify-center rounded border text-sm font-semibold leading-none",
              currentTheme.buttonBorder
            )}
            type="button"
          >
            Reply
          </button>
          <span className="col-start-3 row-start-1 flex translate-x-0.5 translate-y-0.5 items-center justify-center text-sm leading-none text-[#6F727B] group-focus-within:opacity-0 group-hover:opacity-0">
            {date}
          </span>
          <div
            className={cn(
              "absolute right-2.5 top-3.5 z-10 hidden gap-x-1.5 rounded-[5px] px-1 py-0.5 group-focus-within:flex group-hover:flex",
              currentTheme.actionContainer
            )}
          >
            <button
              className={cn(
                currentTheme.action,
                "flex size-7 items-center justify-center rounded outline-none transition-all duration-200"
              )}
              type="button"
              aria-label="Mark as read"
              onClick={handleReadMessageWithPropagation}
            >
              <NotionReadIcon className="size-5" />
            </button>
            <button
              className={cn(
                currentTheme.action,
                "flex size-7 items-center justify-center rounded outline-none transition-all duration-200"
              )}
              type="button"
              aria-label="Archive"
              onClick={handleDeleteMessage}
            >
              <NotionArchiveIcon className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </button>
  )
}

export default NotionMessage
