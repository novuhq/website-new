"use client"

import { useCallback, useEffect, useState } from "react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { ROUTE } from "@/constants/routes"

import { IMenuHeaderItem } from "@/types/common"
import { cn } from "@/lib/utils"
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
}

function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { ref: scrollRef, isScrolledToBottom, hasScroll } = useScrollStatus()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const onOpenChange = useCallback((open: boolean) => {
    setOpen(open)
  }, [])

  if (!items || items.length === 0) {
    return null
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      shouldScaleBackground={false}
      preventScrollRestoration
      modal={false}
    >
      <DrawerTrigger className="relative ml-4 flex size-6 text-foreground outline-hidden lg:hidden">
        <Burger isToggled={open} />
      </DrawerTrigger>
      <DrawerContent
        className="top-16 flex h-auto flex-col rounded-t-none border border-border p-0 backdrop-blur-none lg:hidden"
        withTopLine={false}
      >
        <DrawerTitle className="sr-only">Menu</DrawerTitle>
        <div
          className="flex flex-1 flex-col"
          data-disable-document-scroll={open}
        >
          <nav
            className="max-h-[calc(100vh-208px)] overflow-x-auto px-5 2xs:max-h-[calc(100vh-162px)] md:px-8"
            ref={scrollRef}
          >
            <ul>
              {items.map(({ title, content, href }, index) => (
                <li
                  className="border-b border-b-foreground/10 last:border-b-0"
                  key={index}
                >
                  {href ? (
                    <Link
                      className="relative z-10 w-full py-3.25 font-medium hover:!text-primary sm:!text-lg"
                      href={href}
                      variant="foreground"
                    >
                      {title}
                    </Link>
                  ) : (
                    content &&
                    content.length > 0 && (
                      <MobileItem title={title} content={content} />
                    )
                  )}
                </li>
              ))}
            </ul>
            <div
              className={cn(
                hasScroll &&
                  !isScrolledToBottom &&
                  "after:pointer-events-none after:fixed after:inset-x-0 after:top-16 after:bottom-35.5 after:z-50 after:bg-[linear-gradient(180deg,#05050B00_86.18%,#05050B_100%)] 2xs:after:bottom-24"
              )}
            />
          </nav>

          <div className="mt-auto flex gap-3.5 px-5 py-6 max-2xs:flex-col 2xs:gap-5 2xs:py-7 md:px-8">
            <Button className="w-full" variant="outline" asChild>
              <NextLink href={ROUTE.dashboardV2SignIn}>Login</NextLink>
            </Button>
            <Button className="w-full" asChild>
              <NextLink href={ROUTE.dashboardV2SignUp}>Get Started</NextLink>
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default MobileMenu
