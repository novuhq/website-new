import { ROUTE } from "@/constants/routes"

export function getAgentTemplateUrl(templateId: string) {
  const url = new URL(String(ROUTE.connectApp))
  url.searchParams.set("agentTemplateId", templateId)
  return url.toString()
}
