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

  const current = snippets.find((s) => s.label === selected) ?? snippets[0]

  return (
    <div className="relative flex aspect-[4/4] w-full min-w-0 flex-col overflow-hidden rounded-xl min-[460px]:aspect-[4/3] sm:aspect-[640/374]">
      <McpSnippetBg />

      <div className="relative flex min-w-0 shrink-0 items-center justify-between gap-2 py-2 pr-2.25 pl-4 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-linear-to-r after:from-transparent after:via-foreground/12 after:to-transparent">
        <div className="flex shrink-0 items-center gap-3">
          <span className="size-2.5 rounded-full bg-[#FF605C]" />
          <span className="size-2.5 rounded-full bg-[#FFBD44]" />
          <span className="size-2.5 rounded-full bg-[#00CA4E]" />
        </div>

        <div className="flex min-w-0 flex-1 justify-end">
          <SelectPrimitive.Root value={selected} onValueChange={setSelected}>
            <SelectPrimitive.Trigger
              aria-label="Select MCP client"
              className="group relative inline-flex h-7 w-[9.625rem] max-w-full min-w-0 items-center justify-between gap-2 overflow-hidden rounded-[0.25rem] border border-[rgba(229,204,255,0.12)] bg-white/5 px-2.5 text-sm leading-none whitespace-nowrap text-foreground focus-visible:z-1 [&>span]:truncate"
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
                className="z-50 w-[var(--radix-select-trigger-width)] max-w-[9.625rem] min-w-0 overflow-hidden rounded-[0.25rem]"
              >
                <SelectPrimitive.Viewport className="flex flex-col">
                  {snippets.map((snippet) => (
                    <SelectPrimitive.Item
                      key={snippet.label}
                      value={snippet.label}
                      className={cn(
                        "-mb-px flex cursor-pointer items-center justify-between gap-1.5 border border-[#252534] bg-[#111018] pt-1.5 pr-2.5 pb-2 pl-2.5 text-sm leading-none tracking-tighter whitespace-nowrap text-[#efeff0] outline-hidden transition-colors select-none focus-visible:ring-0 focus-visible:ring-offset-0",
                        "first:rounded-t-[0.25rem] last:mb-0 last:rounded-b-[0.25rem]",
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
      </div>

      <div
        className={cn(
          "show-linenumbers scrollbar-hidden relative min-h-0 min-w-0 flex-1 overflow-y-auto pb-4 outline-none",
          "[&_.shiki]:!bg-transparent",
          "[&_.shiki_span.line]:!bg-transparent",
          "[&_[data-slot=scroll-area-viewport]]:outline-none"
        )}
        tabIndex={-1}
      >
        {current.node}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-b from-transparent to-[#0b0a12]"
        aria-hidden
      />

      <button
        className={cn(
          "absolute top-[2.875rem] right-2.25 flex size-7 items-center justify-center rounded-[0.25rem] border border-[rgba(229,204,255,0.12)] bg-white/5 text-muted-foreground transition-colors hover:text-foreground/80 focus-visible:z-1",
          isCopied && "text-foreground/80"
        )}
        type="button"
        onClick={() => handleCopy(current.raw)}
        disabled={isCopied}
        aria-label={isCopied ? "Copied" : "Copy snippet"}
      >
        {isCopied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  )
}

export default McpConfigSelect
