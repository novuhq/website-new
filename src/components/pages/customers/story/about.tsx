import Image from "next/image"

import { ICustomerData } from "@/types/customers"
import ChannelsList from "@/components/pages/customers/channels-list"

export default function About({
  logo,
  name,
  about,
  industry,
  channelsList,
}: Pick<
  ICustomerData,
  "logo" | "name" | "about" | "industry" | "channelsList"
>) {
  return (
    <div className="flex flex-col lg:border-b lg:border-gray-3 lg:pb-6">
      <Image
        className="h-auto w-36"
        src={logo.url}
        alt={`${name} logo`}
        width={logo.width}
        height={logo.height}
        priority
        quality={100}
        sizes="144px"
      />
      <dl className="mt-7 grid grid-cols-1 gap-y-5 md:grid-cols-2 md:gap-x-6 md:gap-y-6 lg:grid-cols-1">
        <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-1">
          <dt className="leading-tight font-medium tracking-tighter">About</dt>
          <dd className="text-sm leading-snug tracking-tighter text-muted-foreground lg:-mt-px">
            {about}
          </dd>
        </div>
        <div className="flex flex-col gap-2">
          <dt className="leading-tight font-medium tracking-tighter">
            Industry
          </dt>
          <dd className="text-sm leading-snug tracking-tighter text-muted-foreground lg:-mt-px">
            {industry}
          </dd>
        </div>
        {channelsList && channelsList.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <dt className="leading-tight font-medium tracking-tighter">
              Channels
            </dt>
            <dd className="flex items-center gap-2">
              <ChannelsList list={channelsList} />
            </dd>
          </div>
        )}
      </dl>
    </div>
  )
}
