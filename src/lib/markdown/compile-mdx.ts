import { createElement } from "react"
import * as runtime from "react/jsx-runtime"

import { evaluate } from "@mdx-js/mdx"
import remarkGfm from "remark-gfm"

import { getIntegrationComponents } from "@/components/content/get-integration-components"

export async function compileIntegrationMdx(source: string) {
  const components = getIntegrationComponents()

  const { default: Content } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
  })

  const content = createElement(Content, { components })

  return { content }
}
