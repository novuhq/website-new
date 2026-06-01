"use client"

import type { Route } from "next"
import Image from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import connectLogo from "@/svgs/pages/connect/logo.png"

import type { IMenuHeaderItem } from "@/types/common"
import { Button } from "@/components/ui/button"
import MobileMenu from "@/components/header/mobile-menu"
import Nav from "@/components/header/nav"

const connectAnchor = (hash: string) => `/connect/${hash}` as Route<string>

const CONNECT_HEADER_ITEMS: IMenuHeaderItem[] = [
  {
    title: "Connect",
    href: connectAnchor("#connect"),
  },
  {
    title: "Channels",
    href: connectAnchor("#channels"),
  },
  {
    title: "How it works",
    href: connectAnchor("#how-it-works"),
  },
  {
    title: "Agents templates",
    href: connectAnchor("#templates"),
  },
  {
    title: "Pricing",
    href: connectAnchor("#pricing"),
  },
  {
    title: "FAQ",
    href: connectAnchor("#faq"),
  },
]

const CONNECT_HEADER_ACTIONS = {
  secondary: {
    href: ROUTE.index,
    label: "Novu Platform",
  },
  primary: {
    href: ROUTE.connectApp,
    label: "Novu Connect",
  },
}

function ConnectHeader() {
  return (
    <header className="sticky top-0 z-50 bg-black">
      <div className="relative z-10 mx-auto flex min-h-16 w-full max-w-384 items-center justify-between px-5 md:px-8 lg:justify-start">
        <NextLink
          className="mr-5 inline-flex shrink-0 rounded lg:mr-7"
          href={"/connect/" as Route<string>}
        >
          <Image
            src={connectLogo}
            alt="Novu Connect logo"
            className="h-12.5 w-32 shrink-0 object-contain"
            width={128}
            height={50}
            priority
          />
          <span className="sr-only">Novu Connect</span>
        </NextLink>
        <Nav className="hidden grow lg:flex" items={CONNECT_HEADER_ITEMS} />
        <div className="ml-auto hidden items-center justify-end gap-x-5 lg:flex">
          <Button variant="outline" className="border-gray-5" asChild>
            <NextLink href={CONNECT_HEADER_ACTIONS.secondary.href}>
              {CONNECT_HEADER_ACTIONS.secondary.label}
            </NextLink>
          </Button>
          <Button asChild>
            <NextLink href={CONNECT_HEADER_ACTIONS.primary.href}>
              {CONNECT_HEADER_ACTIONS.primary.label}
            </NextLink>
          </Button>
        </div>
        <MobileMenu
          items={CONNECT_HEADER_ITEMS}
          actions={CONNECT_HEADER_ACTIONS}
        />
      </div>
    </header>
  )
}

export default ConnectHeader
