"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Route } from "next"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { ROUTE } from "@/constants/routes"

import { IMenuHeaderItem } from "@/types/common"
import { useScrollStatus } from "@/hooks/use-scroll-status"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Link } from "@/components/ui/link"

import Burger from "./burger"
import MobileItem from "./mobile-item"

interface MobileMenuProps {
  items: IMenuHeaderItem[]
  actions?: {
    secondary: MobileMenuAction
    primary: MobileMenuAction
  }
}

interface MobileMenuAction {
  href: Route<string> | URL
  label: string
}

const DEFAULT_ACTIONS: Required<MobileMenuProps>["actions"] = {
  secondary: {
    href: ROUTE.dashboardV2SignIn,
    label: "Login",
  },
  primary: {
    href: ROUTE.dashboardV2SignUp,
    label: "Get Started",
  },
}

function MobileMenu({ items, actions = DEFAULT_ACTIONS }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const navigationRef = useRef<HTMLElement>(null)
  const interactionWasKeyboardRef = useRef(false)
  const pathname = usePathname()
  const {
    ref: setScrollStatusRef,
    isScrolledToBottom,
    hasScroll,
  } = useScrollStatus()

  const setNavigationRef = useCallback(
    (node: HTMLElement | null) => {
      navigationRef.current = node
      setScrollStatusRef(node)
    },
    [setScrollStatusRef]
  )

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) {
      return
    }

    const preventBackgroundTouchMove = (event: TouchEvent) => {
      const target = event.target
      const isInsideDrawer =
        target instanceof Node && drawerRef.current?.contains(target)

      if (!isInsideDrawer) {
        event.preventDefault()
      }
    }

    const preventBackgroundWheel = (event: WheelEvent) => {
      const navigation = navigationRef.current
      const target = event.target
      const canScrollNavigation =
        navigation &&
        target instanceof Node &&
        navigation.contains(target) &&
        navigation.scrollHeight > navigation.clientHeight

      if (!canScrollNavigation) {
        event.preventDefault()
      }
    }

    const listenerOptions = { capture: false, passive: false } as const

    document.addEventListener(
      "touchmove",
      preventBackgroundTouchMove,
      listenerOptions
    )
    document.addEventListener("wheel", preventBackgroundWheel, listenerOptions)

    return () => {
      document.removeEventListener(
        "touchmove",
        preventBackgroundTouchMove,
        listenerOptions
      )
      document.removeEventListener(
        "wheel",
        preventBackgroundWheel,
        listenerOptions
      )
    }
  }, [open])

  const onOpenChange = useCallback((open: boolean) => {
    setOpen(open)
  }, [])

  const closeMenu = useCallback(() => {
    setOpen(false)
  }, [])

  const onCloseAutoFocus = useCallback((event: Event) => {
    if (interactionWasKeyboardRef.current) {
      return
    }

    event.preventDefault()
    triggerRef.current?.blur()
  }, [])

  if (!items || items.length === 0) {
    return null
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      shouldScaleBackground={false}
      scrollLockTimeout={0}
      preventScrollRestoration
      modal={false}
      noBodyStyles
    >
      <DrawerTrigger
        className="relative ml-6 flex size-6 text-foreground outline-hidden lg:hidden"
        ref={triggerRef}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onPointerDown={() => {
          interactionWasKeyboardRef.current = false
        }}
        onKeyDown={() => {
          interactionWasKeyboardRef.current = true
        }}
      >
        <Burger isToggled={open} />
      </DrawerTrigger>
      <DrawerContent
        ref={drawerRef}
        className="top-16 bottom-auto flex h-[calc(100dvh-4rem)] min-h-0 flex-col overflow-hidden overscroll-none rounded-t-none border border-border p-0 backdrop-blur-none lg:hidden"
        onCloseAutoFocus={onCloseAutoFocus}
        onPointerDownCapture={() => {
          interactionWasKeyboardRef.current = false
        }}
        onKeyDownCapture={() => {
          interactionWasKeyboardRef.current = true
        }}
        withTopLine={false}
      >
        <DrawerTitle className="sr-only">Menu</DrawerTitle>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="relative min-h-0 flex-1">
            <nav
              className="h-full overflow-y-auto overscroll-contain px-5 pb-10 md:px-8"
              ref={setNavigationRef}
              aria-label="Mobile navigation"
            >
              <ul>
                {items.map(({ title, content, href, variant }, index) => (
                  <li
                    className="border-b border-b-foreground/10 font-inter last:border-b-0"
                    key={index}
                  >
                    {href ? (
                      <Link
                        className="relative z-10 w-full py-3.25 font-medium hover:!text-primary sm:!text-lg"
                        href={href}
                        variant="foreground"
                        onClick={closeMenu}
                      >
                        {title}
                      </Link>
                    ) : (
                      content &&
                      content.length > 0 && (
                        <MobileItem
                          title={title}
                          variant={variant}
                          content={content}
                          onNavigate={closeMenu}
                        />
                      )
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            {hasScroll && !isScrolledToBottom && (
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-linear-to-b from-transparent to-background"
                aria-hidden="true"
              />
            )}
          </div>

          <div className="mt-auto flex shrink-0 gap-3.5 px-5 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] font-inter max-2xs:flex-col 2xs:gap-5 2xs:pt-7 2xs:pb-[max(1.75rem,env(safe-area-inset-bottom))] md:px-8">
            <Button className="w-full" variant="outline" asChild>
              <NextLink href={actions.secondary.href} onClick={closeMenu}>
                {actions.secondary.label}
              </NextLink>
            </Button>
            <Button className="w-full" asChild>
              <NextLink href={actions.primary.href} onClick={closeMenu}>
                {actions.primary.label}
              </NextLink>
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default MobileMenu
