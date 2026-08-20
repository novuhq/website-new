import Image from "next/image"

import { cn } from "@/lib/utils"

import { LandingButtonLink, LandingTextLink } from "./action-link"
import type { IconGridData } from "./types"

interface IconGridSectionProps extends IconGridData {
  centered?: boolean
  className?: string
  itemTitleClassName?: string
  linksAtBottom?: boolean
  listClassName?: string
  titleClassName?: string
}

export function IconGridSection({
  action,
  centered = false,
  className,
  items,
  itemTitleClassName,
  linksAtBottom = false,
  listClassName,
  title,
  titleClassName,
}: IconGridSectionProps) {
  return (
    <section
      className={className ?? "relative mt-20 md:mt-25 lg:mt-30 xl:mt-40"}
    >
      <div className="mx-auto flex w-full max-w-240 flex-col items-center px-5 md:px-8">
        <h2
          className={cn(
            "text-center text-[28px] leading-dense font-medium tracking-tighter text-balance text-white md:text-[32px] lg:text-[40px]",
            titleClassName
          )}
        >
          {title}
        </h2>
        <ul
          className={cn(
            "mt-8 grid w-full grid-cols-1 gap-7 min-[501px]:grid-cols-2 md:mt-10 md:grid-cols-3 md:gap-x-7 md:gap-y-8 lg:mt-12 lg:gap-x-9 xl:mt-14 xl:gap-x-16 xl:gap-y-12",
            centered && "min-[501px]:grid-cols-1 md:grid-cols-3",
            listClassName
          )}
        >
          {items.map((item) => (
            <li
              key={item.title}
              className={cn("flex flex-col", centered && "items-center")}
            >
              <Image
                className="h-8 w-auto md:h-10"
                src={item.icon}
                alt=""
                width={40}
                height={40}
                aria-hidden
              />
              <h3
                className={cn(
                  "mt-3.5 text-lg leading-dense font-normal tracking-tighter text-white md:mt-4 md:text-xl xl:mt-5",
                  itemTitleClassName
                )}
              >
                {item.title}
              </h3>
              <p
                className={cn(
                  "mt-2 text-[15px] leading-snug font-light tracking-tighter text-pretty text-gray-8",
                  centered && "max-w-70 text-center"
                )}
              >
                {item.description}
              </p>
              {item.link ? (
                <LandingTextLink
                  className={cn("mt-2.5", linksAtBottom && "mt-auto pt-2.5")}
                  action={item.link}
                  prefix={item.title}
                />
              ) : null}
            </li>
          ))}
        </ul>
        {action ? (
          <LandingButtonLink className="mt-11" action={action} secondary />
        ) : null}
      </div>
    </section>
  )
}
