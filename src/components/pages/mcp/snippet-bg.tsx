"use client"

import Image from "next/image"
import snippetBgImage from "@/images/pages/mcp/snippet-bg.png"

import { cn } from "@/lib/utils"

interface IMcpSnippetBgProps {
  className?: string
}

function McpSnippetBg({ className }: IMcpSnippetBgProps) {
  return (
    <Image
      src={snippetBgImage}
      alt=""
      aria-hidden
      priority
      sizes="(min-width: 1024px) 640px, 100vw"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full rounded-xl object-cover select-none",
        className
      )}
    />
  )
}

export default McpSnippetBg
