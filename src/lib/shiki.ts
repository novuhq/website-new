import {
  transformerNotationDiff,
  transformerNotationHighlight,
} from "@shikijs/transformers"
import {
  BundledLanguage,
  bundledLanguages,
  BundledTheme,
  codeToHtml,
  getSingletonHighlighter,
  HighlighterGeneric,
} from "shiki"

import { type ICodeBlock } from "@/types/common"

function isBundledLanguage(lang: string): lang is BundledLanguage {
  return Object.keys(bundledLanguages).includes(lang as BundledLanguage)
}

let highlighter: HighlighterGeneric<BundledLanguage, BundledTheme> | null = null

const parseHighlightLines = (meta: string): number[] => {
  const highlights: number[] = []

  meta.split(",").forEach((segment) => {
    segment = segment.trim()

    if (segment.includes("-")) {
      const [start, end] = segment.split("-").map(Number)
      for (let i = start; i <= end; i++) {
        highlights.push(i)
      }
    } else {
      highlights.push(Number(segment))
    }
  })

  return highlights
}

export async function highlight(
  code: string,
  lang: BundledLanguage = "bash",
  highlightedLines?: string
): Promise<string> {
  if (!isBundledLanguage(lang)) {
    lang = "bash"
  }

  if (!highlighter) {
    highlighter = await getSingletonHighlighter({
      langs: [lang],
    })
  }

  await highlighter.loadLanguage(lang)

  const html = codeToHtml(code, {
    lang,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    transformers: [
      transformerNotationDiff({
        matchAlgorithm: "v3",
      }),
      transformerNotationHighlight({
        matchAlgorithm: "v3",
      }),
      {
        pre(node) {
          node.properties["data-language"] = lang
        },
        code(node) {
          node.properties.class = "grid"
        },
        line(node, line) {
          node.properties["data-line"] = line

          if (highlightedLines) {
            const highlights = parseHighlightLines(String(highlightedLines))

            highlights.forEach((item) => {
              if (item === line) {
                node.properties["class"] += " highlighted"
              }
            })
          }
        },
      },
    ],
  })

  return html
}

const ECHO_CODE_THEME = {
  name: "echo-code",
  type: "dark" as const,
  colors: { "editor.background": "#131725" },
  tokenColors: [
    {
      scope: [
        "keyword",
        "storage.type",
        "keyword.control",
        "variable.language",
      ],
      settings: { foreground: "#FFE14D" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "entity.name.tag",
        "support.class.component",
      ],
      settings: { foreground: "#DD99FF" },
    },
    {
      scope: ["string", "string.quoted", "meta.jsx.children"],
      settings: { foreground: "#00D5FF" },
    },
    {
      scope: [
        "punctuation",
        "meta.brace",
        "keyword.operator",
        "meta.tag.attributes",
      ],
      settings: { foreground: "#FFFFFF" },
    },
    {
      scope: [
        "comment",
        "comment.line",
        "comment.block",
        "punctuation.definition.comment",
      ],
      settings: { foreground: "#666666" },
    },
    {
      scope: ["variable", "variable.other", "variable.parameter"],
      settings: { foreground: "#FFFFFF" },
    },
    {
      scope: ["entity.name.type", "support.type"],
      settings: { foreground: "#DD99FF" },
    },
  ],
}

export async function highlightEchoCode(code: string): Promise<string> {
  if (!highlighter) {
    highlighter = await getSingletonHighlighter({
      langs: ["javascript"],
    })
  }

  await highlighter.loadLanguage("javascript")

  return codeToHtml(code, {
    lang: "javascript",
    theme: ECHO_CODE_THEME,
    transformers: [
      {
        code(node) {
          node.properties.class = "grid"
        },
        line(node, line) {
          node.properties["data-line"] = line
        },
      },
    ],
  })
}

export async function getHighlightedCodeArray(items: ICodeBlock[]) {
  let highlightedItems: string[] = []

  try {
    highlightedItems = await Promise.all(
      items.map(async ({ code, language }) => {
        const highlightedCode = await highlight(code, language)

        return highlightedCode
      })
    )
  } catch (error) {
    console.error("Error highlighting code:", error)
  }

  return highlightedItems
}
