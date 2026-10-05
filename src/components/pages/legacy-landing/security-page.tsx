import { ComplianceGrid, LinkCardGrid, SecurityCta } from "./card-sections"
import {
  securityCompliance,
  securityCta,
  securityCtaDots,
  securityCtaTexture,
  securityDeploymentModes,
  securityFeatures,
  securityHero,
} from "./data/security"
import { IconGridSection } from "./icon-grid-section"
import { PictureSection } from "./picture-section"

export function SecurityLandingPage() {
  return (
    <div className="-mt-16 overflow-hidden pb-28 lg:pb-32 xl:pb-52">
      <h1 className="sr-only">About secure notifications</h1>

      <PictureSection
        {...securityHero}
        className="mt-14 pt-14 md:mt-26 md:pt-0 lg:mt-36 xl:mt-40"
        contentClassName="[&_p]:tracking-normal"
        mediaClassName="h-48 min-[501px]:h-[300px] md:h-[300px] lg:h-[400px] xl:h-[560px]"
        mediaInnerClassName="top-0 left-1/2 -translate-x-[47%] -translate-y-16 min-[501px]:-translate-y-28 md:top-1/2 md:-translate-y-[46%]"
        imageClassName="w-[530px] min-[501px]:w-[800px] md:w-[800px] lg:w-[1000px] xl:w-[1400px]"
        priority
      />

      <ComplianceGrid {...securityCompliance} />

      <IconGridSection
        {...securityFeatures}
        className="relative mt-20 md:mt-25 lg:mt-30 xl:mt-[191px]"
        titleClassName="md:px-20"
        listClassName="mt-15 gap-y-7.5 md:mt-15 md:gap-y-7.5 lg:mt-15 xl:mt-15"
        linksAtBottom
      />

      <LinkCardGrid
        {...securityDeploymentModes}
        className="relative mt-20 md:mt-25 lg:mt-30 xl:mt-51"
      />

      <SecurityCta
        {...securityCta}
        className="relative mt-20 md:mt-25 lg:mt-30 xl:mt-52"
        dotsSrc={securityCtaDots}
        textureSrc={securityCtaTexture}
      />
    </div>
  )
}
