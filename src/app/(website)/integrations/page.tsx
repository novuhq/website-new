import { redirect } from "next/navigation"
import { ROUTE } from "@/constants/routes"

export default function IntegrationsPage() {
  redirect(`${ROUTE.integrations}/channels`)
}
