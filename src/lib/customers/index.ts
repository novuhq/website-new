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

  const allCustomers = await getAllCustomers(preview)
  const storyCustomers = allCustomers.filter((c) => c.link_type === "story")
  const index = storyCustomers.findIndex((c) => c.slug.current === slug)

  const nextCustomer =
    index > 0
      ? {
          slug: storyCustomers[index - 1].slug.current,
          title: storyCustomers[index - 1].title,
        }
      : { slug: null, title: null }

  const previousCustomer =
    index < storyCustomers.length - 1
      ? {
          slug: storyCustomers[index + 1].slug.current,
          title: storyCustomers[index + 1].title,
        }
      : { slug: null, title: null }

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
    previousCustomer,
    nextCustomer,
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
