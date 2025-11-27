import { TagsIcon, UsersIcon } from "@sanity/icons"
import type { StructureResolver } from "sanity/structure"

import blogStructure from "./blog"
import changelogStructure from "./changelog"
import customersStructure from "./customers"

const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Base")
    .items([
      blogStructure(S, context),
      changelogStructure(S, context),
      customersStructure(S, context),
      S.divider(),
      S.listItem()
        .title("Authors")
        .icon(UsersIcon)
        .child(S.documentTypeList("author").title("All Authors")),
      S.listItem()
        .title("Tags")
        .icon(TagsIcon)
        .child(S.documentTypeList("tag").title("All Tags")),
    ])

export default structure
