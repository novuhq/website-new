import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ROUTE } from "@/constants/routes"

import { getAllCustomers, getCustomerBySlug } from "@/lib/customers"
import { getMetadata } from "@/lib/get-metadata"

interface ChangelogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: ChangelogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const customerData = await getCustomerBySlug(slug)

  if (!customerData) {
    return {}
  }

  const { title, seo } = customerData.customer

  return getMetadata({
    title: seo?.title || title,
    description: seo?.description,
    pathname: `${ROUTE.customers}/${customerData.customer.slug.current}`,
    imagePath: seo?.socialImage,
  })
}

export async function generateStaticParams() {
  const customers = await getAllCustomers()

  return customers
    .filter(
      (customer) => customer.link_type === "story" && customer.slug?.current
    )
    .map(({ slug }) => ({
      slug: slug.current,
    }))
}

export default async function CustomerStoryPage({
  params,
}: ChangelogPostPageProps) {
  const { slug } = await params
  const postData = await getCustomerBySlug(slug)

  if (!postData) {
    notFound()
  }

  const { customer, previousCustomer, nextCustomer } = postData

  console.log(customer, "CUSTOMER")

  return (
    <main className="px-5 pb-26 md:px-8 lg:pb-28 xl:pb-30">
      <div />
    </main>
  )
}
