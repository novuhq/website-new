import { ROUTE } from "@/constants/routes"

import { ICustomerData } from "@/types/customers"
import { Link } from "@/components/ui/link"
import Image from "next/image"

export default function Related({
  customers,
}: {
  customers: Pick<ICustomerData, "title" | "slug" | "url" | "_id" | "logo">[]
}) {
  return (
    <>
      <h2 className="text-[28px] font-medium leading-[1.125] tracking-tight md:text-[32px]">
        Read More
      </h2>
      <ul className="flex flex-col overflow-hidden rounded-[8px] border border-gray-3">
        {customers?.map((customer) => {
          if (!customer.slug && !customer.url) return null

          return (
            <li className="border-b border-gray-3 last:border-0" key={customer._id}>
              <Link
                className="flex flex-col items-start gap-y-3 p-5 transition-colors duration-200 hover:bg-gray-2"
                href={
                  customer.slug
                    ? `${ROUTE.customers}/${customer.slug.current}`
                    : customer.url!
                }
              >
                <Image
                  className="relative z-10 h-6 w-auto"
                  src={customer.logo.url}
                  alt=""
                  width={customer.logo.width}
                  height={customer.logo.height}
                />
                <span className="text-base leading-snug font-medium tracking-tighter text-white md:text-[20px]">
                  {customer.title}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}
