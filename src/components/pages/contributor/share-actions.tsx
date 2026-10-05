"use client"

import { useState } from "react"
import Image from "next/image"
import { Code2, Link2, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Link } from "@/components/ui/link"

interface ShareActionsProps {
  github: string
  profileUrl: string
  embedImageUrl: string
}

export default function ShareActions({
  github,
  profileUrl,
  embedImageUrl,
}: ShareActionsProps) {
  const [copied, setCopied] = useState<"url" | "embed" | null>(null)
  const avatarUrl = `https://avatars.githubusercontent.com/${github}?v=4`
  const embedCode = `<a href="${profileUrl}"><img src="${embedImageUrl}" width="450" height="170" loading="lazy" alt="${github} — Novu contributor" /></a>`

  async function copy(value: string, type: "url" | "embed") {
    await navigator.clipboard.writeText(value)
    setCopied(type)
    window.setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3">
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="flex items-center gap-1.5 rounded-sm text-sm font-light hover:text-gray-9 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            type="button"
          >
            <Share2 className="size-3.5" /> Share achievement
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-lg border-gray-4 bg-gray-2">
          <DialogTitle>Share this contributor profile</DialogTitle>
          <DialogDescription>
            Celebrate @{github}&apos;s open-source contributions to Novu.
          </DialogDescription>
          <div className="relative mx-auto mt-2 size-32 overflow-hidden rounded-full border border-gray-4">
            <Image
              src={avatarUrl}
              fill
              sizes="128px"
              alt={`${github} avatar`}
            />
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button size="sm" variant="outline" asChild>
              <Link
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(`Meet @${github}, a Novu community contributor`)}`}
                variant="clean"
                size="none"
              >
                Share on X
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`}
                variant="clean"
                size="none"
              >
                LinkedIn
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copy(profileUrl, "url")}
            >
              <Link2 /> {copied === "url" ? "Copied" : "Copy link"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <button
            className="flex items-center gap-1.5 rounded-sm text-sm font-light hover:text-gray-9 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            type="button"
          >
            <Code2 className="size-3.5" /> Embed achievement
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-xl border-gray-4 bg-gray-2">
          <DialogTitle>Embed contributor badge</DialogTitle>
          <DialogDescription>
            Copy this snippet into a website or README that accepts HTML.
          </DialogDescription>
          <code className="mt-2 max-h-40 overflow-auto rounded-md bg-black p-4 text-xs leading-relaxed text-gray-8">
            {embedCode}
          </code>
          <Button
            className="justify-self-end"
            size="sm"
            onClick={() => copy(embedCode, "embed")}
          >
            {copied === "embed" ? "Copied" : "Copy code"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
