import UseCaseLottieAnimation from "./lottie-animation"
import type { UseCaseFeature, UseCaseSlug } from "./types"

interface UseCaseFeaturesProps {
  features: readonly UseCaseFeature[]
  slug: UseCaseSlug
}

function UseCaseFeatures({ features, slug }: UseCaseFeaturesProps) {
  return (
    <section className="relative mt-20 overflow-hidden md:mt-30 lg:mt-38 xl:mt-50">
      <div className="relative z-10 mx-auto w-full max-w-[1382px] px-4 md:px-7 lg:px-10 2xl:px-0">
        <ul className="flex flex-col items-center gap-10 text-center md:grid md:grid-cols-2 md:items-start md:gap-x-6 md:gap-y-14 md:text-left lg:grid-cols-3 lg:gap-x-[126px] lg:gap-y-16 xl:gap-y-20">
          {features.map((feature) => (
            <li key={feature.title} className="max-w-[410px] md:max-w-none">
              <UseCaseLottieAnimation
                src={`/images/pages/usecases/${slug}/animations/${feature.animation}-lottie-data.json`}
              />
              <div className="mt-5">
                <h2 className="text-2xl leading-snug font-medium text-white xl:text-3xl">
                  {feature.title}
                </h2>
                <p className="mt-2 max-w-[377px] text-[17px] leading-snug font-book text-gray-9 md:max-w-none xl:mt-3">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default UseCaseFeatures
