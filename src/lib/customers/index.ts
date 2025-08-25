import { ICustomerData, ICustomersPageData } from "@/types/customers"
import { sanityFetch } from "@/lib/sanity/client"
import {
  allCustomersQuery,
  customersPageQuery,
  latestCustomersQuery,
} from "@/lib/sanity/queries/customers"

const REVALIDATE_CUSTOMERS_TAG = ["customers"]

export async function getCustomersPage(
  preview = false
): Promise<ICustomersPageData | null> {
  const page = await sanityFetch<ICustomersPageData>({
    query: customersPageQuery,
    preview,
    tags: REVALIDATE_CUSTOMERS_TAG,
  })

  return page
}

export async function getAllCustomers(
  preview = false
): Promise<ICustomerData[]> {
  const customers = await sanityFetch<ICustomerData[]>({
    query: allCustomersQuery,
    preview,
    tags: REVALIDATE_CUSTOMERS_TAG,
  })

  return customers || []
}

export async function getLatestCustomers(
  currentSlug: string,
  preview = false
): Promise<ICustomerData[]> {
  const customers = await sanityFetch<ICustomerData[]>({
    query: latestCustomersQuery,
    qParams: { currentSlug },
    preview,
    tags: REVALIDATE_CUSTOMERS_TAG,
  })

  return customers || []
}
