import { NextRequest, NextResponse } from "next/server"
import { createClient } from "next-sanity"
import { z } from "zod"

const departmentOptions = [
  "Engineering",
  "Product",
  "Design",
  "Developer relations",
  "Marketing",
  "Operations",
] as const

const MAX_CV_FILE_SIZE = 10 * 1024 * 1024
const MAX_MULTIPART_BODY_SIZE = MAX_CV_FILE_SIZE + 1024 * 1024
const allowedCvExtensions = [".pdf", ".doc", ".docx"]
const allowedCvMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])

const applicationSchema = z.object({
  fullName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phoneNumber: z.string().trim().min(5),
  linkedInProfile: z.string().trim().url(),
  location: z.string().trim().min(2),
  remoteAsyncExperience: z.enum(["Yes", "No"]),
  personalNote: z.string().trim().min(20),
  department: z.enum(departmentOptions),
})

function getSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19"
  const token = process.env.SANITY_API_PREVIEW_TOKEN

  if (!projectId || !dataset || !apiVersion || !token) {
    throw new Error("Missing Sanity write configuration")
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  })
}

function getCvValidationIssues(cv: FormDataEntryValue | null) {
  if (!(cv instanceof File) || cv.size === 0) {
    return ["Please attach your CV."]
  }

  const fileName = cv.name.toLowerCase()
  const hasAllowedExtension = allowedCvExtensions.some((extension) =>
    fileName.endsWith(extension)
  )

  if (!hasAllowedExtension) {
    return ["CV must be a PDF, DOC, or DOCX file."]
  }

  if (cv.type && !allowedCvMimeTypes.has(cv.type)) {
    return ["CV file type is not supported."]
  }

  if (cv.size > MAX_CV_FILE_SIZE) {
    return ["CV must be smaller than 10MB."]
  }

  return []
}

export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(req.headers.get("content-length") || 0)

    if (contentLength > MAX_MULTIPART_BODY_SIZE) {
      return NextResponse.json(
        {
          error: true,
          message: "Application payload is too large.",
        },
        { status: 413 }
      )
    }

    const formData = await req.formData()
    const cv = formData.get("cv")
    const cvIssues = getCvValidationIssues(cv)
    const parsed = applicationSchema.safeParse({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phoneNumber: formData.get("phoneNumber"),
      linkedInProfile: formData.get("linkedInProfile"),
      location: formData.get("location"),
      remoteAsyncExperience: formData.get("remoteAsyncExperience"),
      personalNote: formData.get("personalNote"),
      department: formData.get("department"),
    })

    if (!parsed.success || cvIssues.length > 0 || !(cv instanceof File)) {
      const issues: Record<string, string[] | undefined> = parsed.success
        ? {}
        : { ...parsed.error.flatten().fieldErrors }

      if (cvIssues.length > 0) {
        issues.cv = cvIssues
      }

      return NextResponse.json(
        {
          error: true,
          message: "Invalid application payload",
          issues,
        },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()
    const client = getSanityClient()
    const cvAsset = await client.assets.upload("file", cv, {
      filename: cv.name,
      contentType: cv.type || undefined,
    })
    const application = await client.create({
      _type: "candidateApplication",
      ...parsed.data,
      remoteAsyncExperience: parsed.data.remoteAsyncExperience === "Yes",
      cv: {
        _type: "file",
        asset: {
          _type: "reference",
          _ref: cvAsset._id,
        },
      },
      status: "new",
      source: "careers",
      submittedAt: now,
    })

    return NextResponse.json(
      { sent: true, id: application._id },
      { status: 201 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error"
    const isConfigurationError = message.includes("Sanity write configuration")

    return NextResponse.json(
      {
        error: true,
        message: isConfigurationError
          ? "Server configuration error"
          : "Unable to submit application",
      },
      { status: isConfigurationError ? 500 : 502 }
    )
  }
}
