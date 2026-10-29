import type {
  IMenuHeaderContent,
  IMenuHeaderItem,
  THeaderMenuVariant,
} from "@/types/common"

/** A header item renders a dropdown only with both a variant and content. */
export function hasDropdown(item: IMenuHeaderItem): item is IMenuHeaderItem & {
  variant: THeaderMenuVariant
  content: IMenuHeaderContent[]
} {
  return Boolean(item.variant && item.content && item.content.length > 0)
}
