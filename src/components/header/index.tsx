"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import NextLink from "next/link"
import config from "@/configs/website-config"
import { MENUS } from "@/constants/menus"
import { ROUTE } from "@/constants/routes"

import { IMenuHeaderCard } from "@/types/common"
import { Button } from "@/components/ui/button"
import SearchBar from "@/components/ui/search-bar"
import GithubStars from "@/components/github-stars"

import MobileMenu from "./mobile-menu"
import Nav from "./nav"

interface IHeaderProps {
  githubStars: number
  changelog: IMenuHeaderCard
  blog: IMenuHeaderCard
}

function Header({ githubStars, changelog, blog }: IHeaderProps) {
  const [, setIsIntersecting] = useState(false)
  const triggerRef = useRef<HTMLDivElement | null>(null)

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
      <div
        className="absolute top-0 h-0 w-full -translate-y-px"
        ref={triggerRef}
        aria-hidden="true"
      />
    </header>
  )
}

export default Header
