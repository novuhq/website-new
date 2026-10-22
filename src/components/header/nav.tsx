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
import { hasDropdown } from "./has-dropdown"

interface IHeaderNavProps {
  className?: string
  items: IMenuHeaderItem[]
}

interface IOpenMenuState {
  title: string | null
  animateIn: boolean
  /** When hovering the item opened the menu, or null. */
  hoverOpenedAt: number | null
}

const CLOSED_MENU: IOpenMenuState = {
  title: null,
  animateIn: false,
  hoverOpenedAt: null,
}

// Hover opens a menu just before the click on its trigger lands, so a click
// within this window keeps the menu open instead of closing it.
const HOVER_CLICK_WINDOW_MS = 500

const ITEM_CLASS_NAME =
  "relative z-10 text-[0.9375rem] font-normal! tracking-normal whitespace-nowrap lg:px-2! xl:px-3.75!"

function Nav({ className, items }: IHeaderNavProps) {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<IOpenMenuState>(CLOSED_MENU)

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
    (title: string | null) => () => {
      const now = Date.now()

      setOpenMenu((current) => ({
        title,
        animateIn: title !== null && current.title === null,
        hoverOpenedAt: title !== null ? now : null,
      }))
    },
    []
  )

  const handleMenuToggle = useCallback(
    (title: string) => () => {
      const now = Date.now()

      setOpenMenu((current) => {
        const justOpenedByHover =
          current.hoverOpenedAt !== null &&
          now - current.hoverOpenedAt < HOVER_CLICK_WINDOW_MS
        const nextTitle =
          current.title === title && !justOpenedByHover ? null : title

        return {
          title: nextTitle,
          animateIn: nextTitle !== null && current.title === null,
          hoverOpenedAt: null,
        }
      })
    },
    []
  )

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      setOpenMenu(CLOSED_MENU)
    }
  }

  return (
    <nav
      className={cn("relative flex font-inter xl:mt-1", className)}
      aria-label="Main navigation"
      onMouseLeave={handleMenuOpen(null)}
    >
      <ul className="flex items-center">
        {items.map((item, index) => {
          const { title, href } = item
          const isActive = index === activeIndex
          const itemHasDropdown = hasDropdown(item)
          const menuId = `header-menu-${index}`
          const isOpen = openMenu.title === title
          const triggerProps = {
            onClick: handleMenuToggle(title),
            onKeyDown: handleTriggerKeyDown,
            "aria-haspopup": "true" as const,
            "aria-expanded": isOpen,
            "aria-controls": menuId,
          }

          return (
            <li
              className="relative"
              key={index}
              onMouseEnter={handleMenuOpen(itemHasDropdown ? title : null)}
              onBlur={
                itemHasDropdown
                  ? (event) => {
                      if (
                        !event.currentTarget.contains(
                          event.relatedTarget as Node | null
                        )
                      ) {
                        setOpenMenu(CLOSED_MENU)
                      }
                    }
                  : undefined
              }
            >
              {href && !itemHasDropdown ? (
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
                    // A trigger with a landing page is a link plus a separate
                    // dropdown button, so keyboard and touch users can reach
                    // both.
                    <div className="group/trigger flex items-center">
                      <Link
                        className={cn(
                          ITEM_CLASS_NAME,
                          "group-hover/trigger:text-foreground lg:pr-0! xl:pr-0!"
                        )}
                        href={href}
                        size="md"
                        variant="muted"
                        data-active={isActive}
                        onClick={handleMenuOpen(null)}
                      >
                        {title}
                      </Link>
                      <Button
                        className={cn(
                          ITEM_CLASS_NAME,
                          "cursor-pointer group-hover/trigger:text-foreground lg:pl-1! xl:pl-1!"
                        )}
                        size="md"
                        variant="link"
                        aria-label={`${title} menu`}
                        {...triggerProps}
                      >
                        <ChevronDown className="mt-1 ml-px size-3!" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className={cn(ITEM_CLASS_NAME, "cursor-pointer")}
                      size="md"
                      variant="link"
                      data-active={isActive}
                      {...triggerProps}
                    >
                      {title}
                      <ChevronDown className="mt-1 ml-px size-3!" />
                    </Button>
                  )}
                  {hasDropdown(item) && (
                    <Dropdown
                      id={menuId}
                      isOpen={isOpen}
                      animateIn={isOpen && openMenu.animateIn}
                      title={title}
                      variant={item.variant}
                      content={item.content}
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
