"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import config from "@/configs/website-config"
import { MENUS } from "@/constants/menus"
import { ROUTE } from "@/constants/routes"

import { IMenuHeaderCard } from "@/types/common"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import SearchBar from "@/components/ui/search-bar"
import GithubStars from "@/components/github-stars"
import LinkBanner from "@/components/link-banner"

import MobileMenu from "./mobile-menu"
import Nav from "./nav"

interface IHeaderProps {
  githubStars: number
  changelog: IMenuHeaderCard
  blog: IMenuHeaderCard
}

function Header({ githubStars, changelog, blog }: IHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const normalizedPathname =
    pathname && pathname !== "/" ? pathname.replace(/\/$/, "") : pathname
  const isCareersPage = normalizedPathname === ROUTE.careers

  const navigationItems = MENUS.header.map((item) => {
    const content = item?.content?.map((contentItem) => {
      if (contentItem.type === "changelog") {
        return {
          ...contentItem,
          card: changelog,
        }
      } else if (contentItem.type === "blog") {
        return {
          ...contentItem,
          card: blog,
        }
      }
      return contentItem
    })

    return {
      ...item,
      content,
    }
  })

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
      className={cn(
        "sticky top-0 z-50 transition-colors duration-150",
        !isCareersPage || isScrolled ? "bg-black" : "bg-transparent"
      )}
    >
      <LinkBanner />
      <div className="relative z-10 mx-auto flex min-h-16 w-full max-w-384 items-center justify-between px-5 md:px-8 lg:justify-start">
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
        <Nav className="hidden grow lg:flex" items={navigationItems} />
        <div className="ml-auto hidden items-center justify-end gap-x-5 lg:flex">
          <GithubStars className="hidden xl:flex" stars={githubStars} />
          <Button variant="outline" asChild>
            <NextLink href={ROUTE.dashboardV2SignIn}>Login</NextLink>
          </Button>
          <Button asChild>
            <NextLink href={ROUTE.dashboardV2SignUp}>Get Started</NextLink>
          </Button>
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
