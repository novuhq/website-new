"use client"

import { Info } from "lucide-react"

/**
 * Fallback alert shown when brand extraction fails. The provider owns the
 * copy (`useWebChatBrand().errorMessage`); this component only renders it,
 * so the string is never duplicated here.
 */
export function BrandAlert({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="inline-flex items-center gap-2 rounded-2xl bg-[#FF98BA]/20 py-2 pr-4 pl-2 text-[15px] leading-[1.38em] tracking-tight text-[#FF98BA]"
    >
      <Info className="size-5 shrink-0" aria-hidden />
      <span>{message}</span>
    </div>
  )
}
