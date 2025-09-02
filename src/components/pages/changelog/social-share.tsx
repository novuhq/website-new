"use client"

import { cn } from "@/lib/utils"
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"

interface ISocialShareProps {
  className?: string
  pathname: string
}

function SocialShare({ className, pathname }: ISocialShareProps) {
  const { handleCopy } = useCopyToClipboard(3000)
  const url = `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}${pathname}`

  const socialShareData: {
    icon: keyof typeof Icons
    label: string
    href?: string
    onClick?: () => void
  }[] = [
    {
      icon: "x",
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
    },
    {
      icon: "linkedin",
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`,
    },
    {
      icon: "link",
      label: "Copy Link",
      onClick: () => handleCopy(url),
    },
  ]

  return (
    <ul className={cn("social-share flex gap-4", className)}>
      {socialShareData.map(({ icon, label, href, onClick }, index) => {
        const Icon = Icons[icon]

        return (
          <li key={index}>
            <Button
              className="size-8 rounded-full bg-gray-9 !p-0 hover:bg-foreground"
              onClick={() => {
                if (onClick) {
                  onClick()
                } else {
                  window.open(href, "_blank", "noopener,noreferrer")
                }
              }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="flex min-h-8 w-full items-center justify-center"
                      aria-label={label}
                    >
                      <Icon className="!size-4" size={16} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Button>
          </li>
        )
      })}
    </ul>
  )
}

export default SocialShare
