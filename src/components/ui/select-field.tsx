"use client"

import Image from "next/image"
import type { IStackOption } from "@/data/pages/connect-stack-options"
import * as SelectPrimitive from "@radix-ui/react-select"

import { cn } from "@/lib/utils"

/**
 * Shared configurator core (see `connect-stack-options.ts` for background on
 * why this file exists as a net-new extraction). Moved verbatim out of
 * `connect-stack.tsx` — same markup, same Tailwind classes, same behaviour.
 * `connect-stack.tsx` and `web-chat/configurator.tsx` both import this now.
 */

function OptionLabel({ option }: { option: IStackOption }) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      {option.icon && (
        <span className="relative size-4 shrink-0">
          <Image
            className="size-4 object-contain"
            src={option.icon}
            alt=""
            width={16}
            height={16}
            aria-hidden
          />
        </span>
      )}
      <span className="truncate">{option.label}</span>
    </span>
  )
}

interface ISelectFieldProps {
  className?: string
  label: string
  onValueChange: (value: string) => void
  options: IStackOption[]
  triggerClassName?: string
  value: string
}

export function SelectField({
  className,
  label,
  options,
  value,
  onValueChange,
  triggerClassName,
}: ISelectFieldProps) {
  const current = options.find((option) => option.value === value) ?? options[0]

  return (
    <label className={cn("flex min-w-0 flex-col gap-2", className)}>
      <span className="h-4.5 text-sm leading-tight font-medium tracking-tighter text-gray-60">
        {label}
      </span>
      <SelectPrimitive.Root value={current.value} onValueChange={onValueChange}>
        <SelectPrimitive.Trigger
          className={cn(
            "group relative flex h-10 w-full min-w-0 items-center justify-between gap-1.5 rounded-[0.25rem] border border-gray-20 bg-[#040406] px-[13px] text-left text-sm font-normal tracking-tighter text-foreground transition-colors outline-none before:absolute before:inset-x-0 before:-inset-y-0.5 hover:border-foreground/30 focus-visible:ring-2 focus-visible:ring-foreground/30",
            triggerClassName
          )}
          aria-label={label}
        >
          <SelectPrimitive.Value>
            <OptionLabel option={current} />
          </SelectPrimitive.Value>
          <SelectPrimitive.Icon asChild>
            <svg
              className="relative -mr-0.5 w-2.5 shrink-0 text-gray-60 transition-transform group-data-[state=open]:rotate-180"
              viewBox="0 0 8 5"
              fill="none"
              aria-hidden
            >
              <path
                d="M1 1L4 4L7 1"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="z-50 min-w-(--radix-select-trigger-width) overflow-hidden rounded-[0.25rem] border border-gray-20 bg-black font-inter shadow-xl outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            position="popper"
            sideOffset={2}
          >
            <SelectPrimitive.Viewport className="flex flex-col gap-0.5 p-1.5">
              {options.map((option) => (
                <SelectPrimitive.Item
                  className="relative flex cursor-pointer items-center justify-between gap-3 rounded-[0.25rem] px-[7px] py-1.5 text-sm text-foreground outline-none select-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[highlighted]:bg-[#191a1f] data-[state=checked]:bg-[#191a1f]"
                  key={option.value}
                  value={option.value}
                >
                  <SelectPrimitive.ItemText>
                    <OptionLabel option={option} />
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <svg
                      className="size-3.5"
                      viewBox="0 0 15 15"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M2 8L6 12L14 4"
                        stroke="currentColor"
                        strokeMiterlimit="10"
                        strokeLinecap="square"
                      />
                    </svg>
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </label>
  )
}
