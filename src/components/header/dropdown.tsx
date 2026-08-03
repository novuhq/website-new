"use client"

import { useState } from "react"
import Image from "next/image"
import { ROUTE } from "@/constants/routes"
import { ChevronRight } from "lucide-react"
import { motion } from "motion/react"

import type {
  IMenuHeaderContent,
  IMenuItem,
  THeaderMenuVariant,
} from "@/types/common"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"

import MenuIcon from "./menu-icon"

interface IDropdownProps {
  id: string
  isOpen: boolean
  animateIn: boolean
  title: string
  variant: THeaderMenuVariant
  content: IMenuHeaderContent[]
}

interface IMenuLinksProps {
  items: IMenuItem[]
  variant: "solutions" | "ai"
}

const DROPDOWN_POSITION: Record<THeaderMenuVariant, string> = {
  product: "-left-3",
  solutions: "-left-2",
  channels: "-left-2",
  ai: "-left-2",
  resources: "-left-80 xl:translate-x-0 xl:-left-40 2xl:-left-20",
  integrations: "-left-2",
}

const PRODUCT_BANNERS = [
  "/images/header/menu/banner-inbox.jpg",
  "/images/header/menu/banner-connect.jpg",
] as const

function ProductMenu({ content }: { content: IMenuHeaderContent[] }) {
  const items = content[0]?.items ?? []
  const [activeIndex, setActiveIndex] = useState(0)
  const activeItem = items[activeIndex] ?? items[0]

  return (
    <div className="flex w-max gap-3 p-3">
      <div className="flex w-74 shrink-0 flex-col">
        <ul className="flex flex-col gap-y-0.5">
          {items.map(({ label, description, href }, index) => (
            <li key={label}>
              <Link
                className={cn(
                  "flex w-full flex-col items-start gap-1 rounded-[10px] px-3 py-2.5 transition-colors hover:bg-[#121417]",
                  index === activeIndex && "bg-[#121417]"
                )}
                href={href}
                variant="clean"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
              >
                <span className="block text-base leading-none font-normal tracking-tighter text-white">
                  {label}
                </span>
                {description && (
                  <span className="block text-sm leading-snug font-normal tracking-tighter text-[#A3A6B2]">
                    {description}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          className="mt-auto mb-3 w-fit gap-1 px-3 text-sm leading-none font-medium tracking-normal text-white hover:text-gray-80"
          href={ROUTE.dashboardV2SignUp}
          variant="clean"
        >
          Start for free
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      {activeItem && (
        <Link
          className="relative aspect-[13/11] w-81.25 max-w-none shrink-0 overflow-hidden rounded-[0.625rem] border border-[#23242A]"
          href={activeItem.href}
          variant="clean"
          aria-label={`Open ${activeItem.label}`}
        >
          {PRODUCT_BANNERS.map((src, index) => (
            <Image
              className={cn(
                "absolute inset-0 size-full object-cover transition-opacity duration-200 ease-out motion-reduce:transition-none",
                index === activeIndex ? "opacity-100" : "opacity-0"
              )}
              src={src}
              width={650}
              height={550}
              alt=""
              loading="eager"
              unoptimized
              key={src}
            />
          ))}
        </Link>
      )}
    </div>
  )
}

function MenuLinks({ items, variant }: IMenuLinksProps) {
  return (
    <ul
      className={cn(
        variant === "solutions" && "flex flex-col p-3.5",
        variant === "ai" &&
          "grid auto-cols-max grid-flow-col grid-rows-5 gap-x-6 p-3.5"
      )}
    >
      {items.map(({ label, href, menuIcon }) => (
        <li
          className={cn(
            variant === "solutions" && "min-w-45",
            variant === "ai" && "min-w-37.5"
          )}
          key={label}
        >
          <Link
            className="group flex w-full items-center gap-2.5 rounded-[.5rem] p-2.5 text-[15px] leading-none font-normal tracking-tighter whitespace-nowrap text-gray-90 hover:bg-[#121417] hover:text-white"
            href={href}
            variant="clean"
          >
            <MenuIcon icon={menuIcon} />
            {label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function NestedMenu({
  items,
  variant,
}: {
  items: IMenuItem[]
  variant: "channels" | "integrations"
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeItem = items[activeIndex] ?? items[0]

  return (
    <div className="flex font-inter">
      <ul
        className={cn(
          "shrink-0 rounded-l-[1.375rem] bg-[#0B0C0E] p-3.5",
          variant === "channels" ? "min-w-66" : "min-w-50"
        )}
      >
        {items.map(({ label, href, menuIcon }, index) => {
          const isActive = activeIndex === index

          return (
            <li key={label}>
              <Link
                className={cn(
                  "group flex min-h-9 w-full items-center gap-2.5 rounded-[10px] p-2.5 text-[15px] leading-none font-normal tracking-tighter whitespace-nowrap text-gray-70 transition-colors hover:bg-[#121417] hover:text-white",
                  isActive && "bg-[#121417] text-white"
                )}
                href={href}
                variant="clean"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
              >
                <MenuIcon icon={menuIcon} />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>

      {activeItem && (
        <ul
          className={cn(
            "shrink-0 border-l border-gray-20 p-3.5",
            variant === "channels" ? "min-w-80" : "min-w-72"
          )}
          aria-label={`${activeItem.label} links`}
        >
          {activeItem.children?.map(({ label, href, iconSrc }) => (
            <li key={label}>
              <Link
                className="flex min-h-9 w-full items-center gap-2.5 rounded-[10px] p-2.5 text-[15px] leading-none font-normal tracking-tighter whitespace-nowrap text-gray-90 transition-colors hover:bg-[#121417] hover:text-white"
                href={href}
                variant="clean"
              >
                {iconSrc && (
                  <Image
                    className="size-4 shrink-0 object-contain"
                    src={iconSrc}
                    width={16}
                    height={16}
                    alt=""
                    aria-hidden
                  />
                )}
                {label}
              </Link>
            </li>
          ))}
          {Boolean(activeItem.remainingCount) && (
            <li>
              <Link
                className="flex min-h-9 w-full items-center gap-1 rounded-[10px] p-2.5 text-[15px] leading-none font-normal tracking-tighter whitespace-nowrap text-gray-70 transition-colors hover:bg-[#121417] hover:text-white"
                href={activeItem.href}
                variant="clean"
              >
                +{activeItem.remainingCount} more
                <ChevronRight className="size-4" aria-hidden="true" />
              </Link>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

function ResourcesMenu({ content }: { content: IMenuHeaderContent[] }) {
  return (
    <div className="grid auto-cols-max grid-flow-col gap-x-6 p-3.5 pt-6">
      {content.map(({ subtitle, items }, index) => (
        <div className="w-52.5" key={subtitle ?? index}>
          {subtitle && (
            <span className="mb-3.5 ml-2.5 block text-xs leading-none font-medium tracking-normal text-gray-50 uppercase">
              {subtitle}
            </span>
          )}
          {items && (
            <ul className="flex flex-col">
              {items.map(({ label, href, menuIcon }) => (
                <li key={label}>
                  <Link
                    className="group flex min-h-4 items-center gap-2.5 rounded-[.5rem] p-2.5 text-[15px] leading-none font-normal tracking-tighter whitespace-nowrap text-gray-90 hover:bg-[#121417] hover:text-white"
                    href={href}
                    variant="clean"
                  >
                    <MenuIcon icon={menuIcon} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}

function Dropdown({
  id,
  isOpen,
  animateIn,
  title,
  variant,
  content,
}: IDropdownProps) {
  const items = content.flatMap((group) => group.items ?? [])

  if (!isOpen) return null

  return (
    <motion.div
      id={id}
      aria-label={`${title} submenu`}
      initial={animateIn ? { opacity: 0, y: -4 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={
        animateIn ? { duration: 0.16, ease: "easeOut" } : { duration: 0 }
      }
      className={cn(
        "absolute top-[calc(100%+1.25rem)] z-50 rounded-[22px] border border-[#2A2B33] bg-black shadow-[0_3px_26px_4px_rgba(0,0,0,0.54)]",
        "after:absolute after:-top-6 after:left-0 after:h-6 after:w-full after:bg-transparent",
        DROPDOWN_POSITION[variant]
      )}
    >
      {variant === "product" && <ProductMenu content={content} />}
      {(variant === "solutions" || variant === "ai") && (
        <MenuLinks items={items} variant={variant} />
      )}
      {(variant === "channels" || variant === "integrations") && (
        <NestedMenu items={items} variant={variant} />
      )}
      {variant === "resources" && <ResourcesMenu content={content} />}
    </motion.div>
  )
}

export default Dropdown
