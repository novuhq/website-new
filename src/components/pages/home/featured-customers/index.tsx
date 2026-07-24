import { ROUTE } from "@/constants/routes"

import { ICustomerCardData } from "@/types/customers"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"
import HeroCard from "@/components/pages/customers/hero-card"

interface IFeaturedCustomersProps {
  className?: string
  title: string
  description: string
  linkText: string
  cards: ICustomerCardData[]
}

// HeroCard's CARDS_CONFIG is position-dependent (big/small/small/big), so the
// section only renders with the complete set of 4 curated story cards.
const REQUIRED_CARDS_COUNT = 4

function FeaturedCustomers({
  className,
  title,
  description,
  linkText,
  cards,
}: IFeaturedCustomersProps) {
  if (cards.length !== REQUIRED_CARDS_COUNT) {
    return null
  }

  return (
    <section
      className={cn(
        "featured-customers mt-24 font-inter md:mt-28 lg:mt-32 xl:mt-55",
        className
      )}
      aria-labelledby="featured-customers-heading"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col px-5 md:px-8 lg:max-w-288">
        <header className="flex flex-col items-start">
          <h2
            id="featured-customers-heading"
            className="text-[2rem] leading-[1.125] font-normal tracking-plus-tight text-balance text-foreground md:text-5xl md:leading-[1.125] xl:max-w-136 xl:text-[3.5rem]"
          >
            {title}
          </h2>
          <p className="mt-4 max-w-xl text-base font-normal tracking-tighter text-gray-60 md:text-lg md:leading-normal xl:text-xl xl:leading-normal">
            {description}
          </p>
          <Link
            className="mt-4 text-base leading-none tracking-tight text-lagune-3 transition-colors duration-200 hover:text-lagune-2"
            href={ROUTE.customers}
          >
            {linkText}
          </Link>
        </header>
        <ul className="relative mt-10 flex w-full flex-row flex-wrap gap-4 md:mt-12 md:gap-7 lg:mt-14 lg:gap-8">
          {cards.map((card, index) => (
            <HeroCard key={card._id} {...card} index={index} />
          ))}
        </ul>
      </div>
    </section>
  )
}

export default FeaturedCustomers
