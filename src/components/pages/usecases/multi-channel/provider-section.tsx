import Image from "next/image"
import type {
  IMultiChannelAction,
  IMultiChannelListItem,
} from "@/data/pages/usecase-multi-channel"

import { cn } from "@/lib/utils"

import {
  ActionButton,
  CONTAINER,
  DESCRIPTION,
  HEADING,
  TitleLines,
} from "./shared"

interface IProviderSectionProps {
  id: string
  titleLines: string[]
  description: string
  action: IMultiChannelAction
  items: IMultiChannelListItem[]
  /** Short one- and two-line rows center on the icon; longer copy hangs. */
  align: "center" | "start"
  /** Top offset of the heading column against the list, from Figma. */
  headingOffsetClassName: string
}

/**
 * The heading-left, list-right split shared by "Use the providers you already
 * have" `45929-10302` and "Keep your providers" `45942-10937`. Both are 1152px
 * wide, 64px inside the content box, with the list column at 576px.
 */
export function ProviderSection({
  id,
  titleLines,
  description,
  action,
  items,
  align,
  headingOffsetClassName,
}: IProviderSectionProps) {
  return (
    <section aria-labelledby={`${id}-title`}>
      <div
        className={cn(
          CONTAINER,
          "flex flex-col gap-10 md:gap-14 lg:flex-row lg:items-start lg:justify-between lg:gap-12 xl:px-24"
        )}
      >
        <div
          className={cn(
            "flex flex-col items-start gap-8 lg:max-w-134 lg:gap-9",
            headingOffsetClassName
          )}
        >
          <div className="flex flex-col gap-5">
            <h2 id={`${id}-title`} className={HEADING}>
              <TitleLines lines={titleLines} />
            </h2>
            <p className={cn(DESCRIPTION, "lg:max-w-96")}>{description}</p>
          </div>
          <ActionButton action={action} section={id} variant="secondary" />
        </div>

        <ul
          className="flex flex-col gap-5 md:gap-7 lg:w-144 lg:shrink-0"
          role="list"
        >
          {items.map((item, index) => (
            <li key={item.title}>
              {index > 0 && (
                <hr className="mb-5 border-gray-20 md:mb-7" aria-hidden />
              )}
              <div
                className={cn(
                  "flex gap-4 md:gap-6",
                  align === "center" ? "items-center" : "items-start"
                )}
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-card-surface md:size-16">
                  <Image
                    alt=""
                    aria-hidden
                    className="size-5 md:size-6"
                    src={item.icon}
                  />
                </span>
                <p className="text-lg leading-[1.25] font-medium tracking-tighter text-gray-60 md:text-[22px]">
                  <span className="text-white">{item.title}</span>{" "}
                  <TitleLines lines={item.descriptionLines} breakFrom="xl" />
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
