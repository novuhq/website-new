import { SchemaTypeDefinition } from "sanity"

import blog from "./pages/blog"
import careers from "./pages/careers"
import changelog from "./pages/changelog"
import customer from "./pages/customer"
import customersPage from "./pages/customers"
import staticPage from "./pages/static"
import templates from "./pages/templates"
import shared from "./shared"

const PAGE_TYPES = [
  ...templates,
  ...changelog,
  ...customersPage,
  ...customer,
  ...careers,
  ...blog,
  ...staticPage,
]

const SHARED_TYPES = [...shared]

export const schemaTypes = [
  ...PAGE_TYPES,
  ...SHARED_TYPES,
] as SchemaTypeDefinition[]
