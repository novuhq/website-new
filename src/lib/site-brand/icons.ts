import postcss from "postcss"

/** Only recognize explicit scheme declarations, not negations or mixed queries. */
export function iconColorScheme(media = ""): "dark" | "light" | null {
  const match =
    /^(?:(?:only\s+)?(?:screen|all)\s+and\s+)?\(\s*prefers-color-scheme\s*:\s*(dark|light)\s*\)$/i.exec(
      media.trim()
    )
  return match ? (match[1].toLowerCase() as "dark" | "light") : null
}

/**
 * The preview is always dark. Resolve simple SVG scheme rules in the image
 * itself because WebKit does not consistently inherit an <img>'s color-scheme.
 * Preserve the vector artwork and leave unrelated CSS conditions intact.
 * This runs after accent extraction, which retains its existing color policy.
 */
export function preferDarkLogo(logo: string | null): string | null {
  if (!logo?.startsWith("data:image/svg+xml;base64,")) return logo
  try {
    const svg = Buffer.from(logo.split(",")[1], "base64").toString("utf8")
    let changed = false
    const dark = svg.replace(
      /(<style\b[^>]*>)([\s\S]*?)(<\/style\s*>)/gi,
      (_, open: string, css: string, close: string) => {
        const root = postcss.parse(css)
        let changedStyle = false
        root.walkAtRules((rule) => {
          if (rule.name.toLowerCase() !== "media") return
          const scheme = iconColorScheme(rule.params)
          if (!scheme) return
          rule.params = scheme === "dark" ? "all" : "not all"
          changedStyle = true
        })
        changed ||= changedStyle
        return `${open}${changedStyle ? root.toString() : css}${close}`
      }
    )
    return changed
      ? `data:image/svg+xml;base64,${Buffer.from(dark).toString("base64")}`
      : logo
  } catch {
    return logo
  }
}
