"use client"

import { Info } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Fallback alert shown when brand extraction fails. The provider owns the
 * copy (`useWebChatBrand().errorMessage`); this component only renders it,
 * so the string is never duplicated here.
 *
 * The two Figma alert nodes genuinely differ:
 * mobile (`45509:173755`) is a fixed 320px-wide row where the copy wraps to
 * two lines, so it uses a 16px radius, left-aligned text, and top-aligned
 * icon; desktop (`45487:84157`) hugs a single line, so a 96px radius reads
 * as a full pill with centred text and a vertically centred icon.
 *
 * A live region must exist *before* its content changes to be announced
 * reliably; several screen readers ignore "a status node appeared, already
 * containing text". So `hero.tsx` mounts `BrandAlert` unconditionally and
 * only toggles `message` between `null` and the real string: the same
 * `role="status"` node persists and its content mutation is announced. When there
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
