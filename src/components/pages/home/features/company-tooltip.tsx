"use client"

import { useRef, useState, type MouseEvent, type PointerEvent } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface IFeatureCompany {
  name: string
  about: string
  useCase: string
}

function ChatBotIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5"
      fill="none"
      viewBox="0 0 14 14"
    >
      <path
        d="M4.66536 2.33464C4.66536 1.69122 4.14211 1.16797 3.4987 1.16797C2.85528 1.16797 2.33203 1.69122 2.33203 2.33464C2.33203 2.76455 2.56828 3.13672 2.91536 3.33914V5.2513H4.08203V3.33914C4.42911 3.13672 4.66536 2.76455 4.66536 2.33464Z"
        fill="currentColor"
      />
      <path
        d="M11.5599 6.99986C11.5529 6.9812 11.5494 6.96136 11.5424 6.9427C11.2869 6.29345 10.6569 5.83203 9.91725 5.83203H9.723L8.16725 6.9987C7.91175 7.19003 7.61017 7.29095 7.29342 7.29095C6.489 7.29095 5.83392 6.63645 5.83392 5.83203H1.75C0.785167 5.83203 0 6.6172 0 7.58203V12.2487C0 13.2135 0.785167 13.9987 1.75 13.9987H9.91667C10.8815 13.9987 11.6667 13.2135 11.6667 12.2487V7.58203C11.6667 7.46711 11.6544 7.35511 11.6328 7.24661C11.6159 7.16086 11.5885 7.08036 11.5599 6.99986ZM3.20833 10.4987C2.72592 10.4987 2.33333 10.1061 2.33333 9.6237C2.33333 9.14128 2.72592 8.7487 3.20833 8.7487C3.69075 8.7487 4.08333 9.14128 4.08333 9.6237C4.08333 10.1061 3.69075 10.4987 3.20833 10.4987ZM8.45833 10.4987C7.97592 10.4987 7.58333 10.1061 7.58333 9.6237C7.58333 9.14128 7.97592 8.7487 8.45833 8.7487C8.94075 8.7487 9.33333 9.14128 9.33333 9.6237C9.33333 10.1061 8.94075 10.4987 8.45833 10.4987Z"
        fill="currentColor"
      />
      <path
        d="M7 5.83333V1.16667C7 0.522083 7.52208 0 8.16667 0H12.8333C13.4779 0 14 0.522083 14 1.16667V3.5C14 4.14458 13.4779 4.66667 12.8333 4.66667H9.33333L7.46667 6.06667C7.27417 6.21075 7 6.07367 7 5.83333Z"
        fill="currentColor"
      />
    </svg>
  )
}

function TooltipTip() {
  return (
    <svg
      aria-hidden="true"
      className="absolute right-0 -bottom-2 h-2 w-7.5"
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 30 8"
    >
      <path
        d="M24.207 -0.687805L16.7676 6.75165C15.7913 7.72776 14.2087 7.72776 13.2324 6.75165L5.79297 -0.687805H24.207Z"
        fill="#0B0C0E"
        stroke="#2A2B33"
      />
    </svg>
  )
}

function CompanyTooltip({ company }: { company: IFeatureCompany }) {
  const [open, setOpen] = useState(false)
  const isPinnedRef = useRef(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const pinTooltip = () => {
    isPinnedRef.current = true
    setOpen(true)
  }

  const closeTooltip = () => {
    isPinnedRef.current = false
    setOpen(false)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isPinnedRef.current) return

    setOpen(nextOpen)
  }

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (event.pointerType === "touch" && isPinnedRef.current) {
      closeTooltip()
      return
    }

    pinTooltip()
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (event.detail === 0) {
      pinTooltip()
    }
  }

  return (
    <Tooltip open={open} onOpenChange={handleOpenChange}>
      <TooltipTrigger asChild>
        <button
          ref={triggerRef}
          aria-label={`About ${company.name}`}
          className="absolute top-5 right-5 z-20 flex size-7 cursor-pointer items-center justify-center overflow-hidden rounded border border-gray-12 bg-[#101114] text-gray-60 shadow-[0_0_6px_2px_rgba(0,0,0,0.15)] backdrop-blur-[3.5px] transition-colors hover:border-gray-20 hover:bg-[#0B0C0E] hover:text-white focus-visible:border-gray-20 focus-visible:bg-[#0B0C0E] focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none data-[state=delayed-open]:border-gray-20 data-[state=delayed-open]:bg-[#0B0C0E] data-[state=delayed-open]:text-white data-[state=instant-open]:border-gray-20 data-[state=instant-open]:bg-[#0B0C0E] data-[state=instant-open]:text-white"
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          type="button"
        >
          <ChatBotIcon />
        </button>
      </TooltipTrigger>
      <TooltipContent
        align="end"
        avoidCollisions={false}
        className="block w-[23.1875rem] max-w-[calc(100vw-2rem)] rounded-md border-gray-20 bg-[#0B0C0E] p-0 font-inter text-pretty shadow-none drop-shadow-[0_2px_2.5px_rgba(0,0,0,0.25)] before:hidden after:hidden [&>span]:block [&>span]:w-full"
        onEscapeKeyDown={(event) => {
          if (
            isPinnedRef.current ||
            triggerRef.current === document.activeElement
          ) {
            closeTooltip()
            return
          }

          event.preventDefault()
        }}
        onPointerDownOutside={(event) => {
          if (
            event.target instanceof Node &&
            triggerRef.current?.contains(event.target)
          ) {
            event.preventDefault()
            return
          }

          closeTooltip()
        }}
        side="top"
        sideOffset={12}
      >
        <span className="block px-2.5 py-2 text-left">
          <span className="flex flex-col gap-3">
            <span className="flex flex-col gap-1 text-[13px] leading-none">
              <span className="font-medium tracking-tighter text-gray-90">
                {company.name}
              </span>
              <span className="leading-tight font-normal tracking-tight text-gray-60">
                {company.about}
              </span>
            </span>
            <span className="h-px w-full bg-gray-20" aria-hidden="true" />
          </span>
          <span className="mt-2 block text-[13px] leading-[1.375] font-normal tracking-tight text-gray-80">
            {company.useCase}
          </span>
        </span>
        <TooltipTip />
      </TooltipContent>
    </Tooltip>
  )
}

export default CompanyTooltip
