/** Server-side website identity and accent extraction for the Web Chat hero. */
import { Element, htmlToDOM, type DOMNode } from "html-react-parser"

import { createCachedReader } from "@/lib/site-brand/cache"
import { selectAccent, type AccentCandidate } from "@/lib/site-brand/colors"
import { collectCssCandidates } from "@/lib/site-brand/css"
import {
  createResourceLoader,
  normalizeUrl,
  type ResourceLoader,
} from "@/lib/site-brand/fetch"
import { iconColorScheme, preferDarkLogo } from "@/lib/site-brand/icons"
import { collectLogoCandidates } from "@/lib/site-brand/logo"

export { normalizeUrl } from "@/lib/site-brand/fetch"

export type BrandProfile = {
  url: string
  domain: string
  name: string
  description: string
  accent: string | null
  accentSource?: AccentCandidate["source"] | null
  logo: string | null
}

// Modern server-rendered marketing pages include substantial serialized state.
const MAX_HTML_BYTES = 2 * 1024 * 1024
const MAX_MANIFEST_BYTES = 64 * 1024
const MAX_CSS_BYTES = 256 * 1024
const MAX_LOGO_BYTES = 200 * 1024

type IconCandidate = { url: URL; quality: number; schemePriority: number }
const VECTOR_ICON_QUALITY = Number.MAX_SAFE_INTEGER

function iconCandidate(
  url: URL,
  sizes = "",
  type = "",
  media = ""
): IconCandidate {
  const scheme = iconColorScheme(media)
  const vector =
    type.toLowerCase() === "image/svg+xml" || /\.svg$/i.test(url.pathname)
  const dimension = sizes
    .toLowerCase()
    .split(/\s+/)
    .reduce((largest, size) => {
      const match = /^(\d+)x(\d+)$/.exec(size)
      return match
        ? Math.max(largest, Math.min(Number(match[1]), Number(match[2])))
        : largest
    }, 0)
  return {
    url,
    quality: vector ? VECTOR_ICON_QUALITY : Math.min(4096, dimension),
    schemePriority: scheme === "dark" ? 1 : scheme === "light" ? -1 : 0,
  }
}

function compareIcons(
  a: Pick<IconCandidate, "quality" | "schemePriority">,
  b: Pick<IconCandidate, "quality" | "schemePriority">
) {
  return b.schemePriority - a.schemePriority || b.quality - a.quality
}

function rankedIcons(icons: IconCandidate[]): IconCandidate[] {
  const unique = new Map<string, IconCandidate>()
  for (const icon of icons) {
    const previous = unique.get(icon.url.href)
    if (!previous || compareIcons(icon, previous) < 0)
      unique.set(icon.url.href, icon)
  }
  return [...unique.values()].sort(compareIcons)
}

type HtmlNode = DOMNode | Element["children"][number]

function elementsIn(nodes: DOMNode[]): Element[] {
  const elements: Element[] = []
  const pending: HtmlNode[] = [...nodes].reverse()
  while (pending.length) {
    const node = pending.pop()!
    if (node instanceof Element) elements.push(node)
    if ("children" in node) pending.push(...[...node.children].reverse())
  }
  return elements
}

function textIn(node: HtmlNode): string {
  if (node.type === "text") return node.data
  return "children" in node ? node.children.map(textIn).join("") : ""
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim()
}

function isTransientFailure(error: unknown): boolean {
  const status =
    error && typeof error === "object" && "statusCode" in error
      ? error.statusCode
      : undefined
  return (
    typeof status !== "number" ||
    status >= 500 ||
    status === 408 ||
    status === 429
  )
}

function toRgb(hex: string): [number, number, number] {
  let h = hex.slice(1)
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("")
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
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
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x]
  const hx = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0")
  return `#${hx(r1)}${hx(g1)}${hx(b1)}`
}

/** Each reader owns a bounded cache; upstream loading is supplied at the IO boundary. */
export function createBrandProfileReader({
  createLoader = createResourceLoader,
}: { createLoader?: () => ResourceLoader } = {}) {
  const read = createCachedReader<BrandProfile>({
    ttl: (brand) => (brand.accent ? 24 * 60 * 60 * 1000 : 15 * 60 * 1000),
    read: async (key) => {
      const url = normalizeUrl(key)
      const loader = createLoader()
      let cacheable = true
      try {
        const page = await loader.load(url, {
          maxBytes: MAX_HTML_BYTES,
          accept: "text/html,application/xhtml+xml",
        })
        if (
          !/^(text\/html|application\/xhtml\+xml)(;|$)/i.test(page.contentType)
        ) {
          throw new Error("That URL is not an HTML page")
        }
        const nodes = htmlToDOM(page.body.toString("utf8"))
        const elements = elementsIn(nodes)
        const metas = elements.filter((element) => element.name === "meta")
        const links = elements.filter((element) => element.name === "link")
        const meta = (key: string) =>
          metas.find((element) =>
            [element.attribs.name, element.attribs.property].some(
              (value) => value?.toLowerCase() === key
            )
          )?.attribs.content
        const domain = url.hostname.replace(/^www\./, "")
        const title = elements.find((element) => element.name === "title")
        const name = (
          cleanText(
            meta("og:site_name") || (title && textIn(title)) || domain
          ).split(/\s[|\-–—·:]\s/)[0] || domain
        ).slice(0, 40)
        const description = cleanText(
          meta("description") || meta("og:description") || ""
        ).slice(0, 160)
        let base = page.url
        const baseHref = elements.find(
          (element) => element.name === "base" && element.attribs.href
        )?.attribs.href
        if (baseHref) {
          try {
            base = normalizeUrl(new URL(baseHref, page.url).href)
          } catch {
            /* use the final page URL */
          }
        }
        const resolve = (href: string): URL | null => {
          try {
            return normalizeUrl(new URL(href, base).href)
          } catch {
            return null
          }
        }
        const hasRel = (element: Element, rel: string) =>
          element.attribs.rel?.toLowerCase().split(/\s+/).includes(rel)
        const optionalLoad = async (
          resource: URL,
          maxBytes: number,
          accept: string
        ) => {
          try {
            return await loader.load(resource, { maxBytes, accept })
          } catch (error) {
            if (isTransientFailure(error)) cacheable = false
            return null
          }
        }
        const candidates: AccentCandidate[] = []
        for (const element of metas) {
          const kind = element.attribs.name?.toLowerCase()
          if (
            (kind === "theme-color" || kind === "msapplication-tilecolor") &&
            element.attribs.content
          ) {
            candidates.push({
              color: element.attribs.content,
              source: "meta",
              score: kind === "theme-color" ? 50 : 40,
              reason: `${kind}${element.attribs.media ? ` (${element.attribs.media})` : ""}`,
            })
          }
        }
        const manifestHref = links.find((element) =>
          hasRel(element, "manifest")
        )?.attribs.href
        const manifestUrl = manifestHref ? resolve(manifestHref) : null
        const styleLinks = [
          ...new Set(
            links
              .filter(
                (element) =>
                  hasRel(element, "stylesheet") &&
                  !("disabled" in element.attribs) &&
                  (!element.attribs.media ||
                    /^(all|screen)$/i.test(element.attribs.media.trim()))
              )
              .map((element) => element.attribs.href)
              .filter(Boolean)
          ),
        ]
          .map((href) => ({ href, url: resolve(href) }))
          .filter(
            (value): value is { href: string; url: URL } => value.url !== null
          )
          .slice(0, 3)
        const pageIcons = rankedIcons([
          ...links
            .filter(
              (element) =>
                hasRel(element, "icon") || hasRel(element, "apple-touch-icon")
            )
            .flatMap((element) => {
              const url = element.attribs.href
                ? resolve(element.attribs.href)
                : null
              return url
                ? [
                    iconCandidate(
                      url,
                      element.attribs.sizes ||
                        (hasRel(element, "apple-touch-icon") ? "180x180" : ""),
                      element.attribs.type,
                      element.attribs.media
                    ),
                  ]
                : []
            }),
          {
            url: new URL("/apple-touch-icon.png", page.url),
            quality: -1,
            schemePriority: -2,
          },
          {
            url: new URL("/favicon.ico", page.url),
            quality: -1,
            schemePriority: -2,
          },
        ])
        const manifestIcons: IconCandidate[] = []

        const manifestTask = async () => {
          if (!manifestUrl) return
          const resource = await optionalLoad(
            manifestUrl,
            MAX_MANIFEST_BYTES,
            "application/manifest+json,application/json,text/plain"
          )
          if (!resource) return
          try {
            const manifest: unknown = JSON.parse(resource.body.toString("utf8"))
            if (
              manifest &&
              typeof manifest === "object" &&
              "icons" in manifest &&
              Array.isArray(manifest.icons)
            ) {
              for (const icon of manifest.icons.slice(0, 64)) {
                if (
                  !icon ||
                  typeof icon !== "object" ||
                  typeof icon.src !== "string"
                )
                  continue
                // Manifest icon paths are relative to the manifest, not the HTML base.
                try {
                  const url = normalizeUrl(new URL(icon.src, resource.url).href)
                  manifestIcons.push(
                    iconCandidate(
                      url,
                      typeof icon.sizes === "string" ? icon.sizes : "",
                      typeof icon.type === "string" ? icon.type : ""
                    )
                  )
                } catch {
                  /* Ignore invalid optional icon URLs. */
                }
              }
            }
            if (
              manifest &&
              typeof manifest === "object" &&
              !Array.isArray(manifest) &&
              "theme_color" in manifest &&
              typeof manifest.theme_color === "string"
            ) {
              candidates.push({
                color: manifest.theme_color,
                source: "manifest",
                score: 45,
                reason: "manifest theme_color",
              })
            }
          } catch {
            /* A malformed optional manifest does not invalidate the site. */
          }
        }
        const stylesTask = Promise.all(
          styleLinks.map(async ({ href, url: styleUrl }) => {
            const resource = await optionalLoad(
              styleUrl,
              MAX_CSS_BYTES,
              "text/css"
            )
            const css =
              resource &&
              /^(text\/(css|plain)|application\/octet-stream)(;|$)/i.test(
                resource.contentType
              )
                ? resource.body.toString("utf8")
                : ""
            return { href, css }
          })
        )
        const triedIcons = new Set<string>()
        const logoTask = async (icons: IconCandidate[]) => {
          for (const icon of icons) {
            if (triedIcons.has(icon.url.href)) continue
            if (triedIcons.size >= 6) break
            triedIcons.add(icon.url.href)
            const resource = await optionalLoad(
              icon.url,
              MAX_LOGO_BYTES,
              "image/*"
            )
            if (
              resource?.body.length &&
              /^image\//i.test(resource.contentType)
            ) {
              return {
                schemePriority: icon.schemePriority,
                quality: /^image\/svg\+xml(;|$)/i.test(resource.contentType)
                  ? VECTOR_ICON_QUALITY
                  : icon.quality,
                uri: `data:${resource.contentType.split(";")[0]};base64,${resource.body.toString("base64")}`,
              }
            }
          }
          return null
        }
        // Fetch a page icon while the manifest loads, preserving identity even
        // if the optional manifest consumes the remaining network deadline.
        const readLogo = async () => {
          const [, pageLogo] = await Promise.all([
            manifestTask(),
            logoTask(pageIcons.slice(0, 1)),
          ])
          const betterIcons = rankedIcons([
            ...pageIcons,
            ...manifestIcons,
          ]).filter((icon) => !pageLogo || compareIcons(icon, pageLogo) < 0)
          return (await logoTask(betterIcons))?.uri ?? pageLogo?.uri ?? null
        }
        const [stylesheets, logo] = await Promise.all([stylesTask, readLogo()])
        candidates.push(...collectCssCandidates(nodes, stylesheets))
        let selected = selectAccent(candidates)
        if (!selected.color && logo) {
          candidates.push(...(await collectLogoCandidates(logo, candidates)))
          selected = selectAccent(candidates)
        }
        const accent = usableAccent(selected.color)
        return {
          value: {
            url: url.href,
            domain,
            name,
            description,
            accent,
            accentSource: accent ? selected.source : null,
            logo: preferDarkLogo(logo),
          },
          cacheable,
        }
      } finally {
        loader.close()
      }
    },
  })
  return async (rawUrl: string): Promise<BrandProfile> =>
    read(normalizeUrl(rawUrl).href)
}

export const getBrandProfile = createBrandProfileReader()
