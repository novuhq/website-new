import { DocumentsIcon, TagsIcon, UsersIcon } from "@sanity/icons"
import type { StructureResolver } from "sanity/structure"

import blogStructure from "./blog"
import changelogStructure from "./changelog"
import customersStructure from "./customers"
import templatesStructure from "./templates"

const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Base")
    .items([
      templatesStructure(S, context),
      blogStructure(S, context),
      changelogStructure(S, context),
      customersStructure(S, context),
      S.divider(),
      S.listItem()
        .title("Static pages")
        .icon(DocumentsIcon)
        .child(S.documentTypeList("staticPage").title("All Pages")),
      S.listItem()
        .title("Careers")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("Careers")
            .items([
              S.listItem()
                .title("Open roles")
                .icon(DocumentsIcon)
                .child(S.documentTypeList("careerJob").title("Open Roles")),
              S.listItem()
                .title("Candidate applications")
                .icon(DocumentsIcon)
                .child(
                  S.documentTypeList("candidateApplication").title(
                    "Candidate Applications"
                  )
                ),
            ])
        ),
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
