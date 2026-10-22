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
  /** The pointer opened the menu by hovering its item. */
  openedByHover: boolean
}

const CLOSED_MENU: IOpenMenuState = {
  title: null,
  animateIn: false,
  openedByHover: false,
}

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
    (title: string | null) => () =>
      setOpenMenu((current) => ({
        title,
        animateIn: title !== null && current.title === null,
        openedByHover: title !== null,
      })),
    []
  )

  const handleMenuToggle = useCallback(
    (title: string) => () =>
      setOpenMenu((current) => {
        // Hover opens the menu before the click lands, so a click on a
        // hover-opened menu keeps it open instead of closing it.
        const nextTitle =
          current.title === title && !current.openedByHover ? null : title

        return {
          title: nextTitle,
          animateIn: nextTitle !== null && current.title === null,
          openedByHover: false,
        }
      }),
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
        {items.map(({ title, content, href, variant }, index) => {
          const isActive = index === activeIndex
          const hasDropdown = Boolean(variant && content && content.length > 0)
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
              onMouseEnter={handleMenuOpen(hasDropdown ? title : null)}
              onBlur={
                hasDropdown
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
