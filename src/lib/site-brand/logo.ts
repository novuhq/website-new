import { converter } from "culori"
import postcss from "postcss"
import sharp from "sharp"

import { normalizeColor, type AccentCandidate } from "./colors"

const MAX_BYTES = 200 * 1024
const MAX_PIXELS = 1024 * 1024
const PNG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
const hsl = converter("hsl")
type ImageInput = {
  body: Buffer
  raw?: { width: number; height: number; channels: 4 }
}
type Swatch = { color: string; hue: number; count: number }

/** Rebuild a small color-only CSS subset; raw stylesheet text never reaches Sharp. */
function svgStyles(svg: string): { markup: string; css: string } {
  const rules: string[] = []
  let sheets = 0
  const markup = svg.replace(
    /<style\b([^>]*)>([\s\S]*?)<\/style\s*>/g,
    (_, attributes: string, source: string) => {
      if (++sheets > 16 || source.length > 32 * 1024)
        throw new Error("SVG stylesheet limit exceeded")
      const unknown = attributes.replace(
        /\s+(xmlns|type)\s*=\s*(["'])(.*?)\2/g,
        (_match, name: string, _quote: string, value: string) => {
          if (
            value !==
            (name === "xmlns" ? "http://www.w3.org/2000/svg" : "text/css")
          )
            throw new Error("Unsupported SVG stylesheet attributes")
          return ""
        }
      )
      if (unknown.trim())
        throw new Error("Unsupported SVG stylesheet attributes")
      for (const node of postcss.parse(source).nodes) {
        if (node.type === "comment") continue
        // The extractor has no browser media context; retain only base colors.
        if (node.type === "atrule" && node.name.toLowerCase() === "media")
          continue
        if (
          node.type !== "rule" ||
          rules.length >= 128 ||
          !node.selectors.every((selector) =>
            /^(?::root|[.#]?[a-zA-Z_][\w-]*)$/.test(selector)
          )
        )
          throw new Error("Unsupported SVG stylesheet rule")
        const declarations: string[] = []
        for (const declaration of node.nodes) {
          if (declaration.type === "comment") continue
          if (
            declaration.type !== "decl" ||
            !/^(fill|stroke|color)$/i.test(declaration.prop)
          )
            throw new Error("Unsupported SVG stylesheet declaration")
          const value = declaration.value.trim()
          const color =
            normalizeColor(value) ??
            (/^(none|currentcolor|inherit)$/i.test(value)
              ? value.toLowerCase()
              : null)
          if (!color) throw new Error("Unsupported SVG paint value")
          declarations.push(
            `${declaration.prop.toLowerCase()}:${color}${declaration.important ? "!important" : ""}`
          )
        }
        rules.push(`${node.selectors.join(",")}{${declarations.join(";")}}`)
      }
      return ""
    }
  )
  return { markup, css: rules.join("") }
}

/** Sharp does not decode ICO containers. Accept bounded PNG or 32-bit BMP frames. */
function iconFrame(body: Buffer): ImageInput | null {
  const count = body.readUInt16LE(4)
  if (!count || count > 64 || body.length < 6 + count * 16) return null
  const entries = Array.from({ length: count }, (_, index) => {
    const start = 6 + index * 16
    return {
      width: body[start] || 256,
      height: body[start + 1] || 256,
      size: body.readUInt32LE(start + 8),
      offset: body.readUInt32LE(start + 12),
    }
  }).sort((a, b) => b.width * b.height - a.width * a.height)
  for (const entry of entries) {
    if (
      entry.offset < 6 + count * 16 ||
      entry.offset + entry.size > body.length
    )
      continue
    const frame = body.subarray(entry.offset, entry.offset + entry.size)
    if (frame.subarray(0, 8).equals(PNG)) return { body: frame }
    if (frame.length < 40 || frame.readUInt32LE(0) !== 40) continue
    const width = frame.readInt32LE(4)
    const height = frame.readInt32LE(8) / 2
    if (
      width !== entry.width ||
      height !== entry.height ||
      frame.readUInt16LE(12) !== 1 ||
      frame.readUInt16LE(14) !== 32 ||
      frame.readUInt32LE(16) !== 0 ||
      frame.length < 40 + width * height * 4
    )
      continue
    const maskStart = 40 + width * height * 4
    const maskStride = Math.ceil(width / 32) * 4
    const hasMask = frame.length >= maskStart + maskStride * height
    let hasAlpha = false
    for (let offset = 43; offset < maskStart; offset += 4)
      if (frame[offset]) hasAlpha = true
    // Legacy zero-alpha BMPs need an AND mask to establish opacity.
    if (!hasAlpha && !hasMask) continue
    const pixels = Buffer.alloc(width * height * 4)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const row = height - 1 - y
        const input = 40 + (row * width + x) * 4
        const output = (y * width + x) * 4
        pixels[output] = frame[input + 2]
        pixels[output + 1] = frame[input + 1]
        pixels[output + 2] = frame[input]
        const masked =
          hasMask &&
          frame[maskStart + row * maskStride + (x >> 3)] & (128 >> x % 8)
        pixels[output + 3] = hasAlpha ? frame[input + 3] : masked ? 0 : 255
      }
    }
    return { body: pixels, raw: { width, height, channels: 4 } }
  }
  return null
}

function imageInput(uri: string): ImageInput | null {
  if (uri.length > (MAX_BYTES * 4) / 3 + 128) return null
  const match = /^data:image\/[\w.+-]+;base64,([A-Za-z0-9+/]+={0,2})$/.exec(uri)
  if (!match) return null
  const body = Buffer.from(match[1], "base64")
  if (!body.length || body.length > MAX_BYTES) return null
  if (body.length >= 6 && body.readUInt32LE(0) === 0x00010000)
    return iconFrame(body)
  if (
    body.subarray(0, 8).equals(PNG) ||
    body.subarray(0, 3).equals(Buffer.from([255, 216, 255])) ||
    /^GIF8[79]a/.test(body.subarray(0, 6).toString("ascii")) ||
    (body.toString("ascii", 0, 4) === "RIFF" &&
      body.toString("ascii", 8, 12) === "WEBP") ||
    (body.toString("ascii", 4, 8) === "ftyp" &&
      /^(avif|avis)$/.test(body.toString("ascii", 8, 12)))
  )
    return { body }

  // Only self-contained SVGs enter the rasterizer. Styles are rebuilt from
  // literal color declarations; entities, resources and scripts remain blocked.
  const svg = body
    .toString("utf8")
    .replace(/^\s*<\?xml\s[^?]*\?>/i, "")
    .trim()
  if (!/^<svg[\s>]/i.test(svg) || /<!|<\?|[&\\]/.test(svg)) return null
  const { markup, css } = svgStyles(svg)
  if (
    !/^<svg[\s>]/i.test(svg) ||
    /<!|<\?|[&\\]|<(?:[^<>\s/]+:)?(?:script|foreignObject|image|use|style)\b|\bhref\s*=|\bxml:base\s*=|\bstyle\s*=|\bon\w+\s*=/i.test(
      markup
    ) ||
    /url\s*\(/i.test(markup.replace(/url\(#[\w-]+\)/gi, ""))
  )
    return null
  return {
    body: Buffer.from(
      css ? markup.replace(/(<svg\b[^>]*>)/, `$1<style>${css}</style>`) : markup
    ),
  }
}

function hueDistance(a: number, b: number): number {
  const difference = Math.abs(a - b)
  return Math.min(difference, 360 - difference)
}

function colorDistance(a: string, b: string): number {
  return Math.hypot(
    ...[1, 3, 5].map(
      (offset) =>
        parseInt(a.slice(offset, offset + 2), 16) -
        parseInt(b.slice(offset, offset + 2), 16)
    )
  )
}

function palette(data: Buffer): Swatch[] {
  const bins = new Map<number, { sum: number[]; count: number }>()
  let visible = 0
  let colored = 0
  for (let offset = 0; offset < data.length; offset += 4) {
    if (data[offset + 3] < 204) continue
    visible++
    const channels = [data[offset], data[offset + 1], data[offset + 2]]
    const max = Math.max(...channels) / 255
    const min = Math.min(...channels) / 255
    const lightness = (max + min) / 2
    const saturation = (max - min) / (1 - Math.abs(2 * lightness - 1))
    if (
      max - min < 0.08 ||
      saturation < 0.25 ||
      lightness < 0.08 ||
      lightness > 0.92
    )
      continue
    colored++
    const key =
      (channels[0] >> 5) * 64 + (channels[1] >> 5) * 8 + (channels[2] >> 5)
    const bin = bins.get(key) ?? { sum: [0, 0, 0], count: 0 }
    channels.forEach((channel, index) => {
      bin.sum[index] += channel
    })
    bin.count++
    bins.set(key, bin)
  }
  if (colored < 4 || colored / visible < 0.025) return []
  const swatches = [...bins.values()]
    .map(({ sum, count }) => {
      const color = `#${sum
        .map((value) =>
          Math.round(value / count)
            .toString(16)
            .padStart(2, "0")
        )
        .join("")}`
      return { color, count, hue: hsl(color)!.h! }
    })
    .sort((a, b) => b.count - a.count)
  const groups: Swatch[] = []
  for (const swatch of swatches) {
    const group = groups.find(
      (candidate) => hueDistance(candidate.hue, swatch.hue) < 20
    )
    if (group) group.count += swatch.count
    else groups.push({ ...swatch })
  }
  return groups
    .sort((a, b) => b.count - a.count)
    .map((group) => ({ ...group, count: group.count / colored }))
}

/** Last-resort evidence from an already downloaded icon; never fetch image URLs here. */
export async function collectLogoCandidates(
  logo: string,
  evidence: AccentCandidate[]
): Promise<AccentCandidate[]> {
  try {
    const input = imageInput(logo)
    if (!input) return []
    const { data } = await sharp(input.body, {
      raw: input.raw,
      limitInputPixels: MAX_PIXELS,
      failOn: "warning",
      pages: 1,
    })
      .timeout({ seconds: 1 })
      .resize(64, 64, { fit: "inside", withoutEnlargement: true })
      .toColourspace("srgb")
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    const swatches = palette(data)
    if (!swatches.length) return []
    const candidates: AccentCandidate[] = []
    const dominant = swatches[0]
    if (
      dominant.count >= 0.65 &&
      dominant.count >= (swatches[1]?.count ?? 0) * 1.75
    ) {
      candidates.push({
        color: dominant.color,
        source: "logo",
        score: 40,
        reason: "Dominant chromatic logo color",
      })
    }
    for (const candidate of evidence) {
      if (
        candidate.source !== "css" ||
        (candidate.score < 40 &&
          !candidate.reason.startsWith("Uncorroborated theme token "))
      )
        continue
      const color = normalizeColor(candidate.color)
      const reference = color && hsl(color)
      if (!reference || reference.h === undefined || (reference.s ?? 0) < 0.25)
        continue
      const matches = swatches.filter((swatch) => {
        const sample = hsl(swatch.color)!
        return (
          swatch.count >= 0.2 &&
          hueDistance(reference.h!, swatch.hue) <= 15 &&
          Math.abs(reference.l - sample.l) <= 0.2 &&
          Math.abs(reference.s - sample.s) <= 0.3
        )
      })
      if (matches.length) {
        // Similar brand shades can share a hue match. Reward the closer pixel
        // match instead of giving every shade an identical confidence boost.
        // Near-equal distances still fall within selectAccent's ambiguity band.
        const distance = Math.min(
          ...matches.map((swatch) => colorDistance(color!, swatch.color))
        )
        candidates.push({
          color: color!,
          source: "logo",
          score:
            Math.max(60, candidate.score + 6) + Math.max(0, 10 - distance / 3),
          reason: `Logo corroborates ${candidate.reason}`,
        })
      }
    }
    return candidates
  } catch {
    // Corrupt, unsupported, oversized, or timed-out icons must not lose identity.
    return []
  }
}
