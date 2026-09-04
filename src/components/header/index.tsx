"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import config from "@/configs/website-config"
import { MENUS } from "@/constants/menus"
import { ROUTE } from "@/constants/routes"
import { ClerkProvider, useAuth } from "@clerk/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import SearchBar from "@/components/ui/search-bar"
import GithubStars from "@/components/github-stars"

import MobileMenu from "./mobile-menu"
import Nav from "./nav"

interface IHeaderProps {
  authStateOverride?: HeaderAuthState
  criticalFlowAuthFixture?: boolean
  githubStars: number
}

type HeaderAuthState = "loading" | "signed-in" | "signed-out"

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
const CRITICAL_FLOW_AUTH_STATE_COOKIE = "novu-critical-flow-auth-state"

function getCriticalFlowAuthState(): HeaderAuthState | undefined {
  const prefix = `${CRITICAL_FLOW_AUTH_STATE_COOKIE}=`
  const value = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(prefix))
    ?.slice(prefix.length)

  if (value === "loading" || value === "signed-in" || value === "signed-out") {
    return value
  }
}

function useCriticalFlowAuthState(enabled: boolean) {
  const [authState, setAuthState] = useState<HeaderAuthState>()

  useEffect(() => {
    if (enabled) setAuthState(getCriticalFlowAuthState())
  }, [enabled])

  return authState
}

function DashboardAction({ authState }: { authState: HeaderAuthState }) {
  if (authState === "signed-in") {
    return (
      <Button
        className="h-11 rounded-sm px-5 text-base tracking-tighter normal-case"
        asChild
      >
        <NextLink href={ROUTE.dashboard}>Visit Dashboard</NextLink>
      </Button>
    )
  }

  return (
    <Button
      className="h-11 rounded-sm px-5 text-base tracking-tighter normal-case"
      asChild
    >
      <NextLink href={ROUTE.dashboardV2SignUp}>Sign up now</NextLink>
    </Button>
  )
}

function ClerkDashboardAction() {
  const { isLoaded, isSignedIn } = useAuth()
  const authState: HeaderAuthState = !isLoaded
    ? "loading"
    : isSignedIn
      ? "signed-in"
      : "signed-out"

  return <DashboardAction authState={authState} />
}

function HeaderDashboardAction({
  authStateOverride,
  criticalFlowAuthFixture,
}: {
  authStateOverride?: HeaderAuthState
  criticalFlowAuthFixture: boolean
}) {
  const criticalFlowAuthState = useCriticalFlowAuthState(
    criticalFlowAuthFixture
  )

  if (criticalFlowAuthFixture) {
    return <DashboardAction authState={criticalFlowAuthState ?? "signed-out"} />
  }

  if (authStateOverride || !clerkPublishableKey) {
    return <DashboardAction authState={authStateOverride ?? "signed-out"} />
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/">
      <ClerkDashboardAction />
    </ClerkProvider>
  )
}

function Header({
  authStateOverride,
  criticalFlowAuthFixture = false,
  githubStars,
}: IHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const normalizedPathname =
    pathname && pathname !== "/" ? pathname.replace(/\/$/, "") : pathname
  const isCareersPage = normalizedPathname === ROUTE.careers

  const navigationItems = MENUS.header

  useEffect(() => {
    if (!isCareersPage) {
      setIsScrolled(false)
      return
    }

    const updateScrolled = () => {
      const scrollTop =
        window.scrollY ||
        window.pageYOffset ||
        document.scrollingElement?.scrollTop ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0

      setIsScrolled(scrollTop > 0)
    }

    updateScrolled()
    window.addEventListener("scroll", updateScrolled, { passive: true })
    document.addEventListener("scroll", updateScrolled, {
      capture: true,
      passive: true,
    })

    return () => {
      window.removeEventListener("scroll", updateScrolled)
      document.removeEventListener("scroll", updateScrolled, { capture: true })
    }
  }, [isCareersPage])

  return (
    <header
      data-critical-flow-auth-fixture={
        criticalFlowAuthFixture ? "enabled" : undefined
      }
      className={cn(
        "sticky top-0 z-50 font-inter transition-colors duration-150",
        !isCareersPage || isScrolled ? "bg-black" : "bg-transparent"
      )}
    >
      <div className="relative z-10 mx-auto flex min-h-16 w-full max-w-384 items-center justify-between px-5 md:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <NextLink
          className="mr-5 inline-flex shrink-0 rounded lg:mr-0 lg:justify-self-start"
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
        <Nav
          className="hidden lg:flex lg:justify-self-center"
          items={navigationItems}
        />
        <div className="ml-auto hidden items-center justify-end gap-x-5 lg:ml-0 lg:flex lg:justify-self-end">
          <GithubStars
            className="hidden text-base tracking-tighter xl:flex"
            stars={githubStars}
          />
          <HeaderDashboardAction
            authStateOverride={authStateOverride}
            criticalFlowAuthFixture={criticalFlowAuthFixture}
          />
        </div>
        <SearchBar
          className="ml-auto lg:hidden"
          theme="icon"
          showOnRoute={[ROUTE.blog]}
          enableCmdK={false}
        />
        <MobileMenu items={navigationItems} />
      </div>
    </header>
  )
}

export default Header
