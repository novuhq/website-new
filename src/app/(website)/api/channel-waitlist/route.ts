import { NextRequest, NextResponse } from "next/server"
import { HOME_CHANNELS, HOME_LIVE_CHANNEL_KEYS } from "@/data/pages/home"
import { z } from "zod"

const NOTION_API_BASE_URL = "https://api.notion.com/v1"
const NOTION_VERSION = "2026-03-11"
const NOTION_REQUEST_TIMEOUT = 8000
const LIVE_CHANNEL_KEYS = new Set<string>(HOME_LIVE_CHANNEL_KEYS)
const WAITLIST_CHANNEL_LABELS = new Set(
  HOME_CHANNELS.filter(({ key }) => !LIVE_CHANNEL_KEYS.has(key)).map(
    ({ label }) => label
  )
)

const optionalStringSchema = (max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim().max(max)
  )

const registrationSchema = z.object({
  channel: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .refine((channel) => WAITLIST_CHANNEL_LABELS.has(channel), {
      message: "Unsupported channel",
    }),
  companyWebsite: optionalStringSchema(200),
  email: z.string().trim().email().max(254),
  sourcePage: z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.union([z.string().trim().url().max(2048), z.literal("")])
  ),
  utmSource: optionalStringSchema(200),
})

type NotionErrorResponse = {
  code?: string
  message?: string
}

type NotionDatabaseResponse = {
  data_sources?: Array<{ id: string }>
}

type NotionDataSourceProperty = {
  type: string
}

type NotionDataSourceResponse = {
  properties?: Record<string, NotionDataSourceProperty>
}

type NotionPageResponse = {
  id: string
}

type NotionPropertyValue = Record<string, unknown>

let waitlistDataSourcePromise: Promise<{
  id: string
  properties: Record<string, NotionDataSourceProperty>
}> | null = null

function getNotionConfig() {
  const apiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_WAITLIST_DATABASE_ID

  if (!apiKey || !databaseId) {
    throw new Error("Missing Notion waitlist configuration")
  }

  return {
    apiKey,
    databaseId,
  }
}

async function notionFetch<T>(path: string, init: RequestInit = {}) {
  const { apiKey } = getNotionConfig()
  const headers = new Headers(init.headers)

  headers.set("Authorization", `Bearer ${apiKey}`)
  headers.set("Notion-Version", NOTION_VERSION)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), NOTION_REQUEST_TIMEOUT)

  const response = await fetch(`${NOTION_API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers,
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId))
  const data = await response.json()

  if (!response.ok) {
    const error = data as NotionErrorResponse

    throw new Error(error.message || "Notion API request failed")
  }

  return data as T
}

async function getWaitlistDataSource() {
  waitlistDataSourcePromise ??= (async () => {
    const { databaseId } = getNotionConfig()
    const database = await notionFetch<NotionDatabaseResponse>(
      `/databases/${databaseId}`
    )
    const dataSourceId = database.data_sources?.[0]?.id

    if (!dataSourceId) {
      throw new Error("Notion waitlist database does not have a data source")
    }

    const dataSource = await notionFetch<NotionDataSourceResponse>(
      `/data_sources/${dataSourceId}`
    )

    return {
      id: dataSourceId,
      properties: dataSource.properties || {},
    }
  })()

  try {
    return await waitlistDataSourcePromise
  } catch (error) {
    waitlistDataSourcePromise = null
    throw error
  }
}

function getTextContent(value: string) {
  return [
    {
      text: {
        content: value,
      },
    },
  ]
}

function getPropertyValue(
  property: NotionDataSourceProperty,
  value: string
): NotionPropertyValue | null {
  switch (property.type) {
    case "title":
      return { title: getTextContent(value) }
    case "rich_text":
      return { rich_text: getTextContent(value) }
    case "email":
      return { email: value }
    case "url":
      return { url: value }
    case "select":
      return { select: { name: value } }
    case "multi_select":
      return { multi_select: [{ name: value }] }
    case "date":
      return { date: { start: value } }
    default:
      return null
  }
}

function setProperty(
  result: Record<string, NotionPropertyValue>,
  schema: Record<string, NotionDataSourceProperty>,
  name: string,
  value: string
) {
  if (!value) return false

  const entry = Object.entries(schema).find(
    ([propertyName]) => propertyName.toLowerCase() === name.toLowerCase()
  )

  if (!entry) return false

  const [propertyName, property] = entry
  const propertyValue = getPropertyValue(property, value)

  if (!propertyValue) return false

  result[propertyName] = propertyValue

  return true
}

async function createWaitlistRegistration(
  registration: z.infer<typeof registrationSchema>,
  signupDate: string
) {
  const dataSource = await getWaitlistDataSource()
  const properties: Record<string, NotionPropertyValue> = {}
  const hasEmail = setProperty(
    properties,
    dataSource.properties,
    "Email",
    registration.email
  )
  const hasChannel = setProperty(
    properties,
    dataSource.properties,
    "Requested Channel",
    registration.channel
  )

  if (!hasEmail || !hasChannel) {
    throw new Error("Notion waitlist schema is missing required properties")
  }

  setProperty(properties, dataSource.properties, "Signup Date", signupDate)
  setProperty(
    properties,
    dataSource.properties,
    "Source Page",
    registration.sourcePage
  )
  setProperty(
    properties,
    dataSource.properties,
    "UTM Source",
    registration.utmSource
  )

  return notionFetch<NotionPageResponse>("/pages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: {
        data_source_id: dataSource.id,
      },
      properties,
    }),
  })
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || ""

    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        { error: true, message: "Unsupported content type." },
        { status: 415 }
      )
    }

    let body: unknown

    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: true, message: "Invalid JSON payload" },
        { status: 400 }
      )
    }

    const parsed = registrationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: true,
          issues: parsed.error.flatten().fieldErrors,
          message: "Invalid waitlist registration",
        },
        { status: 400 }
      )
    }

    if (parsed.data.companyWebsite) {
      return NextResponse.json({ sent: true }, { status: 200 })
    }

    const page = await createWaitlistRegistration(
      parsed.data,
      new Date().toISOString()
    )

    return NextResponse.json({ id: page.id, sent: true }, { status: 201 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error"
    const isConfigurationError = message.includes(
      "Notion waitlist configuration"
    )

    console.error("Unable to submit channel waitlist registration", error)

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: true, message: "Request timeout" },
        { status: 504 }
      )
    }

    return NextResponse.json(
      {
        error: true,
        message: isConfigurationError
          ? "Server configuration error"
          : "Unable to join the waitlist",
      },
      { status: isConfigurationError ? 500 : 502 }
    )
  }
}
