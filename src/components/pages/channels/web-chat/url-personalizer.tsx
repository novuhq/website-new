"use client"

import { useId, useState, type FormEvent } from "react"
import Image from "next/image"
import { HERO_GLOBE_IMAGE, HERO_RESET_IMAGE } from "@/data/pages/web-chat"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useWebChatBrand } from "@/components/pages/channels/web-chat/brand-provider"

const PLACEHOLDER = "yourdomain.com"
const SUBMIT_LABEL = "See it in your product"
const CAPTION =
  "Live and interactive. Paste your site to see the agent in your product."
const RESET_LABEL = "Reset personalization"

const FIELD_CLASSES =
  "relative flex h-11 items-center gap-3 rounded-3xl border border-white/10 bg-white/10 pl-2.25 pr-4 transition-colors duration-200 hover:border-white/60 hover:bg-white/[0.14] focus-within:border-white/60 focus-within:bg-white/[0.14]"

// The rounded field border indicates focus; retain an outline for forced colors.
const INPUT_CLASSES =
  "min-w-0 flex-1 bg-transparent text-base leading-none text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-hidden lg:text-lg"

const RESET_ICON_CLASSES =
  "size-6 opacity-40 transition-opacity duration-200 group-hover/reset:opacity-100 group-focus-visible/reset:opacity-100"

// Figma 45487:94047: white by default; the hover state uses the gray-10 token.
const SUBMIT_BUTTON_CLASSES =
  "h-11 shrink-0 rounded-full bg-white px-5 py-3.5 text-base leading-none font-medium tracking-tight normal-case hover:bg-gray-10 focus-visible:bg-gray-10 lg:w-[205px]"

function ResetIcon() {
  return (
    <span
      className={cn("grid place-items-center", RESET_ICON_CLASSES)}
      aria-hidden
    >
      <Image
        src={HERO_RESET_IMAGE}
        alt=""
        width={21}
        height={21}
        className="size-[20.5px]"
      />
    </span>
  )
}

/**
 * The control that starts the hero interaction: a visitor types their own
 * domain, submits, and `onSubmit` fires immediately so Task 8's animation can
 * start right away. `personalize` (Task 4's provider) is kicked off in
 * parallel and is never awaited here — a slow or failing extraction must
 * never delay the animation trigger.
 */
export function UrlPersonalizer({
  onSubmit,
}: {
  onSubmit: (url: string) => void
}) {
  const { status, personalize, reset } = useWebChatBrand()
  const [value, setValue] = useState("")
  const desktopInputId = useId()
  const mobileInputId = useId()

  const isLoading = status === "loading"

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return

    onSubmit(trimmed)
    void personalize(trimmed)
  }

  function handleReset() {
    setValue("")
    reset()
  }

  return (
    <div className="flex w-full max-w-[832px] flex-col gap-4">
      <form onSubmit={handleSubmit}>
        {/* Desktop: input, submit and reset share one pill. */}
        <div className="hidden h-[68px] items-center gap-5 rounded-[40px] bg-black py-3 pr-5 pl-3 shadow-[0_12px_56px_rgba(0,0,0,0.64),0_4px_28px_rgba(0,0,0,0.35)] ring-1 ring-white/10 ring-inset lg:flex">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div className={cn(FIELD_CLASSES, "min-w-0 flex-1")}>
              <Image
                src={HERO_GLOBE_IMAGE}
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0"
              />
              <label htmlFor={desktopInputId} className="sr-only">
                Your website URL
              </label>
              <input
                id={desktopInputId}
                type="text"
                inputMode="url"
                autoComplete="off"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder={PLACEHOLDER}
                className={INPUT_CLASSES}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              size="none"
              variant="default"
              className={SUBMIT_BUTTON_CLASSES}
            >
              {SUBMIT_LABEL}
            </Button>
          </div>
          <button
            type="button"
            onClick={handleReset}
            aria-label={RESET_LABEL}
            className="group/reset shrink-0"
          >
            <ResetIcon />
          </button>
        </div>

        {/* Mobile: a rounded dark card with two rows — full-width input, then submit + reset. */}
        <div className="flex w-full flex-col gap-2.5 rounded-[20px] bg-black p-2 shadow-[0_12px_56px_rgba(0,0,0,0.64),0_4px_28px_rgba(0,0,0,0.35)] ring-1 ring-white/10 ring-inset lg:hidden">
          <div className={FIELD_CLASSES}>
            <Image
              src={HERO_GLOBE_IMAGE}
              alt=""
              width={24}
              height={24}
              className="size-6 shrink-0"
            />
            <label htmlFor={mobileInputId} className="sr-only">
              Your website URL
            </label>
            <input
              id={mobileInputId}
              type="text"
              inputMode="url"
              autoComplete="off"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={PLACEHOLDER}
              className={INPUT_CLASSES}
            />
          </div>
          <div className="flex items-center gap-3 pr-3">
            <Button
              type="submit"
              disabled={isLoading}
              size="none"
              variant="default"
              className={cn(SUBMIT_BUTTON_CLASSES, "flex-1")}
            >
              {SUBMIT_LABEL}
            </Button>
            <button
              type="button"
              onClick={handleReset}
              aria-label={RESET_LABEL}
              className="group/reset shrink-0"
            >
              <ResetIcon />
            </button>
          </div>
        </div>
      </form>

      <p className="px-6 text-center text-sm leading-[1.38em] tracking-tight text-white/40 lg:text-[15px]">
        {CAPTION}
      </p>
    </div>
  )
}
