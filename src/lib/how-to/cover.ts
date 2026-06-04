import { ROUTE } from "@/constants/routes"

export const HOW_TO_COVER_WIDTH = 1344
export const HOW_TO_COVER_HEIGHT = 756

export const HOW_TO_COVER_TEMPLATES = [
  "default",
  "template-1",
  "template-2",
] as const

export const DEFAULT_HOW_TO_COVER_TEMPLATE = "template-1"

export type THowToCoverTemplate = (typeof HOW_TO_COVER_TEMPLATES)[number]

export function isHowToCoverTemplate(
  template?: string | null
): template is THowToCoverTemplate {
  return HOW_TO_COVER_TEMPLATES.includes(template as THowToCoverTemplate)
}

export function getHowToCoverText({
  coverText,
  title,
}: {
  coverText?: string | null
  title?: string | null
}) {
  return coverText?.trim() || title?.trim() || ""
}

export function getHowToCoverPath({
  template = DEFAULT_HOW_TO_COVER_TEMPLATE,
  title,
}: {
  template?: string | null
  title?: string | null
}) {
  const normalizedTemplate = isHowToCoverTemplate(template)
    ? template
    : "default"
  const params = new URLSearchParams({ template: normalizedTemplate })
  const coverTitle = title?.trim()

  if (normalizedTemplate !== "default" && coverTitle) {
    params.set("title", coverTitle)
  }

  return `${ROUTE.apiConnectHowToCover}/?${params.toString()}`
}
