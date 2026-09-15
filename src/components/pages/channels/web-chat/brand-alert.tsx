"use client"

import { Info } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Fallback alert shown when brand extraction fails. The provider owns the
 * copy (`useWebChatBrand().errorMessage`); this component only renders it,
 * so the string is never duplicated here.
 *
 * The two Figma alert nodes genuinely differ, not just the brief's prose:
 * mobile (`45509:173755`) is a fixed 320px-wide row where the copy wraps to
 * two lines, so it uses a 16px radius, left-aligned text, and top-aligned
 * icon; desktop (`45487:84157`) hugs a single line, so a 96px radius reads
 * as a full pill with centred text and a vertically centred icon.
 *
 * Final-review Fix 5: `hero.tsx` used to mount this component (and its
 * `role="status"`) only once `status === "fallback"` — inserting a live
 * region into the DOM with its content already inside, rather than
 * mutating an already-present node. A live region generally must exist
 * *before* its content changes in order to be announced reliably; several
 * screen readers do not treat "a status node appeared, already containing
 * text" as a change worth announcing. `hero.tsx` now mounts `BrandAlert`
 * unconditionally and only toggles `message` between `null` and the real
 * string, so the same `role="status"` node persists across that
 * transition and its content mutation is what gets announced. When there
 * is no message, the node collapses to `sr-only` (present, empty, taking
 * no visual space) rather than being removed.
 */
export function BrandAlert({ message }: { message: string | null }) {
  return (
    <div
      role="status"
      className={cn(
        "flex w-full items-start gap-2 rounded-2xl bg-[#FF98BA]/20 py-2 pr-4 pl-2 text-left text-[15px] leading-[1.38em] tracking-tight text-[#FF98BA] md:inline-flex md:w-fit md:items-center md:rounded-[96px] md:text-center",
        !message && "sr-only"
      )}
    >
      {message && (
        <>
          <Info className="size-5 shrink-0" aria-hidden />
          <span>{message}</span>
        </>
      )}
    </div>
  )
}
