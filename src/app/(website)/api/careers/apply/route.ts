import { NextRequest, NextResponse } from "next/server"
import { CAREER_DEPARTMENTS } from "@/constants/careers"
import { z } from "zod"

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
  department: z.enum(CAREER_DEPARTMENTS),
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

  const response = await fetch(`${NOTION_API_BASE_URL}${path}`, {
    ...init,
    headers,
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

function getPhoneNumberValue(value: string) {
  const normalized = value.replace(/[^\d.-]/g, "")
  const phoneNumber = Number(normalized)

  return Number.isFinite(phoneNumber) ? phoneNumber : null
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
  const phoneNumber = getPhoneNumberValue(application.phoneNumber)

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
        ...(phoneNumber === null
          ? {}
          : {
              "phone number": {
                number: phoneNumber,
              },
            }),
        Department: {
          select: {
            name: application.department,
          },
        },
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
        "Personal note": getRichText(application.personalNote),
        "Have you previously worked in a fully remote and async company?":
          getRichText(application.remoteAsyncExperience),
      },
    }),
  })
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

    const application = await createNotionApplication(parsed.data, cv)

    return NextResponse.json(
      { sent: true, id: application.id },
      { status: 201 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error"
    const isConfigurationError = message.includes("Notion write configuration")

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
