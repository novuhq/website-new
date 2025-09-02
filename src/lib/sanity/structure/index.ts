import { UsersIcon } from "@sanity/icons"
import type { StructureResolver } from "sanity/structure"

import changelogStructure from "./changelog"
import customersStructure from "./customers"

const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Base")
    .items([
      changelogStructure(S, context),
      customersStructure(S, context),
      S.divider(),
      S.listItem()
        .title("Authors")
        .icon(UsersIcon)
        .child(S.documentTypeList("author").title("All Authors")),
    ])

export default structure
