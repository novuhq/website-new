import Image from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import type { IIntegration } from "@/types/integration"
import { Button } from "@/components/ui/button"

interface IProvidersSectionProps {
  categoryLabels: Record<string, string>
  description: string
  providersByCategory: Record<string, IIntegration[]>
  title: string
}

function ProvidersSection({
  categoryLabels,
  description,
  providersByCategory,
  title,
}: IProvidersSectionProps) {
  const categories = Object.keys(categoryLabels).filter(
    (category) => providersByCategory[category]?.length
  )

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="mt-24 font-inter md:mt-28 lg:mt-32">
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8 lg:max-w-7xl">
        <h2 className="max-w-168 text-[2rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-foreground md:text-5xl xl:text-[3.25rem]">
          {title}
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,40.3125rem)_auto] lg:items-start lg:justify-between lg:gap-12">
          <p className="max-w-161 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-60 md:text-lg xl:text-xl xl:leading-[1.5]">
            {description}
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4 lg:justify-self-end lg:pt-2">
            <Button
              className="h-11 w-full px-5 text-base leading-none tracking-tight normal-case sm:w-auto"
              variant="outline-transparent"
              size="sm"
              asChild
            >
              <NextLink
                href={ROUTE.integrationsChannels}
                data-click-location="notify_providers"
                data-click-text="browse_all_integrations"
              >
                Browse all integrations
              </NextLink>
            </Button>
            <Button
              className="h-11 w-full px-5 text-base leading-none tracking-tight normal-case sm:w-auto"
              variant="outline-transparent"
              size="sm"
              asChild
            >
              <NextLink
                href={ROUTE.docsProviders}
                target="_blank"
                rel="noopener noreferrer"
              >
                Provider docs
              </NextLink>
            </Button>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-8 md:mt-16">
          {categories.map((category) => (
            <div
              className="grid grid-cols-1 gap-3 md:grid-cols-[6.5rem_minmax(0,1fr)] md:gap-6"
              key={category}
            >
              <h3 className="pt-2 text-sm leading-none font-normal tracking-normal text-gray-50 uppercase">
                {categoryLabels[category]}
              </h3>
              <ul className="flex flex-wrap gap-2.5">
                {providersByCategory[category].map((provider) => (
                  <li key={provider.slug}>
                    <NextLink
                      className="flex items-center gap-2.5 rounded-lg border border-gray-20 bg-[#0B0C0E] py-2 pr-3.5 pl-2.5 transition-colors duration-300 hover:border-white/25"
                      href={provider.pathname}
                      data-click-location="notify_providers"
                      data-click-text={provider.slug}
                    >
                      <Image
                        src={provider.icon}
                        alt=""
                        width={20}
                        height={20}
                        className="size-5 object-contain"
                        aria-hidden="true"
                      />
                      <span className="text-sm leading-none tracking-tighter text-gray-8">
                        {provider.title}
                      </span>
                    </NextLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProvidersSection
