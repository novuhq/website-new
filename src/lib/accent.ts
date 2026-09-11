/**
 * Pure colour helpers for the Web Chat brand personalizer. No DOM, no fetch —
 * safe to import from server components, client components and node tests.
 */

/** The unpersonalized accent. Matches the Figma badge square (#C25CD6). */
export const DEFAULT_ACCENT = "#c25cd6" as const

const SHORTHAND = /^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i
const FULL = /^#?([0-9a-f]{6})$/i

/** Normalize `abc`, `#ABC`, `#E65006` to lowercase `#rrggbb`, else null. */
export function normalizeHex(input: string): string | null {
  const value = input.trim()

  const shorthand = SHORTHAND.exec(value)
  if (shorthand) {
    const [, r, g, b] = shorthand
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase()
  }

  const full = FULL.exec(value)
  return full ? `#${full[1].toLowerCase()}` : null
}

function channels(hex: string): [number, number, number] {
  const value = hex.slice(1)
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255) as [
    number,
    number,
    number,
  ]
}

function toLinear(channel: number): number {
  return channel <= 0.03928
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4)
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
export function relativeLuminance(hex: string): number {
  const normalized = normalizeHex(hex)

  if (!normalized) {
    return 0
  }

  const [r, g, b] = channels(normalized).map(toLinear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Text colour to sit on an accent fill.
 *
 * Deliberately a luminance threshold rather than a max-contrast rule: the design
 * uses white on #E65006 even though black has the higher contrast ratio there.
 * Black is reserved for accents light enough that white would be unreadable.
 */
export function accentForeground(hex: string): "#ffffff" | "#000000" {
  return relativeLuminance(hex) > 0.5 ? "#000000" : "#ffffff"
}
