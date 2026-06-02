import Image from "next/image"
import centralizeNotificationsImage from "@/images/pages/book-a-demo/centralize-notifications/centralize-notifications.webp"

type FeatureIcon = "layers" | "rocket" | "grid"

interface ICentralizeFeature {
  title: string
  description: string
  icon: FeatureIcon
}

const CENTRALIZE_FEATURES: ICentralizeFeature[] = [
  {
    title: "Notification center",
    description: "Give users one place to receive and act on key updates.",
    icon: "layers",
  },
  {
    title: "User-controlled preferences",
    description: "Let users choose how and when notifications arrive.",
    icon: "rocket",
  },
  {
    title: "Notification digests",
    description: "Group updates into summaries to reduce noise.",
    icon: "grid",
  },
  {
    title: "Centralized workflow logic",
    description: "Manage notification behavior from one workflow layer.",
    icon: "grid",
  },
]

function FeatureIcon({ icon }: { icon: FeatureIcon }) {
  return (
    <span
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-13 to-gray-8 text-background"
      aria-hidden
    >
      {icon === "layers" && (
        <svg
          className="size-5"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 2.75L17 6.25L10 9.75L3 6.25L10 2.75Z"
            fill="currentColor"
          />
          <path
            d="M4 9.25L10 12.25L16 9.25"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="square"
            strokeLinejoin="round"
          />
          <path
            d="M4 12.75L10 15.75L16 12.75"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="square"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {icon === "rocket" && (
        <svg
          className="size-5"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.75 2.5C10.3 2.97 7.62 4.98 5.72 8.52L2.5 9.5L5 12L7.5 14.5L8.48 11.28C12.02 9.38 14.03 6.7 14.5 3.25L13.75 2.5Z"
            fill="currentColor"
          />
          <path
            d="M5.45 13.5C4.25 13.75 3.42 14.58 3.17 15.78C4.37 15.53 5.2 14.7 5.45 13.5Z"
            fill="currentColor"
          />
          <path
            d="M10.95 6.05H11.05"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      )}

      {icon === "grid" && (
        <svg
          className="size-5"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 3H8V8H3V3Z" fill="currentColor" />
          <path d="M3 12H8V17H3V12Z" fill="currentColor" />
          <path d="M12 12H17V17H12V12Z" fill="currentColor" />
          <path
            d="M12.25 5.55L14.15 7.45L17.25 3.75"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="square"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  )
}

function BookADemoCentralizeNotifications() {
  return (
    <section className="relative isolate overflow-hidden bg-background py-16 md:py-20 xl:min-h-314.25 xl:py-0">
      <div className="relative mx-auto flex w-full max-w-384 flex-col items-center px-5 md:px-8 xl:min-h-314.25 xl:px-0 xl:pt-55.5">
        <Image
          className="pointer-events-none absolute top-64.75 left-1/2 z-0 hidden h-auto w-384 max-w-none -translate-x-1/2 select-none xl:block"
          src={centralizeNotificationsImage}
          alt=""
          sizes="1536px"
          loading="lazy"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex w-full max-w-264 flex-col items-center gap-4.5 text-center">
          <h2 className="max-w-189.5 text-[2rem] leading-dense font-medium tracking-tighter text-balance text-white md:text-[2.5rem] xl:text-[2.75rem]">
            Centralize customer notifications across products and channels
          </h2>
          <p className="max-w-170.5 text-base leading-normal font-book tracking-tighter text-pretty text-gray-8 md:text-lg">
            Give teams one controlled layer for notification workflows,
            preferences, digests, and in-app communication &mdash; without
            rebuilding notification logic in every product.
          </p>
        </div>

        <div
          className="relative z-0 mx-auto mt-9 aspect-[1536/907] w-full max-w-304 md:mt-0 lg:mt-0 xl:hidden"
          aria-hidden
        >
          <Image
            className="size-full object-contain"
            src={centralizeNotificationsImage}
            alt=""
            sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) calc(100vw - 64px), 1216px"
            loading="lazy"
          />
        </div>

        <ul className="relative z-10 mt-10 grid w-full max-w-304 grid-cols-1 gap-8 text-left sm:grid-cols-2 md:mt-0 md:gap-10 lg:mt-0 xl:absolute xl:bottom-19.5 xl:left-1/2 xl:mt-0 xl:-translate-x-1/2 xl:grid-cols-4 xl:gap-12 xl:px-0">
          {CENTRALIZE_FEATURES.map(({ title, description, icon }) => (
            <li key={title} className="flex flex-col items-start gap-5">
              <FeatureIcon icon={icon} />

              <div className="flex flex-col gap-2.5">
                <h3 className="text-xl leading-snug font-medium tracking-tighter text-white">
                  {title}
                </h3>
                <p className="text-base leading-snug font-book tracking-tighter text-gray-9">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default BookADemoCentralizeNotifications
