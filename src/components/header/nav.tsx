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
  /** A click pins a menu opened by hover; the next click closes it. */
  openedBy: "hover" | "click" | null
}

const CLOSED_MENU: IOpenMenuState = {
  title: null,
  animateIn: false,
  openedBy: null,
}

const ITEM_CLASS_NAME =
  "relative z-10 text-[0.9375rem] font-normal! tracking-normal whitespace-nowrap lg:px-2! xl:px-3.75!"

function Nav({ className, items }: IHeaderNavProps) {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<IOpenMenuState>(CLOSED_MENU)

  const activeIndex = useMemo(
    () =>
      items.findIndex(({ href, activeHref = href }) =>
        activeHref === ROUTE.index
          ? pathname === ROUTE.index
          : activeHref &&
            (pathname === activeHref || pathname.startsWith(`${activeHref}/`))
      ),
    [pathname, items]
  )

  // Hovering an open menu again keeps how it was opened.
  const handleMenuOpen = useCallback(
    (title: string | null) => () =>
      setOpenMenu((current) =>
        current.title === title
          ? current
          : {
              title,
              animateIn: title !== null && current.title === null,
              openedBy: title !== null ? "hover" : null,
            }
      ),
    []
  )

  const handleMenuToggle = useCallback(
    (title: string) => () =>
      setOpenMenu((current) =>
        current.title === title && current.openedBy === "click"
          ? CLOSED_MENU
          : { title, animateIn: current.title === null, openedBy: "click" }
      ),
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

          if (!hasDropdown(item)) {
            return (
              <li
                className="relative"
                key={index}
                onMouseEnter={handleMenuOpen(null)}
              >
                {href && (
                  <Link
                    className={ITEM_CLASS_NAME}
                    href={href}
                    size="md"
                    variant="muted"
                    data-active={isActive}
                  >
                    {title}
                  </Link>
                )}
              </li>
            )
          }

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
              onMouseEnter={handleMenuOpen(title)}
              // Focus can leave this item for a link in another item's menu,
              // so only this item's menu closes. WebKit drops focus when a
              // click lands inside the item, so a blur to nothing while the
              // pointer is over the item keeps the menu open.
              onBlur={({ currentTarget, relatedTarget }) => {
                if (currentTarget.contains(relatedTarget as Node | null)) return
                if (relatedTarget === null && currentTarget.matches(":hover")) {
                  return
                }

                setOpenMenu((current) =>
                  current.title === title ? CLOSED_MENU : current
                )
              }}
            >
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
                    onKeyDown={handleTriggerKeyDown}
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
              <Dropdown
                id={menuId}
                isOpen={isOpen}
                animateIn={isOpen && openMenu.animateIn}
                title={title}
                variant={item.variant}
                content={item.content}
              />
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Nav
