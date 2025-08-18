import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ROUTE } from "@/constants/routes"

import { getAllCustomers, getCustomerBySlug } from "@/lib/customers"
import { getMetadata } from "@/lib/get-metadata"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"
import CTA from "@/components/cta"
import DynamicIcon from "@/components/dynamic-icon"
import Content from "@/components/pages/content"
import SocialShare from "@/components/shared/social-share"

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

  const {
    name,
    title,
    story_photo: cover,
    logomark,
    about,
    industry,
    email_channels: email,
    inbox_channels: inbox,
    sms_channels: sms,
    pathname,
    quote_title: quoteTitle,
    quote_author_logo: quoteAuthorLogo,
    quote_author_name: quoteAuthorName,
    quote_author_position: quoteAuthorPosition,
    key_challenges: keyChallenges,
    novu_solution: novu_solution,
    body: bodyContent,
    related,
  } = customer

  console.log(customer, "CUSTOMER")

  console.log(bodyContent, "CONTENT")

  return (
    <main>
      <section className="pt-9.5 md:pt-11.5 lg:pt-13.5 xl:pt-15.5">
        <article className="mx-auto max-w-232 xl:translate-x-30">
          <div>
            <Link
              className="group -ml-px gap-x-1 leading-none tracking-tighter"
              href={ROUTE.customers}
              variant="muted-dark"
              size="sm"
            >
              <DynamicIcon icon="chevron-left" />
              Customers
            </Link>
            <span className="mx-2.5 text-sm leading-none font-medium tracking-tight text-gray-7 md:mx-2.75">
              /
            </span>
            <p className="-mt-px text-sm tracking-tighter md:inline">{name}</p>
          </div>
          <h1 className="mt-3 text-4xl leading-[1.125] font-medium tracking-tighter text-foreground md:mt-3.5 md:text-5xl xl:max-w-176">
            {title}
          </h1>
          <div className="mt-7.75 grid grid-cols-1 lg:grid-cols-[704px_192px] lg:gap-x-8 xl:grid-cols-[704px_192px]">
            {cover && (
              <div className="relative mb-10.5 aspect-video w-full overflow-hidden rounded-xl bg-[#1C1D22] shadow-changelog-image md:mb-12 lg:col-start-1 lg:mb-0">
                <Image
                  className=""
                  src={cover.url}
                  alt="Cover"
                  sizes="100vw"
                  fill
                />
              </div>
            )}
            <div className="sticky top-16 flex h-fit w-full flex-col gap-6">
              <dl className="flex flex-col border-b border-gray-3 pb-6 md:flex-row lg:flex-col">
                <Image
                  className={cn("h-7 w-36 object-cover")}
                  src={logomark.url}
                  alt={name || ""}
                  width={144}
                  height={28}
                  priority
                  quality={100}
                />
                <div className="mt-7 flex flex-col gap-2">
                  <dt className="leading-tight font-medium tracking-tighter">
                    About
                  </dt>
                  <dd className="mt-2 text-sm leading-snug tracking-tighter text-muted-foreground lg:-mt-px">
                    {about}
                  </dd>
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  <dt className="leading-tight font-medium tracking-tighter">
                    Industry
                  </dt>
                  <dd className="mt-2 text-sm leading-snug tracking-tighter text-muted-foreground lg:-mt-px">
                    {industry}
                  </dd>
                </div>
                <div className="mt-6 flex flex-col gap-2.5">
                  <dt className="leading-tight font-medium tracking-tighter">
                    Channels
                  </dt>
                  <dd className="flex items-center gap-2">
                    <Link
                      href={`mailto:${email}`}
                      className="rounded-[116px] border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.06)] px-2.5 pt-2 pb-1.5 text-sm leading-none tracking-tighter text-gray-9"
                    >
                      Email
                    </Link>
                    <Link
                      href={`${inbox}`}
                      className="rounded-[116px] border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.06)] px-2.5 pt-2 pb-1.5 text-sm leading-none tracking-tighter text-gray-9"
                    >
                      Inbox
                    </Link>
                    <Link
                      href={`sms:${sms}`}
                      className="rounded-[116px] border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.06)] px-2.5 pt-2 pb-1.5 text-sm leading-none tracking-tighter text-gray-9"
                    >
                      SMS
                    </Link>
                  </dd>
                </div>
              </dl>
              <SocialShare className="md:-mt-px" pathname={pathname} />
            </div>
            <div className="col-start-1 mt-10 border-l-2 border-gray-3 pl-6">
              <h2 className="text-[28px] leading-normal font-normal tracking-tight">
                {quoteTitle}
              </h2>
              <div className="mt-4 flex gap-x-2.5">
                {quoteAuthorLogo && (
                  <Image
                    className="rounded-full"
                    src={quoteAuthorLogo.url}
                    alt={quoteAuthorName || ""}
                    width={28}
                    height={28}
                    priority
                    quality={100}
                  />
                )}
                <p className="flex items-center">
                  <span className="text-[13px] leading-tight font-medium">
                    {quoteAuthorName}
                  </span>
                  <span className="ml-1.5 text-sm leading-normal font-normal text-gray-7">
                    — {quoteAuthorPosition}
                  </span>
                </p>
              </div>
            </div>
            <div className="col-start-1 mt-12 flex gap-4">
              <ul className="flex w-1/2 flex-col gap-3">
                <h2 className="mb-1 text-2xl leading-snug font-medium tracking-tight">
                  Key Challenges
                </h2>
                {keyChallenges?.map((challenge) => (
                  <li
                    key={challenge}
                    className="relative pl-3.5 text-base font-normal text-gray-9 before:absolute before:top-1/2 before:left-0 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-red-1 before:content-['']"
                  >
                    {challenge}
                  </li>
                ))}
              </ul>
              <ul className="flex w-1/2 flex-col gap-3">
                <h2 className="mb-1 text-2xl leading-snug font-medium tracking-tight">
                  Novu Solution
                </h2>
                {novu_solution?.map((solution) => (
                  <li
                    key={solution}
                    className="relative pl-3.5 text-base font-normal text-gray-9 before:absolute before:top-1/2 before:left-0 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-lagune-3 before:content-['']"
                  >
                    {solution}
                  </li>
                ))}
              </ul>
            </div>
            <Content
              className={cn(
                "prose mt-14 lg:col-start-1 [&>*:first-child]:mt-0!",
                !cover && "lg:mt-0"
              )}
              content={bodyContent}
            />
            <section className="explore col-start-1 mt-24 flex flex-col gap-y-8">
              <h2 className="text-[32px] leading-[1.125] font-normal tracking-tight">
                Explore
              </h2>
              <ul className="flex flex-col rounded-[8px] border border-gray-3">
                {related?.map((customer) => (
                  <li
                    key={customer._id}
                    className="relative flex flex-col gap-y-2.5 border-b border-gray-3 p-4 pb-3.5 last:border-b-0"
                  >
                    <Link
                      className="absolute top-0 left-0 h-full w-full"
                      href={customer.slug.current}
                    />
                    <p className="text-sm leading-none font-medium tracking-tight text-lagune-3">
                      Customer Story
                    </p>
                    <h3 className="truncate text-[20px] leading-snug font-medium tracking-tight">
                      {customer.title}
                    </h3>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </article>
        <CTA
          title="You’re five minutes away from your first Novu-backed notification"
          description="Create a free account, send your first notification, all before your coffee gets cold... no credit card required."
          className="!pt-60 !pb-[202px]"
          containerClassName="!max-w-192 !px-0"
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
      </section>
    </main>
  )
}
