import {
  escapeMarkdownTableCell,
  escapeMarkdownText,
  formatCodeFence,
  formatMarkdownLink,
  safeMarkdownUrl,
} from "./markdown-format"

type PortableSpan = {
  _type?: string
  text?: string
  marks?: string[]
}

type PortableMarkDef = {
  _key?: string
  _type?: string
  href?: string
}

type PortableBlock = {
  _type?: string
  style?: string
  children?: PortableSpan[]
  markDefs?: PortableMarkDef[]
  listItem?: string
  level?: number
  [key: string]: unknown
}

function compact(value: string) {
  return value
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function asPortableBlocks(value: unknown): PortableBlock[] {
  if (!value) return []
  return Array.isArray(value)
    ? (value as PortableBlock[])
    : [value as PortableBlock]
}

function inlineText(blocks: unknown) {
  return portableTextToMarkdown(blocks)
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function markedText(
  span: PortableSpan,
  markDefs: PortableMarkDef[] | undefined
) {
  let text = escapeMarkdownText(span.text ?? "")

  for (const mark of span.marks ?? []) {
    const markDef = markDefs?.find((def) => def._key === mark)

    if (markDef?._type === "link" && markDef.href) {
      text = formatMarkdownLink(text, markDef.href, { labelIsEscaped: true })
      continue
    }

    if (mark === "strong") {
      text = `**${text}**`
    } else if (mark === "em") {
      text = `_${text}_`
    } else if (mark === "code") {
      text = `\`${text}\``
    }
  }

  return text
}

function blockChildrenToMarkdown(block: PortableBlock) {
  return (block.children ?? [])
    .map((child) => markedText(child, block.markDefs))
    .join("")
    .replace(/[ \t]+/g, " ")
    .trim()
}

function markdownTable(value: PortableBlock) {
  const table = value.table as
    | { rows?: Array<{ cells?: string[] }> }
    | undefined
  const rows = table?.rows?.map((row) => row.cells ?? []) ?? []

  if (rows.length === 0) return ""

  const width = Math.max(...rows.map((row) => row.length))
  const normalizedRows = rows.map((row) =>
    Array.from({ length: width }, (_, index) =>
      escapeMarkdownTableCell(row[index] ?? "")
    )
  )
  const header = normalizedRows[0]
  const divider = header.map(() => "---")
  const body = normalizedRows.slice(1)

  return [header, divider, ...body]
    .map((row) => `| ${row.join(" | ")} |`)
    .join("\n")
}

function customBlockToMarkdown(block: PortableBlock) {
  switch (block._type) {
    case "codeBlock": {
      const language = typeof block.language === "string" ? block.language : ""
      const code = typeof block.code === "string" ? block.code : ""
      return code ? formatCodeFence(code, language) : ""
    }
    case "codeTabs": {
      const tabs = Array.isArray(block.tabs)
        ? (block.tabs as Array<{
            fileName?: string
            language?: string
            code?: string
          }>)
        : []

      return tabs
        .map((tab) => {
          const title = tab.fileName
            ? `#### ${escapeMarkdownText(tab.fileName)}\n\n`
            : ""
          return `${title}${formatCodeFence(tab.code ?? "", tab.language)}`
        })
        .join("\n\n")
    }
    case "quoteBlock": {
      const quote = typeof block.quote === "string" ? block.quote : ""
      const role = typeof block.role === "string" ? block.role : ""
      const authors = Array.isArray(block.authors)
        ? block.authors
            .map((author) =>
              typeof author === "object" &&
              author !== null &&
              "name" in author &&
              typeof author.name === "string"
                ? author.name
                : ""
            )
            .filter(Boolean)
            .join(", ")
        : ""

      return [
        escapeMarkdownText(quote),
        authors || role
          ? `- ${escapeMarkdownText([authors, role].filter(Boolean).join(", "))}`
          : "",
      ]
        .filter(Boolean)
        .map((line) => `> ${line}`)
        .join("\n")
    }
    case "noteBlock": {
      const title =
        typeof block.title === "string"
          ? escapeMarkdownText(block.title)
          : "Note"
      return [`> [!NOTE] ${title}`, inlineText(block.content)]
        .filter(Boolean)
        .join("\n>\n> ")
    }
    case "detailsToggleBlock": {
      const title =
        typeof block.title === "string"
          ? escapeMarkdownText(block.title)
          : "Details"
      return [`### ${title}`, portableTextToMarkdown(block.content)]
        .filter(Boolean)
        .join("\n\n")
    }
    case "tableBlock":
      return markdownTable(block)
    case "stepsBlock": {
      const steps = Array.isArray(block.steps)
        ? (block.steps as Array<{ title?: string; content?: unknown }>)
        : []

      return steps
        .map((step, index) =>
          [
            `${index + 1}. **${escapeMarkdownText(step.title ?? `Step ${index + 1}`)}**`,
            inlineText(step.content),
          ]
            .filter(Boolean)
            .join("\n")
        )
        .join("\n\n")
    }
    case "changeBlock": {
      const title = block.type === "fixes" ? "Fixes" : "Improvements"
      const items = Array.isArray(block.items)
        ? (block.items as Array<{ tag?: { text?: string }; text?: unknown }>)
        : []

      return [
        `### ${title}`,
        items
          .map((item) => {
            const tag = item.tag?.text
              ? `**${escapeMarkdownText(item.tag.text)}:** `
              : ""
            return `- ${tag}${inlineText(item.text)}`
          })
          .join("\n"),
      ]
        .filter(Boolean)
        .join("\n\n")
    }
    case "ctaBlock": {
      const text = typeof block.text === "string" ? block.text : ""
      const buttonText =
        typeof block.buttonText === "string" ? block.buttonText : ""
      const buttonUrl =
        typeof block.buttonUrl === "string" ? block.buttonUrl : ""

      return [
        escapeMarkdownText(text),
        buttonText && buttonUrl
          ? formatMarkdownLink(buttonText, buttonUrl)
          : "",
      ]
        .filter(Boolean)
        .join("\n\n")
    }
    case "youtubeVideo": {
      const youtubeId =
        typeof block.youtubeId === "string" ? block.youtubeId : ""
      return youtubeId ? `Video: ${youtubeId}` : ""
    }
    case "twitterEmbed": {
      const tweetUrl = typeof block.tweetUrl === "string" ? block.tweetUrl : ""
      const safeTweetUrl = safeMarkdownUrl(tweetUrl)
      return safeTweetUrl ? `Tweet: ${safeTweetUrl}` : ""
    }
    default:
      return ""
  }
}

export function portableTextToMarkdown(value: unknown) {
  const output: string[] = []

  for (const block of asPortableBlocks(value)) {
    if (block._type !== "block") {
      const rendered = customBlockToMarkdown(block)
      if (rendered) output.push(rendered)
      continue
    }

    const text = blockChildrenToMarkdown(block)
    if (!text) continue

    if (block.listItem) {
      const indent = "  ".repeat(Math.max((block.level ?? 1) - 1, 0))
      const marker = block.listItem === "number" ? "1." : "-"
      output.push(`${indent}${marker} ${text}`)
      continue
    }

    if (block.style === "h1") {
      output.push(`# ${text}`)
    } else if (block.style === "h2") {
      output.push(`## ${text}`)
    } else if (block.style === "h3") {
      output.push(`### ${text}`)
    } else if (block.style === "h4") {
      output.push(`#### ${text}`)
    } else if (block.style === "blockquote") {
      output.push(`> ${text}`)
    } else {
      output.push(text)
    }
  }

  return compact(output.join("\n\n"))
}
