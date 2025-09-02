import Image from "next/image"

import { ICustomerData } from "@/types/customers"
import { cn } from "@/lib/utils"

export default function Quote({
  quote,
  className,
}: Pick<ICustomerData, "quote"> & { className?: string }) {
  if (!quote) return null

  const {
    title,
    authorLogo,
    authorName,
    authorPosition,
  } = quote

  console.log(authorLogo);


  return (
    <div className={cn("col-start-1 mt-12 border-l-2 border-gray-3 pl-4 md:pl-6 lg:mt-12 xl:mt-[46px]", className)}>
      <h2 className="text-[18px] leading-snug font-normal tracking-tight md:text-[28px] md:leading-normal">
        {title}
      </h2>
      <div className="mt-5 flex gap-x-2.5 tracking-tight md:mt-4">
        {authorLogo.url && (
          <Image
            className="h-auto w-7 hidden rounded-full md:block"
            src={authorLogo.url}
            alt={authorName || ""}
            width={authorLogo.width || 28}
            height={authorLogo.height || 28}
            priority
            quality={90}
          />
        )}
        <p className="flex items-center">
          <span className="text-[13px] leading-tight font-medium">
            {authorName}
          </span>
          <span className="ml-1.5 text-sm leading-normal font-normal text-gray-7">
            — {authorPosition}
          </span>
        </p>
      </div>
    </div>
  )
}
