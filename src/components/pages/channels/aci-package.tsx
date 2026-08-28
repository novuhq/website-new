import {
  ArrowDownIcon,
  Cpu,
  Fingerprint,
  Gauge,
  MessagesSquare,
  SendIcon,
  ShieldCheck,
  ZapIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

const SURFACES = [
  "Web Chat",
  "Slack",
  "Microsoft Teams",
  "iMessage",
  "WhatsApp",
  "Telegram",
  "Email",
]

const LAYERS = [
  {
    icon: Fingerprint,
    title: "Identity & subscribers",
    body: "Every user identified and secured with HMAC. No auth or user store to build.",
  },
  {
    icon: MessagesSquare,
    title: "One durable thread",
    body: "Context and history follow each user across every channel, on their own subscriber.",
  },
  {
    icon: SendIcon,
    title: "Delivery that lands",
    body: "Retries, fallbacks, and deliverability from four years of notification infrastructure.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance, built in",
    body: "SOC 2 Type II, HIPAA, ISO 27001, and GDPR, in US and EU data regions.",
  },
  {
    icon: Gauge,
    title: "Scale from day one",
    body: "The same rails the open-source Novu, ~40K GitHub stars, runs in production.",
  },
]

const BADGES = ["SOC 2 Type II", "HIPAA", "ISO 27001", "GDPR", "US & EU regions"]

/**
 * The ACI package: adding the agent is not "just a chat connection", it inherits
 * Novu's production infrastructure. Rendered as a stack to show real depth.
 */
export default function AciPackage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-20 bg-[#05050b] p-6 md:p-8",
        className
      )}
    >
      {/* Your agent (yours, on top of the stack) */}
      <div className="mx-auto flex max-w-xl flex-col items-center rounded-xl border border-dashed border-gray-30 bg-black/40 px-5 py-4 text-center">
        <span className="flex items-center gap-2 text-sm font-medium text-gray-90">
          <Cpu className="size-4 text-gray-60" aria-hidden />
          Your agent
        </span>
        <span className="mt-1 font-mono text-[0.72rem] text-gray-60">
          your brain, your model, your tools. Novu never runs it.
        </span>
      </div>

      <div className="flex justify-center py-3" aria-hidden>
        <ArrowDownIcon className="size-5 text-gray-40" />
      </div>

      {/* The ACI package */}
      <div className="rounded-xl border border-purple-3/40 bg-purple-3/[0.04]">
        <div className="flex items-center justify-between gap-3 border-b border-purple-3/25 px-5 py-3">
          <span className="font-mono text-[0.72rem] tracking-[0.12em] text-purple-1 uppercase">
            Novu ACI · Agent Communication Infrastructure
          </span>
          <span className="hidden font-mono text-[0.68rem] text-gray-60 sm:inline">
            one connection
          </span>
        </div>

        {/* Surfaces the one agent reaches */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-20 px-5 py-4">
          {SURFACES.map((s, i) => (
            <span
              key={s}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-xs",
                i === 0
                  ? "border-purple-3/50 bg-purple-3/10 text-white"
                  : "border-gray-20 bg-black/40 text-gray-70"
              )}
            >
              {s}
            </span>
          ))}
        </div>

        {/* Infrastructure layers */}
        <ul className="grid gap-px overflow-hidden rounded-b-xl bg-gray-20 sm:grid-cols-2 lg:grid-cols-5">
          {LAYERS.map((layer) => (
            <li
              key={layer.title}
              className="flex flex-col gap-2 bg-[#05050b] p-5"
            >
              <span className="flex size-8 items-center justify-center rounded-lg border border-gray-20 bg-black">
                <layer.icon className="size-4 text-purple-1" aria-hidden />
              </span>
              <span className="mt-1 text-sm font-medium tracking-tighter text-white">
                {layer.title}
              </span>
              <span className="text-xs leading-normal text-pretty text-gray-60">
                {layer.body}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Compliance badges + production callout */}
      <div className="mt-6 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2">
          {BADGES.map((b) => (
            <span
              key={b}
              className="rounded-md border border-gray-20 bg-black/40 px-2.5 py-1 font-mono text-[0.68rem] text-gray-70"
            >
              {b}
            </span>
          ))}
        </div>
        <span className="flex items-center gap-2 rounded-lg border border-purple-3/40 bg-purple-3/10 px-3.5 py-2 text-sm font-medium text-white">
          <ZapIcon className="size-4 text-purple-1" aria-hidden />
          From npx to production in under two minutes.
        </span>
      </div>
    </div>
  )
}
