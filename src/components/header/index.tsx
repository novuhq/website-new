"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import NextLink from "next/link"
import config from "@/configs/website-config"
import { MENUS } from "@/constants/menus"
import { ROUTE } from "@/constants/routes"

import { Button } from "@/components/ui/button"

import MobileMenu from "./mobile-menu"
import Nav from "./nav"

function Header() {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const triggerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!triggerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(!entry.isIntersecting)
      },
      {
        root: null,
        threshold: 0,
      }
    )

    observer.observe(triggerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 flex min-h-16 items-center bg-background">
      <div className="relative z-10 mx-auto flex w-full max-w-384 items-center justify-between px-5 md:px-8 lg:justify-start">
        <NextLink
          className="mr-5 inline-flex shrink-0 rounded lg:mr-7"
          href={ROUTE.index}
        >
          <Image
            src={config.logo}
            alt={`${config.projectName} logo`}
            className="shrink-0"
            width="102"
            height="32"
            priority
          />
          <span className="sr-only">{config.projectName}</span>
        </NextLink>
        {/* <Nav className="hidden grow lg:flex" items={MENUS.header} /> */}
        <div className="ml-auto hidden items-center justify-end gap-x-5 lg:flex">
          <Button variant="outline">Login</Button>
          <Button asChild>
            <NextLink href={ROUTE.contactUs}>Get Started</NextLink>
          </Button>
        </div>
        {/* <MobileMenu items={MENUS.header} /> */}
      </div>
      <div
        className="absolute top-0 h-0 w-full -translate-y-px"
        ref={triggerRef}
        aria-hidden="true"
      />
    </header>
  )
}

export default Header
