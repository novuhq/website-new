"use client"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import type { ButtonProps } from "@/components/ui/button"
import { Button } from "@/components/ui/button"

import { useBookADemoScheduling } from "./scheduling-provider"

type BookADemoSchedulingButtonProps = Pick<
  ButtonProps,
  "className" | "size" | "textClassName" | "variant"
> & {
  children: ReactNode
  clickLocation: string
  clickText: string
  source: string
}

function BookADemoSchedulingButton({
  children,
  clickLocation,
  clickText,
  source,
  ...props
}: BookADemoSchedulingButtonProps) {
  const openSchedulingModal = useBookADemoScheduling()

  return (
    <Button
      type="button"
      data-click-location={clickLocation}
      data-click-text={clickText}
      onClick={() => openSchedulingModal(source)}
      {...props}
    >
      {children}
    </Button>
  )
}

type BookADemoSchedulingInlineButtonProps = {
  children: ReactNode
  className?: string
  clickLocation: string
  clickText: string
  source: string
}

function BookADemoSchedulingInlineButton({
  children,
  className,
  clickLocation,
  clickText,
  source,
}: BookADemoSchedulingInlineButtonProps) {
  const openSchedulingModal = useBookADemoScheduling()

  return (
    <button
      type="button"
      className={cn(
        "inline cursor-pointer p-0 text-left font-book tracking-tighter text-lagune-3 transition-colors hover:text-lagune-2 focus-visible:ring-2 focus-visible:ring-lagune-3 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        className
      )}
      data-click-location={clickLocation}
      data-click-text={clickText}
      onClick={() => openSchedulingModal(source)}
    >
      {children}
    </button>
  )
}

export default BookADemoSchedulingButton
export { BookADemoSchedulingInlineButton }
