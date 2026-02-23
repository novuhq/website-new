import { ICustomerData } from "@/types/customers"
import { sanityFetch } from "@/lib/sanity/client"
import { customerBySlugQuery } from "@/lib/sanity/queries/customers"
import { REVALIDATION_CONFIG } from "@/lib/revalidation/config"

const REVALIDATE_CUSTOMER_TAG = [...REVALIDATION_CONFIG.customer.tags]

export async function getCustomerBySlug(
  slug: string,
  preview = false
): Promise<{ customer: ICustomerData } | null> {
  const customer = await sanityFetch<ICustomerData>({
    query: customerBySlugQuery,
    qParams: { slug },
    preview,
    tags: REVALIDATE_CUSTOMER_TAG,
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
