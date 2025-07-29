import React from "react"
import clsx from "clsx"
import parse from "html-react-parser"
import { BundledLanguage } from "shiki/langs"

import { ICodeBlock } from "@/types/common"
import { highlight } from "@/lib/shiki"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import "@/styles/shiki.css"

import CodeBlockWrapper from "./code-block-wrapper"

interface CodeChildProps {
  className?: string
  children?: string
  fileName?: string
  highlightedLines?: string
}

interface CodeBlockProps extends ICodeBlock {
  className?: string
  as?: "figure" | "div"
  children?: React.ReactElement<CodeChildProps> | React.ReactNode
}

async function CodeBlock({
  language,
  as = "figure",
  code = "",
  className,
  fileName,
  children,
  highlightedLines,
}: CodeBlockProps) {
  const childrenElement = React.isValidElement(children)
    ? (children as React.ReactElement<CodeChildProps>)
    : null

  const resolvedLanguage =
    childrenElement?.props?.className?.replace("language-", "") ||
    language ||
    "bash"

  const resolvedCode =
    code.trim() || childrenElement?.props?.children?.trim() || ""
  const resolvedFileName = fileName || childrenElement?.props?.fileName
  const resolvedHighlightedLines =
    highlightedLines || childrenElement?.props?.highlightedLines
  const html = await highlight(
    resolvedCode,
    resolvedLanguage.toLowerCase() as BundledLanguage,
    resolvedHighlightedLines
  )

  const countLines = html.split("\n").length

  return (
    <CodeBlockWrapper className={className} fileName={resolvedFileName} as={as}>
      <ScrollArea className="w-full">
        <div
          className={clsx(
            "px-4 text-left font-mono text-sm",
            `language-${resolvedLanguage}`,
            countLines > 1 ? "py-4" : "py-3.5"
          )}
        >
          {parse(html)}
        </div>
        <ScrollBar className="invisible" orientation="horizontal" />
      </ScrollArea>
    </CodeBlockWrapper>
  )
}

export default CodeBlock
