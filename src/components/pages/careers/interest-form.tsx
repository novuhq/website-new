"use client"

import { useRef, useState } from "react"
import { CAREER_DEPARTMENTS, isCareerDepartment } from "@/constants/careers"
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

const labelClassName =
  "text-[0.9375rem] leading-snug font-normal tracking-tighter text-white"
const HONEYPOT_FIELD_NAME = "companyWebsite"
const phoneNumberSchema = z
  .string()
  .trim()
  .max(40, "Please enter a valid phone number.")
  .refine(
    (value) => value === "" || /^\+?[\d\s().-]+$/.test(value),
    "Please enter a valid phone number."
  )
  .refine((value) => {
    if (!value) {
      return true
    }

    const digitCount = value.replace(/\D/g, "").length

    return digitCount >= 7 && digitCount <= 15
  }, "Please enter a valid phone number.")

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, "Please enter your full name.")
    .max(120, "Full name is too long."),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .max(254, "Email is too long."),
  phoneNumber: phoneNumberSchema,
  linkedInProfile: z
    .string()
    .url("Please enter a valid LinkedIn URL.")
    .max(300, "LinkedIn URL is too long."),
  location: z
    .string()
    .min(2, "Please enter your city and country.")
    .max(120, "Location is too long."),
  remoteAsyncExperience: z.string(),
  cv: z.any().refine((files) => files?.length === 1, "Please attach your CV."),
  personalNote: z.string().max(2000, "Personal note is too long."),
  department: z.string(),
})

type CareersInterestFormValues = z.infer<typeof formSchema>
type CareersFieldName = keyof CareersInterestFormValues

interface CareersInterestFormProps {
  defaultDepartment?: string
}

const formDefaultValues: CareersInterestFormValues = {
  fullName: "",
  email: "",
  phoneNumber: "",
  linkedInProfile: "",
  location: "",
  remoteAsyncExperience: "",
  cv: undefined,
  personalNote: "",
  department: "",
}

type CareersFieldProps = {
  control: ReturnType<typeof useForm<CareersInterestFormValues>>["control"]
  name: CareersFieldName
  label: string
  placeholder: string
  required?: boolean
}

function CareersTextField({
  control,
  name,
  label,
  placeholder,
  required = false,
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
          <FormLabel className={labelClassName}>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              required={required}
              type={type}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function CareersFileField({
  control,
  name,
  label,
  required = false,
}: Omit<CareersFieldProps, "placeholder">) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, ref, name } }) => (
        <FormItem>
          <FormLabel className={labelClassName}>{label}</FormLabel>
          <FormControl>
            <Input
              ref={ref}
              name={name}
              type="file"
              accept=".pdf,.doc,.docx"
              required={required}
              onChange={(event) => onChange(event.target.files)}
            />
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
          <FormLabel className={labelClassName}>{label}</FormLabel>
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
          <FormLabel className={labelClassName}>{label}</FormLabel>
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

function CareersInterestForm({
  defaultDepartment = "",
}: CareersInterestFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formKey, setFormKey] = useState(0)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const normalizedDefaultDepartment = isCareerDepartment(defaultDepartment)
    ? defaultDepartment
    : ""
  const defaultValues = {
    ...formDefaultValues,
    department: normalizedDefaultDepartment,
  }
  const form = useForm<CareersInterestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: CareersInterestFormValues) {
    setSubmitted(false)
    setSubmitError(null)

    try {
      const formData = new FormData()
      formData.append("fullName", values.fullName)
      formData.append("email", values.email)
      formData.append("phoneNumber", values.phoneNumber)
      formData.append("linkedInProfile", values.linkedInProfile)
      formData.append("location", values.location)
      formData.append("remoteAsyncExperience", values.remoteAsyncExperience)
      formData.append("personalNote", values.personalNote)
      formData.append("department", values.department)
      formData.append(HONEYPOT_FIELD_NAME, honeypotRef.current?.value || "")
      formData.append("cv", values.cv[0])

      const response = await fetch("/api/careers/apply", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Unable to submit application")
      }

      setSubmitted(true)
      form.reset(defaultValues)
      setFormKey((key) => key + 1)

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
        key={formKey}
        className="mt-11 rounded-md border border-mcp-prompt-card-border bg-mcp-prompt-card p-6 md:p-9"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div className="hidden" aria-hidden="true">
          <label htmlFor={HONEYPOT_FIELD_NAME}>Company website</label>
          <input
            ref={honeypotRef}
            id={HONEYPOT_FIELD_NAME}
            name={HONEYPOT_FIELD_NAME}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <CareersTextField
            control={form.control}
            name="fullName"
            label="Full Name"
            placeholder="Jane Doe"
            required
          />
          <CareersTextField
            control={form.control}
            name="email"
            label="Your email"
            placeholder="jane@email.com"
            required
            type="email"
          />
          <CareersTextField
            control={form.control}
            name="phoneNumber"
            label="Phone number"
            placeholder="+1 555 000 0000"
            type="text"
          />
          <CareersTextField
            control={form.control}
            name="linkedInProfile"
            label="LinkedIn profile"
            placeholder="https://www.linkedin.com/in/jane"
            required
            type="url"
          />
        </div>

        <div className="mt-6 grid gap-6">
          <CareersTextField
            control={form.control}
            name="location"
            label="Location (city and country)"
            placeholder="New York, USA"
            required
          />
          <CareersSelectField
            control={form.control}
            name="remoteAsyncExperience"
            label="Have you previously worked in a fully remote and async company?"
            placeholder="Please select"
            options={["Yes", "No"]}
          />
          <CareersSelectField
            control={form.control}
            name="department"
            label="Department"
            placeholder="Please select"
            options={[...CAREER_DEPARTMENTS]}
          />
          <CareersFileField
            control={form.control}
            name="cv"
            label="CV"
            required
          />
          <CareersTextareaField
            control={form.control}
            name="personalNote"
            label="Personal note"
            placeholder="Tell us why Novu interests you..."
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
