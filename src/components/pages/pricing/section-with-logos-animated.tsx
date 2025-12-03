"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import clsx from "clsx"

import { LogoItem, Logos } from "@/types/pricing"

function splitIntoRows(items: LogoItem[], rows: number) {
  if (!items || items.length === 0 || rows <= 0) return []

  const sortedItems = [...items].sort((a, b) => {
    const priorityA = a.priority ?? 0
    const priorityB = b.priority ?? 0

    return priorityB - priorityA
  })

  const result = Array.from({ length: rows }, () => [])

  sortedItems.forEach((item, index) => {
    const targetRow =
      item.rowIndex !== null && item.rowIndex !== undefined
        ? item.rowIndex
        : index % rows

    if (targetRow >= 0 && targetRow < rows) {
      (result[targetRow] as LogoItem[]).push(item)
    }
  })

  return result as LogoItem[][]
}

const List = ({
  items,
  ariaHidden = false,
  isVisible = false,
}: {
  items: LogoItem[]
  ariaHidden?: boolean
  isVisible?: boolean
}) => (
  <ul
    className={clsx(
      "flex gap-6 md:gap-9",
      isVisible &&
        "group-odd:animate-logos-backward group-even:animate-logos-forward"
    )}
    aria-hidden={ariaHidden}
  >
    {items.map((item, index) => {
      const src = item.logo?.asset?.url
      const title = item.title

      if (!src || !title) return null

      return (
        <li
          className="flex h-6 w-[106px] shrink-0 items-center justify-center md:h-8 md:w-[140px] lg:h-10 lg:w-[180px]"
          key={item._key || index}
        >
          <img
            className="block h-auto w-max max-w-full"
            src={src}
            alt={title}
            loading="lazy"
          />
        </li>
      )
    })}
  </ul>
)

const SectionWithLogosAnimated = ({
  className = "",
  title,
  description,
  items,
  rows = 1,
}: Logos & { className?: string }) => {
  if (!items || items.length === 0 || !title || !rows) {
    return null
  }

  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const logosLists = splitIntoRows(items, rows)

  useEffect(() => {
    const currentSection = sectionRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (currentSection) {
      observer.observe(currentSection)
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection)
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={clsx(
        "section-with-logos-animated safe-paddings mt-[114px] px-8 md:mt-[138px] lg:mt-[154px] xl:mt-[158px]",
        className
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center">
        <h2 className="mx-auto text-center text-[28px] leading-1.125 font-medium tracking-tighter text-balance lg:text-[32px] xl:text-[40px]">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-center text-[16px] leading-normal font-light tracking-tighter text-gray-8 xl:text-[18px]">
            {description}
          </p>
        )}
        <Link href="/customers" className="w-full cursor-pointer">
          {logosLists.map((list, index) => (
            <div
              className={clsx(
                "group flex w-full items-center gap-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent_3%,rgba(0,0,0,.5)_20%,#000_30%,#000_70%,rgba(0,0,0,.5)_80%,transparent_97%)] md:gap-9",
                index === 0
                  ? "mt-[30px] md:mt-10 lg:mt-[52px] xl:mt-16"
                  : "mt-7 md:mt-8 lg:mt-10 xl:mt-11"
              )}
              key={index}
            >
              <List items={list} isVisible={isVisible} />
              <List items={list} isVisible={isVisible} ariaHidden />
            </div>
          ))}
        </Link>
      </div>
    </section>
  )
}

export default SectionWithLogosAnimated
