"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const NOTIFY_EMAIL = "hello@novu.co"

interface INotifyMeProps {
  channelLabel: string
  className?: string
  /** when this value changes, focus the email input (0 = never) */
  focusSignal?: number
}

function NotifyMe({
  channelLabel,
  className,
  focusSignal = 0,
}: INotifyMeProps) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focusSignal > 0) {
      inputRef.current?.focus({ preventScroll: true })
    }
  }, [focusSignal])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!email) return

    const subject = encodeURIComponent(`Notify me when ${channelLabel} is live`)
    const body = encodeURIComponent(
      `Please notify me when the ${channelLabel} channel is live on Novu Connect.\n\nMy email: ${email}`
    )
    window.location.href = `mailto:${NOTIFY_EMAIL}?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p
        className={cn(
          "flex items-center gap-2 text-base tracking-tight text-gray-90",
          className
        )}
      >
        <Check className="size-4.5 shrink-0 text-[#3ac47d]" aria-hidden />
        Thanks. We&apos;ll email you when {channelLabel} is live.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative h-11 w-[22.1875rem] max-w-full", className)}
    >
      <input
        ref={inputRef}
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@company.com"
        aria-label={`Email to be notified when ${channelLabel} is live`}
        className="h-11 w-full rounded-md border border-gray-20 bg-transparent pr-32 pl-4 text-base text-foreground placeholder:text-gray-50 focus-visible:border-gray-40 focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:outline-none"
      />
      <Button
        type="submit"
        variant="default"
        size="none"
        className="absolute inset-y-1 right-1 h-auto rounded px-5 text-base leading-none font-medium tracking-tight normal-case"
      >
        Notify Me
      </Button>
    </form>
  )
}

export default NotifyMe
