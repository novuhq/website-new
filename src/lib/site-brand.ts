/**
 * Server-side brand extraction for the Agent Chat "try it on your site"
 * personalizer. Fetches a URL's HTML, pulls a small brand profile (name, color,
 * logo inlined as a data URI, and a coarse vertical guess), and never touches
 * the client with an arbitrary external asset. No screenshot service, no LLM.
 */

export type Vertical =
  | "saas"
  | "ecommerce"
  | "fintech"
  | "support"
  | "healthcare"
  | "developer"
  | "generic"

export type BrandProfile = {
  url: string
  domain: string
  name: string
  description: string
  accent: string | null // hex, validated
  logo: string | null // data URI
  vertical: Vertical
}

const FETCH_TIMEOUT = 6000
const MAX_HTML_BYTES = 512 * 1024
const MAX_LOGO_BYTES = 200 * 1024
const UA =
  "Mozilla/5.0 (compatible; NovuAgentChatPreview/1.0; +https://novu.co)"

/** Normalize user input into a safe http(s) URL, or throw. */
export function normalizeUrl(input: string): URL {
  const trimmed = input.trim()
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  const url = new URL(withProto) // throws on garbage

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http and https URLs are supported")
  }
  if (isBlockedHost(url.hostname)) {
    throw new Error("That host is not allowed")
  }
  return url
}

/** Lightweight SSRF guard: reject localhost and private IP literals. */
function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase()
  if (h === "localhost" || h.endsWith(".local")) return true
  // IPv4 private / loopback / link-local literals
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])]
    if (a === 127 || a === 10 || a === 0) return true
    if (a === 169 && b === 254) return true
    if (a === 192 && b === 168) return true
    if (a === 172 && b >= 16 && b <= 31) return true
  }
  if (h === "::1" || h.startsWith("fe80") || h.startsWith("fc") || h.startsWith("fd"))
    return true
  return false
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeout = FETCH_TIMEOUT
) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    return await fetch(url, {
      ...init,
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
      headers: { "user-agent": UA, ...(init.headers || {}) },
    })
  } finally {
    clearTimeout(id)
  }
}

async function fetchHtml(url: URL): Promise<string> {
  const res = await fetchWithTimeout(url.toString(), {
    headers: { accept: "text/html,application/xhtml+xml" },
  })
  if (!res.ok) throw new Error(`Site returned ${res.status}`)
  const ct = res.headers.get("content-type") || ""
  if (!ct.includes("html")) throw new Error("That URL is not an HTML page")
  const buf = await res.arrayBuffer()
  const bytes = new Uint8Array(buf).subarray(0, MAX_HTML_BYTES)
  return new TextDecoder("utf-8").decode(bytes)
}

// --- HTML parsing (regex-based; this is preview copy, not a DOM contract) ---

function metaContent(html: string, keyAttr: string, key: string): string | null {
  // matches <meta name="..." content="..."> in either attribute order
  const re = new RegExp(
    `<meta[^>]+${keyAttr}=["']${key}["'][^>]*content=["']([^"']+)["']`,
    "i"
  )
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]*${keyAttr}=["']${key}["']`,
    "i"
  )
  return html.match(re)?.[1] ?? html.match(re2)?.[1] ?? null
}

function firstTitle(html: string): string | null {
  return html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? null
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}

function cleanName(raw: string, domain: string): string {
  // Site names often read "Product | Tagline" or "Product - Tagline". Take the
  // strongest segment, cap length, fall back to the domain.
  const first = decodeEntities(raw).split(/\s[|\-–—·:]\s/)[0]?.trim()
  const name = (first || domain).slice(0, 40)
  return name || domain
}

function validHex(input: string | null): string | null {
  if (!input) return null
  const v = input.trim()
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v) ? v : null
}

function toRgb(hex: string): [number, number, number] {
  let h = hex.slice(1)
  if (h.length === 3) h = h.split("").map((c) => c + c).join("")
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

/**
 * Brand theme-colors are frequently near-black, near-white, or grayscale, which
 * read as broken accents on the dark UI. Keep the brand hue but clamp lightness
 * into a usable band; fall back to null (default purple) for grayscale colors.
 */
function usableAccent(hex: string | null): string | null {
  if (!hex) return null
  const [r, g, b] = toRgb(hex).map((n) => n / 255) as [number, number, number]
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  if (s < 0.18) return null // grayscale: use the default accent

  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
  }
  h = (h * 60 + 360) % 360

  const nl = Math.min(0.68, Math.max(0.48, l)) // contrast-safe band
  const c = (1 - Math.abs(2 * nl - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = nl - c / 2
  const [r1, g1, b1] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x]
  const hx = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0")
  return `#${hx(r1)}${hx(g1)}${hx(b1)}`
}

function iconCandidates(html: string, base: URL): string[] {
  const out: string[] = []
  const linkRe = /<link[^>]+>/gi
  const links = html.match(linkRe) || []
  for (const tag of links) {
    if (!/rel=["'][^"']*icon[^"']*["']/i.test(tag)) continue
    const href = tag.match(/href=["']([^"']+)["']/i)?.[1]
    if (!href) continue
    try {
      out.push(new URL(href, base).toString())
    } catch {
      /* ignore malformed href */
    }
  }
  // apple-touch-icon and default favicon fallbacks
  out.push(new URL("/apple-touch-icon.png", base).toString())
  out.push(new URL("/favicon.ico", base).toString())
  return [...new Set(out)]
}

async function inlineLogo(candidates: string[]): Promise<string | null> {
  for (const src of candidates) {
    try {
      const res = await fetchWithTimeout(src, { headers: { accept: "image/*" } }, 4000)
      if (!res.ok) continue
      const ct = res.headers.get("content-type") || ""
      if (!ct.startsWith("image/")) continue
      const buf = await res.arrayBuffer()
      if (buf.byteLength === 0 || buf.byteLength > MAX_LOGO_BYTES) continue
      const b64 = Buffer.from(buf).toString("base64")
      return `data:${ct.split(";")[0]};base64,${b64}`
    } catch {
      /* try next candidate */
    }
  }
  return null
}

const VERTICAL_KEYWORDS: Array<[Vertical, RegExp]> = [
  [
    // Commerce-specific signals only ("product" is too common on all SaaS sites).
    "ecommerce",
    /\b(add to cart|shopping cart|checkout|storefront|ecommerce|e-commerce|online store|retail|apparel|boutique|free shipping|add to bag)\b/i,
  ],
  [
    "fintech",
    /\b(bank|payment|invoic\w*|fintech|crypto|wallet|transactions?|lending|trading|billing|finance|payroll)\b/i,
  ],
  [
    "healthcare",
    /\b(health|patients?|clinic|medical|therapy|wellness|hospital|care team|telehealth)\b/i,
  ],
  [
    "support",
    /\b(help ?desk|support|tickets?|customer service|service ?desk|contact center)\b/i,
  ],
  [
    "developer",
    /\b(api|sdk|developer|deploy\w*|devops|infrastructure|open ?source|repos?|git|ci\/cd)\b/i,
  ],
  [
    "saas",
    /\b(dashboard|platform|workspace|workflow|analytics|crm|saas|b2b|software|teams?|automation)\b/i,
  ],
]

/** Visible-text approximation: drop script/style, strip tags, collapse space. */
function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 8000)
}

function inferVertical(text: string): Vertical {
  let best: Vertical = "generic"
  let bestScore = 0
  for (const [vertical, re] of VERTICAL_KEYWORDS) {
    const matches = text.match(new RegExp(re, "gi"))
    const score = matches ? matches.length : 0
    if (score > bestScore) {
      best = vertical
      bestScore = score
    }
  }
  return best
}

export async function getBrandProfile(rawUrl: string): Promise<BrandProfile> {
  const url = normalizeUrl(rawUrl)
  const domain = url.hostname.replace(/^www\./, "")
  const html = await fetchHtml(url)

  const name = cleanName(
    metaContent(html, "property", "og:site_name") ||
      firstTitle(html) ||
      domain,
    domain
  )
  const description = decodeEntities(
    metaContent(html, "name", "description") ||
      metaContent(html, "property", "og:description") ||
      ""
  ).slice(0, 160)

  const accent = usableAccent(
    validHex(metaContent(html, "name", "theme-color")) ||
      validHex(metaContent(html, "name", "msapplication-TileColor"))
  )

  const logo = await inlineLogo(iconCandidates(html, url))

  const haystack = `${name} ${description} ${visibleText(html)}`
  const vertical = inferVertical(haystack)

  return { url: url.toString(), domain, name, description, accent, logo, vertical }
}
