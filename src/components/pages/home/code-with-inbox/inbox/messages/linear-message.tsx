"use client"

import { cn } from "@/lib/utils"
import { LINEAR_MESSAGE_THEMES } from "../theme-config"
import type { ILinearMessage } from "../types"

interface ILinearMessageProps {
  theme: "linearDark" | "linearLight"
  message: ILinearMessage
  readMessage: (id: number, state?: boolean) => void
}

function LinearMessage({ theme, message, readMessage }: ILinearMessageProps) {
  const {
    index,
    title,
    actionType,
    avatarIcon: AvatarIcon,
    additionalText,
    date,
    dateIcon,
    isRead,
    authors,
  } = message
  const currentTheme = LINEAR_MESSAGE_THEMES[theme]

  const handleReadMessage = () => {
    readMessage(index, true)
  }

  return (
    <button
      className={cn(
        "mx-1 flex w-[calc(100%-8px)] items-center justify-between gap-x-5 rounded-[12px] px-5 py-[18px] pb-4 text-left font-inter",
        currentTheme.messageItemHover
      )}
      type="button"
      onClick={handleReadMessage}
    >
      <div className="flex items-center gap-x-[18px]">
        <div className="relative size-11 shrink-0">
          <img
            className="size-11 rounded-full"
            src={authors[0].avatar}
            alt={authors[0].name}
            width={44}
            height={44}
          />
          <AvatarIcon
            className={cn(
              "absolute -right-0.5 bottom-0 size-[18px]",
              currentTheme.avatarIconBg
            )}
            width={18}
            height={18}
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <span className="flex items-center gap-2">
            <span
              className={cn(
                isRead ? "hidden" : currentTheme.dot,
                "block size-2 shrink-0 rounded-full"
              )}
              aria-hidden
            />
            <h3
              className={cn(
                isRead
                  ? currentTheme.headerRead
                  : currentTheme.headerUnread,
                "line-clamp-1 text-[18px] leading-none tracking-[0.01em]"
              )}
            >
              {title}
            </h3>
          </span>
          <p
            className={cn(
              isRead ? currentTheme.textRead : currentTheme.textUnread,
              "line-clamp-1 text-[18px] font-normal leading-dense tracking-[-0.045em]"
            )}
          >
            {authors[0].name} {actionType} {additionalText}
          </p>
        </div>
      </div>
      <div className="flex w-11 flex-col items-end gap-y-2.5">
        <img
          src={dateIcon}
          alt={actionType}
          className="size-5 shrink-0"
          width={20}
          height={20}
        />
        <time
          className="text-[14px] leading-none text-[#6F727B]"
          dateTime="2023-10-02T12:00:00Z"
        >
          {date}
        </time>
      </div>
    </button>
  )
}

export default LinearMessage
