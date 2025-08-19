import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ROUTE } from "@/constants/routes"

import {
  getAllCustomers,
  getCustomerBySlug,
  getLatestCustomers,
} from "@/lib/customers"
import { getMetadata } from "@/lib/get-metadata"
import { cn } from "@/lib/utils"
import CTA from "@/components/cta"
import Content from "@/components/pages/content"
import About from "@/components/pages/customers/about"
import Quote from "@/components/pages/customers/quote"
import Related from "@/components/pages/customers/related"
import Socials from "@/components/pages/customers/socials"
import Breadcrumbs from "@/components/shared/breadcrumbs"
import ColoredList from "@/components/shared/colored-list"
import SocialShare from "@/components/shared/social-share"

interface CustomerStoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: CustomerStoryPageProps): Promise<Metadata> {
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

  return customers.map(({ slug }) => ({
    slug: slug.current,
  }))
}

export default async function CustomerStoryPage({
  params,
}: CustomerStoryPageProps) {
  const { slug } = await params
  const postData = await getCustomerBySlug(slug)

  if (!postData) {
    notFound()
  }

  const { customer } = postData

  const {
    name,
    title,
    story_photo: cover,
    logomark,
    logo,
    about,
    industry,
    channels,
    socials,
    pathname,
    quote,
    challenges_solution: challengesSolution,
    body: bodyContent,
    related,
  } = customer

  const relatedCustomers =
    related && related.length > 0 ? related : await getLatestCustomers(slug)

  return (
    <main>
      <section className="px-5 pt-9.5 md:px-8 md:pt-11.5 lg:px-0 lg:pt-13.5 xl:pt-15.5">
        <article className="mx-auto max-w-232 xl:translate-x-30">
          <Breadcrumbs />
          <h1 className="mt-4 text-[32px] leading-[1.125] font-medium tracking-tighter text-foreground md:text-[44px] xl:max-w-176 xl:text-5xl">
            {title}
          </h1>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[704px_192px] lg:gap-x-8 xl:grid-cols-[704px_192px]">
            {cover && (
              <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-[5px] bg-[#1C1D22] shadow-changelog-image md:mb-12 md:rounded-xl lg:col-start-1 lg:mb-0">
                <Image
                  className=""
                  src={cover}
                  alt="Cover"
                  sizes="100vw"
                  priority
                  fill
                />
              </div>
            )}

            <div className="top-16 flex h-fit w-full flex-col gap-6 border-y border-gray-3 py-6 lg:sticky lg:col-start-2 lg:border-0 lg:py-0">
              <About
                logo={logomark?.url || logo.url}
                name={name}
                about={about}
                industry={industry}
                channels={channels}
              />
              <Socials socials={socials} />
            </div>

            <div className={cn("col-start-1", !cover && "lg:row-start-1")}>
              {quote && <Quote quote={quote} />}
              {challengesSolution && (
                <div className="col-start-1 mt-14 flex flex-col gap-8 md:mt-12 md:flex-row md:gap-4">
                  <ColoredList
                    items={[
                      ...(challengesSolution?.challenges || []).map(
                        (item: string) => ({
                          color: "red" as const,
                          text: item,
                        })
                      ),
                      ...(challengesSolution?.solution || []).map(
                        (item: string) => ({
                          color: "lagune" as const,
                          text: item,
                        })
                      ),
                    ]}
                    redGroupTitle="Key Challenges"
                    laguneGroupTitle="Novu Solution"
                  />
                </div>
              )}

              <Content
                className={cn(
                  "prose-customer prose mt-14 lg:col-start-1 [&>*:first-child]:mt-0!",
                  !cover && "lg:mt-0"
                )}
                content={bodyContent}
              />
              <SocialShare
                className="mt-14 flex border-t border-gray-3 pt-7 lg:hidden"
                pathname={pathname}
              />
              <div className="explore col-start-1 mt-24 flex flex-col gap-y-8">
                <Related customers={relatedCustomers} />
              </div>
            </div>
          </div>
        </article>
      </section>
      <CTA
        title="You’re five minutes away from your first Novu-backed notification"
        description="Create a free account, send your first notification, all before your coffee gets cold... no credit card required."
        className="px-5 !pt-31 !pb-28 md:px-8 md:!pt-32 lg:px-0 lg:pt-53 lg:!pb-52 xl:pt-60 xl:pb-[202px]"
        containerClassName="xl:!max-w-192 lg:!max-w-176 !px-0"
        titleClassName="md:!text-[32px] lg:!text-[36px] xl:!text-[44px]"
        descriptionClassName="!max-w-[722px] xs:!text-wrap !text-base"
        actions={[
          {
            kind: "primary-button",
            label: "Get started",
            href: `${ROUTE.dashboard}?utm_campaign=gs-website-inbox`,
          },
          {
            kind: "secondary-button",
            label: "Contact us",
            href: ROUTE.pricing,
          },
        ]}
      />
    </main>
  )
}
