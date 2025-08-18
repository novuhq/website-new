import {
  ICustomerData,
  ICustomersPageData,
  ICustomerWithNeighbors,
} from "@/types/customers"
import { sanityFetch } from "@/lib/sanity/client"
import {
  allCustomersQuery,
  customerBySlugQuery,
  customersPageQuery,
  latestCustomersQuery,
} from "@/lib/sanity/queries/customers"

const REVALIDATE_CUSTOMERS_TAG = ["customer", "customers"]

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

export async function getCustomerBySlug(
  slug: string,
  preview = false
): Promise<ICustomerWithNeighbors | null> {
  const customer = await sanityFetch<ICustomerData>({
    query: customerBySlugQuery,
    qParams: { slug },
    preview,
    tags: REVALIDATE_CUSTOMERS_TAG,
  })

  if (!customer) {
    return null
  }

  const customerWithSeo = {
    ...customer,
    seo: customer.seo
      ? {
          ...customer.seo,
          socialImage:
            customer.seo.socialImage ??
            `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}/api/og?template=customer&title=${customer.seo.title}`,
        }
      : undefined,
  }

  return {
    customer: customerWithSeo,
  }
}

export async function getCustomersByCardType(
  cardType: "big" | "small",
  preview = false
): Promise<ICustomerData[]> {
  const customers = await getAllCustomers(preview)
  return customers.filter((customer) => customer.card_type === cardType)
}

export async function getCustomerStories(
  preview = false
): Promise<ICustomerData[]> {
  const customers = await getAllCustomers(preview)
  return customers.filter((customer) => customer.link_type === "story")
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
