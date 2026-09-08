import Image from "next/image"
import {
  DEPLOY_ACI_COMPLIANCE_BADGES,
  DEPLOY_ACI_DESCRIPTION,
  DEPLOY_ACI_HEADING,
  DEPLOY_ACI_ILLUSTRATION_ALT,
  DEPLOY_ACI_ITEMS,
} from "@/data/pages/web-chat-deploy-aci"
import illustrationDesktop from "@/images/pages/channels/web-chat/deploy-aci-illustration-desktop.webp"
import illustrationMobile from "@/images/pages/channels/web-chat/deploy-aci-illustration-mobile.webp"

import { FrameworkLogoCycle } from "@/components/pages/channels/web-chat/framework-logo-cycle"

/**
 * §6 "Deploy the ACI, not just chat" (Task 13). Figma desktop `45487-81046`,
 * mobile `45497-147576`, framework logo set `45497-146963`. Not
 * personalized — no `HueLayer`, no `--wc-accent*` custom properties.
 *
 * The illustration is exported as a flattened image (a hybrid decision:
 * it's a dense composite of glass-tile grids, blurred spheres and gradient
 * glows that isn't worth reproducing node-for-node in CSS) with
 * `FrameworkLogoCycle` absolutely positioned over the "Your agent / Your
 * stack" plate's icon slot, matching the same 106x106 slot at both
 * breakpoints (see the percentage insets below, computed from the Figma
 * frame's own pixel coordinates). The stage renders a solid black backing
 * so it fully covers the flattened image's static placeholder logo
 * underneath — the two are the same colour, so the seam is invisible.
 *
 * Container: the desktop frame places the image flush with the section's
 * own left edge while the heading/badges/items sit 32px further in — i.e.
 * the image bleeds past the standard `px-8` page margin. `max-w-[1344px]`
 * is that 32px margin plus the image's true 1280px width on both sides.
 */
export function DeployAci() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto max-w-[1344px] px-5 md:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-16">
          <h2 className="text-[32px] leading-[1.25em] font-normal tracking-[-0.04em] text-white md:max-w-[840px] md:text-[48px] md:leading-[1.04em]">
            {DEPLOY_ACI_HEADING}
          </h2>
          <p className="text-base leading-[1.5] tracking-[-0.025em] text-white/80 md:max-w-[604px] md:pt-2 md:text-[18px] md:text-gray-70">
            {DEPLOY_ACI_DESCRIPTION}
          </p>
        </div>

        <div className="relative mt-8 aspect-[320/658] w-full overflow-hidden rounded-[16px] border-[0.5px] border-gray-20 bg-black md:-mx-8 md:mt-14 md:aspect-[1280/480] md:w-[calc(100%+4rem)] md:rounded-[24px] md:border-[0.75px]">
          <Image
            alt={DEPLOY_ACI_ILLUSTRATION_ALT}
            className="hidden object-cover md:block"
            fill
            priority={false}
            sizes="1280px"
            src={illustrationDesktop}
          />
          <Image
            alt={DEPLOY_ACI_ILLUSTRATION_ALT}
            className="object-cover md:hidden"
            fill
            priority={false}
            sizes="320px"
            src={illustrationMobile}
          />

          <FrameworkLogoCycle className="absolute top-[5.62%] left-[33.44%] h-[16.11%] w-[33.13%] md:top-[38.96%] md:left-[7.58%] md:h-[22.08%] md:w-[8.28%]" />
        </div>

        <div className="mt-8 flex flex-col gap-8 md:mt-14 md:flex-row md:items-start md:justify-between md:gap-16">
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

          <ul className="flex flex-col gap-4 md:w-128 md:gap-7" role="list">
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
