"use client"

import { useEffect, useState } from "react"
import { Route } from "next"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { useTouchDevice } from "@/hooks/use-touch-device"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import SearchDialog from "@/components/ui/search-dialog"

interface SearchBarProps {
  className?: string
  placeholder?: string
  theme?: "default" | "icon"
  showOnRoute?: (Route<string> | URL)[]
  enableCmdK?: boolean
}

function SearchBar({
  placeholder = "Search...",
  className,
  theme = "default",
  showOnRoute,
  enableCmdK = true,
  ...props
}: SearchBarProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isTouchDevice = useTouchDevice()

  useEffect(() => {
    if (!enableCmdK || isTouchDevice) {
      return
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [enableCmdK, isTouchDevice])

  if (showOnRoute && showOnRoute.length > 0) {
    const isShow = showOnRoute.find((route) =>
      pathname.startsWith(route.toString())
    )
    if (!isShow) {
      return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {theme === "icon" ? (
          <Button
            variant="none"
            aria-label="Search"
            className={cn("size-6 p-0 [&_svg]:size-5", className)}
            {...props}
          >
            <Search size={20} />
          </Button>
        ) : (
          <Button
            variant="none"
            aria-label="Search"
            className={cn(
              "relative h-8 w-full justify-start rounded border border-gray-4 px-1.5 text-sm font-normal text-gray-8 shadow-none lg:h-8 lg:pl-2.5 [&_svg]:size-3.5",
              className
            )}
            {...props}
          >
            <Search size={12} />
            <span className="mr-auto ml-0.5 inline-flex text-[0.8125rem] font-normal normal-case">
              {placeholder}
            </span>
            {!isTouchDevice && enableCmdK && (
              <kbd className="pointer-events-none flex h-5 items-center gap-1 rounded bg-gray-4 px-1.5 font-mono text-xs leading-snug tracking-tight select-none">
                <span className="text-base">⌘</span>K
              </kbd>
            )}
          </Button>
        )}
      </DialogTrigger>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </Dialog>
  )
}

export default SearchBar
