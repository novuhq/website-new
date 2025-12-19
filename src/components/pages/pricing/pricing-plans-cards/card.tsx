import Image from "next/image"
import borderShine from "@/images/pages/pricing/border-shine.svg"
import dotsPattern from "@/images/pages/pricing/dots-pattern.png"
import pinkShineInsideCard from "@/images/pages/pricing/pink-shine-inside.svg"
import stars from "@/images/pages/pricing/stars.png"
import { PortableText } from "@portabletext/react"
import clsx from "clsx"

import { IPricingHeroCard } from "@/types/pricing"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

const Card = ({
  plan,
  onContactUsClick,
}: {
  plan: IPricingHeroCard
  onContactUsClick: (source: string) => void
}) => {
  const {
    title,
    isFeatured,
    textBeforePrice,
    price,
    link,
    extraInfo,
    description,
    details,
  } = plan
  const id = title.toLowerCase()
  const isContactButton = link.text.toLowerCase().includes("contact")

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isContactButton) {
      e.preventDefault()
      // @ts-expect-error analytics is not defined in the global scope
      window?.analytics?.track(
        "Pricing Event: Click Contact Us on pricing card",
        {
          packageType: title,
          source: `pricing_card_${id}`,
        }
      )
      if (onContactUsClick) {
        onContactUsClick(`pricing_card_${id}`)
      }
    }
  }

  const priceData = price && price.length > 0 ? price[0] : null
  const isNumericPrice = priceData?._type === "numericPrice"
  const isCustomPrice = priceData?._type === "customPrice"

  return (
    <li className="relative min-h-[394px] rounded-xl">
      <div
        className={clsx(
          "relative z-20 h-full overflow-hidden rounded-xl p-6",
          isFeatured
            ? "bg-[linear-gradient(152deg,#1F1122_0.45%,#1B1529_98.47%)]"
            : "bg-grey-pricing-card bg-[#111018]"
        )}
      >
        <div className="relative z-20">
          <h3 className="text-[20px] leading-snug font-medium tracking-tighter">
            {title}
          </h3>
          <div className="relative mt-[42px] flex flex-col md:mt-[50px] md:min-h-[72px]">
            {textBeforePrice && (
              <p className="mb-1 text-[15px] leading-snug font-medium tracking-tighter text-white md:mb-0">
                {textBeforePrice}
              </p>
            )}
            {priceData && (
              <div className="mt-auto flex items-end">
                {isNumericPrice && (
                  <>
                    <p className="text-[40px] leading-dense tracking-tighter">
                      ${priceData.value}
                    </p>
                    {priceData.paymentPeriod && (
                      <p className="relative bottom-0.5 ml-1 text-[15px] leading-snug font-book tracking-tighter text-gray-8">
                        / {priceData.paymentPeriod}
                      </p>
                    )}
                  </>
                )}
                {isCustomPrice && (
                  <p className="text-[40px] leading-dense tracking-tighter">
                    {priceData.value}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="relative mt-[22px]">
            <Button
              className="z-20 h-[46px] w-full text-[14px] uppercase"
              size="sm"
              variant={isFeatured ? "default" : "outline"}
              onClick={handleButtonClick}
              asChild
            >
              <Link
                variant="white"
                href={link.href}
                rel={link.isExternal ? "noopener noreferrer" : undefined}
                target={link.isExternal ? "_blank" : undefined}
              >
                {link.text}
              </Link>
            </Button>
            {extraInfo && (
              <p className="absolute inset-x-0 top-[calc(100%+8px)] truncate text-center text-[13px] leading-snug font-book tracking-tighter text-gray-9">
                {extraInfo}
              </p>
            )}
          </div>
          <p className="mt-[46px] text-[16px] leading-snug font-book tracking-tighter text-gray-9 md:min-h-[66px] lg:min-h-[initial] xl:min-h-[66px]">
            {description}
          </p>
          <span
            className="mt-4 mb-5 block h-px w-full border-t border-dashed border-gray-5"
            aria-hidden
          />
          {details && (
            <div
              className={clsx(
                'mt-4.5 text-[16px] leading-snug font-book tracking-tighter [&_li]:flex [&_li]:gap-x-2 [&_li]:before:content-[url("/images/check-icon.svg")]',
                "[&_li]:text-[15px] [&_li]:before:relative [&_li]:before:top-0.5 [&_li]:before:size-4 [&_ul]:mt-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-y-3 [&_ul]:md:mt-3.5 [&_ul]:md:gap-y-[13px] [&_ul]:xl:mt-[18px]",
                isFeatured
                  ? "text-white [&_li]:before:content-[url('/images/check-icon.svg')]"
                  : "text-gray-10 [&_li]:before:content-[url('/images/check-icon-gray.svg')]"
              )}
            >
              <PortableText value={details} />
            </div>
          )}
        </div>
        {isFeatured && (
          <>
            <Image
              src={pinkShineInsideCard}
              className="pointer-events-none absolute inset-0 w-full"
              width={309}
              height={571}
              alt=""
              loading="eager"
              aria-hidden
            />
            <Image
              className="pointer-events-none absolute inset-0 w-full"
              src={dotsPattern}
              width={617}
              height={1142}
              alt=""
              loading="eager"
              aria-hidden
            />
          </>
        )}
        <span
          className={clsx(
            "absolute inset-0 z-[11] rounded-[inherit] border-gradient",
            isFeatured
              ? "bg-[radial-gradient(114.29%_113.4%_at_74%_-13.4%,#f1ddfa_10.74%,rgba(95,82,122,0.3)_49.79%,rgba(168,148,209,0.1)_100%)]"
              : "bg-[linear-gradient(246.73deg,rgba(60,60,83,0.8)_15.63%,rgba(52,52,71,0.6)_84.63%)]"
          )}
          aria-hidden
        />
      </div>
      {isFeatured && (
        <>
          <Image
            src={borderShine}
            className="pointer-events-none absolute -top-2.5 -right-3 z-30 h-[98px] w-[209px]"
            width="209"
            height="98"
            alt=""
            loading="eager"
            aria-hidden
          />
          <Image
            className="pointer-events-none absolute -top-[103px] -right-[190px] z-10 h-[206px] w-[482px] max-w-none"
            src={stars}
            width={482}
            height={206}
            alt=""
            loading="eager"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute -top-[49px] left-[70px] z-0 h-[171px] w-[308px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_#663179_0%,_rgba(90,_49,_121,_0)_100%)] blur-[16px] sm:left-[84px] md:-top-[34px] md:left-[132px]"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute -top-[142px] left-[90px] z-0 h-[355px] w-[280px] -rotate-[84deg] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_#5E1C59_0%,_rgba(35,_18,_59,_0)_100%)] opacity-40 sm:left-[110px] md:-top-[128px] md:left-[154px]"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute -top-[151px] left-5 z-0 h-[458px] w-[370px] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_#3B1230_16.51%,_rgba(59,_18,_56,_0)_100%)] sm:left-[46px] md:left-[90px]"
            aria-hidden
          />
        </>
      )}
    </li>
  )
}

export default Card
