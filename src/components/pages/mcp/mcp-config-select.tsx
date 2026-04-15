"use client"

import { ReactNode, useState } from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"

import McpSnippetBg from "./snippet-bg"

export interface IMcpConfigSnippet {
  label: string
  node: ReactNode
  raw: string
}

interface IMcpConfigSelectProps {
  snippets: IMcpConfigSnippet[]
  defaultLabel?: string
}

function McpConfigSelect({ snippets, defaultLabel }: IMcpConfigSelectProps) {
  const initial =
    snippets.find((s) => s.label === defaultLabel)?.label ?? snippets[0].label
  const [selected, setSelected] = useState(initial)
  const { isCopied, handleCopy } = useCopyToClipboard(3000)

  const current =
    snippets.find((s) => s.label === selected) ?? snippets[0]

  return (
    <div className="relative flex aspect-[4/3] w-full flex-col overflow-hidden rounded-xl sm:aspect-[640/374]">
      <McpSnippetBg />

      <div className="relative flex shrink-0 items-center justify-between py-2 pr-2.25 pl-4 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-linear-to-r after:from-transparent after:via-foreground/12 after:to-transparent">
        <div className="flex items-center gap-3">
          <span className="size-2.5 rounded-full bg-[#FF605C]" />
          <span className="size-2.5 rounded-full bg-[#FFBD44]" />
          <span className="size-2.5 rounded-full bg-[#00CA4E]" />
        </div>

        <SelectPrimitive.Root value={selected} onValueChange={setSelected}>
          <SelectPrimitive.Trigger
            aria-label="Select MCP client"
            className="group relative inline-flex h-7 w-[9.625rem] items-center justify-between gap-2 overflow-hidden rounded-sm border border-[rgba(229,204,255,0.12)] bg-white/5 px-2.5 text-sm leading-none whitespace-nowrap text-foreground focus-visible:z-1 [&>span]:truncate"
          >
            <SelectPrimitive.Value>{selected}</SelectPrimitive.Value>
            <SelectPrimitive.Icon asChild>
              <ChevronDown className="size-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              position="popper"
              sideOffset={6}
              align="end"
              className="z-50 w-[9.625rem] overflow-hidden rounded-[4px]"
            >
              <SelectPrimitive.Viewport className="flex flex-col">
                {snippets.map((snippet) => (
                  <SelectPrimitive.Item
                    key={snippet.label}
                    value={snippet.label}
                    className={cn(
                      "-mb-px flex cursor-pointer items-center justify-between gap-1.5 border border-[#252534] bg-[#111018] pt-[6px] pr-[10px] pb-[8px] pl-[10px] text-[14px] leading-none tracking-[-0.02em] whitespace-nowrap text-[#efeff0] outline-hidden transition-colors select-none focus-visible:ring-0 focus-visible:ring-offset-0",
                      "first:rounded-t-[4px] last:mb-0 last:rounded-b-[4px]",
                      "data-[highlighted]:bg-[#1a1825]"
                    )}
                  >
                    <SelectPrimitive.ItemText>
                      {snippet.label}
                    </SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator>
                      <Check className="size-4 text-[#efeff0]" aria-hidden />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      </div>

      <div
        tabIndex={-1}
        className={cn(
          "show-linenumbers relative min-h-0 flex-1 overflow-y-auto pb-4 outline-none",
          "[&_.shiki]:!bg-transparent",
          "[&_.shiki_span.line]:!bg-transparent",
          "[&_figure.code-block>div]:pr-0",
          "[&_figure.code-block_button]:[display:none!important]",
          "[&_[data-slot=scroll-area-viewport]]:outline-none"
        )}
      >
        {current.node}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-b from-transparent to-[#0b0a12]"
      />

      <button
        type="button"
        onClick={() => handleCopy(current.raw)}
        disabled={isCopied}
        aria-label={isCopied ? "Copied" : "Copy snippet"}
        className={cn(
          "absolute top-[2.875rem] right-2.25 flex size-7 items-center justify-center rounded-sm border border-[rgba(229,204,255,0.12)] bg-white/5 text-muted-foreground transition-colors hover:text-foreground/80 focus-visible:z-1",
          isCopied && "text-foreground/80"
        )}
      >
        {isCopied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  )
}

export default McpConfigSelect
