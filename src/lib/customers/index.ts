import { ICustomerData, ICustomersPageData } from "@/types/customers"
import { sanityFetch } from "@/lib/sanity/client"
import {
  allCustomersLogosQuery,
  allCustomersQuery,
  customersGridQuery,
  customersPageQuery,
  latestCustomersQuery,
} from "@/lib/sanity/queries/customers"
import { REVALIDATION_CONFIG } from "@/lib/revalidation/config"

const REVALIDATE_CUSTOMERS_TAG = [REVALIDATION_CONFIG.customers.type]

export async function getCustomersPage(
  preview = false
): Promise<ICustomersPageData | null> {
  const [page, customersGrid] = await Promise.all([
    sanityFetch<Omit<ICustomersPageData, "customersGrid">>({
      query: customersPageQuery,
      preview,
      tags: REVALIDATE_CUSTOMERS_TAG,
    }),
    sanityFetch<ICustomersPageData["customersGrid"]>({
      query: customersGridQuery,
      preview,
      tags: REVALIDATE_CUSTOMERS_TAG,
    }),
  ])

  if (!page) return null

  return {
    ...page,
    customersGrid: customersGrid || [],
  }
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
): Promise<Array<Pick<ICustomerData, "_id" | "slug" | "title" | "logo">>> {
  const customers = await sanityFetch<
    Array<Pick<ICustomerData, "_id" | "slug" | "title" | "logo">>
  >({
    query: latestCustomersQuery,
    qParams: { currentSlug },
    preview,
    tags: REVALIDATE_CUSTOMERS_TAG,
  })
  return customers || []
}

export async function getAllCustomersLogos(
  preview = false
): Promise<ICustomerData[]> {
  const customers = await sanityFetch<ICustomerData[]>({
    query: allCustomersLogosQuery,
    preview,
    tags: REVALIDATE_CUSTOMERS_TAG,
  })

  return customers || []
}
