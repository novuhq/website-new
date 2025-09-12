"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ROUTE } from "@/constants/routes"

import { ICustomersGridData } from "@/types/customers"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import ChannelsList from "@/components/pages/customers/channels-list"

interface ICustomersGridProps {
  isFeaturedExist: boolean
  categories: string[]
  customers: ICustomersGridData[]
}

export default function CustomersGrid({
  isFeaturedExist,
  categories,
  customers,
}: ICustomersGridProps) {
  const fullCategories = [
    ...(isFeaturedExist ? ["Featured"] : []),
    ...categories,
  ]
  const [activeCategory, setActiveCategory] = useState<string>(
    isFeaturedExist ? "Featured" : categories[0]
  )
  const [shownCount, setShownCount] = useState<number>(6)
  const [shownAmount, setShownAmount] = useState<number>(6)

  useEffect(() => {
    setShownAmount(shownCount)
  }, [activeCategory, shownCount])

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth

      if (width >= 1280) {
        setShownCount(12)
        setShownAmount(12)
      } else if (width >= 1024) {
        setShownCount(9)
        setShownAmount(9)
      } else if (width >= 768) {
        setShownCount(10)
        setShownAmount(10)
      } else {
        setShownCount(6)
        setShownAmount(6)
      }
    }

    handleResize()

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const allFilteredCustomers = customers.filter((item) => {
    if (activeCategory === "Featured") {
      return item.isFeatured
    }
    return item.category?.name === activeCategory
  })

  const filteredCustomers = allFilteredCustomers.slice(0, shownAmount)

  return (
    <section className="trusted relative mt-26 md:mt-28 lg:mt-40">
      <h2 className="text-center text-[28px] leading-[1.125] font-medium tracking-tighter text-foreground md:text-[32px] lg:text-[40px] 2xl:text-[44px]">
        Trusted by companies worldwide
      </h2>
      <ul className="scrollbar-hidden mt-7 flex items-center gap-1 overflow-auto px-5 py-1 md:justify-center">
        {fullCategories.map((category, index) => (
          <li key={index}>
            <button
              className={cn(
                "h-7 rounded-full border px-3 text-sm leading-none tracking-tighter whitespace-nowrap transition-colors duration-300 hover:text-foreground",
                activeCategory === category
                  ? "border-[#2E3038] text-foreground"
                  : "border-transparent text-muted-foreground"
              )}
              onClick={() => {
                setActiveCategory(category)
                setShownAmount(shownCount)
              }}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
      <ul className="mx-auto mt-10 grid max-w-186 grid-cols-1 gap-3 px-5 md:grid-cols-2 lg:max-w-250 lg:grid-cols-3 xl:mt-14 xl:max-w-314 xl:grid-cols-4">
        {filteredCustomers.map(
          ({ _id, name, logo, channelsList, title, slug, url }, index) => (
            <article
              className="relative flex min-h-45 items-center justify-center overflow-hidden rounded-xl border border-[#333347]/50 bg-[#0F0F15]/50 opacity-80 md:min-h-55 lg:min-h-65"
              key={_id}
            >
              <h2 className="sr-only">{name}</h2>
              <Link
                href={url ? url : `${ROUTE.customers}/${slug?.current}`}
                className="peer absolute inset-0 z-20"
              >
                <span className="sr-only">
                  {url
                    ? "Go to the customers website"
                    : "Read the customers story"}
                </span>
              </Link>
              <Image
                className="relative z-10 h-8 w-auto max-w-4/5"
                src={logo.url}
                alt=""
                width={logo.width}
                height={logo.height}
                loading="lazy"
              />
              {channelsList && channelsList.length > 0 && (
                <p className="absolute top-3.5 z-10 truncate px-8 text-sm leading-normal font-light tracking-tighter text-muted-foreground opacity-0 transition-opacity duration-300 peer-hover:opacity-100 peer-focus-visible:opacity-100">
                  <ChannelsList list={channelsList} />
                </p>
              )}
              <p className="absolute bottom-3.5 z-10 line-clamp-2 px-8 text-center text-sm leading-normal font-light tracking-tighter text-muted-foreground opacity-0 transition-opacity duration-300 peer-hover:opacity-100 peer-focus-visible:opacity-100">
                {title}
              </p>
              <div className="absolute top-0 right-0 h-59 w-80 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#344387]/50 opacity-0 blur-3xl transition-opacity duration-300 peer-hover:opacity-100 peer-focus-visible:opacity-100" />
            </article>
          )
        )}
      </ul>
      {allFilteredCustomers.length > shownAmount && (
        <Button
          className={cn(
            "mx-auto mt-8 flex !h-10 w-max !px-8 !text-xs xl:mt-10"
          )}
          variant="outline"
          size="lg"
          onClick={() => setShownAmount((prev) => prev + shownCount)}
        >
          Show more
        </Button>
      )}
    </section>
  )
}
