import type { Route } from "next"
import Image from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import parse from "html-react-parser"
import { ArrowLeft, ChevronRight, Eye, RefreshCw, Settings } from "lucide-react"

import type { IIntegration } from "@/types/integration"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import RelatedArticles from "@/components/pages/integrations/related-articles"

interface IntegrationDetailProps {
  integration: IIntegration
  relatedIntegrations: IIntegration[]
  className?: string
}

interface IIntegrationInfoBlockProps {
  title: string
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  html?: string
  className?: string
}

function IntegrationInfoBlock({
  title,
  Icon,
  html,
  className,
}: IIntegrationInfoBlockProps) {
  return (
    <section className={cn("flex flex-col gap-2.5", className)}>
      <h2 className="font-display flex items-center gap-2.5 text-lg leading-snug tracking-tight text-foreground">
        <Icon className="size-[1.375rem] text-foreground" aria-hidden />
        {title}
      </h2>
      <div
        className={cn(
          "text-sm leading-snug font-book tracking-tight text-gray-9",
          "[&_p]:text-sm [&_p]:leading-snug [&_p]:tracking-tight"
        )}
      >
        {html ? parse(html) : null}
      </div>
    </section>
  )
}

function IntegrationDetail({
  integration,
  relatedIntegrations,
  className,
}: IntegrationDetailProps) {
  const primaryLabel =
    integration.primaryCtaLabel ?? `Integrate ${integration.title}`
  const primaryHref = (integration.primaryCtaHref ??
    integration.docsUrl ??
    ROUTE.docsProviders) as Route<string> | string

  const featuresText = integration.features?.length
    ? integration.features.join(", ")
    : null

  const relatedSlice = relatedIntegrations.slice(0, 6)
  const relatedArticles = integration.relatedArticles.slice(0, 4)

  return (
    <article
      className={cn(
        "mx-auto w-full px-5 pt-8 md:px-8 md:pt-20 lg:w-4xl lg:px-0 xl:w-5xl 2xl:w-176",
        className
      )}
    >
      <div>
        <Link
          href={`${ROUTE.integrations}/${integration.tab}#integrations-explore`}
          variant="muted"
          size="sm"
          className="inline-flex items-center gap-2 text-gray-8 hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All Integrations
        </Link>

        <header className="flex flex-col gap-5 border-b border-gray-2 pt-7 pb-8 md:pt-9 md:pb-10 lg:max-w-xl xl:max-w-176 2xl:max-w-none">
          <div className="relative size-18 shrink-0 overflow-hidden rounded-xl border border-[var(--integration-icon-wrapper-border)] [background:var(--integration-icon-wrapper-bg)]">
            <div className="absolute top-[0.9375rem] left-[0.9375rem] size-10">
              <Image
                src={integration.icon}
                alt=""
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
            <div className="min-w-0 flex-1 basis-[60%]">
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <h1 className="font-display text-4xl leading-[1.125] tracking-tight text-white sm:text-5xl">
                  {integration.title}
                </h1>
                <span className="rounded-xl border border-integration-card-category-border bg-integration-card-category-bg px-2.5 pt-[0.3125rem] pb-[0.4375rem] text-xs leading-none tracking-tighter text-gray-9">
                  {integration.badge}
                </span>
              </div>
              <p className="mt-3 max-w-[22.6875rem] text-lg leading-normal font-book tracking-tight text-gray-8">
                {integration.tagline}
              </p>
            </div>

            <Button
              variant="default"
              size="none"
              className="h-11 w-full rounded-md px-5 text-sm leading-none uppercase sm:w-fit"
              asChild
            >
              <NextLink
                href={primaryHref as Route<string>}
                target="_blank"
                rel="noopener noreferrer"
              >
                {primaryLabel}
              </NextLink>
            </Button>
          </div>
        </header>
      </div>

      <div className="relative flex flex-col sm:flex-row sm:gap-10 md:gap-12 lg:gap-16 2xl:grid 2xl:grid-cols-[44rem_16rem]">
        <div className="flex w-full min-w-0 flex-col gap-10">
          <div className="flex flex-col gap-10 border-b border-gray-2 py-10">
            <div className="grid gap-10 lg:grid-cols-2">
              <IntegrationInfoBlock
                title="Overview"
                Icon={Eye}
                html={integration.overviewHtml}
              />
              <IntegrationInfoBlock
                title="How it works"
                Icon={RefreshCw}
                html={integration.howItWorksHtml}
              />
              <IntegrationInfoBlock
                title="Configure"
                Icon={Settings}
                html={integration.configureHtml}
                className="lg:max-w-[20.75rem]"
              />
            </div>
          </div>
          <RelatedArticles
            articles={relatedArticles}
            className="flex sm:hidden lg:flex"
          />
        </div>

        <aside className="flex h-fit w-full flex-col gap-5 self-start pt-10 sm:w-64 sm:shrink-0 lg:sticky lg:top-24 lg:w-64 lg:pt-0">
          <div className="relative overflow-hidden rounded-xl border border-foreground/20 bg-foreground/6 p-5">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-9 left-1/2 h-20 w-72 -translate-x-1/2 rounded-full bg-radial from-foreground/8 to-transparent"
            />
            <h3 className="font-display relative text-base leading-tight tracking-tight text-foreground">
              Need help?
            </h3>
            <p className="relative mt-2 text-sm leading-tight font-book tracking-tight text-gray-8">
              Check our docs for step-by-step guide for integrating{" "}
              {integration.title}.
            </p>
            <Link
              href={
                (integration.docsUrl ?? ROUTE.docsProviders) as Route<string>
              }
              variant="default"
              size="sm"
              className="relative mt-2 inline-flex items-center gap-1.5 text-[0.9375rem] leading-snug text-lagune-3 hover:text-lagune-2"
            >
              Read the docs
              <ChevronRight className="size-4" aria-hidden />
            </Link>
          </div>

          {featuresText ? (
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-base leading-tight tracking-tight text-white">
                Features
              </h3>
              <p className="text-sm leading-snug font-book tracking-tight text-gray-8">
                {featuresText}
              </p>
            </div>
          ) : null}

          {relatedSlice.length > 0 ? (
            <div>
              <h3 className="font-display text-base tracking-tight text-white">
                Other {integration.badge.toLowerCase()} providers
              </h3>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-3">
                {relatedSlice.map((rel) => (
                  <li key={rel.slug} className="shrink-0">
                    <Link
                      href={rel.pathname}
                      className="flex items-center gap-2 text-sm whitespace-nowrap text-gray-8 no-underline transition-colors hover:text-white"
                    >
                      <span className="relative size-6 shrink-0 overflow-hidden rounded border border-gray-4 bg-card">
                        <Image
                          src={rel.icon}
                          alt=""
                          width={24}
                          height={24}
                          className="object-contain p-0.5"
                        />
                      </span>
                      <span>{rel.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
      <RelatedArticles
        articles={relatedArticles}
        className="mt-10 hidden sm:flex lg:hidden"
      />
    </article>
  )
}

export default IntegrationDetail
