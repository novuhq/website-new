"use client"

import { useState, type ReactElement, type SVGProps } from "react"
import { ArrowUpRight, Check, ChevronDown, Copy } from "lucide-react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"

interface IPromptActionsProps {
  prompt: string
}

interface IPromptTarget {
  id: string
  label: string
  href: (encodedPrompt: string) => string
  icon: (props: SVGProps<SVGSVGElement>) => ReactElement
}

function GptIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path
        d="M14.8481 6.54857C15.2111 5.45907 15.0861 4.26557 14.5056 3.27457C13.6326 1.75457 11.8776 0.972574 10.1636 1.34057C9.40108 0.481574 8.30558 -0.00692579 7.15708 7.42117e-05C5.40508 -0.00392579 3.85058 1.12407 3.31158 2.79107C2.18608 3.02157 1.21458 3.72607 0.646072 4.72457C-0.233428 6.24057 -0.0329275 8.15157 1.14208 9.45157C0.779072 10.5411 0.904072 11.7346 1.48458 12.7256C2.35758 14.2456 4.11258 15.0276 5.82658 14.6596C6.58858 15.5186 7.68458 16.0071 8.83308 15.9996C10.5861 16.0041 12.1411 14.8751 12.6801 13.2066C13.8056 12.9761 14.7771 12.2716 15.3456 11.2731C16.2241 9.75707 16.0231 7.84757 14.8486 6.54757L14.8481 6.54857ZM8.83408 14.9541C8.13258 14.9551 7.45308 14.7096 6.91458 14.2601C6.93908 14.2471 6.98158 14.2236 7.00908 14.2066L10.1951 12.3666C10.3581 12.2741 10.4581 12.1006 10.4571 11.9131V7.42157L11.8036 8.19907C11.8181 8.20607 11.8276 8.22007 11.8296 8.23607V11.9556C11.8276 13.6096 10.4881 14.9506 8.83408 14.9541ZM2.39208 12.2026C2.04058 11.5956 1.91408 10.8841 2.03458 10.1936C2.05808 10.2076 2.09958 10.2331 2.12908 10.2501L5.31508 12.0901C5.47658 12.1846 5.67658 12.1846 5.83858 12.0901L9.72808 9.84407V11.3991C9.72908 11.4151 9.72158 11.4306 9.70908 11.4406L6.48858 13.3001C5.05408 14.1261 3.22158 13.6351 2.39208 12.2026ZM1.55358 5.24807C1.90358 4.64007 2.45608 4.17507 3.11408 3.93357C3.11408 3.96107 3.11258 4.00957 3.11258 4.04357V7.72407C3.11158 7.91107 3.21158 8.08457 3.37408 8.17707L7.26358 10.4226L5.91708 11.2001C5.90358 11.2091 5.88658 11.2106 5.87158 11.2041L2.65058 9.34307C1.21908 8.51407 0.728572 6.68207 1.55358 5.24807ZM12.6166 7.82257L8.72708 5.57657L10.0736 4.79957C10.0871 4.79057 10.1041 4.78907 10.1191 4.79557L13.3401 6.65507C14.7741 7.48357 15.2656 9.31807 14.4371 10.7521C14.0866 11.3591 13.5346 11.8241 12.8771 12.0661V8.27557C12.8786 8.08857 12.7786 7.91557 12.6166 7.82257ZM13.9566 5.80557C13.9331 5.79107 13.8916 5.76607 13.8621 5.74907L10.6761 3.90907C10.5146 3.81457 10.3146 3.81457 10.1526 3.90907L6.26308 6.15507V4.60007C6.26208 4.58407 6.26958 4.56857 6.28208 4.55857L9.50258 2.70057C10.9371 1.87307 12.7711 2.36557 13.5981 3.80057C13.9476 4.40657 14.0741 5.11607 13.9556 5.80557H13.9566ZM5.53108 8.57707L4.18408 7.79957C4.16958 7.79257 4.16008 7.77857 4.15808 7.76257V4.04307C4.15908 2.38707 5.50258 1.04507 7.15858 1.04607C7.85908 1.04607 8.53708 1.29207 9.07558 1.74007C9.05108 1.75307 9.00908 1.77657 8.98108 1.79357L5.79508 3.63357C5.63208 3.72607 5.53208 3.89907 5.53308 4.08657L5.53108 8.57607V8.57707ZM6.26258 7.00007L7.99508 5.99957L9.72758 6.99957V9.00007L7.99508 10.0001L6.26258 9.00007V7.00007Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ClaudeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.13933 10.6367L6.286 8.872L6.33933 8.71867L6.286 8.63333H6.13333L5.60667 8.60133L3.808 8.55267L2.24867 8.488L0.738 8.40667L0.357333 8.326L0 7.856L0.0366667 7.62133L0.356667 7.40733L0.814 7.44733L1.82733 7.516L3.346 7.62133L4.44733 7.686L6.08 7.856H6.33933L6.376 7.75133L6.28667 7.686L6.218 7.62133L4.646 6.55733L2.94467 5.432L2.054 4.784L1.57133 4.45667L1.32867 4.14867L1.22333 3.47667L1.66067 2.99533L2.248 3.03533L2.398 3.076L2.99333 3.53333L4.26533 4.51733L5.926 5.73933L6.16933 5.942L6.266 5.87333L6.27867 5.82467L6.16933 5.642L5.266 4.01133L4.302 2.35133L3.87267 1.66333L3.75933 1.25067C3.71635 1.09213 3.69307 0.928899 3.69 0.764667L4.18867 0.0893333L4.464 0L5.128 0.0893333L5.408 0.332L5.82133 1.27467L6.48933 2.76067L7.526 4.78067L7.83 5.37933L7.992 5.934L8.05267 6.104H8.158V6.00667L8.24333 4.86933L8.40133 3.47267L8.55467 1.676L8.608 1.16933L8.85867 0.562667L9.35667 0.234667L9.746 0.421333L10.066 0.878L10.0213 1.174L9.83067 2.408L9.458 4.34333L9.21533 5.638H9.35667L9.51867 5.47667L10.1753 4.606L11.2767 3.23L11.7633 2.68333L12.33 2.08067L12.6947 1.79333H13.3833L13.89 2.546L13.6633 3.32333L12.954 4.22133L12.3667 4.98267L11.524 6.116L10.9973 7.02267L11.046 7.096L11.1713 7.08267L13.0753 6.67867L14.104 6.492L15.3313 6.282L15.8867 6.54067L15.9473 6.804L15.7287 7.342L14.416 7.666L12.8767 7.974L10.584 8.516L10.556 8.536L10.5887 8.57667L11.6213 8.674L12.0627 8.698H13.144L15.1573 8.848L15.684 9.196L16 9.62133L15.9473 9.94467L15.1373 10.358L14.044 10.0987L11.4913 9.492L10.6167 9.27267H10.4953V9.346L11.224 10.058L12.5613 11.2647L14.234 12.818L14.3187 13.2033L14.104 13.5067L13.8773 13.474L12.4073 12.3693L11.84 11.8713L10.556 10.7913H10.4707V10.9047L10.7667 11.3373L12.33 13.6847L12.4113 14.4047L12.298 14.64L11.8927 14.782L11.4473 14.7007L10.5313 13.4173L9.588 11.9727L8.826 10.6773L8.73267 10.7307L8.28333 15.5667L8.07267 15.8133L7.58667 16L7.182 15.6927L6.96733 15.1947L7.182 14.2107L7.44133 12.928L7.65133 11.908L7.842 10.6413L7.95533 10.22L7.94733 10.192L7.854 10.204L6.898 11.5153L5.44467 13.4787L4.294 14.7087L4.018 14.818L3.54 14.5713L3.58467 14.13L3.852 13.7373L5.444 11.7133L6.404 10.4587L7.024 9.73467L7.02 9.62933H6.98333L2.75467 12.3733L2.00133 12.4707L1.67667 12.1667L1.71733 11.6693L1.87133 11.5073L3.14333 10.6327L3.13933 10.6367Z"
        fill="currentColor"
      />
    </svg>
  )
}

function CursorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path
        d="M14.5906 3.61493L8.47653 0.0850327C8.2802 -0.0283442 8.03794 -0.0283442 7.84161 0.0850327L1.72788 3.61493C1.56283 3.71022 1.46094 3.88645 1.46094 4.07733V11.1954C1.46094 11.386 1.56283 11.5625 1.72788 11.6578L7.8419 15.1877C8.03823 15.3011 8.28049 15.3011 8.47682 15.1877L14.5908 11.6578C14.7559 11.5625 14.8578 11.3863 14.8578 11.1954V4.07733C14.8578 3.88674 14.7559 3.71022 14.5908 3.61493H14.5906ZM14.2065 4.36264L8.3043 14.5855C8.26441 14.6544 8.15908 14.6263 8.15908 14.5465V7.85264C8.15908 7.71888 8.0876 7.59516 7.97164 7.528L2.17478 4.18124C2.1059 4.14135 2.13402 4.03599 2.21382 4.03599H14.0182C14.1859 4.03599 14.2906 4.21769 14.2068 4.36294H14.2065V4.36264Z"
        fill="currentColor"
      />
    </svg>
  )
}

const PROMPT_TARGETS: IPromptTarget[] = [
  {
    id: "chatgpt",
    label: "Open in ChatGPT",
    href: (encodedPrompt) => `https://chatgpt.com/?q=${encodedPrompt}`,
    icon: GptIcon,
  },
  {
    id: "claude",
    label: "Open in Claude",
    href: (encodedPrompt) => `https://claude.ai/new?q=${encodedPrompt}`,
    icon: ClaudeIcon,
  },
  {
    id: "cursor",
    label: "Open in Cursor",
    href: (encodedPrompt) =>
      `https://cursor.com/link/prompt?text=${encodedPrompt}`,
    icon: CursorIcon,
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
          className="inline-flex size-7 items-center justify-center rounded-l-sm border border-r-0 border-border bg-background/30 text-muted-foreground transition-colors hover:text-foreground"
          aria-label={isCopied ? "Prompt copied" : "Copy prompt"}
        >
          {isCopied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>

        <DropdownMenuPrimitive.Root
          open={isMenuOpen}
          onOpenChange={setIsMenuOpen}
        >
          <DropdownMenuPrimitive.Trigger
            className={cn(
              "group inline-flex size-7 items-center justify-center rounded-r-sm border border-border bg-background/30 text-muted-foreground transition-colors hover:text-foreground",
              "data-[state=open]:text-foreground"
            )}
            aria-label="Open prompt actions"
          >
            <ChevronDown className="size-3.5 transition-transform duration-200 ease-out group-data-[state=open]:rotate-180" />
          </DropdownMenuPrimitive.Trigger>

          <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
              align="end"
              sideOffset={8}
              className="z-50 flex min-w-[11.875rem] flex-col rounded-md border border-border bg-background outline-none"
            >
              {PROMPT_TARGETS.map((target, index) => {
                const isLast = index === PROMPT_TARGETS.length - 1
                const Icon = target.icon

                return (
                  <DropdownMenuPrimitive.Item
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
                        "inline-flex cursor-pointer items-center gap-2 border-border px-2 py-2 pr-4 text-sm leading-none tracking-tight text-foreground transition-colors outline-none hover:bg-gray-2 data-[highlighted]:bg-gray-2",
                        !isLast && "border-b"
                      )}
                    >
                      <span className="inline-flex size-7 items-center justify-center rounded-sm border border-border bg-gray-1 text-muted-foreground">
                        <Icon className="size-4" />
                      </span>
                      <span className="inline-flex items-center gap-1">
                        {target.label}
                        <span className="inline-flex size-3.5 items-center justify-center rounded-sm bg-gray-2 text-muted-foreground">
                          <ArrowUpRight className="size-2.5" />
                        </span>
                      </span>
                    </a>
                  </DropdownMenuPrimitive.Item>
                )
              })}
            </DropdownMenuPrimitive.Content>
          </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Root>
      </div>
    </div>
  )
}

export default PromptActions
