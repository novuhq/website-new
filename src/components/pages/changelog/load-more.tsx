"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ILoadMoreProps {
  className?: string
}

function LoadMore({ className }: ILoadMoreProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get("page") || 1)

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page + 1))
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <Button
      className={cn("!h-10 !px-8 !text-xs", className)}
      variant="outline"
      size="lg"
      onClick={handleClick}
    >
      Show more
    </Button>
  )
}

export default LoadMore
