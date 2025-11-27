"use client"

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

  return (
    <section
      className={cn("categories-list max-w-full md:overflow-hidden", className)}
    >
      <h2 className="sr-only">Categories</h2>
      <nav className="relative -mx-5 md:mx-0">
        <ScrollArea className="w-full">
          <ul className="flex h-7.5 w-full items-center px-5 md:pl-0">
            {categories.map(({ title, url }, index) => {
              const isActive =
                url === ROUTE.blog
                  ? pathname === ROUTE.blog ||
                    pathname.startsWith(`${ROUTE.blog}/page`)
                  : pathname === url || pathname.startsWith(`${url}/page`)

              return (
                <li key={index}>
                  <Link
                    className={cn(
                      "relative h-7.5 justify-center rounded-full px-3 leading-none tracking-tight whitespace-nowrap transition-colors ring-inset",
                      isActive
                        ? "border border-[#81869E] text-white"
                        : "text-gray-8 hover:text-white"
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
