import { SchemaTypeDefinition } from "sanity"

import changelog from "./pages/changelog"
import customer from "./pages/customer"
import customersPage from "./pages/customers"
import pricing from "./pages/pricing"
import shared from "./shared"

const PAGE_TYPES = [...changelog, ...customersPage, ...customer, ...pricing]

const SHARED_TYPES = [...shared]

export const schemaTypes = [
  ...PAGE_TYPES,
  ...SHARED_TYPES,
] as SchemaTypeDefinition[]
