import { PortableTextBlock } from "next-sanity"

import { ITableOfContentsItem } from "@/types/common"
import { generateHeadingSlug } from "@/lib/utils"

import { portableToPlain } from "./portable-to-plain"

/**
 * Extracts table of contents items from portable text content
 * @param data - Array of portable text blocks
 * @param headingLevels - Optional array of heading levels to include (e.g. ['h2', 'h3'])
 *
 * @returns Array of table of contents items with title, anchor, and level
 */
export function getTableOfContents(
  data: PortableTextBlock[],
  headingLevels: string[] = ["h2"]
): ITableOfContentsItem[] {
  if (!data || data.length === 0) return []
  const idCount: Record<string, number> = {}

  return data.reduce((acc, item) => {
    if (
      item.style &&
      headingLevels.includes(item.style) &&
      (item._type === "block" || !!item.children)
    ) {
      const text = portableToPlain(item)
      const anchor = generateHeadingSlug(text, idCount)

      const newNavItem: ITableOfContentsItem = {
        title: (item.children as { text: string }[])[0].text,
        anchor,
        level: Number(item.style.replace("h", "")),
      }

      return [...acc, newNavItem]
    }

    if (
      item.children &&
      item.children[0]._type === "span" &&
      ["h2", "h3"].includes(item.children[0].marks[0])
    ) {
      const element = item.children[0]
      const text = element.text
      const anchor = generateHeadingSlug(text, idCount)

      const newNavItem: ITableOfContentsItem = {
        title: text,
        anchor,
        level: Number(element.marks[0].replace("h", "")),
      }

      return [...acc, newNavItem]
    }

    return acc
  }, [] as ITableOfContentsItem[])
}
