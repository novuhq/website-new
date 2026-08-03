/* eslint-disable @next/next/no-img-element */
import NextLink from "next/link"

import type { IChannelPageData } from "@/types/channel"
import type {
  IAgentTemplateData,
  ITemplateIconReferenceData,
} from "@/types/templates"
import { getAgentTemplateUrl } from "@/lib/templates/url"

function TemplateBadge({ item }: { item: ITemplateIconReferenceData }) {
  return (
    <span className="flex min-h-8 max-w-full items-center gap-1 rounded border border-[rgba(51,51,71,0.5)] py-1.5 pr-2.5 pl-1.5">
      {item.icon?.url ? (
        <img
          src={item.icon.url}
          alt=""
          width={20}
          height={20}
          className="size-5 shrink-0 object-contain"
          aria-hidden
        />
      ) : null}
      <span className="truncate text-[0.9375rem] leading-none font-normal tracking-normal text-gray-10">
        {item.name}
      </span>
    </span>
  )
}

function TemplateBadgeRow({
  items,
  title,
}: {
  items: ITemplateIconReferenceData[]
  title: string
}) {
  if (!items.length) {
    return null
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-[0.9375rem] leading-none font-light tracking-tighter text-gray-50">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <TemplateBadge key={`${item.id || item.name}-${index}`} item={item} />
        ))}
      </div>
    </div>
  )
}

function ChannelTemplateCard({ template }: { template: IAgentTemplateData }) {
  const avatarUrl = template.avatar?.darkImage?.url

  return (
    <article className="relative flex min-h-119 w-full flex-col overflow-hidden rounded-xl border border-gray-20 bg-[#0b0c0e] p-7">
      <div className="flex w-full items-start justify-between gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            width={44}
            height={44}
            className="size-11 rounded-lg object-contain"
            aria-hidden
          />
        ) : (
          <span className="size-11 rounded-lg bg-gray-3" aria-hidden />
        )}
        {template.category?.title ? (
          <span className="flex min-h-6.25 shrink-0 items-center rounded-xl border border-[#333347] bg-[rgba(38,38,52,0.8)] px-2.5 py-1.5 text-[0.8125rem] leading-none font-normal tracking-tighter text-gray-10">
            {template.category.title}
          </span>
        ) : null}
      </div>

      <div className="mt-5 flex min-w-0 items-baseline gap-2">
        <h3 className="min-w-0 text-lg leading-none font-medium tracking-tighter text-white">
          {template.name}
        </h3>
        <span
          className="shrink-0 text-base leading-none text-gray-50"
          aria-hidden
        >
          &bull;
        </span>
        <p className="truncate text-base leading-none font-normal tracking-normal text-gray-50">
          {template.agentName}
        </p>
      </div>

      <p className="mt-3 min-h-22 w-full text-base leading-snug font-light tracking-normal text-gray-80">
        {template.summary}
      </p>

      <div className="mt-5 flex w-full flex-col gap-6">
        <TemplateBadgeRow
          title="MCP connectors"
          items={template.mcpServerList ?? []}
        />
        <TemplateBadgeRow title="Channels" items={template.channels ?? []} />
      </div>

      <div className="mt-auto w-full pt-6">
        <NextLink
          href={getAgentTemplateUrl(template.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 w-full items-center justify-center rounded-md border border-gray-40 px-5 text-base leading-none font-medium tracking-[-0.025em] text-white transition-colors hover:border-gray-50 focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:outline-none"
          data-click-location="channel_templates"
          data-click-text={`use_${template.id}_template`}
          aria-label={`Use the ${template.name} template`}
        >
          Use this template
        </NextLink>
      </div>
    </article>
  )
}

interface IChannelTemplatesProps {
  channel: IChannelPageData
  templates: IAgentTemplateData[]
}

function ChannelTemplates({ channel, templates }: IChannelTemplatesProps) {
  if (!templates.length) {
    return null
  }

  return (
    <section className="safe-paddings mt-18">
      <div className="container mx-auto max-w-176 px-5 md:px-8 lg:px-0">
        <div className="flex flex-col gap-4">
          <h2 className="text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-white md:text-[2rem]">
            Start with a ready-made agent for {channel.channelName}
          </h2>
          <p className="text-base leading-normal font-normal tracking-tighter text-gray-80">
            Pick a starter agent with its prompt, tools, and skills already
            wired up, then connect it to {channel.channelName}. Template to a
            live agent in about two minutes.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {templates.map((template) => (
            <ChannelTemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ChannelTemplates
