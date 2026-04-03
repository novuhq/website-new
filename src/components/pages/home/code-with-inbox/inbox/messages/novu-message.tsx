"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { NovuNotificationIcon } from "../icons"
import { NOVU_MESSAGE_THEMES } from "../theme-config"
import type { INovuMessage } from "../types"

interface INovuMessageProps {
  theme: "novuDark" | "novuLight"
  message: INovuMessage
  readMessage: (id: number, state?: boolean) => void
}

function NovuMessage({ theme, message, readMessage }: INovuMessageProps) {
  const { index, title, mail, text, date, avatar, isRead } = message
  const currentTheme = NOVU_MESSAGE_THEMES[theme]

  const handleActiveMessage = (idx: number) => {
    readMessage(idx, true)
  }

  return (
    <div
      className={cn(
        currentTheme.background,
        "group relative cursor-pointer font-inter font-light"
      )}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === "Enter" && handleActiveMessage(index)}
      onClick={() => handleActiveMessage(index)}
    >
      <div
        className={cn(
          currentTheme.border,
          "relative grid grid-cols-1 overflow-hidden border-b p-5"
        )}
      >
        <div className="flex items-start gap-x-4">
          <div>
            {avatar ? (
              <Image
                className="rounded-full"
                src={avatar}
                alt=""
                width={38}
                height={38}
              />
            ) : (
              <span
                className={cn(
                  currentTheme.avatar,
                  "row-span-2 flex size-[38px] items-center justify-center rounded-full"
                )}
              >
                <NovuNotificationIcon className="size-4" />
              </span>
            )}
          </div>
          <div className="flex max-w-[400px] flex-col">
            <h4
              className={cn(
                "mt-px text-start text-lg font-medium leading-tight outline-none",
                currentTheme.titleStyles
              )}
            >
              {title}
            </h4>
            <p
              className={cn(
                "relative mt-1 text-[0.9375rem] font-normal tracking-[-0.01em] opacity-90",
                currentTheme.textStyles
              )}
            >
              {mail && <span className="font-medium">{mail}</span>} {text}
            </p>
            {message.buttons && message.buttons.length > 0 && (
              <div className="relative z-10 mt-3.5 flex gap-3">
                {message.buttons[0] && (
                  <button
                    className="group/button relative h-[30px] rounded-md bg-[#7D52F4] px-[17px] text-sm font-medium normal-case shadow-[0px_0px_0px_0.5px_#7D52F4] outline-none focus-visible:shadow-[0px_0px_0px_0.5px_#7D52F4,0px_0px_0px_4px_rgba(153,160,174,0.16)]"
                    type="button"
                  >
                    <span className="relative">{message.buttons[0]}</span>
                    <span
                      className="pointer-events-none absolute inset-0 rounded-md border border-white [mask-image:linear-gradient(to_bottom,rgba(255,255,255,0.12),rgba(255,255,255,0.1))]"
                      aria-hidden
                    />
                    <span
                      className="pointer-events-none absolute inset-0 rounded-md bg-gradient-to-b from-white to-transparent opacity-[0.16] transition-opacity duration-200 group-hover/button:opacity-0"
                      aria-hidden
                    />
                  </button>
                )}
                {message.buttons[1] && (
                  <button
                    className={cn(
                      "group/button relative h-[30px] rounded-md px-4 text-sm font-medium normal-case outline-none",
                      currentTheme.secondaryButton
                    )}
                    type="button"
                  >
                    <span className="relative">{message.buttons[1]}</span>
                    <span
                      className={cn(
                        "pointer-events-none absolute inset-0 rounded-md border group-focus-visible/button:border-none",
                        currentTheme.secondaryButtonBorder
                      )}
                      aria-hidden
                    />
                  </button>
                )}
              </div>
            )}
            <span
              className={cn(
                "text-[13px] font-normal leading-none opacity-50",
                currentTheme.dateStyles,
                message.buttons ? "mt-[18px]" : "mt-3"
              )}
            >
              {date}
            </span>
          </div>
        </div>
        {!isRead && (
          <span
            className={cn(
              currentTheme.dot,
              "absolute right-7 top-7 block size-2 rounded-full"
            )}
          />
        )}
      </div>
    </div>
  )
}

export default NovuMessage
