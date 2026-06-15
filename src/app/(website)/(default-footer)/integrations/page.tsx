import { redirect } from "next/navigation"
import { ROUTE } from "@/constants/routes"

// Primary redirect is in next.config.ts (runs at edge).
// This page-level redirect is a fallback for direct SSR hits.
export default function IntegrationsPage() {
  redirect(`${ROUTE.integrations}/channels`)
}
