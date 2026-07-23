/* eslint-disable @next/next/no-img-element */
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import type { IChannelPageData } from "@/types/channel"
import type { IAgentTemplateData } from "@/types/templates"

function TemplateSkillChip({ label }: { label: string }) {
  return (
    <span className="flex min-h-7 items-center rounded border border-[rgba(51,51,71,0.5)] px-2.5 py-1 text-[0.8125rem] leading-none tracking-normal text-gray-10">
      {label}
    </span>
  )
}

function ChannelTemplateCard({ template }: { template: IAgentTemplateData }) {
  const avatarUrl = template.avatar?.darkImage?.url
  const skills = (template.skillsList ?? []).slice(0, 4)

  return (
    <article className="group/card relative flex h-full w-full flex-col items-start overflow-hidden rounded-xl border border-[rgba(51,51,71,0.5)] bg-[rgba(15,15,21,0.8)] p-6">
      <div className="flex w-full items-start justify-between gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            width={44}
            height={44}
            className="size-11 rounded-lg object-cover"
            aria-hidden
          />
        ) : (
          <span className="size-11 rounded-lg bg-gray-3" aria-hidden />
        )}
        {template.category?.title ? (
          <span className="flex shrink-0 items-center rounded-xl border border-[#333347] bg-[rgba(38,38,52,0.8)] px-2.5 py-1 text-[0.8125rem] leading-none tracking-tighter text-gray-10">
            {template.category.title}
          </span>
        ) : null}
      </div>

      <div className="mt-5 flex items-baseline gap-1.5">
        <h3 className="text-lg leading-tight font-medium tracking-tighter text-white">
          {template.name}
        </h3>
        <span className="text-base leading-none text-gray-7" aria-hidden>
          &bull;
        </span>
        <p className="text-base leading-none font-book tracking-normal text-gray-7">
          {template.agentName}
        </p>
      </div>

      <p className="mt-3 w-full text-base leading-snug font-light tracking-normal text-gray-9">
        {template.summary}
      </p>

      {skills.length > 0 ? (
        <div className="mt-5 flex w-full flex-wrap gap-2">
          {skills.map((skill) => (
            <TemplateSkillChip key={skill} label={skill} />
          ))}
        </div>
      ) : null}

      <div className="mt-auto w-full pt-6">
        <NextLink
          href={`${ROUTE.connectApp}?agentTemplateId=${template.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-full items-center justify-center rounded border border-[#534b5d] px-5 text-xs leading-none font-medium tracking-normal text-white uppercase transition-colors hover:border-[#686170] focus-visible:border-[#686170] focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:outline-none"
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
    <section className="safe-paddings py-14 md:py-20">
      <div className="container mx-auto max-w-320 px-5 md:px-8">
        <div className="max-w-208">
          <h2 className="text-[28px] leading-dense font-medium tracking-tighter text-white md:text-[32px]">
            Start with a ready-made agent for {channel.channelName}
          </h2>
          <p className="mt-3 text-base font-book tracking-tighter text-gray-8">
            Pick a starter agent with its prompt, tools, and skills already wired
            up, then connect it to {channel.channelName}. Template to a live agent
            in about two minutes.
          </p>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <ChannelTemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ChannelTemplates
