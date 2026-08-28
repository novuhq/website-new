"use client"

import { useState } from "react"
import { ArrowRight, Globe, RotateCcw } from "lucide-react"

import { cn } from "@/lib/utils"
import type { BrandProfile } from "@/lib/site-brand"
import {
  VERTICAL_PRESETS,
  buildInstallPrompt,
  type PreviewRow,
} from "@/data/pages/agent-preview"
import { Button } from "@/components/ui/button"
import CopyPromptButton from "@/components/pages/home/copy-prompt-button"
import {
  AgentChatProvider,
  AgentChatWidget,
} from "@/components/pages/channels/agent-chat-showcase"
import AgentPreviewPlayer from "@/components/pages/channels/agent-preview-player"

const DEFAULT_ACCENT = "#8b5cf6"

// Fictional demo data for the default (non-personalized) view. Not real customers.
const DEFAULT_ROWS: PreviewRow[] = [
  { cells: ["Brightloom Labs", "AR", "Nov 3"], status: { label: "on track", tone: "good" }, dot: "#a855f7" },
  { cells: ["Northwind Retail", "MK", "Dec 12"], status: { label: "on track", tone: "good" }, dot: "#3b82f6" },
  { cells: ["Arbor Systems", "JL", "Dec 28"], status: { label: "on track", tone: "good" }, dot: "#22c55e" },
  { cells: ["Juniper Analytics", "SP", "Jan 9"], status: { label: "at risk", tone: "warn" }, dot: "#f59e0b" },
]

const DEFAULT_PROMPT = `Add Novu Web Chat to my app so end users can chat with my agent in-product.

Use @novu/react (useAgentChat + NovuProvider) following the docs at https://docs.novu.co/agents/channels/agent-chat. Build a production-quality chat UI with AI Elements (https://elements.ai-sdk.dev): render the message list from message.parts, a composer, reasoning and tool parts, and tool approvals via respondToAction. Match my app's existing styling and design system. Do not dump raw JSON.

Wrap the UI in <NovuProvider> for the signed-in end user: read applicationIdentifier from an environment variable, pass the authenticated user's id as subscriberId from my existing auth, and pass subscriberHash if my app enables Novu subscriber HMAC. Place the chat in a sensible spot and add no unnecessary wrappers.`

type Status = "idle" | "loading" | "error" | "preview"

function ProductUI({
  logo,
  accent,
  label,
  subLabel,
  columns,
  rows,
}: {
  logo: string | null
  accent: string
  label: string
  subLabel: string
  columns: [string, string, string, string]
  rows: PreviewRow[]
}) {
  return (
    <div className="hidden flex-1 flex-col lg:flex">
      <div className="flex flex-1">
        {/* Slim app sidebar */}
        <div className="flex w-14 flex-col items-center gap-4 border-r border-gray-20 py-5">
          <span
            className="flex size-8 items-center justify-center overflow-hidden rounded-lg font-mono text-sm font-medium text-white"
            style={logo ? { background: "#000" } : { backgroundColor: accent }}
          >
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="" className="size-full object-contain" />
            ) : (
              label.slice(0, 1).toUpperCase()
            )}
          </span>
          <span className="h-1.5 w-6 rounded-full" style={{ backgroundColor: `${accent}55` }} />
          <span className="h-1.5 w-6 rounded-full bg-gray-20" />
          <span className="h-1.5 w-6 rounded-full bg-gray-20" />
        </div>

        {/* Main content: the data view the agent works on */}
        <div className="flex-1 p-6">
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg font-medium tracking-tighter text-white">{label}</h3>
            <span className="font-mono text-[0.7rem] text-gray-60">{subLabel}</span>
          </div>
          <div className="mt-5 grid grid-cols-[1.6fr_0.6fr_0.8fr_0.8fr] gap-x-3 border-b border-gray-20 pb-2 font-mono text-[0.62rem] tracking-[0.12em] text-gray-60 uppercase">
            {columns.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          <ul className="mt-1">
            {rows.map((r) => (
              <li
                key={r.cells[0]}
                className="grid grid-cols-[1.6fr_0.6fr_0.8fr_0.8fr] items-center gap-x-3 border-b border-gray-20/60 py-3 text-sm"
              >
                <span className="flex items-center gap-2.5 text-gray-90">
                  <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: r.dot }} />
                  {r.cells[0]}
                </span>
                <span className="font-mono text-xs text-gray-60">{r.cells[1]}</span>
                <span className="text-gray-70">{r.cells[2]}</span>
                <span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-mono text-[0.65rem]",
                      r.status.tone === "warn"
                        ? "bg-amber-400/10 text-amber-300"
                        : "bg-emerald-400/10 text-emerald-300"
                    )}
                  >
                    {r.status.label}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/**
 * Hero showcase: the agent docked as a side panel next to a product UI, inside
 * browser chrome. Visitors can paste their own site to see the agent themed to
 * their brand with mock data, animated live via Remotion, and copy a prompt to
 * build it in their own app with Claude Code or Codex.
 */
export default function AgentInProduct({ className }: { className?: string }) {
  const [url, setUrl] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [brand, setBrand] = useState<BrandProfile | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isPreview = status === "preview" && brand !== null
  const accent = (isPreview && brand?.accent) || DEFAULT_ACCENT
  const preset = VERTICAL_PRESETS[brand?.vertical ?? "saas"]

  const domain = isPreview ? brand!.domain : "app.yourproduct.com"
  const productLabel = isPreview ? preset.productLabel : "Renewals"
  const productSub = isPreview ? preset.subLabel : "Q4 pipeline"
  const columns: [string, string, string, string] = isPreview
    ? preset.columns
    : ["Account", "Owner", "Renewal", "Status"]
  const rows = isPreview ? preset.rows : DEFAULT_ROWS

  const installPrompt =
    isPreview && brand
      ? buildInstallPrompt({ name: brand.name, domain: brand.domain, vertical: brand.vertical })
      : DEFAULT_PROMPT

  async function personalize() {
    const value = url.trim()
    if (!value || status === "loading") return
    setStatus("loading")
    setError(null)
    try {
      const res = await fetch("/api/agent-preview", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: value }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data?.message || "Could not read that site")
        setStatus("error")
        return
      }
      setBrand(data.brand as BrandProfile)
      setStatus("preview")
    } catch {
      setError("Something went wrong. Try another URL.")
      setStatus("error")
    }
  }

  function reset() {
    setStatus("idle")
    setBrand(null)
    setError(null)
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="overflow-hidden rounded-xl border border-gray-20 bg-[#05050b] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-gray-20 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-gray-30" />
            <span className="size-2.5 rounded-full bg-gray-30" />
            <span className="size-2.5 rounded-full bg-gray-30" />
          </div>
          <div className="mx-auto flex items-center gap-2 rounded-md border border-gray-20 bg-black px-3 py-1 font-mono text-[0.7rem] text-gray-60">
            {domain}
          </div>
          <span className="font-mono text-[0.68rem] text-gray-60">
            {isPreview ? "your product" : "self-hosted"}
          </span>
        </div>

        {/* App body: product UI + docked agent */}
        <div className="flex h-[30rem] md:h-[34rem]">
          <ProductUI
            logo={isPreview ? brand!.logo : null}
            accent={accent}
            label={productLabel}
            subLabel={productSub}
            columns={columns}
            rows={rows}
          />

          {/* Docked agent panel: live agent by default, branded Remotion preview once personalized */}
          <div className="flex w-full flex-col border-gray-20 lg:w-[24rem] lg:border-l">
            {isPreview && brand ? (
              <AgentPreviewPlayer
                accent={accent}
                name={brand.name}
                logo={brand.logo}
                preset={preset}
              />
            ) : (
              <AgentChatProvider className="h-full">
                <AgentChatWidget
                  variant="panel"
                  emptyTitle="Ask the agent"
                  emptyDescription="It lives in the app and can act on what is on screen. This one is live, ask it anything about Novu Connect."
                  starters={[
                    "Review our renewals and flag anything at risk",
                    "Which channels can my agent reach?",
                    "How do I add this agent to my app?",
                  ]}
                />
              </AgentChatProvider>
            )}
          </div>
        </div>
      </div>

      {/* Control bar: personalize with your URL + copy prompt for a coding agent */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-20 bg-[#05050b] p-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-gray-20 bg-black px-3">
          <Globe className="size-4 shrink-0 text-gray-60" aria-hidden />
          <input
            type="text"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") personalize()
            }}
            placeholder="yourcompany.com"
            aria-label="Your website URL"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-gray-90 placeholder:text-gray-60 focus-visible:outline-none"
          />
          {isPreview && (
            <button
              type="button"
              onClick={reset}
              className="flex shrink-0 items-center gap-1 font-mono text-[0.7rem] text-gray-60 transition-colors hover:text-white"
            >
              <RotateCcw className="size-3" aria-hidden />
              reset
            </button>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            size="none"
            variant="default"
            onClick={personalize}
            disabled={status === "loading" || !url.trim()}
            className="h-10 rounded-md px-4 text-sm leading-none font-medium tracking-[-0.025em] normal-case"
          >
            {status === "loading" ? (
              "Reading your site..."
            ) : (
              <>
                See it in your product
                <ArrowRight className="ml-1.5 size-4" aria-hidden />
              </>
            )}
          </Button>
          <CopyPromptButton
            className="h-10 rounded-md px-4 text-sm leading-none font-medium tracking-[-0.025em] normal-case"
            copiedLabel="Copied"
            label="Copy for Claude / Codex"
            size="none"
            value={installPrompt}
            variant="outline"
          />
        </div>
      </div>

      {status === "error" && error && (
        <p className="px-1 text-sm text-red-1" role="status">
          {error}
        </p>
      )}
      {isPreview && brand && (
        <p className="px-1 font-mono text-xs text-gray-60">
          Showing a mock of <span className="text-gray-90">{brand.name}</span>. The agent, styled to
          your brand, docked in your product. Paste the prompt to build it for real.
        </p>
      )}
    </div>
  )
}
