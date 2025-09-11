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
    <dl className="flex flex-col lg:border-b lg:border-gray-3 lg:pb-6">
      <Image
        className="h-auto w-36"
        src={logo.url}
        alt={`${name} logo`}
        width={logo.width}
        height={logo.height}
        priority
        quality={100}
      />
      <div className="mt-7 flex flex-col gap-2">
        <dt className="leading-tight font-medium tracking-tighter">About</dt>
        <dd className="text-sm leading-snug tracking-tighter text-muted-foreground lg:-mt-px">
          {about}
        </dd>
      </div>
      <div className="mt-5 flex flex-col gap-5 md:mt-6 md:flex-row md:gap-6 lg:flex-col">
        <div className="flex flex-col gap-2 md:mt-0 md:w-1/2 lg:w-auto">
          <dt className="leading-tight font-medium tracking-tighter">
            Industry
          </dt>
          <dd className="text-sm leading-snug tracking-tighter text-muted-foreground lg:-mt-px">
            {industry}
          </dd>
        </div>
        {channelsList && channelsList.length > 0 && (
          <div className="flex flex-col gap-2.5 md:w-1/2 lg:w-auto">
            <dt className="leading-tight font-medium tracking-tighter">
              Channels
            </dt>
            <dd className="flex items-center gap-2">
              <ChannelsList list={channelsList} />
            </dd>
          </div>
        )}
      </div>
    </dl>
  )
}
