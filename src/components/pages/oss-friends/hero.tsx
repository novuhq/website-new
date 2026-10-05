import Image from "next/image"

import { Link } from "@/components/ui/link"

import { OSS_FRIENDS } from "./data"

const HERO_TITLE = "Our Open-source Friends"
const HERO_DESCRIPTION =
  "In Novu, we are proud to collaborate with a diverse group of partners to promote open-source software and the values of transparency, collaboration, and community that it represents."

function AnimatedUnderline() {
  return (
    <span
      className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden rounded-full"
      aria-hidden
    >
      <span className="absolute inset-0 origin-right bg-primary transition-transform duration-250 ease-in-out group-hover:scale-x-0 motion-reduce:transition-none" />
      <span className="absolute inset-0 origin-left scale-x-0 bg-primary transition-transform delay-0 duration-250 ease-in-out group-hover:scale-x-100 group-hover:delay-250 motion-reduce:transition-none" />
    </span>
  )
}

function OssFriendsHero() {
  return (
    <section
      className="relative -mt-16 overflow-hidden bg-black pt-[95px] pb-10 md:pt-26 md:pb-16 lg:pt-32 xl:pt-36 xl:pb-20"
      aria-labelledby="oss-friends-heading"
    >
      <div className="relative z-10 mx-auto w-full px-4 md:px-7 lg:px-10 xl:max-w-304 2xl:px-0">
        <h1
          id="oss-friends-heading"
          className="mx-auto text-center text-[32px] leading-dense font-bold text-balance text-white md:text-4xl lg:text-5xl xl:text-[64px]"
        >
          {HERO_TITLE}
        </h1>
        <p className="mx-auto mt-3 max-w-[590px] text-center text-base leading-tight text-white/70 md:mt-4 lg:mt-5 lg:max-w-[676px] lg:text-lg xl:mt-4 xl:max-w-[800px]">
          {HERO_DESCRIPTION}
        </p>

        <ul className="mt-12 grid auto-rows-min grid-cols-1 gap-5 md:mt-14 md:auto-rows-fr md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-7 xl:mt-24 xl:gap-8">
          {OSS_FRIENDS.map(({ name, description, logoSrc, linkUrl }) => (
            <li key={name}>
              <article className="flex h-full flex-col justify-between rounded-2xl bg-linear-to-b from-gray-2 to-gray-2/70 px-5 pt-5 pb-6 xl:rounded-[20px] xl:p-8">
                <div>
                  <header className="flex items-center gap-x-3 md:gap-x-[18px]">
                    <Image
                      className="size-9 shrink-0 xl:size-10"
                      src={logoSrc}
                      alt={name}
                      width={40}
                      height={40}
                    />
                    <h2 className="text-2xl leading-snug font-normal xl:text-[28px]">
                      {name}
                    </h2>
                  </header>
                  <p className="mt-3 leading-snug font-light text-gray-9 md:mt-5">
                    {description}
                  </p>
                </div>

                <Link
                  className="group relative mt-5 w-fit pb-1.5 text-[13px] leading-none font-medium tracking-[0.01em] text-primary uppercase hover:text-primary focus-visible:text-primary md:mt-6 xl:mt-7"
                  href={linkUrl}
                  variant="clean"
                  size="none"
                >
                  Visit {name}
                  <AnimatedUnderline />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <picture aria-hidden>
        <source
          media="(min-width: 768px)"
          srcSet="/images/pages/oss-friends/background.svg"
        />
        <Image
          className="pointer-events-none absolute top-0 left-1/2 h-[530px] w-[360px] max-w-none min-w-[360px] -translate-x-1/2 select-none md:h-[648px] md:w-[1920px] md:min-w-[1920px]"
          src="/images/pages/oss-friends/background-mobile.svg"
          width={1920}
          height={648}
          alt=""
          unoptimized
          loading="eager"
        />
      </picture>
    </section>
  )
}

export default OssFriendsHero
