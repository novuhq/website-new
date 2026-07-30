"use client"

import { useCallback, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { ROUTE } from "@/constants/routes"
import { ChevronDown } from "lucide-react"

import { IMenuHeaderItem } from "@/types/common"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

import Dropdown from "./dropdown"

interface IHeaderNavProps {
  className?: string
  items: IMenuHeaderItem[]
}

function Nav({ className, items }: IHeaderNavProps) {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const activeIndex = useMemo(
    () =>
      items.findIndex(({ href }) =>
        href === ROUTE.index
          ? pathname === ROUTE.index
          : href && (pathname === href || pathname.startsWith(`${href}/`))
      ),
    [pathname, items]
  )

  const handleMenuOpen = useCallback(
    (title: string | null) => () => setOpenMenu(title),
    []
  )

  return (
    <nav
      className={cn("relative flex font-inter xl:mt-1", className)}
      aria-label="Main navigation"
    >
      <ul className="flex items-center">
        {items.map(({ title, content, href, variant }, index) => {
          const isActive = index === activeIndex
          const hasDropdown = Boolean(
            !href && variant && content && content.length > 0
          )
          const menuId = `header-menu-${index}`

          return (
            <li
              className="relative"
              key={index}
              onMouseEnter={hasDropdown ? handleMenuOpen(title) : undefined}
              onMouseLeave={hasDropdown ? handleMenuOpen(null) : undefined}
              onBlur={
                hasDropdown
                  ? (event) => {
                      if (
                        !event.currentTarget.contains(
                          event.relatedTarget as Node | null
                        )
                      ) {
                        setOpenMenu(null)
                      }
                    }
                  : undefined
              }
            >
              {href ? (
                <Link
                  className="relative z-10 text-[0.9375rem] font-normal! tracking-normal whitespace-nowrap lg:px-2! xl:px-3.75!"
                  href={href}
                  size="md"
                  variant="muted"
                  data-active={isActive}
                >
                  {title}
                </Link>
              ) : (
                <>
                  <Button
                    className="relative z-10 text-[0.9375rem] font-normal! tracking-normal whitespace-nowrap lg:px-2! xl:px-3.75!"
                    size="md"
                    variant="link"
                    data-active={isActive}
                    onClick={() =>
                      setOpenMenu((current) =>
                        current === title ? null : title
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        setOpenMenu(null)
                      }
                    }}
                    aria-haspopup="true"
                    aria-expanded={openMenu === title}
                    aria-controls={menuId}
                  >
                    {title}
                    <ChevronDown className="mt-1 ml-px size-3!" />
                  </Button>
                  {content && content.length > 0 && variant && (
                    <Dropdown
                      id={menuId}
                      isOpen={openMenu === title}
                      title={title}
                      variant={variant}
                      content={content}
                    />
                  )}
                </>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Nav
