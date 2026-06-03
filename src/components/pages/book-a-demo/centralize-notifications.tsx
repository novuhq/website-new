import Image from "next/image"
import centralizeNotificationsImage from "@/images/pages/book-a-demo/centralize-notifications/centralize-notifications.webp"
import gridIcon from "@/images/pages/book-a-demo/centralize-notifications/icons/grid.svg"
import layersIcon from "@/images/pages/book-a-demo/centralize-notifications/icons/layers.svg"
import rocketIcon from "@/images/pages/book-a-demo/centralize-notifications/icons/rocket.svg"
import treeIcon from "@/images/pages/book-a-demo/centralize-notifications/icons/tree.svg"

const FEATURE_ICONS = {
  grid: gridIcon,
  layers: layersIcon,
  rocket: rocketIcon,
  tree: treeIcon,
} as const

type FeatureIcon = keyof typeof FEATURE_ICONS

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
    icon: "tree",
  },
]

function FeatureIcon({ icon }: { icon: FeatureIcon }) {
  return (
    <span className="block size-10 shrink-0" aria-hidden>
      <Image
        className="size-full"
        src={FEATURE_ICONS[icon]}
        width={40}
        height={40}
        alt=""
        loading="lazy"
      />
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
            className="size-full scale-[1.25] object-contain sm:scale-100"
            src={centralizeNotificationsImage}
            alt=""
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) calc(100vw - 64px), 1216px"
            loading="lazy"
          />
        </div>

        <ul className="relative z-10 mt-10 grid w-full max-w-304 grid-cols-1 gap-12 text-left sm:grid-cols-2 md:mt-0 md:gap-10 lg:mt-0 xl:absolute xl:bottom-19.5 xl:left-1/2 xl:mt-0 xl:-translate-x-1/2 xl:grid-cols-4 xl:gap-12 xl:px-0">
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
