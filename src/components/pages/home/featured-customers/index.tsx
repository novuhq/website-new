import Image, { type StaticImageData } from "next/image"
import { ROUTE } from "@/constants/routes"
import derivLogo from "@/images/pages/home/featured-customers/deriv.svg"
import unifiedLogo from "@/images/pages/home/featured-customers/unified.svg"
import veritextLogo from "@/images/pages/home/featured-customers/veritext.svg"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

type CustomerLogo = "deriv" | "unified" | "veritext"

interface IFeaturedCustomerTestimonial {
  authorName: string
  authorPosition: string
  company: string
  href: string
  logo: CustomerLogo
  quote: string
}

interface IFeaturedCustomersProps {
  caseStudyLinkText: string
  className?: string
  items: IFeaturedCustomerTestimonial[]
  linkText: string
  title: string
}

const CUSTOMER_LOGOS: Record<
  CustomerLogo,
  { className: string; image: StaticImageData }
> = {
  unified: {
    image: unifiedLogo,
    className: "w-25.5",
  },
  veritext: {
    image: veritextLogo,
    className: "w-23.75",
  },
  deriv: {
    image: derivLogo,
    className: "w-21.5",
  },
}

function FeaturedCustomers({
  className,
  title,
  linkText,
  caseStudyLinkText,
  items,
}: IFeaturedCustomersProps) {
  return (
    <section
      className={cn(
        "featured-customers mt-24 font-inter md:mt-28 lg:mt-32 xl:mt-55",
        className
      )}
      aria-labelledby="featured-customers-heading"
    >
      <div className="section-container">
        <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:gap-12">
          <h2
            id="featured-customers-heading"
            className="max-w-134.5 text-[2rem] leading-[1.125] font-normal tracking-plus-tight text-balance text-foreground md:text-5xl"
          >
            {title}
          </h2>
          <Button
            asChild
            className="h-10.5 shrink-0 px-5 text-base leading-none tracking-tight normal-case md:mb-3 md:self-end"
            size="none"
          >
            <Link href={ROUTE.customers} size="none" variant="clean">
              {linkText}
            </Link>
          </Button>
        </header>

        <ul className="mt-12 grid grid-cols-1 gap-12 border-t border-gray-20 pt-12 md:grid-cols-3 md:gap-8 lg:gap-16">
          {items.map((item) => {
            const logo = CUSTOMER_LOGOS[item.logo]

            return (
              <li
                className="flex min-w-0 flex-col justify-between gap-10 md:h-63.75"
                key={item.company}
              >
                <div className="flex flex-col gap-4.5">
                  <Image
                    src={logo.image}
                    alt={item.company}
                    className={cn(
                      "h-7 object-contain object-left",
                      logo.className
                    )}
                  />

                  <div className="flex flex-col gap-2.5">
                    <blockquote className="text-lg leading-normal font-normal tracking-tighter text-gray-80">
                      “{item.quote}”
                    </blockquote>
                    <p className="text-sm leading-[1.375] font-normal tracking-tighter text-gray-60">
                      {item.authorName}, {item.authorPosition}
                    </p>
                  </div>
                </div>

                <Link
                  className="w-fit text-sm leading-none font-medium tracking-normal text-white hover:text-gray-80 [&_svg]:size-4"
                  href={item.href}
                  size="none"
                  variant="clean"
                  animation="arrow-right"
                  data-click-location="featured_customers"
                  data-click-text={`read_${item.logo}_case_study`}
                >
                  {caseStudyLinkText}
                  <ChevronRight aria-hidden />
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default FeaturedCustomers
