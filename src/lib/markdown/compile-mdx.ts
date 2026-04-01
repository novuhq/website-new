import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"

import { getIntegrationComponents } from "@/components/content/get-integration-components"

export async function compileIntegrationMdx(source: string) {
  const components = getIntegrationComponents()

  const { content } = await compileMDX({
    source,
    components,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  })

  return { content }
}
