"use client"

import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { Check } from "lucide-react"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface INotifyMeProps {
  channelLabel: string
  className?: string
  /** when this value changes, focus the email input (0 = never) */
  focusSignal?: number
}

const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address.")
  .max(254, "Email is too long.")

function getUtmSource() {
  const currentUtmSource = new URLSearchParams(window.location.search).get(
    "utm_source"
  )

  if (currentUtmSource) return currentUtmSource

  try {
    return sessionStorage.getItem("utm_source") || ""
  } catch {
    return ""
  }
}

function NotifyMe({
  channelLabel,
  className,
  focusSignal = 0,
}: INotifyMeProps) {
  const [email, setEmail] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const errorId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focusSignal > 0) {
      inputRef.current?.focus({ preventScroll: true })
    }
  }, [focusSignal])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    const parsedEmail = emailSchema.safeParse(email)

    if (!parsedEmail.success) {
      setErrorMessage(parsedEmail.error.issues[0]?.message || "Invalid email.")
      inputRef.current?.focus()
      return
    }

    setErrorMessage("")
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch("/api/channel-waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: channelLabel,
          companyWebsite: formData.get("companyWebsite"),
          email: parsedEmail.data,
          sourcePage: window.location.href,
          utmSource: getUtmSource(),
        }),
      })

      if (!response.ok) {
        throw new Error("Unable to submit waitlist registration")
      }

      setSubmitted(true)
    } catch {
      setErrorMessage("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <p
        className={cn(
          "flex items-center gap-2 text-base tracking-tight text-gray-90",
          className
        )}
        role="status"
        aria-live="polite"
      >
        <Check className="size-4.5 shrink-0 text-[#3ac47d]" aria-hidden />
        Thanks. We&apos;ll email you when {channelLabel} is live.
      </p>
    )
  }

  return (
    <div className={cn("w-full max-w-full sm:w-89", className)}>
      <form onSubmit={handleSubmit} className="relative h-11 w-full" noValidate>
        <input
          ref={inputRef}
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setErrorMessage("")
          }}
          placeholder="you@company.com"
          aria-describedby={errorMessage ? errorId : undefined}
          aria-invalid={Boolean(errorMessage)}
          aria-label={`Email to be notified when ${channelLabel} is live`}
          className="h-11 w-full rounded-md border border-gray-20 bg-transparent pr-32 pl-4 text-base text-foreground placeholder:text-gray-50 focus-visible:border-gray-40 focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:outline-none"
        />
        <div className="sr-only" aria-hidden="true">
          <label htmlFor={`${errorId}-company-website`}>Company website</label>
          <input
            id={`${errorId}-company-website`}
            name="companyWebsite"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <Button
          type="submit"
          variant="default"
          size="none"
          disabled={isSubmitting}
          className="absolute inset-y-1 right-1 h-auto rounded px-5 text-base leading-none font-medium tracking-tight normal-case"
        >
          {isSubmitting ? "Submitting…" : "Notify Me"}
        </Button>
        {errorMessage ? (
          <p
            className="absolute top-full translate-y-1.5 text-sm tracking-tight text-destructive"
            id={errorId}
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}
      </form>
    </div>
  )
}

export default NotifyMe
