import Image from "next/image"
import { format } from "date-fns"
import { ArrowLeft, ExternalLink, Github, MapPin } from "lucide-react"

import {
  getContributorEmbedImageUrl,
  type Contributor,
  type ContributorAchievement,
} from "@/lib/contributors"
import { absoluteUrl } from "@/lib/site-url"
import { Link } from "@/components/ui/link"
import GetStarted from "@/components/pages/get-started"

import Activity from "./activity"
import ShareActions from "./share-actions"

const MEDALS = [
  {
    icon: "gold-medal",
    title: "Gold Medal",
    tooltip:
      "This medal is given to the experienced contributors with many thanks from the Novu team.",
    minimum: 7,
  },
  {
    icon: "silver-medal",
    title: "Silver Medal",
    tooltip:
      "This one is held by the people who made at least three PRs to make Novu better.",
    minimum: 3,
  },
  {
    icon: "bronze-medal",
    title: "Bronze Medal",
    tooltip:
      "This medal is a great start of your relationship with the Novu project.",
    minimum: 1,
  },
] as const

function normalizeWebsite(value?: string) {
  if (!value) return null
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`)
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null
  } catch {
    return null
  }
}

function achievementDate(contributor: Contributor, minimum: number) {
  const chronological = [...contributor.pulls].reverse()
  const pull = chronological[minimum - 1]
  const date = pull?.mergedAt || pull?.createdAt
  return date ? format(new Date(date), "MMMM d, yyyy") : null
}

function AchievementDescription({
  title,
  description,
}: {
  title: string
  description: string
}) {
  if (!description) return null

  return (
    <details className="mt-2 w-full text-xs text-gray-8">
      <summary
        className="cursor-pointer rounded-sm text-center text-primary hover:text-primary-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        aria-label={`About ${title}`}
      >
        About this badge
      </summary>
      <p className="mt-2 text-left leading-snug">{description}</p>
    </details>
  )
}

function Profile({ contributor }: { contributor: Contributor }) {
  const displayName = contributor.name || `@${contributor.github}`
  const website = normalizeWebsite(contributor.website)

  return (
    <aside className="rounded-[20px] bg-linear-to-b from-gray-2 to-gray-2/70 p-5 md:flex md:w-full md:px-10 md:pt-10 md:pb-6 lg:sticky lg:top-20 lg:col-span-4 lg:block lg:max-w-78 lg:px-5">
      <div className="group relative mx-auto flex size-58 shrink-0 items-center justify-center rounded-full border border-gray-4 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.12),transparent_65%)] md:mr-10 md:ml-0 lg:mx-auto">
        <Image
          className="size-48 rounded-full object-cover grayscale transition-[filter] duration-200 group-hover:grayscale-0"
          src={`https://avatars.githubusercontent.com/${contributor.github}?v=4`}
          width={192}
          height={192}
          priority
          alt={displayName}
        />
      </div>
      <div className="mt-3 min-w-0 grow md:mt-0 lg:mt-3">
        <h1 className="text-center text-2xl leading-tight font-medium md:text-left lg:text-center">
          {displayName}
        </h1>
        {contributor.name && (
          <span className="mt-0.5 block text-center text-lg leading-tight text-primary md:text-left lg:text-center">
            @{contributor.github}
          </span>
        )}
        {contributor.bio && (
          <p className="mt-4 text-center leading-snug font-light md:text-left lg:text-center">
            {contributor.bio}
          </p>
        )}
        <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 md:justify-start lg:justify-center">
          {contributor.location && contributor.location !== "undefined" && (
            <span className="flex items-center text-sm leading-tight">
              <MapPin className="mr-1.5 size-4" /> {contributor.location}
            </span>
          )}
          {website && (
            <Link
              className="min-w-0 text-sm leading-tight"
              href={website}
              variant="white"
              size="none"
              aria-label="Visit website"
            >
              <ExternalLink className="size-4 shrink-0" />
              <span className="max-w-48 truncate">{contributor.website}</span>
            </Link>
          )}
        </div>
        <div className="mt-6 flex justify-center gap-4 border-t border-dashed border-gray-5 pt-6 md:justify-start lg:justify-center">
          <Link
            className="transition-opacity hover:opacity-80"
            href={`https://github.com/${contributor.github}`}
            variant="white"
            size="none"
            aria-label={`${contributor.github} on GitHub`}
          >
            <Github className="size-8" />
          </Link>
          {contributor.twitter && (
            <Link
              className="flex size-8 items-center justify-center rounded-full border border-gray-5 text-sm font-medium transition-opacity hover:opacity-80"
              href={`https://twitter.com/${contributor.twitter}`}
              variant="white"
              size="none"
              aria-label={`${contributor.twitter} on X`}
            >
              X
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}

function Achievements({
  contributor,
  additionalAchievements,
}: {
  contributor: Contributor
  additionalAchievements: ContributorAchievement[]
}) {
  const earnedMedals = MEDALS.filter(
    ({ minimum }) => minimum <= contributor.totalPulls
  )
  const profileUrl = absoluteUrl(
    `/contributors/${contributor.github.toLowerCase()}`
  )

  return (
    <section aria-labelledby="contributor-achievements-heading">
      <h2
        id="contributor-achievements-heading"
        className="text-3xl leading-tight font-medium md:text-[30px] lg:text-4xl"
      >
        Achievements
      </h2>
      <p className="mt-4 text-base font-light text-gray-9 md:text-lg">
        {contributor.name || contributor.github} has made{" "}
        <strong className="text-white">
          {contributor.totalPulls} pull{" "}
          {contributor.totalPulls === 1 ? "request" : "requests"}.
        </strong>
        <br />
        Thank you for helping Novu grow!
      </p>

      {additionalAchievements.length + earnedMedals.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4 md:gap-x-7 lg:gap-x-8">
          {additionalAchievements.map((achievement) => (
            <article
              className="flex flex-col items-center text-center"
              key={`${achievement.slug}-${achievement.date}`}
            >
              <Image
                className="h-33.5 w-auto object-contain"
                src={achievement.badge.src}
                width={160}
                height={160}
                loading="eager"
                alt={achievement.badge.alt}
              />
              <h3 className="mt-3.5 leading-tight">{achievement.title}</h3>
              <span className="mt-1.5 text-sm leading-tight text-gray-6">
                {achievement.date}
              </span>
              <AchievementDescription
                title={achievement.title}
                description={achievement.tooltip}
              />
            </article>
          ))}
          {earnedMedals.map((medal) => {
            const earnedAt = achievementDate(contributor, medal.minimum)

            return (
              <article
                className="flex flex-col items-center text-center"
                key={medal.title}
              >
                <Image
                  className="h-33.5 w-auto object-contain"
                  src={`/images/pages/contributors/achievements/active/${medal.icon}.png`}
                  width={134}
                  height={160}
                  loading="eager"
                  alt={`${medal.title} icon`}
                />
                <h3 className="mt-3.5 leading-tight">{medal.title}</h3>
                {earnedAt && (
                  <span className="mt-1.5 text-sm leading-tight text-gray-6">
                    {earnedAt}
                  </span>
                )}
                <AchievementDescription
                  title={medal.title}
                  description={medal.tooltip}
                />
              </article>
            )
          })}
        </div>
      ) : (
        <p className="mt-8 text-sm text-gray-8">
          The first badge will appear after the first merged contribution.
        </p>
      )}

      <ShareActions
        github={contributor.github}
        profileUrl={profileUrl}
        embedImageUrl={getContributorEmbedImageUrl(contributor.github)}
      />
    </section>
  )
}

interface ContributorPageProps {
  contributor: Contributor
  additionalAchievements: ContributorAchievement[]
}

export default function ContributorPage({
  contributor,
  additionalAchievements,
}: ContributorPageProps) {
  const initialPulls = contributor.pulls.slice(0, 3)

  return (
    <>
      <div className="-mt-16 px-5 pt-22 md:px-8 md:pt-30 lg:pt-44 2xl:px-0">
        <div className="mx-auto grid max-w-304 items-start gap-x-8 lg:grid-cols-12">
          <Profile contributor={contributor} />
          <div className="mt-16 min-w-0 md:mt-20 lg:col-span-8 lg:mt-0">
            <Achievements
              contributor={contributor}
              additionalAchievements={additionalAchievements}
            />
            <div className="border-image-mask my-8 border-t border-dashed border-gray-4 pb-12 sm:pb-20" />
            <Activity
              github={contributor.github}
              initialPulls={initialPulls}
              initialNextOffset={
                contributor.pulls.length > initialPulls.length
                  ? initialPulls.length
                  : null
              }
            />
            <div className="mt-9 border-t border-dashed border-gray-4 pt-8 sm:mt-14">
              <Link
                className="gap-2.5"
                href="/contributors"
                variant="white"
                size="none"
              >
                <ArrowLeft className="size-4" /> Back to Contributors page
              </Link>
            </div>
          </div>
        </div>
      </div>
      <GetStarted className="mt-16 sm:mt-20 lg:mt-32" />
    </>
  )
}
