"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { ROUTE } from "@/constants/routes"

import { ICategory } from "@/types/blog"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface ICategoriesListProps {
  className?: string
  categories: ICategory[]
}

function CategoriesList({ className, categories }: ICategoriesListProps) {
  const pathname = usePathname()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        '[data-slot="scroll-area-viewport"]'
      ) as HTMLElement
      const activeElement = scrollAreaRef.current.querySelector(
        '[data-active="true"]'
      ) as HTMLElement

      if (viewport && activeElement) {
        const viewportRect = viewport.getBoundingClientRect()
        const elementRect = activeElement.getBoundingClientRect()

        const isFullyVisible =
          elementRect.left >= viewportRect.left &&
          elementRect.right <= viewportRect.right

        if (!isFullyVisible) {
          const elementOffsetLeft = activeElement.offsetLeft
          const elementWidth = activeElement.offsetWidth
          const viewportWidth = viewport.offsetWidth

          const scrollLeft =
            elementOffsetLeft - viewportWidth / 2 + elementWidth / 2

          viewport.scrollTo({
            left: Math.max(0, scrollLeft),
            behavior: "smooth",
          })
        }
      }
    }
  }, [pathname])

  return (
    <section
      className={cn("categories-list max-w-full md:overflow-hidden", className)}
    >
      <h2 className="sr-only">Categories</h2>
      <nav className="relative -mx-5 md:mx-0">
        <ScrollArea className="w-full" ref={scrollAreaRef}>
          <ul className="flex h-7.5 w-full items-center px-5 md:pl-0">
            {categories.map(({ title, url }, index) => {
              const isActive =
                url === ROUTE.blog
                  ? pathname === ROUTE.blog ||
                    pathname.startsWith(`${ROUTE.blog}/page`)
                  : pathname === url || pathname.startsWith(`${url}/page`)

              return (
                <li key={index} data-active={isActive}>
                  <Link
                    className={cn(
                      "relative h-7.5 justify-center rounded-full border px-3 leading-none tracking-tight whitespace-nowrap transition-colors",
                      isActive
                        ? "border-[#81869E] text-white"
                        : "border-background text-gray-8 hover:text-white"
                    )}
                    size="sm"
                    variant="clean"
                    href={url}
                  >
                    {title}
                  </Link>
                </li>
              )
            })}
          </ul>
          <ScrollBar className="invisible" orientation="horizontal" />
        </ScrollArea>
        <div
          className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 my-auto h-full w-26 bg-gradient-to-r from-transparent to-background lg:w-16"
          aria-hidden
        />
      </nav>
    </section>
  )
}
export default CategoriesList
