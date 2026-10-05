import Image from "next/image"
import {
  DEPLOY_ACI_COMPLIANCE_BADGES,
  DEPLOY_ACI_DESCRIPTION,
  DEPLOY_ACI_HEADING,
  DEPLOY_ACI_ILLUSTRATION_ALT,
  DEPLOY_ACI_ITEMS,
} from "@/data/pages/web-chat-deploy-aci"
import illustrationDesktop from "@/images/pages/channels/web-chat/deploy-aci-illustration-desktop.jpg"
import illustrationMobile from "@/images/pages/channels/web-chat/deploy-aci-illustration-mobile.jpg"

import { FrameworkLogoCycle } from "@/components/pages/channels/web-chat/framework-logo-cycle"

/**
 * §6 "Deploy the ACI, not just chat" (Task 13). Figma desktop `45487-81046`,
 * mobile `45497-147576`, framework logo set `45497-146963`. Not
 * personalized — no `HueLayer`, no `--wc-accent*` custom properties.
 *
 * Clean 2× exports preserve the lighting and plate while all framework logos
 * are rendered by one full-image SVG track. Its responsive coordinates come
 * from the original outer and center logo positions in Figma.
 *
 * Desktop artwork is 1280px wide at x320 in the 1920px frame. The heading
 * and badges start 32px inside it; the feature list starts at x992.
 */
export function DeployAci() {
  return (
    <section>
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8 lg:max-w-336">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-12 xl:pl-8">
          <h2 className="text-[32px] leading-[1.25em] font-normal tracking-[-0.04em] text-white md:max-w-[840px] md:text-[48px] md:leading-[1.04em] xl:pt-1.25">
            {DEPLOY_ACI_HEADING}
          </h2>
          <p className="text-base leading-[1.5] tracking-[-0.025em] text-white/80 md:text-[18px] md:text-gray-70 lg:max-w-[604px] lg:pt-2 xl:pt-0">
            {DEPLOY_ACI_DESCRIPTION}
          </p>
        </div>

        {/* Both exports already include their rounded outer border. */}
        <div className="relative mx-auto mt-8 aspect-[320/658] w-full max-w-104 overflow-hidden rounded-[16px] bg-black md:mt-14 lg:aspect-[1280/480] lg:max-w-none lg:rounded-[24px]">
          <picture>
            <source
              media="(width < 64rem)"
              srcSet={illustrationMobile.src}
              width={illustrationMobile.width}
              height={illustrationMobile.height}
            />
            <Image
              alt={DEPLOY_ACI_ILLUSTRATION_ALT}
              className="object-cover"
              fill
              unoptimized
              src={illustrationDesktop}
            />
          </picture>

          <FrameworkLogoCycle />
        </div>

        <div className="mt-8 flex flex-col gap-8 md:mt-14 lg:flex-row lg:items-start lg:justify-between lg:gap-12 xl:pr-24 xl:pl-8">
          <ul className="flex items-center gap-7 md:gap-10" role="list">
            {DEPLOY_ACI_COMPLIANCE_BADGES.map((badge) => (
              <li key={badge.label}>
                <Image
                  alt={badge.label}
                  className="h-14 w-auto md:h-20"
                  src={badge.icon}
                />
              </li>
            ))}
          </ul>

          <ul
            className="flex flex-col gap-4 md:gap-7 lg:w-128 lg:shrink-0"
            role="list"
          >
            {DEPLOY_ACI_ITEMS.map((item, index) => (
              <li key={item.title}>
                {index > 0 && (
                  <hr className="mb-4 border-gray-20 md:mb-7" aria-hidden />
                )}
                <div className="flex flex-col gap-1.5 md:gap-2.5">
                  <p className="text-xl leading-none font-medium tracking-[-0.02em] text-white md:text-2xl">
                    {item.title}
                  </p>
                  <p className="text-[15px] leading-[1.5] tracking-[-0.02em] text-gray-50 md:text-[18px]">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default DeployAci
