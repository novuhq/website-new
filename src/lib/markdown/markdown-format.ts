const SAFE_URL_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"])

export function escapeMarkdownText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

export function escapeMarkdownTableCell(value: string) {
  return escapeMarkdownText(value).replace(/\|/g, "\\|")
}

function stripControlCharacters(value: string) {
  return Array.from(value)
    .filter((character) => {
      const code = character.charCodeAt(0)
      return code >= 0x20 && code !== 0x7f
    })
    .join("")
}

export function safeMarkdownUrl(value: string | URL | null | undefined) {
  if (!value) return null

  const raw = stripControlCharacters(String(value).trim())
  if (!raw || /[\s<>]/.test(raw)) return null

  if (raw.startsWith("/") && !raw.startsWith("//")) return raw
  if (raw.startsWith("#")) return raw

  try {
    const parsed = new URL(raw)
    return SAFE_URL_PROTOCOLS.has(parsed.protocol) ? parsed.toString() : null
  } catch {
    return null
  }
}

function escapeMarkdownLinkDestination(value: string) {
  return value.replace(/\\/g, "%5C").replace(/</g, "%3C").replace(/>/g, "%3E")
}

export function formatMarkdownLink(
  label: string,
  href: string | URL | null | undefined,
  options: { labelIsEscaped?: boolean } = {}
) {
  const text = options.labelIsEscaped ? label : escapeMarkdownText(label)
  const url = safeMarkdownUrl(href)

  if (!url) return text

  return `[${text}](<${escapeMarkdownLinkDestination(url)}>)`
}

export function formatCodeFence(code: string, language = "") {
  const info = language.replace(/[`\r\n]/g, "").trim()
  const longestFence = Math.max(
    3,
    ...Array.from(code.matchAll(/`+/g), (match) => match[0].length + 1)
  )
  const fence = "`".repeat(longestFence)

  return `${fence}${info}\n${code}\n${fence}`
}
