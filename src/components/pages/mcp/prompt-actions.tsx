"use client"

import { useState, type ComponentType } from "react"
import { DropdownMenu } from "radix-ui"
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  MessageCircle,
  Sparkles,
  SquareCode,
} from "lucide-react"

import { cn } from "@/lib/utils"
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"

interface IPromptActionsProps {
  prompt: string
}

interface IPromptTarget {
  id: string
  label: string
  href: (encodedPrompt: string) => string
  icon: ComponentType<{ className?: string }>
}

const PROMPT_TARGETS: IPromptTarget[] = [
  {
    id: "chatgpt",
    label: "Open in ChatGPT",
    href: (encodedPrompt) => `https://chatgpt.com/?q=${encodedPrompt}`,
    icon: MessageCircle,
  },
  {
    id: "claude",
    label: "Open in Claude",
    href: (encodedPrompt) => `https://claude.ai/new?q=${encodedPrompt}`,
    icon: Sparkles,
  },
  {
    id: "cursor",
    label: "Open in Cursor",
    href: (encodedPrompt) =>
      `https://cursor.com/link/prompt?text=${encodedPrompt}`,
    icon: SquareCode,
  },
]

function PromptActions({ prompt }: IPromptActionsProps) {
  const { isCopied, handleCopy } = useCopyToClipboard(2000)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const encodedPrompt = encodeURIComponent(prompt)

  return (
    <div
      className={cn(
        "absolute top-[0.9375rem] right-4 inline-flex flex-col items-end",
        isMenuOpen ? "z-30" : "z-10"
      )}
    >
      <div className="inline-flex">
        <button
          type="button"
          onClick={() => handleCopy(prompt)}
          className="inline-flex size-7 items-center justify-center rounded-l-sm border border-r-0 border-border bg-background/30 text-muted-foreground transition-colors hover:text-foreground focus-visible:z-1"
          aria-label={isCopied ? "Prompt copied" : "Copy prompt"}
        >
          {isCopied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>

        <DropdownMenu.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenu.Trigger
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-r-sm border border-border bg-background/30 text-muted-foreground transition-colors hover:text-foreground focus-visible:z-1",
              "data-[state=open]:text-foreground"
            )}
            aria-label="Open prompt actions"
          >
            <ChevronDown className="size-3.5 transition-transform duration-200 ease-out data-[state=open]:rotate-180 group-data-[state=open]:rotate-180" />
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 flex min-w-[11.875rem] flex-col rounded-md border border-border bg-background outline-none"
            >
              {PROMPT_TARGETS.map((target, index) => {
                const Icon = target.icon
                const isLast = index === PROMPT_TARGETS.length - 1

                return (
                  <DropdownMenu.Item
                    key={target.id}
                    asChild
                    onPointerMove={(e) => e.preventDefault()}
                    onPointerLeave={(e) => e.preventDefault()}
                  >
                    <a
                      href={target.href(encodedPrompt)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={cn(
                        "inline-flex cursor-pointer items-center gap-2 border-border px-2 py-2 pr-4 text-sm leading-none tracking-tight text-foreground outline-none transition-colors hover:bg-gray-2 focus-visible:bg-gray-2 data-[highlighted]:bg-gray-2",
                        !isLast && "border-b"
                      )}
                    >
                      <span className="inline-flex size-7 items-center justify-center rounded-sm border border-border bg-gray-1 text-muted-foreground">
                        <Icon className="size-4" />
                      </span>
                      <span className="inline-flex items-center gap-1">
                        {target.label}
                        <span className="inline-flex size-3.5 items-center justify-center rounded-[2px] bg-gray-2 text-muted-foreground">
                          <ArrowUpRight className="size-2.5" />
                        </span>
                      </span>
                    </a>
                  </DropdownMenu.Item>
                )
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  )
}

export default PromptActions
