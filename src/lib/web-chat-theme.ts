import { accentForeground, DEFAULT_ACCENT, normalizeHex } from "@/lib/accent"

export interface BrandTheme {
  accent: string
  accentForeground: string
  /** The accent at 12% alpha, for tinted rows and bubbles. */
  accentSoft: string
  /**
   * The accent at 19% alpha, for the dashboard's selected row. Measured off
   * `hero-personalization-05` (`45487-89814`): the selected row solves to
   * alpha 0.189/0.177/0.200 per channel against the unselected row beneath
   * it. Kept separate from `accentSoft` because that token is also read by
   * the compare card and the product bento, which were matched to their own
   * frames at 12%.
   */
  accentRow: string
  /**
   * The accent at 72% alpha, for the sidebar's active nav pill once a brand
   * is applied. Same frame: the pill's fill is (167, 58, 4) against an
   * accent of (230, 80, 6), i.e. 0.726/0.725/0.667.
   */
  accentNav: string
}

/** Build a theme from an extracted accent, falling back to the site default. */
export function buildBrandTheme(accent: string | null | undefined): BrandTheme {
  const normalized = (accent && normalizeHex(accent)) || DEFAULT_ACCENT

  return {
    accent: normalized,
    accentForeground: accentForeground(normalized),
    accentSoft: `${normalized}1f`,
    accentRow: `${normalized}30`,
    accentNav: `${normalized}b8`,
  }
}

/** The custom properties every personalized section reads. */
export function brandCssVars(theme: BrandTheme): Record<string, string> {
  return {
    "--wc-accent": theme.accent,
    "--wc-accent-foreground": theme.accentForeground,
    "--wc-accent-soft": theme.accentSoft,
    "--wc-accent-row": theme.accentRow,
    "--wc-accent-nav": theme.accentNav,
    "--wc-hue": theme.accent,
  }
}
