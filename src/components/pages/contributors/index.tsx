import Image from "next/image"

import { getCommunityIssues } from "@/lib/community"
import { getContributorsResult, type Contributor } from "@/lib/contributors"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import GetStarted from "@/components/pages/get-started"

import AchievementTier, { type AchievementProfile } from "./achievement-tier"
import Issues from "./issues"

const MEDAL_TIERS = [
  {
    icon: "gold-medal",
    title: "Gold Medal",
    min: 7,
    max: 2000,
    description:
      "This medal is given to the experienced contributors only, with many thanks from the whole Novu team!",
  },
  {
    icon: "silver-medal",
    title: "Silver Medal",
    min: 3,
    max: 6,
    description:
      "This one is held by the people who made at least three PRs to make Novu better. Way to go!",
  },
  {
    icon: "bronze-medal",
    title: "Bronze Medal",
    min: 1,
    max: 2,
    description:
      "This medal is a great start of your relationship with the Novu project. Don't stop there!",
  },
] as const

const STAGES = [
  {
    title: "Read the docs",
    description: (
      <>
        Start by reading Novu&apos;s{" "}
        <Link href="https://github.com/novuhq/novu/blob/main/CONTRIBUTING.md">
          Contributing Guide
        </Link>{" "}
        and <Link href="https://docs.novu.co/platform">Documentation</Link>.
        Learn more about Novu, and set it up
      </>
    ),
  },
  {
    title: "Pick an issue",
    description: (
      <>
        Head over to{" "}
        <Link href="https://github.com/novuhq/novu/issues">
          Novu&apos;s issues page
        </Link>
        , Comment on an issue and we will assign it to you. Do you want to open
        a new issue?{" "}
        <Link href="https://github.com/novuhq/novu/issues/new?assignees=&labels=&template=bug_report.md&title=">
          Click here
        </Link>
        .
      </>
    ),
  },
  {
    title: "Solve it",
    description: (
      <>
        Solve the issue while following Novu&apos;s guidelines and create a Pull
        Request. Do you feel stuck? Join our{" "}
        <Link href="https://discord.novu.co">Discord</Link>, The community will
        be super happy to help you
      </>
    ),
  },
  {
    title: "Earn your badge",
    description: (
      <>
        You will automatically be listed here. Now it&apos;s the time to send it
        to your friends and show them how awesome you are!
      </>
    ),
  },
] as const

function latestPullTimestamp(contributor: Contributor) {
  const latest =
    contributor.pulls[0]?.mergedAt || contributor.pulls[0]?.createdAt
  return latest ? Date.parse(latest) || 0 : 0
}

function tierProfiles(
  contributors: Contributor[],
  min: number,
  max: number
): AchievementProfile[] {
  return contributors
    .filter(
      (contributor) =>
        !contributor.teammate &&
        contributor.totalPulls >= min &&
        contributor.totalPulls <= max
    )
    .sort((a, b) => latestPullTimestamp(b) - latestPullTimestamp(a))
    .map(({ github, name }) => ({ github, name }))
}

function Hero() {
  return (
    <section className="relative -mt-16 overflow-hidden pt-22 md:pt-30 lg:pt-32">
      <div className="relative z-10 mx-auto max-w-304 px-5 md:px-8 2xl:px-0">
        <div className="mx-auto max-w-200 text-center">
          <h1 className="text-4xl leading-tight font-bold md:text-5xl lg:text-7xl">
            Community Heroes
          </h1>
          <p className="mt-5 text-base leading-snug font-book text-gray-9 md:text-lg">
            Novu is being built for developers using the incredible power of the
            community!
            <br />
            Here is a list of these amazing individuals, working together to
            build the best open-source notification infrastructure 🚀
            <br />
            <br />
            Do you want to be listed here too?
          </p>
          <Button className="mt-5 md:mt-7" asChild>
            <a href="#started">Become a contributor</a>
          </Button>
        </div>
      </div>
      <Image
        className="relative left-1/2 -z-0 -mt-52 h-auto min-w-325 -translate-x-1/2 md:-mt-52 lg:-mt-70 lg:min-w-425 xl:-mt-82.5 xl:min-w-480"
        src="/images/pages/contributors/hero-bg.svg"
        width={1920}
        height={654}
        sizes="1920px"
        alt=""
        priority
      />
    </section>
  )
}

function Achievements({
  contributors,
  unavailable,
}: {
  contributors: Contributor[]
  unavailable: boolean
}) {
  if (unavailable) {
    return (
      <section className="px-5 py-16 md:px-8 md:py-20 lg:py-36 xl:py-40">
        <div
          className="mx-auto max-w-254 rounded-xl border border-gray-4 bg-gray-2 px-6 py-10 text-center"
          role="status"
        >
          <h2 className="text-3xl leading-tight font-medium">
            Community achievements
          </h2>
          <p className="mt-3 font-book text-gray-9">
            Contributor profiles are temporarily unavailable. Please check back
            shortly.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="px-5 py-16 md:px-8 md:py-20 lg:py-36 xl:py-40">
      <div className="mx-auto max-w-304">
        {MEDAL_TIERS.map((tier) => {
          const profiles = tierProfiles(contributors, tier.min, tier.max)
          return (
            <article
              className="mx-auto flex max-w-254 flex-col border-b border-dashed border-gray-4 py-11 first:pt-0 last:border-none last:pb-0 sm:flex-row md:py-16 lg:py-20"
              key={tier.title}
            >
              <Image
                className="h-auto w-25.5 shrink-0 self-start object-contain sm:mr-5 md:mr-7 md:w-33.5 lg:mr-34 lg:w-44"
                src={`/images/pages/contributors/achievements/active/${tier.icon}.png`}
                width={176}
                height={210}
                sizes="(max-width: 767px) 102px, (max-width: 1023px) 134px, 176px"
                alt={`${tier.title} icon`}
              />
              <div className="mt-6 min-w-0 grow sm:mt-0">
                <h2 className="text-3xl leading-tight font-medium md:text-[30px] lg:text-4xl">
                  {tier.title}
                </h2>
                <p className="mt-4 text-base leading-snug font-light text-gray-9 md:text-lg">
                  {tier.description}
                </p>
                {profiles.length ? (
                  <AchievementTier profiles={profiles} />
                ) : (
                  <p className="mt-6 text-sm text-gray-8">
                    Contributor data is being refreshed. Check back shortly.
                  </p>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section
      className="scroll-mt-20 bg-gray-2 px-5 py-16 md:px-8 md:py-20 lg:py-32"
      id="started"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-304">
        <h2
          id="how-it-works-heading"
          className="text-3xl leading-tight font-medium md:text-4xl lg:text-5xl"
        >
          How it works
        </h2>
        <ol className="mt-11 grid grid-cols-1 md:mt-14 lg:mt-16 lg:grid-cols-4 lg:gap-7">
          {STAGES.map((stage, index) => (
            <li className="group relative flex lg:block" key={stage.title}>
              <div className="relative mr-6 shrink-0 lg:mr-0">
                <Image
                  className="size-14 md:size-16 lg:size-19"
                  src={`/images/pages/contributors/how-it-works/stage-${index + 1}.svg`}
                  width={76}
                  height={76}
                  alt={`Stage ${index + 1}`}
                />
                <span className="absolute top-16 left-1/2 h-[calc(100%-72px)] w-px -translate-x-1/2 border-l border-dashed border-gray-6 group-last:hidden md:top-20 md:h-[calc(100%-92px)] lg:top-1/2 lg:left-22 lg:h-px lg:w-[calc(100%-56px)] lg:translate-x-0 lg:-translate-y-1/2 lg:border-t lg:border-l-0" />
              </div>
              <div className="pb-6 md:pb-10 lg:mt-6 lg:pb-0">
                <h3 className="text-xl leading-tight font-medium">
                  {stage.title}
                </h3>
                <p className="mt-2 leading-snug font-book text-gray-9">
                  {stage.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default async function Contributors() {
  const [contributorsResult, communityIssues] = await Promise.all([
    getContributorsResult(),
    getCommunityIssues(),
  ])
  const issues = communityIssues.filter((issue) =>
    issue.tags.some(
      (tag) => tag === "good first issue" || tag === "help wanted"
    )
  )

  return (
    <>
      <Hero />
      <Achievements
        contributors={contributorsResult.contributors}
        unavailable={contributorsResult.unavailable}
      />
      <HowItWorks />
      <Issues
        className="px-5 py-16 md:px-0 md:py-20 lg:py-32"
        issues={issues}
      />
      <GetStarted />
    </>
  )
}
