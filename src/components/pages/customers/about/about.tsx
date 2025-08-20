import Image from "next/image"

import { ICustomerData } from "@/types/customers"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"

export default function About({
  logo,
  name,
  about,
  industry,
  channels,
}: Pick<ICustomerData, "name" | "about" | "industry" | "channels"> & {
  logo: string
}) {
  return (
    <dl className="flex flex-col lg:border-b lg:border-gray-3 lg:pb-6">
      <Image
        className={cn("h-7 w-36")}
        src={logo}
        alt={`${name} logo`}
        width={144}
        height={28}
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
        <div className="flex flex-col gap-2.5 md:w-1/2 lg:w-auto">
          <dt className="leading-tight font-medium tracking-tighter">
            Channels
          </dt>
          <dd className="flex items-center gap-2">
            {channels?.email && (
              <Link
                href={`mailto:${channels.email}`}
                className="rounded-[116px] border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.06)] px-[9px] pt-[3px] pb-[5px] text-xs leading-none tracking-tighter text-gray-9"
              >
                Email
              </Link>
            )}
            {channels?.inbox && (
              <Link
                href={`${channels.inbox}`}
                className="rounded-[116px] border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.06)] px-[9px] pt-[3px] pb-[5px] text-xs leading-none tracking-tighter text-gray-9"
              >
                Inbox
              </Link>
            )}
            {channels?.sms && (
              <Link
                href={`sms:${channels.sms}`}
                className="rounded-[116px] border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.06)] px-[9px] pt-[3px] pb-[5px] text-xs leading-none tracking-tighter text-gray-9"
              >
                SMS
              </Link>
            )}
          </dd>
        </div>
      </div>
    </dl>
  )
}
