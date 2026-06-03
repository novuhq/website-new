import Image, { type StaticImageData } from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import blueShineInside from "@/images/pages/connect/pricing/blue-shine-inside.svg"
import borderShine from "@/images/pages/connect/pricing/border-shine.svg"
import dotsPattern from "@/images/pages/connect/pricing/dots-pattern.png"
import stars from "@/images/pages/connect/pricing/stars.png"
import dollarIcon from "@/svgs/icons/dollar.inline.svg"
import letterIcon from "@/svgs/icons/letter.inline.svg"
import robotIcon from "@/svgs/icons/robot.inline.svg"
import shieldIcon from "@/svgs/icons/shield.inline.svg"
import stackIcon from "@/svgs/icons/stack.inline.svg"
import teamIcon from "@/svgs/icons/team.inline.svg"
import chatIcon from "@/svgs/icons/сhat.inline.svg"

import { cn } from "@/lib/utils"

const CARD_BACKGROUND =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 292 482' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.11999999731779099'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-2.1959e-14 26.832 -39.812 -1.6095e-14 238.14 16.473)'><stop stop-color='rgba(102,122,152,1)' offset='0'/><stop stop-color='rgba(102,122,152,0)' offset='0.88967'/></radialGradient></defs></svg>\"), linear-gradient(90deg, rgba(15, 15, 21, 0.8) 0%, rgba(15, 15, 21, 0.8) 100%)"
const BANNER_BACKGROUND =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 1216 184' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.11999999731779099'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(53.85 25.866 -418.66 1982.6 523 -33.181)'><stop stop-color='rgba(102,122,152,1)' offset='0'/><stop stop-color='rgba(102,122,152,0)' offset='0.88967'/></radialGradient></defs></svg>\"), linear-gradient(90deg, rgba(15, 15, 21, 0.8) 0%, rgba(15, 15, 21, 0.8) 100%)"
const BUTTON_BACKGROUND =
  "linear-gradient(221.861deg, rgba(176, 166, 191, 0.06) 8.6198%, rgba(176, 166, 191, 0.03) 113.79%)"
const BUTTON_HOVER_BACKGROUND =
  "linear-gradient(221.861deg, rgba(176, 166, 191, 0.18) 8.6198%, rgba(176, 166, 191, 0.08) 113.79%)"
const BANNER_BUTTON_BACKGROUND =
  "linear-gradient(237.74deg, rgba(176, 166, 191, 0.06) 8.6198%, rgba(176, 166, 191, 0.03) 113.79%)"
const BANNER_BUTTON_HOVER_BACKGROUND =
  "linear-gradient(237.74deg, rgba(176, 166, 191, 0.18) 8.6198%, rgba(176, 166, 191, 0.08) 113.79%)"

type PricingIconSource = StaticImageData | string

interface IPricingFeature {
  text: string
  icon: PricingIconSource
  iconSize?: number
}

interface IPricingPlan {
  name: string
  price: string
  cta: string
  featured?: boolean
  features: IPricingFeature[]
}

const PRICING_PLANS: IPricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    cta: "Sign up for free",
    features: [
      { text: "100 active conversations", icon: chatIcon },
      { text: "3 agents", icon: robotIcon },
      { text: "2 channels", icon: stackIcon },
    ],
  },
  {
    name: "Starter",
    price: "$9.99",
    cta: "Get started",
    features: [
      { text: "500 active conversations", icon: chatIcon },
      { text: "10 agents", icon: robotIcon },
      { text: "3 channels", icon: stackIcon },
      { text: "$0.03 / extra conversation", icon: dollarIcon },
    ],
  },
  {
    name: "Pro",
    price: "$30",
    cta: "Get started",
    featured: true,
    features: [
      { text: "1,000 active conversations", icon: chatIcon },
      { text: "20 agents", icon: robotIcon },
      { text: "5 channels", icon: stackIcon },
      { text: "$0.02 / extra conversation", icon: dollarIcon },
      { text: "Team-shared MCP vault", icon: teamIcon },
    ],
  },
  {
    name: "Team",
    price: "$250",
    cta: "Get started",
    features: [
      { text: "5,000 active conversations", icon: chatIcon },
      { text: "50 agents", icon: robotIcon },
      { text: "10 channels", icon: stackIcon },
      { text: "$0.015 / extra conversation", icon: dollarIcon },
      { text: "Custom email domain", icon: letterIcon, iconSize: 16 },
      { text: "Cross-team shared context", icon: teamIcon },
      { text: "RBAC", icon: shieldIcon },
    ],
  },
]

const ENTERPRISE_FEATURE_COLUMNS = [
  ["Unlimited agents & channels", "Custom volume"],
  ["HIPAA BAA, SSO/SCIM", "Audit logs and dedicated support"],
]

function getImageUrl(source: PricingIconSource) {
  return typeof source === "string" ? source : source.src
}

function PricingFeatureIcon({
  icon,
  iconSize = 18,
  featured = false,
}: {
  icon: PricingIconSource
  iconSize?: number
  featured?: boolean
}) {
  const iconUrl = getImageUrl(icon)

  return (
    <span
      className="shrink-0"
      style={{
        width: iconSize,
        height: iconSize,
        backgroundColor: featured ? "#bacbff" : "#999999",
        WebkitMask: `url(${iconUrl}) center / contain no-repeat`,
        mask: `url(${iconUrl}) center / contain no-repeat`,
      }}
      aria-hidden
    />
  )
}

function PricingButton({
  children,
  featured = false,
  clickText,
}: {
  children: string
  featured?: boolean
  clickText: string
}) {
  return (
    <NextLink
      href={ROUTE.connectApp}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group/button relative flex h-11.5 w-full items-center justify-center overflow-visible rounded-md px-6 py-4 text-center text-sm leading-none font-medium tracking-normal uppercase transition-[background,border-color,color] duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-lagune-3/40 motion-reduce:transition-none",
        featured
          ? "bg-white px-5 text-black hover:bg-gray-10"
          : "border border-[#534b5d] text-white hover:border-[#686170] focus-visible:border-[#686170]"
      )}
      style={featured ? undefined : { backgroundImage: BUTTON_BACKGROUND }}
      data-click-location="connect_pricing"
      data-click-text={clickText}
    >
      {!featured && (
        <span
          className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-200 ease-out group-hover/button:opacity-100 group-focus-visible/button:opacity-100 motion-reduce:transition-none"
          style={{ backgroundImage: BUTTON_HOVER_BACKGROUND }}
          aria-hidden
        />
      )}
      <span className="relative z-10">{children}</span>
    </NextLink>
  )
}

function PricingCardBackground({ featured }: { featured?: boolean }) {
  if (!featured) {
    return null
  }

  return (
    <>
      <Image
        className="pointer-events-none absolute inset-0 size-full object-cover object-right-top"
        src={blueShineInside}
        width={292}
        height={482}
        alt=""
        loading="eager"
        aria-hidden
        unoptimized
      />
      <Image
        className="pointer-events-none absolute inset-0 w-full"
        src={dotsPattern}
        width={584}
        height={964}
        alt=""
        loading="eager"
        aria-hidden
        unoptimized
      />
    </>
  )
}

function PricingCardOuterEffects() {
  return (
    <>
      <Image
        className="pointer-events-none absolute -top-2.5 -right-3 z-30 h-24.5 w-47.25 max-w-none"
        src={borderShine}
        width={189}
        height={98}
        alt=""
        loading="eager"
        aria-hidden
        unoptimized
      />
      <Image
        className="pointer-events-none absolute -top-25.75 -right-47.5 z-0 h-51.5 w-120.5 max-w-none"
        src={stars}
        width={482}
        height={206}
        alt=""
        loading="eager"
        aria-hidden
        unoptimized
      />
      <span
        className="pointer-events-none absolute -top-49 left-[-31.25px] z-0 h-[586.191px] w-[586.191px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(20,17,34,0.45)_0%,rgba(21,26,56,0)_100%)] blur-[18px] sm:left-21 md:-top-37.75 md:left-22.5 xl:left-[-31.25px]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -top-31.25 left-0 z-0 h-[315.574px] w-[382.323px] -rotate-[84deg] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(58,75,174,0.56)_0%,rgba(21,26,56,0)_100%)] opacity-40 blur-[2px] sm:left-27.5 md:-top-32 md:left-38.5 xl:left-0"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -top-13 left-8 z-0 h-42.75 w-77 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(82,99,185,0.5)_0%,rgba(82,99,185,0)_100%)] blur-[16px] sm:left-21 md:-top-8.5 md:left-33 xl:left-8"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -top-5.25 -left-58.25 z-0 h-69.25 w-97.75 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(20,17,34,0.45)_0%,rgba(20,17,34,0)_100%)] blur-[20px]"
        aria-hidden
      />
    </>
  )
}

function PricingCard({ plan }: { plan: IPricingPlan }) {
  const { name, price, cta, featured, features } = plan

  return (
    <article
      className="relative h-120.5 w-full rounded-xl"
      data-connect-pricing-card
    >
      <div
        className={cn(
          "relative z-20 h-full overflow-hidden rounded-xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.5)]",
          featured
            ? "shadow-[0px_4px_10px_0px_rgba(0,0,0,0.5)]"
            : "border border-[rgba(51,51,71,0.5)]"
        )}
        style={featured ? undefined : { backgroundImage: CARD_BACKGROUND }}
      >
        <PricingCardBackground featured={featured} />
        {featured && (
          <span
            className="pointer-events-none absolute inset-0 z-[11] rounded-[inherit] border-gradient bg-[radial-gradient(114.29%_113.4%_at_74%_-13.4%,#BACBFF_10.74%,rgba(82,99,185,0.3)_49.79%,rgba(186,203,255,0.1)_100%)]"
            aria-hidden
          />
        )}

        <div className="relative z-20 flex h-full flex-col items-start gap-5 p-5.75">
          <div className="flex w-full flex-col items-start gap-12">
            <h3 className="text-xl leading-snug font-medium tracking-tighter whitespace-nowrap text-white">
              {name}
            </h3>

            <div className="flex w-full flex-col items-start gap-6">
              <div className="flex items-baseline gap-0.5">
                <p className="text-[2.5rem] leading-dense font-normal tracking-tighter whitespace-nowrap text-white">
                  {price}
                </p>
                <p className="w-21.5 text-[0.9375rem] leading-snug font-book tracking-tighter text-gray-8">
                  /month
                </p>
              </div>

              <PricingButton
                featured={featured}
                clickText={`${name.toLowerCase()}_${cta.toLowerCase().replace(/\s+/g, "_")}`}
              >
                {cta}
              </PricingButton>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-2.5">
            <p className="w-full text-[0.9375rem] leading-tight font-book tracking-tighter text-gray-10">
              Includes:
            </p>

            <ul className="flex w-full flex-col items-start gap-2.5">
              {features.map((feature) => (
                <li
                  key={feature.text}
                  className="flex w-full items-center gap-2 text-[0.9375rem] leading-tight font-book tracking-tighter text-gray-10"
                >
                  <PricingFeatureIcon
                    icon={feature.icon}
                    iconSize={feature.iconSize}
                    featured={featured}
                  />
                  <span className="min-w-0 flex-1">{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {featured && <PricingCardOuterEffects />}
    </article>
  )
}

function BannerCheckIcon() {
  return (
    <svg
      className="size-4 shrink-0"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3 7.64L6.49 11.14L13 4.86"
        stroke="#e6e6e6"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EnterpriseBanner() {
  return (
    <div
      className="relative mt-4 min-h-46 rounded-xl border border-[rgba(51,51,71,0.5)] px-6 py-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.5)] md:px-8 lg:h-46"
      style={{ backgroundImage: BANNER_BACKGROUND }}
      data-connect-pricing-banner
    >
      <div className="flex w-full max-w-237 flex-col items-start gap-1.5">
        <h3 className="text-[1.375rem] leading-tight font-medium tracking-tighter text-white">
          Enterprise
        </h3>
        <p className="max-w-189.25 text-base leading-snug font-book tracking-tighter text-gray-9">
          For complex workflows: custom volume, compliance controls, dedicated
          support, and flexible hosting.
        </p>
      </div>

      <div className="mt-5 grid max-w-150.25 grid-cols-1 gap-x-4.5 gap-y-2.5 md:grid-cols-[260px_323px]">
        {ENTERPRISE_FEATURE_COLUMNS.map((column, columnIndex) => (
          <ul key={columnIndex} className="flex flex-col gap-2.5">
            {column.map((feature) => (
              <li
                key={feature}
                className="flex min-h-5.25 items-center gap-2 text-[0.9375rem] leading-snug font-book tracking-tighter text-gray-10"
              >
                <BannerCheckIcon />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>

      <NextLink
        href={ROUTE.contactUs}
        className="group/button relative mt-6 inline-flex h-11.5 w-34.5 items-center justify-center overflow-visible rounded-md border border-[#534b5d] px-0 py-4 text-center text-sm leading-none font-medium tracking-normal text-white uppercase transition-[border-color] duration-200 ease-out outline-none hover:border-[#686170] focus-visible:border-[#686170] focus-visible:ring-2 focus-visible:ring-lagune-3/40 motion-reduce:transition-none lg:absolute lg:top-26.25 lg:right-7.75 lg:mt-0"
        style={{ backgroundImage: BANNER_BUTTON_BACKGROUND }}
        data-click-location="connect_pricing"
        data-click-text="contact_us"
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-200 ease-out group-hover/button:opacity-100 group-focus-visible/button:opacity-100 motion-reduce:transition-none"
          style={{ backgroundImage: BANNER_BUTTON_HOVER_BACKGROUND }}
          aria-hidden
        />
        <span className="relative z-10">Contact us</span>
      </NextLink>
    </div>
  )
}

function Pricing() {
  return (
    <section
      id="pricing"
      className="scroll-mt-16 pt-28 md:pt-36 lg:pt-44 xl:pt-50"
      data-connect-section="pricing"
    >
      <div className="relative mx-auto w-full max-w-304 px-5 md:px-8 2xl:px-0">
        <h2 className="relative z-10 mx-auto w-fit max-w-full text-center text-[1.75rem] leading-dense font-medium tracking-tighter text-white md:text-5xl md:whitespace-nowrap">
          Pricing Novu Connect
        </h2>

        <div className="relative z-10 mx-auto mt-16 w-full max-w-[460px] md:max-w-[760px] lg:max-w-[890px] xl:max-w-304">
          <ul className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {PRICING_PLANS.map((plan) => (
              <li key={plan.name} className="min-w-0">
                <PricingCard plan={plan} />
              </li>
            ))}
          </ul>

          <EnterpriseBanner />
        </div>
      </div>
    </section>
  )
}

export default Pricing
