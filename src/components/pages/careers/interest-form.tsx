"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const interestOptions = [
  "Engineering",
  "Product",
  "Design",
  "Developer relations",
  "Marketing",
  "Operations",
]

const formSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  role: z.string().min(1, "Please select an area of interest."),
  link: z.string().url("Please enter a valid URL."),
  note: z.string().min(20, "Please add a little more detail."),
})

type CareersInterestFormValues = z.infer<typeof formSchema>
type CareersFieldName = keyof CareersInterestFormValues

type CareersFieldProps = {
  control: ReturnType<typeof useForm<CareersInterestFormValues>>["control"]
  name: CareersFieldName
  label: string
  placeholder: string
}

function CareersTextField({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: CareersFieldProps & {
  type?: "email" | "text" | "url"
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} type={type} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function CareersSelectField({
  control,
  name,
  label,
  placeholder,
  options,
}: CareersFieldProps & {
  options: string[]
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <select
              className="flex h-11 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-base leading-snug tracking-tight text-foreground transition-colors duration-300 focus-visible:border-accent-foreground focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 has-[option[value='']:checked]:text-muted-foreground"
              {...field}
            >
              <option value="">{placeholder}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function CareersTextareaField({
  control,
  name,
  label,
  placeholder,
}: CareersFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <textarea
              className="flex min-h-30 w-full resize-y rounded-md border border-border bg-background px-3.5 py-2.5 text-base leading-snug tracking-tight transition-colors duration-300 placeholder:text-muted-foreground focus-visible:border-accent-foreground focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function CareersInterestForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const form = useForm<CareersInterestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      link: "",
      note: "",
    },
  })

  async function onSubmit(values: CareersInterestFormValues) {
    setSubmitted(false)
    setSubmitError(null)

    try {
      const response = await fetch("/api/careers/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Unable to submit application")
      }

      setSubmitted(true)
      form.reset()

      window.setTimeout(() => {
        setSubmitted(false)
      }, 4000)
    } catch (_error) {
      setSubmitError("Something went wrong. Please try again.")
    }
  }

  return (
    <Form {...form}>
      <form
        className="mt-11 rounded-md border border-mcp-prompt-card-border bg-mcp-prompt-card p-6 md:p-9"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div className="grid gap-6 md:grid-cols-2">
          <CareersTextField
            control={form.control}
            name="name"
            label="Your name"
            placeholder="Jane"
          />
          <CareersTextField
            control={form.control}
            name="email"
            label="Your email"
            placeholder="jane@email.com"
            type="email"
          />
        </div>

        <div className="mt-6 grid gap-6">
          <CareersSelectField
            control={form.control}
            name="role"
            label="Role or area of interest"
            placeholder="Please select"
            options={interestOptions}
          />
          <CareersTextField
            control={form.control}
            name="link"
            label="LinkedIn, GitHub, or portfolio"
            placeholder="Paste your link here"
            type="url"
          />
          <CareersTextareaField
            control={form.control}
            name="note"
            label="A short note about why Novu interests you"
            placeholder="Your company needs..."
          />
        </div>

        <Button
          className="mt-6 h-12 w-full rounded-md"
          disabled={form.formState.isSubmitting}
          type="submit"
        >
          {form.formState.isSubmitting ? "Submitting" : "Submit"}
        </Button>

        {submitted && (
          <p
            className="mt-4 text-center text-sm leading-normal text-lagune-1"
            role="status"
          >
            Thanks. We received your note and will reach out if there is a fit.
          </p>
        )}
        {submitError && (
          <p
            className="mt-4 text-center text-sm leading-normal text-destructive"
            role="alert"
          >
            {submitError}
          </p>
        )}
      </form>
    </Form>
  )
}

export default CareersInterestForm
