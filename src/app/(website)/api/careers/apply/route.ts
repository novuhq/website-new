import { NextRequest, NextResponse } from "next/server"
import { CAREER_DEPARTMENTS } from "@/constants/careers"
import { z } from "zod"

const MAX_CV_FILE_SIZE = 10 * 1024 * 1024
const MAX_MULTIPART_BODY_SIZE = MAX_CV_FILE_SIZE + 1024 * 1024
const NOTION_REQUEST_TIMEOUT = 8000
const HONEYPOT_FIELD_NAME = "companyWebsite"
const allowedCvExtensions = [".pdf", ".doc", ".docx"]
const allowedCvMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])
const optionalStringSchema = z.preprocess(
  (value) => (typeof value === "string" ? value : ""),
  z.string().trim().max(2000)
)
const phoneNumberSchema = z
  .preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim().max(40)
  )
  .refine((value) => value === "" || /^\+?[\d\s().-]+$/.test(value))
  .refine((value) => {
    if (!value) {
      return true
    }

    const digitCount = value.replace(/\D/g, "").length

    return digitCount >= 7 && digitCount <= 15
  })

const applicationSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phoneNumber: phoneNumberSchema,
  linkedInProfile: z.string().trim().url().max(300),
  location: z.string().trim().min(2).max(120),
  remoteAsyncExperience: z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.union([z.enum(["Yes", "No"]), z.literal("")])
  ),
  personalNote: optionalStringSchema,
  department: z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.union([z.enum(CAREER_DEPARTMENTS), z.literal("")])
  ),
})

const NOTION_VERSION = "2026-03-11"
const NOTION_API_BASE_URL = "https://api.notion.com/v1"

let notionDataSourceIdPromise: Promise<string> | null = null

type NotionErrorResponse = {
  code?: string
  message?: string
}

type NotionFileUploadResponse = {
  id: string
}

type NotionPageResponse = {
  id: string
}

function getNotionConfig() {
  const apiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_DATABASE_ID
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID

  if (!apiKey || (!databaseId && !dataSourceId)) {
    throw new Error("Missing Notion write configuration")
  }

  return {
    apiKey,
    databaseId,
    dataSourceId,
  }
}

async function notionFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const { apiKey } = getNotionConfig()
  const headers = new Headers(init.headers)

  headers.set("Authorization", `Bearer ${apiKey}`)
  headers.set("Notion-Version", NOTION_VERSION)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), NOTION_REQUEST_TIMEOUT)

  const response = await fetch(`${NOTION_API_BASE_URL}${path}`, {
    ...init,
    headers,
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(timeoutId)
  })
  const data = await response.json()

  if (!response.ok) {
    const error = data as NotionErrorResponse
    throw new Error(error.message || "Notion API request failed")
  }

  return data as T
}

async function getNotionDataSourceId() {
  const { databaseId, dataSourceId } = getNotionConfig()

  if (dataSourceId) {
    return dataSourceId
  }

  if (!databaseId) {
    throw new Error("Missing Notion write configuration")
  }

  notionDataSourceIdPromise ??= notionFetch<{
    data_sources?: Array<{ id: string }>
  }>(`/databases/${databaseId}`).then((database) => {
    const firstDataSource = database.data_sources?.[0]

    if (!firstDataSource) {
      throw new Error("Notion database does not have a data source")
    }

    return firstDataSource.id
  })

  return notionDataSourceIdPromise
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

function getRichText(value: string) {
  return {
    rich_text: [
      {
        text: {
          content: value,
        },
      },
    ],
  }
}

async function uploadCvToNotion(cv: File) {
  const fileUpload = await notionFetch<NotionFileUploadResponse>(
    "/file_uploads",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: cv.name,
        content_type: cv.type || "application/octet-stream",
      }),
    }
  )
  const formData = new FormData()

  formData.append("file", cv, cv.name)

  await notionFetch<NotionFileUploadResponse>(
    `/file_uploads/${fileUpload.id}/send`,
    {
      method: "POST",
      body: formData,
    }
  )

  return fileUpload.id
}

async function createNotionApplication(
  application: z.infer<typeof applicationSchema>,
  cv: File
) {
  const [dataSourceId, cvFileUploadId] = await Promise.all([
    getNotionDataSourceId(),
    uploadCvToNotion(cv),
  ])

  return notionFetch<NotionPageResponse>("/pages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: {
        data_source_id: dataSourceId,
      },
      properties: {
        "Full Name": {
          title: [
            {
              text: {
                content: application.fullName,
              },
            },
          ],
        },
        Email: {
          email: application.email,
        },
        ...(application.phoneNumber
          ? {
              "phone number": {
                phone_number: application.phoneNumber,
              },
            }
          : {}),
        ...(application.department
          ? {
              Department: {
                select: {
                  name: application.department,
                },
              },
            }
          : {}),
        "Location (city and country)": getRichText(application.location),
        "LinkedIn profile": {
          url: application.linkedInProfile,
        },
        CV: {
          files: [
            {
              type: "file_upload",
              file_upload: {
                id: cvFileUploadId,
              },
            },
          ],
        },
        ...(application.personalNote
          ? {
              "Personal note": getRichText(application.personalNote),
            }
          : {}),
        ...(application.remoteAsyncExperience
          ? {
              "Have you previously worked in a fully remote and async company?":
                getRichText(application.remoteAsyncExperience),
            }
          : {}),
      },
    }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || ""

    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return NextResponse.json(
        {
          error: true,
          message: "Unsupported content type.",
        },
        { status: 415 }
      )
    }

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
    const honeypot = formData.get(HONEYPOT_FIELD_NAME)

    if (typeof honeypot === "string" && honeypot.trim()) {
      return NextResponse.json({ sent: true }, { status: 200 })
    }

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

    const application = await createNotionApplication(parsed.data, cv)

    return NextResponse.json(
      { sent: true, id: application.id },
      { status: 201 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error"
    const isConfigurationError = message.includes("Notion write configuration")

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        {
          error: true,
          message: "Request timeout",
        },
        { status: 504 }
      )
    }

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
