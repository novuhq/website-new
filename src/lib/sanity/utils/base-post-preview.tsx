import { format } from "date-fns"

export const basePostPreview = {
  select: {
    title: "title",
    publishedAt: "publishedAt",
    cover: "cover",
    isFeatured: "isFeatured",
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prepare(selection: Record<string, any>) {
    const { title, publishedAt, cover, isFeatured } = selection
    const dateSegment = publishedAt
      ? format(new Date(publishedAt), "yyyy/MMMM")
      : "No date"

    return {
      title: isFeatured ? `★ ${title}` : title,
      media: cover,
      subtitle: `Published: ${dateSegment}${isFeatured ? " (Featured)" : ""}`,
    }
  },
}
