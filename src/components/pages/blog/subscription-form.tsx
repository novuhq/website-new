"use client"

import { useState } from "react"
import { SUBSCRIPTION_FORM_ID, UTM_PARAMS } from "@/constants/forms"
import { ROUTE } from "@/constants/routes"
import { zodResolver } from "@hookform/resolvers/zod"
import { cva, type VariantProps } from "class-variance-authority"
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

interface ISubscriptionFormProps extends VariantProps<typeof formVariants> {
  className?: string
  buttonText?: string
  placeholder?: string
  useIcon?: boolean
}

const formVariants = cva(
  "relative flex w-full items-center gap-x-5 border bg-background transition-colors duration-300",
  {
    variants: {
      variant: {
        default: "border-gray-5 rounded focus-within:border-gray-8 pr-1",
        cta: "rounded-[0.375rem] border-none pr-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function SubscriptionForm({
  className,
  buttonText = "Subscribe",
  placeholder = "Your email...",
  variant = "default",
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

    const data = await response.json()

    if (data.error) {
      form.setError("email", { message: data.message })
      setIsSubmitting(false)
      return
    } else {
      setIsSuccess(true)
      setIsSubmitting(false)

      setTimeout(() => {
        setIsSuccess(false)
        form.reset()
      }, 3000)
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn(formVariants({ variant }), className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="static w-full">
              <FormControl>
                <Input
                  className={cn(
                    "w-full rounded border-none bg-transparent pr-0 pl-3 focus-visible:ring-[none] focus-visible:outline-none",
                    variant === "default" && "h-9.5",
                    variant === "cta" && "h-11.5 placeholder:text-white"
                  )}
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
            "relative z-10 rounded-xs px-3",
            useIcon && "px-3 [&_svg]:size-5",
            variant === "default" && "h-8",
            variant === "cta" && "h-9"
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
