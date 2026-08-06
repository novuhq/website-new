import NextLink from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

export interface IExploreLinkItem {
  description: string
  href: string
  linkLabel: string
  title: string
}

export interface IExploreDocsItem {
  href: string
  title: string
}

interface IExploreLinksProps {
  description: string
  docsItems?: IExploreDocsItem[]
  docsTitle?: string
  items: IExploreLinkItem[]
  title: string
}

function ExploreLinks({
  description,
  docsItems,
  docsTitle,
  items,
  title,
}: IExploreLinksProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <section className="mt-24 font-inter md:mt-28 lg:mt-32">
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8 lg:max-w-7xl">
        <h2 className="max-w-168 text-[2rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-foreground md:text-5xl xl:text-[3.25rem]">
          {title}
        </h2>
        <p className="mt-4 max-w-161 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-60 md:text-lg">
          {description}
        </p>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.title}>
              <NextLink
                className="group flex h-full flex-col rounded-xl border border-gray-20 bg-[#0B0C0E] p-5 transition-colors duration-300 hover:border-white/25 lg:p-6"
                href={item.href}
                data-click-location="notify_explore"
                data-click-text={item.linkLabel}
              >
                <h3 className="text-base leading-tight font-medium tracking-tighter text-foreground md:text-lg">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-normal font-normal tracking-tighter text-pretty text-gray-50">
                  {item.description}
                </p>
                <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm leading-none font-medium tracking-tighter text-blue-1">
                  {item.linkLabel}
                  <ArrowRight
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </NextLink>
            </li>
          ))}
        </ul>

        {docsItems && docsItems.length > 0 && (
          <div className="mt-10 flex flex-col gap-4 md:mt-12">
            {docsTitle && (
              <h3 className="text-sm leading-none font-normal tracking-normal text-gray-50 uppercase">
                {docsTitle}
              </h3>
            )}
            <ul className="flex flex-wrap gap-2.5">
              {docsItems.map((item) => (
                <li key={item.href}>
                  <NextLink
                    className="group flex items-center gap-1.5 rounded-lg border border-gray-20 bg-[#0B0C0E] px-3.5 py-2.5 text-sm leading-none tracking-tighter text-gray-8 transition-colors duration-300 hover:border-white/25 hover:text-foreground"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-click-location="notify_explore_docs"
                    data-click-text={item.title}
                  >
                    {item.title}
                    <ArrowUpRight
                      className="size-3.5 text-gray-50 transition-colors duration-300 group-hover:text-foreground"
                      aria-hidden
                    />
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

export default ExploreLinks
