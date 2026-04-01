import rehypeSanitize from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

/**
 * Markdown → HTML via the same unified/remark/rehype stack as typical remark pipelines
 * (aligned with mindbeam-next: remark + remark-gfm, no `marked`).
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const trimmed = markdown.trim()
  if (!trimmed) {
    return ""
  }

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(trimmed)

  return String(file)
}
