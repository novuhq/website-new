"use client"

import { cn } from "@/lib/utils"

import BookADemoSchedulingButton from "./scheduling-button"

function BookADemoSchedulingActions({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-x-3 gap-y-4 max-2xs:flex-col md:gap-x-7",
        className
      )}
    >
      <BookADemoSchedulingButton
        className="max-2xs:w-full md:min-w-39.5"
        variant="default"
        size="lg"
        clickLocation="book_a_demo_cta"
        clickText="book_a_demo"
        source="book_a_demo_cta"
      >
        Book a demo
      </BookADemoSchedulingButton>
      <BookADemoSchedulingButton
        className="max-2xs:w-full md:min-w-39.5"
        variant="outline"
        size="lg"
        clickLocation="book_a_demo_cta"
        clickText="book_a_call"
        source="book_a_demo_cta"
      >
        Book a Call
      </BookADemoSchedulingButton>
    </div>
  )
}

export default BookADemoSchedulingActions
