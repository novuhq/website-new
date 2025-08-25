"use client"

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { ROUTE } from "@/constants/routes"
import { ChevronDown } from "lucide-react"
import { domAnimation, LazyMotion } from "motion/react"
import * as m from "motion/react-m"

import { IMenuHeaderItem } from "@/types/common"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

import Dropdown from "./dropdown"

interface IHeaderNavProps {
  className?: string
  items: IMenuHeaderItem[]
}

const ANIMATION_DURATION = 0.2
const NO_ANIMATION_DURATION = 0

function Nav({ className, items }: IHeaderNavProps) {
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [linkRefs, setLinkRefs] = useState<
    (HTMLAnchorElement | HTMLButtonElement | null)[]
  >([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useLayoutEffect(() => {
    setLinkRefs((prev) => prev.slice(0, items.length))
  }, [items.length])

  const activeIndex = useMemo(
    () =>
      items.findIndex(({ href }) =>
        href === ROUTE.index
          ? pathname === ROUTE.index
          : href && (pathname === href || pathname.startsWith(`${href}/`))
      ),
    [pathname, items]
  )

  const motionData = useMemo(() => {
    const navRect = navRef.current?.getBoundingClientRect()
    const hoveredRect =
      hoveredIndex !== null
        ? linkRefs[hoveredIndex]?.getBoundingClientRect()
        : null

    if (!navRect || !hoveredRect) return null

    return {
      navRect,
      hoveredRect,
      x: hoveredRect.left - navRect.left,
      width: hoveredRect.width,
    }
  }, [linkRefs, hoveredIndex])

  // No animation for first hover on active item, otherwise animate
  const animationDuration =
    !hasAnimated && hoveredIndex === activeIndex
      ? NO_ANIMATION_DURATION
      : ANIMATION_DURATION

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    setHoveredIndex(null)
    setHasAnimated(false)
  }, [])

  const handleItemHover = useCallback(
    (index: number) => {
      setHoveredIndex(index)

      // Start animations if hovering on non-active item
      if (!hasAnimated && index !== activeIndex) {
        setHasAnimated(true)
      }
    },
    [hasAnimated, activeIndex]
  )

  const handleMenuOpen = useCallback(
    (title: string | null) => () => setOpenMenu(title),
    []
  )

  return (
    <nav
      className={cn("relative flex justify-center px-4 xl:mt-1", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      ref={navRef}
    >
      <LazyMotion features={domAnimation}>
        <ul className="-ml-5.5 flex items-center xl:ml-44">
          {items.map(({ title, content, href }, index) => {
            const isActive = index === activeIndex
            const hasDropdown = !href && content && content.length > 0

            return (
              <li
                className="relative px-px xl:px-1.25"
                key={index}
                onMouseEnter={hasDropdown ? handleMenuOpen(title) : undefined}
                onMouseLeave={hasDropdown ? handleMenuOpen(null) : undefined}
                onFocus={hasDropdown ? handleMenuOpen(title) : undefined}
                onBlur={hasDropdown ? handleMenuOpen(null) : undefined}
              >
                {href ? (
                  <Link
                    className="relative z-10"
                    href={href}
                    size="md"
                    variant="muted"
                    ref={(el: HTMLAnchorElement | null) => {
                      linkRefs[index] = el
                    }}
                    data-active={isActive && !isHovering}
                    onMouseEnter={() => handleItemHover(index)}
                  >
                    {title}
                  </Link>
                ) : (
                  <>
                    <Button
                      className="relative z-10"
                      size="md"
                      variant="link"
                      ref={(el: HTMLButtonElement | null) => {
                        linkRefs[index] = el
                      }}
                      data-active={isActive && !isHovering}
                      onMouseEnter={() => handleItemHover(index)}
                    >
                      {title}
                      <ChevronDown
                        className={cn(
                          "mt-1 !size-3 transition-transform duration-200",
                          openMenu === title && "rotate-180"
                        )}
                      />
                    </Button>
                    {content && content.length > 0 && (
                      <Dropdown
                        isOpen={openMenu === title}
                        title={title}
                        content={content}
                      />
                    )}
                  </>
                )}
              </li>
            )
          })}
        </ul>

        {isHovering && hoveredIndex !== null && motionData && (
          <m.span
            className="absolute inset-0 rounded-full bg-[#17171f]/85 will-change-transform"
            initial={{ opacity: 0, x: motionData.x, width: motionData.width }}
            animate={{ opacity: 1, x: motionData.x, width: motionData.width }}
            exit={{ opacity: 0 }}
            transition={{ duration: animationDuration }}
          />
        )}
      </LazyMotion>
    </nav>
  )
}

export default Nav
