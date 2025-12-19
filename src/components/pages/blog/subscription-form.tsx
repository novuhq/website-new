"use client"

import { useState } from "react"
import { SUBSCRIPTION_FORM_ID, UTM_PARAMS } from "@/constants/forms"
import { ROUTE } from "@/constants/routes"
import { zodResolver } from "@hookform/resolvers/zod"
import { SendHorizontal } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

interface ISubscriptionFormProps {
  className?: string
  buttonText?: string
  placeholder?: string
  useIcon?: boolean
}

function SubscriptionForm({
  className,
  buttonText = "Subscribe",
  placeholder = "Your email...",
  useIcon = false,
}: ISubscriptionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    const utmParams: Record<string, string> = {}

    UTM_PARAMS.forEach((param) => {
      try {
        const paramValue = sessionStorage.getItem(param)

        if (paramValue) {
          utmParams[param] = paramValue
        }
      } catch (_err) {
        // Do nothing
      }
    })

    try {
      const response = await fetch(ROUTE.apiHubspot, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formId: SUBSCRIPTION_FORM_ID,
          data: {
            context: {
              pageUri: window.location.href,
            },
            fields: [
              {
                objectTypeId: "0-1",
                name: "email",
                value: values.email,
              },
              ...Object.entries(utmParams).map(([name, value]) => ({
                objectTypeId: "0-1",
                name,
                value,
              })),
            ],
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Subscription failed")
      }

      const data = await response.json()

      if (data.error) {
        form.setError("email", { message: data.message })
        return
      }

      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        form.reset()
      }, 3000)
    } catch (_error) {
      form.setError("email", {
        message: "Something went wrong. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn(
          "relative flex w-full items-center gap-x-5 rounded border border-gray-5 bg-background pr-1 transition-colors duration-300 focus-within:border-gray-8",
          className
        )}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="static w-full">
              <FormControl>
                <Input
                  className="h-9.5 w-full rounded border-none bg-transparent pr-0 pl-3 focus-visible:ring-[none] focus-visible:outline-none"
                  placeholder={placeholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className={cn(
            "relative z-10 h-8 rounded-xs px-3",
            useIcon && "px-3 [&_svg]:size-5"
          )}
          type="submit"
          disabled={isSubmitting}
        >
          <span
            className={cn(
              "text-[0.75rem] leading-none",
              useIcon && "hidden md:block"
            )}
          >
            {isSubmitting ? "Sending..." : buttonText}
          </span>
          {useIcon && (
            <SendHorizontal className="shrink-0 md:hidden" size={20} />
          )}
        </Button>

        {isSuccess && (
          <div className="absolute top-12 text-sm font-book text-gray-8">
            Thank you for subscribing!
          </div>
        )}
      </form>
    </Form>
  )
}

export default SubscriptionForm
