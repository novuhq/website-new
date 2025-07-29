import { SchemaTypeDefinition } from "sanity"

import changelog from "./pages/changelog"
import shared from "./shared"

const PAGE_TYPES = [...changelog]

const SHARED_TYPES = [...shared]

export const schemaTypes = [
  ...PAGE_TYPES,
  ...SHARED_TYPES,
] as SchemaTypeDefinition[]
