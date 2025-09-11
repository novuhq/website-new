import { ROUTE } from "@/constants/routes"

import { ICustomerData } from "@/types/customers"
import { Link } from "@/components/ui/link"

export default function Related({
  customers,
}: {
  customers: Pick<ICustomerData, "title" | "slug" | "url" | "_id">[]
}) {
  return (
    <>
      <h2 className="text-[28px] leading-[1.125] font-normal tracking-tight md:text-[32px]">
        Explore
      </h2>
      <ul className="flex flex-col overflow-hidden rounded-[8px] border border-gray-3">
        {customers?.map((customer) => (
          <li
            key={customer._id}
            className="relative flex flex-col gap-y-2.5 border-b border-gray-3 p-4 pb-3.5 transition-colors duration-200 last:border-b-0 hover:bg-gray-3"
          >
            {(customer.slug || customer.url) && (
              <Link
                className="absolute top-0 left-0 h-full w-full"
                href={
                  customer.slug
                    ? `${ROUTE.customers}/${customer.slug.current}`
                    : customer.url!
                }
              />
            )}
            <p className="text-sm leading-none font-medium tracking-tighter text-lagune-3">
              Customer Story
            </p>
            <h3 className="text-base leading-snug font-medium tracking-tighter md:text-[20px]">
              {customer.title}
            </h3>
          </li>
        ))}
      </ul>
    </>
  )
}
