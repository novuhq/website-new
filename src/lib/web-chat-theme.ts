import { accentForeground, DEFAULT_ACCENT, normalizeHex } from "@/lib/accent"

export interface BrandTheme {
  accent: string
  accentForeground: string
  /** The accent at 12% alpha, for tinted rows and bubbles. */
  accentSoft: string
}

/** Build a theme from an extracted accent, falling back to the site default. */
export function buildBrandTheme(accent: string | null | undefined): BrandTheme {
  const normalized = (accent && normalizeHex(accent)) || DEFAULT_ACCENT

  return {
    accent: normalized,
    accentForeground: accentForeground(normalized),
    accentSoft: `${normalized}1f`,
  }
}

/** The custom properties every personalized section reads. */
export function brandCssVars(theme: BrandTheme): Record<string, string> {
  return {
    "--wc-accent": theme.accent,
    "--wc-accent-foreground": theme.accentForeground,
    "--wc-accent-soft": theme.accentSoft,
    "--wc-hue": theme.accent,
  }
}
