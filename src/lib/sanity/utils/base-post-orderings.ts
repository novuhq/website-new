import { SortOrdering } from "sanity"

export const basePostOrderings: SortOrdering[] = [
  {
    title: "Featured First, Then Publishing Date",
    name: "featuredFirst",
    by: [
      { field: "isFeatured", direction: "desc" },
      { field: "publishedAt", direction: "desc" },
    ],
  },
  {
    name: "publishingDateAsc",
    title: "Publishing date New → Old",
    by: [
      {
        field: "publishedAt",
        direction: "asc",
      },
      {
        field: "title",
        direction: "asc",
      },
    ],
  },
  {
    name: "publishingDateDesc",
    title: "Publishing date Old → New",
    by: [
      {
        field: "publishedAt",
        direction: "desc",
      },
      {
        field: "title",
        direction: "asc",
      },
    ],
  },
]
