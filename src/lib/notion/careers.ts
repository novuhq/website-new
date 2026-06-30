import "server-only"

import slugify from "slugify"

import {
  type ICareerJob,
  type ICareerJobContentBlock,
  type ICareerJobDetail,
} from "@/types/careers"

const NOTION_VERSION = "2026-03-11"
const NOTION_API_BASE_URL = "https://api.notion.com/v1"

type NotionRichText = {
  plain_text?: string
}

type NotionProperty = {
  type: string
  title?: NotionRichText[]
  rich_text?: NotionRichText[]
  unique_id?: { prefix?: string | null; number?: number } | null
  select?: { name?: string } | null
  status?: { name?: string } | null
  url?: string | null
  date?: { start?: string } | null
  created_time?: string
  last_edited_time?: string
  [key: string]: unknown
}

type NotionPage = {
  id: string
  created_time?: string
  last_edited_time?: string
  properties: Record<string, NotionProperty>
}

type NotionBlock = {
  id: string
  type: string
  has_children?: boolean
  paragraph?: { rich_text?: NotionRichText[] }
  heading_1?: { rich_text?: NotionRichText[] }
  heading_2?: { rich_text?: NotionRichText[] }
  heading_3?: { rich_text?: NotionRichText[] }
  bulleted_list_item?: { rich_text?: NotionRichText[] }
  numbered_list_item?: { rich_text?: NotionRichText[] }
}

type NotionListResponse<T> = {
  results?: T[]
  has_more?: boolean
  next_cursor?: string | null
}

function getCareersDataSourceId() {
  return (
    process.env.NOTION_CAREERS_DATA_SOURCE_ID ||
    process.env.NOTION_JOBS_DATA_SOURCE_ID ||
    ""
  )
}

function getNotionApiKey() {
  return process.env.NOTION_API_KEY || ""
}

function getCareersNotionConfig() {
  const apiKey = getNotionApiKey()
  const dataSourceId = getCareersDataSourceId()

  if (!apiKey || !dataSourceId) {
    throw new Error("Missing Notion careers read configuration")
  }

  return {
    apiKey,
    dataSourceId,
  }
}

async function notionFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const apiKey = getNotionApiKey()
  const headers = new Headers(init.headers)

  if (!apiKey) {
    throw new Error("Missing Notion API key")
  }

  headers.set("Authorization", `Bearer ${apiKey}`)
  headers.set("Notion-Version", NOTION_VERSION)

  const response = await fetch(`${NOTION_API_BASE_URL}${path}`, {
    ...init,
    headers,
    next: { tags: ["careers"] },
  })
  const data = await response.json()

  if (!response.ok) {
    const message =
      typeof data?.message === "string"
        ? data.message
        : "Notion API request failed"

    throw new Error(message)
  }

  return data as T
}

function getRichTextText(items: NotionRichText[] = []) {
  return items.map((item) => item.plain_text || "").join("")
}

function getProperty(
  properties: Record<string, NotionProperty>,
  names: string[]
) {
  const entries = Object.entries(properties)
  const match = entries.find(([name]) =>
    names.some((candidate) => candidate.toLowerCase() === name.toLowerCase())
  )

  return match?.[1]
}

function getPropertyText(
  properties: Record<string, NotionProperty>,
  names: string[]
) {
  const property = getProperty(properties, names)

  if (!property) {
    return ""
  }

  if (property.type === "title") {
    return getRichTextText(property.title)
  }

  if (property.type === "rich_text") {
    return getRichTextText(property.rich_text)
  }

  if (property.type === "select") {
    return property.select?.name || ""
  }

  if (property.type === "status") {
    return property.status?.name || ""
  }

  if (property.type === "url") {
    return property.url || ""
  }

  if (property.type === "date") {
    return property.date?.start || ""
  }

  if (property.type === "created_time") {
    return property.created_time || ""
  }

  if (property.type === "last_edited_time") {
    return property.last_edited_time || ""
  }

  return ""
}

function getSlug(value: string) {
  return slugify(value, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  })
}

function getPropertyUniqueId(
  properties: Record<string, NotionProperty>,
  names: string[]
) {
  const property = getProperty(properties, names)
  const uniqueId = property?.type === "unique_id" ? property.unique_id : null

  if (!uniqueId || typeof uniqueId.number !== "number") {
    return null
  }

  return {
    value: `${uniqueId.prefix ? `${uniqueId.prefix}-` : ""}${uniqueId.number}`,
    number: uniqueId.number,
  }
}

function getCareerSlug(title: string, jobId: string) {
  return `${getSlug(title)}-${getSlug(jobId)}`
}

function getJobIdNumberFromSlug(slug: string) {
  const match = slug.match(/(?:^|-)job-(\d+)$/i)

  if (!match) {
    return null
  }

  return Number(match[1])
}

function getPageTitle(page: NotionPage) {
  return getPropertyText(page.properties, [
    "Title",
    "Name",
    "Role",
    "Position",
    "Job title",
    "Full Name",
  ])
}

function isOpenCareerPage(page: NotionPage) {
  const status = getPropertyText(page.properties, ["Status", "State"])

  return ["open", "published", "active"].includes(status.toLowerCase())
}

function mapPageToCareerJob(page: NotionPage): ICareerJob | null {
  const title = getPageTitle(page)
  const jobId = getPropertyUniqueId(page.properties, ["Job ID", "ID"])

  if (!title || !jobId || !isOpenCareerPage(page)) {
    return null
  }

  const department = getPropertyText(page.properties, [
    "Department",
    "Team",
    "Area",
  ])
  const workplaceType = getPropertyText(page.properties, [
    "Workplace Type",
    "Workplace",
    "Type",
  ])
  const hours = getPropertyText(page.properties, [
    "Hours",
    "Employment type",
    "Employment Type",
  ])
  const location = getPropertyText(page.properties, ["Location", "Workplace"])

  return {
    _id: page.id,
    jobId: jobId.value,
    jobIdNumber: jobId.number,
    title,
    department,
    workplaceType,
    hours,
    location,
    applicationUrl: getPropertyText(page.properties, [
      "Application URL",
      "Apply URL",
      "Application link",
    ]),
    publishedAt:
      getPropertyText(page.properties, [
        "Published at",
        "Published At",
        "Date",
      ]) ||
      page.created_time ||
      page.last_edited_time ||
      "",
    slug: getCareerSlug(title, jobId.value),
  }
}

async function queryCareerPages(filter?: Record<string, unknown>) {
  const config = getCareersNotionConfig()

  const pages: NotionPage[] = []
  let startCursor: string | null = null

  do {
    const data: NotionListResponse<NotionPage> = await notionFetch(
      `/data_sources/${config.dataSourceId}/query`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page_size: 100,
          start_cursor: startCursor || undefined,
          filter,
        }),
      }
    )

    pages.push(...(data.results || []))
    startCursor = data.next_cursor || null

    if (!data.has_more) {
      break
    }
  } while (startCursor)

  return pages
}

async function getAllCareerPages() {
  return queryCareerPages({
    property: "Status",
    select: {
      equals: "Open",
    },
  })
}

async function getCareerPageByJobIdNumber(jobIdNumber: number) {
  const pages = await queryCareerPages({
    and: [
      {
        property: "Status",
        select: {
          equals: "Open",
        },
      },
      {
        property: "Job ID",
        unique_id: {
          equals: jobIdNumber,
        },
      },
    ],
  })

  return pages[0] || null
}

async function getPageContentBlocks(pageId: string) {
  const blocks: NotionBlock[] = []
  let startCursor: string | null = null

  do {
    const data: NotionListResponse<NotionBlock> = await notionFetch(
      `/blocks/${pageId}/children?page_size=100${
        startCursor ? `&start_cursor=${startCursor}` : ""
      }`
    )

    blocks.push(...(data.results || []))
    startCursor = data.next_cursor || null

    if (!data.has_more) {
      break
    }
  } while (startCursor)

  return blocks
}

function getBlockText(block: NotionBlock) {
  if (block.type === "paragraph") {
    return getRichTextText(block.paragraph?.rich_text)
  }

  if (block.type === "heading_1") {
    return getRichTextText(block.heading_1?.rich_text)
  }

  if (block.type === "heading_2") {
    return getRichTextText(block.heading_2?.rich_text)
  }

  if (block.type === "heading_3") {
    return getRichTextText(block.heading_3?.rich_text)
  }

  if (block.type === "bulleted_list_item") {
    return getRichTextText(block.bulleted_list_item?.rich_text)
  }

  if (block.type === "numbered_list_item") {
    return getRichTextText(block.numbered_list_item?.rich_text)
  }

  return ""
}

function mapBlocksToCareerContent(blocks: NotionBlock[]) {
  const content: ICareerJobContentBlock[] = []
  let currentList: string[] = []

  function flushList() {
    if (currentList.length > 0) {
      content.push({
        _type: "bulletedList",
        items: currentList,
      })
      currentList = []
    }
  }

  for (const block of blocks) {
    const text = getBlockText(block)

    if (!text) {
      flushList()
      continue
    }

    if (
      block.type === "bulleted_list_item" ||
      block.type === "numbered_list_item"
    ) {
      currentList.push(text)
      continue
    }

    flushList()

    if (block.type === "heading_1" || block.type === "heading_2") {
      content.push({
        _type: "heading",
        level: 2,
        text,
      })
      continue
    }

    if (block.type === "heading_3") {
      content.push({
        _type: "heading",
        level: 3,
        text,
      })
      continue
    }

    content.push({
      _type: "paragraph",
      text,
    })
  }

  flushList()

  return content
}

function getPlainContent(content: ICareerJobContentBlock[]) {
  return content
    .flatMap((block) => {
      if (block._type === "bulletedList") {
        return block.items
      }

      return block.text
    })
    .join("\n\n")
}

export async function getOpenCareerJobs() {
  const pages = await getAllCareerPages()

  return pages
    .map(mapPageToCareerJob)
    .filter((job): job is ICareerJob => Boolean(job))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export async function getCareerJobBySlug(slug: string) {
  const jobIdNumber = getJobIdNumberFromSlug(slug)

  if (jobIdNumber === null) {
    return null
  }

  const page = await getCareerPageByJobIdNumber(jobIdNumber)

  if (!page) {
    return null
  }

  const job = mapPageToCareerJob(page)

  if (!job) {
    return null
  }

  if (job.slug !== slug) {
    return null
  }

  const blocks = await getPageContentBlocks(page.id)
  const content = mapBlocksToCareerContent(blocks)

  return {
    ...job,
    content,
    plainContent: getPlainContent(content),
  } satisfies ICareerJobDetail
}
