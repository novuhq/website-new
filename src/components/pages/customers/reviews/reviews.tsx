import { ICustomerTweetData } from "@/types/customers"
import Slider from "./slider"

const Reviews = ({ reviews }: { reviews: ICustomerTweetData[] }) => {
  return (
    <section className="reviews relative mt-[104px] [overflow-x:clip] md:mt-28 md:overflow-x-visible lg:mt-[180px]">
      <div className="relative mx-auto flex w-full max-w-[1216px] flex-col items-center px-5 text-center md:px-8 lg:px-0">
        <span className="absolute top-[30px] -left-[323px] h-[327px] w-[965px] rounded-[100%] bg-[linear-gradient(168deg,rgba(245,117,224,0.80)_26.46%,rgba(164,123,243,0.87)_40.2%,rgba(178,129,242,0.80)_53.94%,rgba(117,153,245,0.95)_79.63%)] opacity-[0.07] blur-[125px] [clip-path:inset(-9999px_0_-9999px_-9999px)] md:top-[60px] md:-left-[214px] md:[clip-path:none] lg:top-[50px] lg:-left-[86px] xl:top-0 xl:left-[32px] xl:h-[392px] xl:w-[1152px]" />
        <h2 className="max-w-[850px] gap-y-4 text-center text-[28px] leading-[1.125] font-medium tracking-tighter text-balance text-foreground md:max-w-[516px] md:text-[32px] lg:max-w-[704px] lg:text-[40px] xl:text-[44px]">
          What our customers say about us
        </h2>
        <p className="mt-3 text-base leading-normal font-[350] tracking-tighter text-pretty text-muted-foreground md:max-w-[516px] lg:max-w-[704px] xl:max-w-[608px] xl:text-[18px]">
          Explore what developers and non-technical users say about why they're
          fans of our open-source notifications framework.
        </p>
        <div className="relative mt-9 w-full md:mt-10 md:max-w-[600px] lg:max-w-[856px] xl:mt-14 xl:max-w-[1216px]">
          <Slider reviews={reviews} />
        </div>
      </div>
    </section>
  )
}

export default Reviews
