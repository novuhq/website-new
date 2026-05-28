import { SchemaTypeDefinition } from "sanity"

import blog from "./pages/blog"
import changelog from "./pages/changelog"
import customer from "./pages/customer"
import customersPage from "./pages/customers"
import howTo from "./pages/how-to"
import staticPage from "./pages/static"
import templates from "./pages/templates"
import shared from "./shared"

const PAGE_TYPES = [
  ...templates,
  ...changelog,
  ...customersPage,
  ...customer,
  ...howTo,
  ...blog,
  ...staticPage,
]

const SHARED_TYPES = [...shared]

export const schemaTypes = [
  ...PAGE_TYPES,
  ...SHARED_TYPES,
] as SchemaTypeDefinition[]
