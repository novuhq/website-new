"use client"

import { useCallback, useMemo, useState, type KeyboardEvent } from "react"
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

interface IOpenMenuState {
  title: string | null
  animateIn: boolean
}

const ITEM_CLASS_NAME =
  "relative z-10 text-[0.9375rem] font-normal! tracking-normal whitespace-nowrap lg:px-2! xl:px-3.75!"

function Nav({ className, items }: IHeaderNavProps) {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<IOpenMenuState>({
    title: null,
    animateIn: false,
  })

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
    (title: string | null) => () =>
      setOpenMenu((current) => ({
        title,
        animateIn: title !== null && current.title === null,
      })),
    []
  )

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      setOpenMenu({ title: null, animateIn: false })
    }
  }

  return (
    <nav
      className={cn("relative flex font-inter xl:mt-1", className)}
      aria-label="Main navigation"
      onMouseLeave={handleMenuOpen(null)}
    >
      <ul className="flex items-center">
        {items.map(({ title, content, href, variant }, index) => {
          const isActive = index === activeIndex
          const hasDropdown = Boolean(variant && content && content.length > 0)
          const menuId = `header-menu-${index}`
          const isOpen = openMenu.title === title

          return (
            <li
              className="relative"
              key={index}
              onMouseEnter={handleMenuOpen(hasDropdown ? title : null)}
              onBlur={
                hasDropdown
                  ? (event) => {
                      if (
                        !event.currentTarget.contains(
                          event.relatedTarget as Node | null
                        )
                      ) {
                        setOpenMenu({ title: null, animateIn: false })
                      }
                    }
                  : undefined
              }
            >
              {href && !hasDropdown ? (
                <Link
                  className={ITEM_CLASS_NAME}
                  href={href}
                  size="md"
                  variant="muted"
                  data-active={isActive}
                >
                  {title}
                </Link>
              ) : (
                <>
                  {href ? (
                    // A trigger with a landing page navigates on click; its
                    // dropdown opens on hover or keyboard focus instead.
                    <Link
                      className={cn(ITEM_CLASS_NAME, "gap-x-1")}
                      href={href}
                      size="md"
                      variant="muted"
                      data-active={isActive}
                      onFocus={handleMenuOpen(title)}
                      onClick={handleMenuOpen(null)}
                      onKeyDown={handleTriggerKeyDown}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      aria-controls={menuId}
                    >
                      {title}
                      <ChevronDown className="mt-1 ml-px size-3!" />
                    </Link>
                  ) : (
                    <Button
                      className={cn(ITEM_CLASS_NAME, "cursor-pointer")}
                      size="md"
                      variant="link"
                      data-active={isActive}
                      onClick={() =>
                        setOpenMenu((current) => {
                          const nextTitle =
                            current.title === title ? null : title

                          return {
                            title: nextTitle,
                            animateIn:
                              nextTitle !== null && current.title === null,
                          }
                        })
                      }
                      onKeyDown={handleTriggerKeyDown}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      aria-controls={menuId}
                    >
                      {title}
                      <ChevronDown className="mt-1 ml-px size-3!" />
                    </Button>
                  )}
                  {content && content.length > 0 && variant && (
                    <Dropdown
                      id={menuId}
                      isOpen={isOpen}
                      animateIn={isOpen && openMenu.animateIn}
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
