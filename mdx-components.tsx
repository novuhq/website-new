import type { MDXComponents } from "mdx/types"

import { getIntegrationComponents } from "@/components/content/get-integration-components"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...getIntegrationComponents(), ...components }
}
