import { converter, formatHex, parse } from "culori"

export type AccentCandidate = {
  color: string
  source: "css" | "meta" | "manifest" | "logo"
  score: number
  reason: string
}

const rgb = converter("rgb")
const hsl = converter("hsl")

/** Parse identity colors only. Display contrast/lightness adjustments belong to the consumer. */
export function normalizeColor(value: string): string | null {
  if (!value.trim() || /\bnone\b/i.test(value)) return null
  const parsed = parse(value.trim())
  if (!parsed || (parsed.alpha !== undefined && parsed.alpha !== 1)) return null
  const color = rgb(parsed)
  if (![color.r, color.g, color.b].every(Number.isFinite)) return null
  // formatHex clips wide-gamut channels into the sRGB range.
  return formatHex(color)
}

function isChromatic(color: string): boolean {
  const channels = rgb(color)!
  const spread =
    Math.max(channels.r, channels.g, channels.b) -
    Math.min(channels.r, channels.g, channels.b)
  return (hsl(color)?.s ?? 0) >= 0.18 && spread >= 0.035
}

function equivalent(a: string, b: string): boolean {
  // Converted CSS fallback declarations can differ by one or two rounding steps.
  return [1, 3, 5].every(
    (offset) =>
      Math.abs(
        parseInt(a.slice(offset, offset + 2), 16) -
          parseInt(b.slice(offset, offset + 2), 16)
      ) <= 2
  )
}

export function selectAccent(candidates: AccentCandidate[]): {
  color: string | null
  source: AccentCandidate["source"] | null
} {
  const groups: AccentCandidate[] = []
  for (const candidate of candidates) {
    const color = normalizeColor(candidate.color)
    if (!color || !isChromatic(color) || !Number.isFinite(candidate.score))
      continue
    const existing = groups.find((group) => equivalent(group.color, color))
    if (!existing) groups.push({ ...candidate, color })
    else if (candidate.score > existing.score)
      Object.assign(existing, candidate, { color })
  }
  groups.sort((a, b) => b.score - a.score)
  const best = groups[0]
  // Repetition never increases confidence. Close competing evidence is ambiguous;
  // the explicit metadata priority steps (50/45/40) still remain meaningful.
  if (
    !best ||
    best.score < 40 ||
    (groups[1] && best.score - groups[1].score <= 3)
  ) {
    return { color: null, source: null }
  }
  return { color: best.color, source: best.source }
}
