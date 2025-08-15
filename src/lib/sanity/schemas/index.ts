import { SchemaTypeDefinition } from "sanity"

import changelog from "./pages/changelog"
import customers from "./pages/customers"
import shared from "./shared"

const PAGE_TYPES = [...changelog, ...customers]

const SHARED_TYPES = [...shared]

export const schemaTypes = [
  ...PAGE_TYPES,
  ...SHARED_TYPES,
] as SchemaTypeDefinition[]
