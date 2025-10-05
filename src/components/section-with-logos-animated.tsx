import Image from "next/image"

import { getAllCustomersLogos } from "@/lib/customers"
import { cn } from "@/lib/utils"

interface IItem {
  name: string
  logo: {
    url: string
    width: number
    height: number
  }
}

interface IListProps {
  items: IItem[]
  ariaHidden?: boolean
}

interface ISectionWithLogosAnimatedProps {
  title: string
  description?: string
  rows?: number
}

function splitIntoRows(items: IItem[], rows: number): IItem[][] {
  const result: IItem[][] = Array.from({ length: rows }, () => [])

  items.forEach((item, index) => {
    result[index % rows].push(item)
  })

  return result
}

const List = ({ items, ariaHidden = false }: IListProps) => (
  <ul
    className="flex gap-6 group-odd:animate-logos-backward group-even:animate-logos-forward md:gap-9"
    aria-hidden={ariaHidden}
  >
    {items.map(({ name, logo }, index) => (
      <li
        className="flex h-6 w-26.5 shrink-0 items-center justify-center md:h-8 md:w-35 lg:h-10 lg:w-45"
        key={index}
      >
        <Image
          className="block h-auto w-max max-w-full"
          src={logo.url}
          width={logo.width}
          height={logo.height}
          alt={name}
          loading="lazy"
        />
      </li>
    ))}
  </ul>
)

const SectionWithLogosAnimated = async ({
  title,
  description,
  rows = 1,
}: ISectionWithLogosAnimatedProps) => {
  const allLogos = await getAllCustomersLogos()

  if (!allLogos || allLogos.length === 0) {
    return null
  }

  const logosLists = splitIntoRows(allLogos, rows)

  return (
    <section className="section-with-logos-animated mt-26 mb-21 px-8 md:my-24 lg:mt-28 lg:mb-36 xl:mt-38 xl:mb-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center">
        <h2 className="leading-denser mx-auto max-w-60 text-center text-3xl font-medium tracking-tighter md:max-w-max lg:text-[32px]">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-center text-base leading-normal font-light tracking-tighter text-pretty text-gray-8 lg:text-lg">
            {description}
          </p>
        )}
        {logosLists.map((list, index) => (
          <div
            className={cn(
              "group flex w-full items-center gap-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent_3%,rgba(0,0,0,.5)_20%,#000_30%,#000_70%,rgba(0,0,0,.5)_80%,transparent_97%)] md:gap-9",
              index === 0
                ? "mt-8 md:mt-11 lg:mt-14 xl:mt-16"
                : "mt-7 md:mt-8 lg:mt-10 xl:mt-11"
            )}
            key={index}
          >
            <List items={list} />
            <List items={list} ariaHidden />
          </div>
        ))}
      </div>
    </section>
  )
}

export default SectionWithLogosAnimated
