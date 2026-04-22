import path from "path"

import { cache, createElement, type ComponentType } from "react"
import type { MDXComponents } from "mdx/types"

import { INTEGRATIONS_DIR } from "@/lib/integrations/paths"

import { getIntegrationComponents } from "@/components/content/get-integration-components"

export interface ContentModule {
  default: ComponentType<{ components?: MDXComponents }>
  metadata?: Record<string, unknown>
}

function resolveIntegrationPath(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\/+/, "")
  const absolutePath = path.resolve(INTEGRATIONS_DIR, normalized)
  const baseWithSep = INTEGRATIONS_DIR + path.sep

  if (
    absolutePath !== INTEGRATIONS_DIR &&
    !absolutePath.startsWith(baseWithSep)
  ) {
    throw new Error(
      `Integration path "${relativePath}" escapes the content directory.`
    )
  }

  return normalized
}

const loadIntegrationModule = cache(async function loadIntegrationModule(
  relativePath: string
): Promise<ContentModule> {
  const safePath = resolveIntegrationPath(relativePath)

  return (await import(
    `@/content/integrations/${safePath}`
  )) as ContentModule
})

export async function compileIntegrationMdx(
  relativePath: string
): Promise<{ content: ReturnType<typeof createElement> }> {
  const contentModule = await loadIntegrationModule(relativePath)
  const Content = contentModule.default
  const components = getIntegrationComponents()

  return {
    content: createElement(Content, {
      components: components as MDXComponents,
    }),
  }
}
