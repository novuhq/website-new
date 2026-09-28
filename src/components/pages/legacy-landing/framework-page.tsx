import { BentoGrid, ImageCardGrid, LogoGrid } from "./card-sections"
import { CodeShowcase } from "./code-showcase"
import {
  frameworkCodeDots,
  frameworkCtaBackground,
  frameworkCtaFree,
  frameworkCtaNow,
  frameworkDevelopers,
  frameworkHero,
  frameworkInfrastructure,
  frameworkIntegrations,
  frameworkLocalAndCloud,
  frameworkReuse,
  frameworkSelfService,
  frameworkWorkflowControl,
} from "./data/framework"
import { DualCta } from "./dual-cta"
import { PictureSection } from "./picture-section"

export function FrameworkLandingPage() {
  return (
    <div className="overflow-hidden">
      <h1 className="sr-only">Framework</h1>

      <CodeShowcase
        {...frameworkHero}
        className="mt-20 mb-[145px] md:mt-25 lg:mt-[134px] lg:mb-[134px] xl:mt-[134px] xl:mb-[222px]"
        codeBlockSize="large"
        codeDotsSrc={frameworkCodeDots}
        primaryAction
      />

      <ImageCardGrid {...frameworkDevelopers} />

      <BentoGrid
        {...frameworkInfrastructure}
        className="relative mt-22 md:mt-22 lg:mt-48 xl:mt-48"
      />

      <DualCta
        {...frameworkCtaNow}
        backgroundSrc={frameworkCtaBackground}
        className="relative mt-31 mb-31 overflow-visible lg:mt-51 lg:mb-51 xl:mt-[235px] xl:mb-62.5"
      />

      <LogoGrid
        {...frameworkIntegrations}
        className="mt-20 md:mt-25 lg:mt-30 xl:mt-40"
      />

      <PictureSection
        {...frameworkWorkflowControl}
        className="mt-15 md:mt-22 lg:mt-25 xl:mt-[238px]"
        theme="image-right"
        mediaClassName="h-full min-h-px"
        mediaInnerClassName="top-0 left-1/2 -translate-x-[55%] -translate-y-[156px] md:top-1/2 md:-translate-x-[56%] md:-translate-y-[52%] lg:-translate-x-[54%] lg:-translate-y-1/2 xl:-translate-x-[53%] xl:-translate-y-[45%] 2xl:-translate-y-[48%]"
        imageClassName="w-[700px] md:w-[816px] lg:w-[1012px] xl:w-[1198px]"
      />

      <PictureSection
        {...frameworkSelfService}
        className="mt-[410px] md:mt-[110px] lg:mt-[184px] xl:mt-[380px]"
        mediaClassName="h-full min-h-px"
        mediaInnerClassName="top-0 left-1/2 -translate-x-[52%] -translate-y-[156px] min-[501px]:-translate-y-[176px] md:top-1/2 md:-translate-y-[52%] lg:-translate-x-[55%] lg:-translate-y-[47%] xl:-translate-x-[53%] 2xl:-translate-x-[60%]"
        imageClassName="w-[440px] min-[501px]:w-[506px] md:w-[506px] lg:w-[600px] xl:w-[850px] 2xl:w-[1128px]"
      />

      <PictureSection
        {...frameworkReuse}
        className="mt-[280px] md:mt-22 lg:mt-[184px] xl:mt-[414px]"
        theme="image-right"
        mediaClassName="h-full min-h-px"
        mediaInnerClassName="top-0 left-1/2 -translate-x-[46%] -translate-y-[126px] min-[501px]:-translate-y-[142px] md:top-1/2 md:-translate-y-[52%] lg:-translate-x-[43%] lg:-translate-y-[45%] xl:-translate-x-[44%] xl:-translate-y-[40%]"
        imageClassName="w-[540px] min-[501px]:w-[600px] md:w-[580px] lg:w-[720px] xl:w-[1024px]"
      />

      <PictureSection
        {...frameworkLocalAndCloud}
        className="mt-[260px] mb-[220px] md:mt-22 md:mb-12.5 lg:mt-[184px] lg:mb-25 xl:mt-[402px]"
        mediaClassName="h-full min-h-px"
        mediaInnerClassName="top-0 left-1/2 -translate-x-[38%] -translate-y-[288px] md:top-1/2 md:-translate-y-[56%] lg:-translate-x-[39%] xl:-translate-x-[38%] xl:-translate-y-[45%] 2xl:-translate-x-[42%] 2xl:-translate-y-[51%]"
        imageClassName="w-[440px] min-[501px]:w-[480px] md:w-[480px] lg:w-[620px] xl:w-[850px] 2xl:w-[1081px]"
      />

      <DualCta
        {...frameworkCtaFree}
        backgroundSrc={frameworkCtaBackground}
        className="relative mt-31 mb-[147px] overflow-visible lg:mt-35 xl:mt-70 2xl:mt-47.5"
      />
    </div>
  )
}
