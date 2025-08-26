import { ICustomerTweetData } from "@/types/customers"
import { Link } from "@/components/ui/link"
import Slider from "@/components/ui/slider"

const ReviewCard = ({
  name,
  text,
  tweetLink,
  logo,
  tag,
}: ICustomerTweetData) => {
  return (
    <div className="relative h-full w-full md:max-w-[384px]">
      <Link
        className="relative z-10 flex h-full flex-col items-start rounded-xl border border-[rgba(51,51,71,0.60)] bg-[#111018] px-5 py-[18px] text-start transition-colors duration-300 hover:bg-[#15141D] md:px-6 md:py-5"
        href={tweetLink}
        variant="white"
      >
        <p
          className="[&>span]:text-primary-1 mb-5 line-clamp-5 text-[15px] leading-snug font-[350] xl:text-base"
          dangerouslySetInnerHTML={{ __html: text }}
        />
        <div className="mt-auto flex w-full gap-x-3 border-t border-t-[#333347] pt-5 text-start">
          <img
            className="h-auto w-9 rounded-full"
            src={logo.url}
            alt={name}
            width={logo.width}
            height={logo.height}
            loading="lazy"
          />
          <div>
            <span className="block text-base leading-none text-gray-9 md:text-[15px]">
              {name}
            </span>
            <span className="mt-[6px] block text-sm leading-none text-gray-8 md:text-sm">
              {tag}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

const Reviews = ({ reviews }: { reviews: ICustomerTweetData[] }) => {
  return (
    <section className="reviews relative mt-[104px] [overflow-x:clip] md:mt-28 md:overflow-x-visible lg:mt-[180px]">
      <div className="relative mx-auto flex w-full max-w-[1216px] flex-col items-center px-5 text-center md:px-8 lg:px-0">
        <span className="absolute top-7 left-1/2 h-82 w-full -translate-x-1/2 rounded-[100%] bg-[linear-gradient(168deg,rgba(245,117,224,0.80)_26.46%,rgba(164,123,243,0.87)_40.2%,rgba(178,129,242,0.80)_53.94%,rgba(117,153,245,0.95)_79.63%)] opacity-7 blur-[32px] md:top-15 md:[clip-path:none] lg:top-12 xl:top-0 xl:h-98 xl:w-288" />
        <h2 className="max-w-[850px] gap-y-4 text-center text-[28px] leading-[1.125] font-medium tracking-tighter text-balance text-foreground md:max-w-[516px] md:text-[32px] lg:max-w-[704px] lg:text-[40px] xl:text-[44px]">
          What our customers say about us
        </h2>
        <p className="mt-3 text-base leading-normal font-[350] tracking-tighter text-pretty text-muted-foreground md:max-w-[516px] lg:max-w-[704px] xl:max-w-[608px] xl:text-[18px]">
          Explore what developers and non-technical users say about why they're
          fans of our open-source notifications framework.
        </p>
        <div className="relative mt-9 w-full md:mt-10 md:max-w-[600px] lg:max-w-[856px] xl:mt-14 xl:max-w-[1216px]">
          <Slider>
            {reviews.map((review, index) => (
              <ReviewCard key={index} {...review} />
            ))}
          </Slider>
        </div>
      </div>
    </section>
  )
}

export default Reviews
