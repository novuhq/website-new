"use client"

import type { CSSProperties } from "react"
import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

import { cn } from "@/lib/utils"

type Brand = {
  name: string
  role: string
  initial: string
  accent: string
  accentFg: string
  surface: string
  panel: string
  text: string
  muted: string
  border: string
}

// A few brand palettes, including a light one, to show the same chat adapting.
const BRANDS: Brand[] = [
  {
    name: "Novu",
    role: "In-app assistant",
    initial: "N",
    accent: "#7A88FF",
    accentFg: "#0b0b12",
    surface: "#0b0b12",
    panel: "#17171d",
    text: "#ECECF2",
    muted: "#8A8B99",
    border: "#26262f",
  },
  {
    name: "Aurora",
    role: "Support agent",
    initial: "A",
    accent: "#2DD4BF",
    accentFg: "#04201c",
    surface: "#06120f",
    panel: "#0d201b",
    text: "#E6FBF5",
    muted: "#6FB0A4",
    border: "#123b32",
  },
  {
    name: "Ember",
    role: "Concierge",
    initial: "E",
    accent: "#FB923C",
    accentFg: "#221000",
    surface: "#120c07",
    panel: "#1e150d",
    text: "#FBEAD9",
    muted: "#B0906A",
    border: "#3a2a1a",
  },
  {
    name: "Rosé",
    role: "Shopping helper",
    initial: "R",
    accent: "#F472B6",
    accentFg: "#2a0a1c",
    surface: "#120910",
    panel: "#1e1019",
    text: "#FBE4F1",
    muted: "#B585A3",
    border: "#3a1f30",
  },
  {
    name: "Daylight",
    role: "Onboarding guide",
    initial: "D",
    accent: "#2563EB",
    accentFg: "#ffffff",
    surface: "#ffffff",
    panel: "#F1F3F9",
    text: "#0F172A",
    muted: "#64748B",
    border: "#E2E8F0",
  },
]

type View = { id: string; label: string; card: string; bubble: string }
const VIEWS: View[] = [
  { id: "rounded", label: "Rounded", card: "1.1rem", bubble: "0.9rem" },
  { id: "compact", label: "Compact", card: "0.55rem", bubble: "0.45rem" },
]

const CANNED: Array<{ role: "agent" | "user"; text: string }> = [
  { role: "agent", text: "Hi! I'm your in-app assistant. Ask me anything." },
  { role: "user", text: "Can you update my shipping address?" },
  { role: "agent", text: "Of course. What is the new address?" },
]

function ChatThemeShowcase({ className }: { className?: string }) {
  const [brandIndex, setBrandIndex] = useState(0)
  const [viewIndex, setViewIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    if (reduced || paused) return
    const t = window.setInterval(
      () => setBrandIndex((i) => (i + 1) % BRANDS.length),
      3000
    )
    return () => window.clearInterval(t)
  }, [reduced, paused])

  const brand = BRANDS[brandIndex]
  const view = VIEWS[viewIndex]

  const themeStyle = {
    "--acc": brand.accent,
    "--acc-fg": brand.accentFg,
    "--surface": brand.surface,
    "--panel": brand.panel,
    "--txt": brand.text,
    "--muted": brand.muted,
    "--bord": brand.border,
    "--cardr": view.card,
    "--bubr": view.bubble,
  } as CSSProperties

  return (
    <div className={cn("w-full", className)}>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {BRANDS.map((b, i) => (
          <button
            aria-pressed={i === brandIndex}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
              i === brandIndex
                ? "border-gray-40 text-white"
                : "border-gray-20 text-gray-70 hover:border-gray-40"
            )}
            key={b.name}
            onClick={() => {
              setBrandIndex(i)
              setPaused(true)
            }}
            type="button"
          >
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: b.accent }}
            />
            {b.name}
          </button>
        ))}

        <span className="mx-1 h-4 w-px bg-gray-20" />

        {VIEWS.map((v, i) => (
          <button
            aria-pressed={i === viewIndex}
            className={cn(
              "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
              i === viewIndex
                ? "border-gray-40 text-white"
                : "border-gray-20 text-gray-70 hover:border-gray-40"
            )}
            key={v.id}
            onClick={() => setViewIndex(i)}
            type="button"
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Chat card (recolors live) */}
      <div
        className="mt-4 overflow-hidden border transition-colors duration-500"
        style={{
          ...themeStyle,
          background: "var(--surface)",
          borderColor: "var(--bord)",
          borderRadius: "var(--cardr)",
          color: "var(--txt)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-2.5 border-b px-4 py-3 transition-colors duration-500"
          style={{ borderColor: "var(--bord)" }}
        >
          <span
            className="flex size-7 items-center justify-center rounded-lg font-mono text-sm font-semibold transition-colors duration-500"
            style={{ background: "var(--acc)", color: "var(--acc-fg)" }}
          >
            {brand.initial}
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[0.9rem] font-medium">{brand.name}</span>
            <span
              className="flex items-center gap-1.5 font-mono text-[0.68rem]"
              style={{ color: "var(--muted)" }}
            >
              <span
                className="size-1.5 rounded-full transition-colors duration-500"
                style={{ background: "var(--acc)" }}
              />
              {brand.role}
            </span>
          </span>
        </div>

        {/* Messages */}
        <div className="flex flex-col gap-2.5 px-4 py-4">
          {CANNED.map((m, i) =>
            m.role === "agent" ? (
              <div
                className="max-w-[82%] self-start px-3.5 py-2.5 text-sm leading-snug transition-colors duration-500"
                key={i}
                style={{
                  background: "var(--panel)",
                  borderRadius: "var(--bubr)",
                  color: "var(--txt)",
                }}
              >
                {m.text}
              </div>
            ) : (
              <div
                className="max-w-[82%] self-end px-3.5 py-2.5 text-sm leading-snug transition-colors duration-500"
                key={i}
                style={{
                  background: "var(--acc)",
                  borderRadius: "var(--bubr)",
                  color: "var(--acc-fg)",
                }}
              >
                {m.text}
              </div>
            )
          )}
        </div>

        {/* Composer */}
        <div
          className="flex items-center gap-2 border-t px-3 py-3 transition-colors duration-500"
          style={{ borderColor: "var(--bord)" }}
        >
          <div
            className="flex-1 px-3 py-2 font-mono text-xs transition-colors duration-500"
            style={{
              background: "var(--panel)",
              borderRadius: "var(--bubr)",
              color: "var(--muted)",
            }}
          >
            Message {brand.name}...
          </div>
          <span
            className="flex size-8 items-center justify-center transition-colors duration-500"
            style={{
              background: "var(--acc)",
              color: "var(--acc-fg)",
              borderRadius: "var(--bubr)",
            }}
          >
            <ArrowUp className="size-4" aria-hidden />
          </span>
        </div>
      </div>

      <p className="mt-3 font-mono text-xs text-gray-60">
        Same component, any brand. Recolored live to match the site it lives on.
      </p>
    </div>
  )
}

export default ChatThemeShowcase
