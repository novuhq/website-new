import { Route } from "next"
import { ROUTE } from "@/constants/routes"

/**
 * Enum for SchemaTypes that should display a preview button in the view form
 */
// eslint-disable-next-line no-shadow
export enum DraftsSchemaTypes {
  CHANGELOG_POST = "changelogPost",
  CUSTOMERS = "customers",
  CUSTOMER = "customer",
  PRICING = "pricing",
}

/**
 * Map SchemaType with a preview to its corresponding route
 */
export const PREVIEW_ROUTES: Record<DraftsSchemaTypes, URL | Route<string>> = {
  [DraftsSchemaTypes.CHANGELOG_POST]: ROUTE.changelog,
  [DraftsSchemaTypes.CUSTOMERS]: ROUTE.customers,
  [DraftsSchemaTypes.CUSTOMER]: ROUTE.customers,
  [DraftsSchemaTypes.PRICING]: ROUTE.pricing,
}
