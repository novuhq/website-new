import Image from "next/image"

import type { IPost } from "@/types/blog"
import { getLatestPosts } from "@/lib/blog"
import {
  getCommunityIssues,
  getCommunityMembers,
  getCommunityStats,
  type CommunityMember,
  type CommunityStats,
} from "@/lib/community"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import SubscriptionForm from "@/components/ui/subscription-form"

import OpenIssues from "./open-issues"

const INVOLVEMENT_ITEMS = [
  {
    icon: "/images/pages/community/novu-gradient-logo.svg",
    title: "Novu Cloud",
    description: "Embark on your journey by creating your personalized account",
    linkText: "Get started",
    linkUrl: "https://dashboard.novu.co/?utm_campaign=community_page",
  },
  {
    icon: "/images/pages/community/discord.svg",
    title: "Join Discord",
    description:
      "Immerse yourself in the community by joining our dedicated server",
    linkText: "Join discord",
    linkUrl: "https://discord.novu.co/",
  },
  {
    icon: "/images/pages/community/github.svg",
    title: "Fork and Work",
    description:
      "Discover an issue within our project and make a valuable contribution",
    linkText: "Find an issue",
    linkUrl: "https://github.com/novuhq/novu/issues",
  },
] as const

const EVENTS = [
  {
    title: "The Help Desk Session",
    description: "Solving your most common Novu questions.",
    category: "Webinar",
    date: "2024-08-07T15:30:00Z",
    venue: "Youtube",
    linkUrl: "https://www.youtube.com/watch?v=VBHierIbPHc",
    linkText: "Ask questions",
  },
  {
    title: "Inbox Component",
    description: "How to add in-app notifications to any app in minutes.",
    category: "Webinar",
    date: "2024-08-21T15:30:00Z",
    venue: "Youtube",
    linkUrl: "https://www.youtube.com/watch?v=8fpghRkVWBY",
    linkText: "Watch live",
  },
  {
    title: "SSO and RBAC",
    description:
      "How we migrated our user management to Clerk with one engineer.",
    category: "Webinar",
    date: "2024-09-04T15:30:00Z",
    venue: "Youtube",
    linkUrl: "https://www.youtube.com/watch?v=zpz3Q2Iox2k",
    linkText: "Join us",
  },
] as const

const CONTRIBUTION_ITEMS = [
  {
    icon: "paint",
    title: "Create content",
    description: "Help others discover Novu with videos and blog articles.",
    linkUrl: "https://docs.novu.co/community/get-involved#create-content",
  },
  {
    icon: "microphone",
    title: "Present at meetups",
    description: "Share your experience and represent Novu in public meetups.",
    linkUrl: "https://docs.novu.co/community/get-involved#create-content",
  },
  {
    icon: "bug",
    title: "Report bugs",
    description:
      "Find and fix bugs in the code, then submit pull requests to resolve them.",
    linkUrl: "https://roadmap.novu.co/roadmap",
  },
  {
    icon: "idea",
    title: "Submit new ideas",
    description: "Suggest features, integrations, or SDKs for our roadmap.",
    linkUrl: "https://roadmap.novu.co/roadmap",
  },
  {
    icon: "improve",
    title: "Improve documentation",
    description: "Share your experience and represent Novu in public",
    linkUrl: "https://github.com/novuhq/docs/issues",
  },
  {
    icon: "settings",
    title: "Helping others",
    description: "Support developers with their projects and contributions",
    linkUrl: "https://docs.novu.co/community/get-involved#create-content",
  },
] as const

const MEMBER_POSITIONS = [
  "left-[62%] top-[30%] size-20 md:size-23",
  "left-[18%] top-[47%] size-20 md:size-23",
  "left-[39%] top-[69%] size-20 md:size-23",
  "left-[72%] top-[68%] size-20 md:size-23",
  "left-[44%] top-[30%] size-15 md:size-18",
  "left-[10%] top-[35%] size-15 md:size-18",
  "left-[72%] top-[48%] size-15 md:size-18",
  "left-[84%] top-[38%] size-15 md:size-18",
  "left-[18%] top-[70%] size-15 md:size-18",
  "left-[31%] top-[34%] size-12 md:size-14",
  "left-[30%] top-[57%] size-12 md:size-14",
  "left-[53%] top-[22%] size-12 md:size-14",
  "left-[62%] top-[61%] size-12 md:size-14",
  "left-[21%] top-[23%] size-12 md:size-14",
  "left-[52%] top-[75%] size-12 md:size-14",
  "left-[29%] top-[77%] size-12 md:size-14",
  "left-[76%] top-[26%] size-12 md:size-14",
  "left-[82%] top-[57%] hidden size-14 md:block",
  "left-[33%] top-[18%] hidden size-14 md:block",
  "left-[10%] top-[60%] hidden size-14 md:block",
  "left-[63%] top-[78%] hidden size-14 md:block",
  "left-[84%] top-[72%] hidden size-14 md:block",
] as const

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center text-3xl leading-tight font-medium md:text-[32px] lg:text-5xl xl:text-[44px]">
      {children}
    </h2>
  )
}

function Hero() {
  return (
    <section className="relative z-10 overflow-hidden bg-linear-to-b from-[#130d16] via-[#09050b] pt-24 pb-72 md:pt-25.5 md:pb-117 lg:pt-41 lg:pb-35 2xl:pt-66.5 2xl:pb-46.5">
      <div className="relative z-10 mx-auto grid max-w-272 px-5 md:px-8 lg:grid-cols-12">
        <div className="text-center lg:col-span-6 lg:text-left xl:col-span-5 xl:col-start-2">
          <h1 className="text-[32px] leading-[1.05] font-bold text-white md:text-4xl lg:text-6xl 2xl:text-7xl">
            Welcome to the <br className="hidden lg:block" /> Novu Community
          </h1>
          <p className="mx-auto mt-3 max-w-114 text-base leading-tight font-book text-white/70 md:mt-4 lg:mx-0 lg:text-lg 2xl:text-xl">
            Innovate, collaborate, and stay up to date with the latest in
            Notifications infrastructure.
          </p>
          <SubscriptionForm
            className="mx-auto mt-6 h-14 max-w-116 border-white/10 bg-[#0e0910] lg:mx-0 lg:mt-9"
            placeholder="Email address..."
            variant="cta"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 left-1/2 w-208 -translate-x-1/2 md:w-375 lg:left-[70%] lg:w-310 xl:w-370 2xl:left-1/2 2xl:w-480">
        <Image
          className="absolute top-42 left-1/2 h-auto w-full max-w-none -translate-x-1/2 md:top-0 lg:-top-16 2xl:-top-90"
          src="/images/pages/community/hero-bg.svg"
          width={1920}
          height={1920}
          sizes="(max-width: 767px) 830px, (max-width: 1023px) 1500px, 1920px"
          alt=""
          priority
        />
        <Image
          className="absolute top-63 left-1/2 h-auto w-104 -translate-x-[53%] md:top-42 md:w-186 lg:top-21 lg:w-154 xl:w-185 2xl:top-25 2xl:w-239"
          src="/images/pages/community/animals.png"
          width={957}
          height={575}
          sizes="(max-width: 767px) 417px, (max-width: 1023px) 746px, 957px"
          alt=""
          priority
        />
      </div>
      <span className="pointer-events-none absolute inset-0 z-0 bg-linear-to-b from-[#130d16] via-[#130d16]/80 via-55% to-transparent" />
    </section>
  )
}

function GetInvolved() {
  return (
    <section className="relative z-10 mt-20 px-5 md:mt-24 md:px-8 lg:mt-30 2xl:mt-17.5">
      <div className="mx-auto max-w-272">
        <SectionHeading>Get involved: start, engage, contribute</SectionHeading>
        <ul className="mx-auto mt-8 grid max-w-210 grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-5 md:mt-11 lg:mt-12 lg:gap-7 xl:gap-16 2xl:mt-14">
          {INVOLVEMENT_ITEMS.map((item) => (
            <li className="flex flex-col items-center" key={item.title}>
              <Image src={item.icon} width={40} height={40} alt="" />
              <h3 className="mt-4 text-center text-xl leading-tight font-medium md:mt-5 lg:mt-6 lg:text-2xl xl:text-3xl">
                {item.title}
              </h3>
              <p className="mt-2 max-w-70 text-center leading-snug font-light text-gray-9">
                {item.description}
              </p>
              <Link
                className="mt-5 border-b border-primary/50 pb-0.5 text-[13px] font-medium hover:border-primary md:mt-4 lg:mt-6"
                href={item.linkUrl}
                size="none"
              >
                {item.linkText}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function formatNumber(count: number) {
  if (count < 100) return count.toLocaleString("en-US")
  if (count < 950) return `${Math.floor(count / 100) * 100}+`
  const thousands = (count / 1000).toFixed(1).replace(/\.0$/, "")
  return `${thousands}k+`
}

function StatCard({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/6 bg-[#e8f4ff]/8",
        className
      )}
    >
      {children}
    </div>
  )
}

function GitHubStat({ stats }: { stats: CommunityStats }) {
  return (
    <section className="relative z-10 mt-20 px-5 md:mt-25 md:px-8 lg:mt-30 2xl:mt-40">
      <div className="mx-auto max-w-272">
        <SectionHeading>
          Built by a community of {formatNumber(stats.contributors)}{" "}
          contributors
        </SectionHeading>
        <div className="relative mx-auto mt-8 grid max-w-220 grid-cols-2 gap-2.5 md:mt-11 md:grid-cols-4 lg:mt-12 lg:gap-3">
          <Image
            className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-auto w-250 max-w-none -translate-x-1/2 -translate-y-1/2 opacity-70"
            src="/images/pages/community/light.svg"
            width={1004}
            height={944}
            alt=""
          />
          <StatCard className="col-span-2 row-span-2 flex min-h-50 flex-col justify-center px-8 sm:min-h-64 lg:min-h-72 lg:px-16">
            <Image
              className="absolute inset-0 size-full object-cover"
              src="/images/pages/community/stars-bg.png"
              fill
              sizes="(max-width: 767px) 100vw, 55vw"
              alt=""
            />
            <strong className="relative z-10 w-fit bg-linear-to-r from-[#b7e3f0] to-white/70 bg-clip-text text-6xl leading-none font-medium text-transparent sm:text-7xl lg:text-[84px]">
              {formatNumber(stats.count)}
            </strong>
            <span className="relative z-10 mt-1 w-fit bg-linear-to-r from-white to-white/60 bg-clip-text text-xl leading-none font-medium text-transparent sm:text-2xl lg:text-4xl">
              GitHub stars
            </span>
          </StatCard>
          {[
            [stats.openIssues, "Open Issues", "from-[#ffcee6]"],
            [stats.closedIssues, "Closed Issues", "from-[#b7e3f0]"],
          ].map(([count, label, color]) => (
            <StatCard
              className="flex min-h-25 flex-col items-center justify-center"
              key={String(label)}
            >
              <strong
                className={cn(
                  "bg-linear-to-r to-white/70 bg-clip-text text-[32px] leading-none font-medium text-transparent lg:text-5xl",
                  color
                )}
              >
                {formatNumber(Number(count))}
              </strong>
              <span className="mt-1 text-xs font-light text-gray-9 sm:text-sm">
                {label}
              </span>
            </StatCard>
          ))}
          <StatCard className="col-span-2 flex min-h-32 items-end justify-center pb-5">
            <Image
              className="absolute inset-0 size-full object-cover"
              src="/images/pages/community/contributors-bg.png"
              fill
              sizes="(max-width: 767px) 100vw, 45vw"
              alt=""
            />
            <strong className="relative z-10 bg-linear-to-r from-white to-white/60 bg-clip-text text-xl font-medium text-transparent lg:text-3xl">
              {formatNumber(stats.contributors)} Contributors
            </strong>
          </StatCard>
          {[
            [stats.pullRequests, "Pull Requests", "pr"],
            [stats.forks, "forks", "fork"],
          ].map(([count, label, icon]) => (
            <StatCard
              className="col-span-2 flex min-h-25 items-center justify-center sm:min-h-34"
              key={String(label)}
            >
              <Image
                className="mr-2.5 h-8 w-auto"
                src={`/images/pages/community/${icon}.svg`}
                width={31}
                height={36}
                alt=""
              />
              <strong className="bg-linear-to-r from-[#ffcee6] to-white/70 bg-clip-text text-xl font-medium text-transparent sm:text-2xl lg:text-3xl">
                {formatNumber(Number(count))} {label}
              </strong>
            </StatCard>
          ))}
          <StatCard className="col-span-2 flex min-h-25 flex-col items-center justify-center sm:min-h-34 md:col-span-4">
            <strong className="bg-linear-to-r from-[#ffcee6] to-white/70 bg-clip-text text-[32px] leading-none font-medium text-transparent lg:text-5xl">
              {formatNumber(stats.commits)}
            </strong>
            <span className="mt-1 text-sm font-light text-gray-9">Commits</span>
          </StatCard>
        </div>
      </div>
    </section>
  )
}

function Events() {
  return (
    <section className="mt-20 px-5 md:mt-25 md:px-8 lg:mt-30 2xl:mt-40">
      <div className="mx-auto grid max-w-220 gap-8 sm:grid-cols-2 lg:gap-16">
        <header>
          <h2 className="text-3xl leading-tight font-medium md:text-[32px] lg:text-5xl 2xl:text-[44px]">
            Engage in events, forging connections, and gaining insights
          </h2>
          <p className="mt-3 leading-snug font-light text-gray-9 sm:mt-4">
            Let’s say you’ve been tasked to build an application to help
            consumers find agencies providing a specific service tasked to
            build. To build an application to help consumers
          </p>
        </header>
        <ul className="flex flex-col gap-y-5 lg:gap-y-6">
          {EVENTS.map((event, index) => (
            <li
              className={cn(
                "pb-5",
                index < EVENTS.length - 1 && "border-b border-gray-3 lg:pb-6"
              )}
              key={event.title}
            >
              <div className="flex flex-wrap gap-x-2.5 text-sm leading-none text-gray-6">
                <span className="bg-[linear-gradient(90deg,#f17eae,#ff884d)] bg-clip-text text-transparent">
                  {event.category}
                </span>
                <time
                  className="border-l border-gray-4 pl-2.5"
                  dateTime={event.date}
                >
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(event.date))}
                </time>
                <span className="border-l border-gray-4 pl-2.5">
                  {event.venue}
                </span>
              </div>
              <h3 className="mt-2 text-lg leading-tight sm:text-xl lg:text-2xl">
                {event.title}
              </h3>
              <p className="mt-2 leading-snug font-light text-gray-9">
                {event.description}
              </p>
              <Link
                className="mt-4 border-b border-primary/50 pb-0.5 text-[13px] font-medium"
                href={event.linkUrl}
                size="none"
              >
                {event.linkText}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function MembersMap({ members }: { members: CommunityMember[] }) {
  return (
    <section className="relative mt-11 overflow-hidden md:mt-0 lg:-mt-16">
      <div className="pointer-events-none absolute top-[46%] left-1/2 z-10 flex w-full -translate-x-1/2 flex-col items-center px-5">
        <h2 className="max-w-md text-center text-2xl leading-tight font-medium md:text-[32px] lg:text-5xl xl:max-w-lg">
          The power of open source community
        </h2>
        <Button
          className="pointer-events-auto mt-5 md:mt-7"
          variant="outline"
          asChild
        >
          <Link
            href="https://github.com/novuhq/novu/graphs/contributors"
            variant="clean"
            size="none"
          >
            View All Contributors
          </Link>
        </Button>
      </div>
      <div className="relative left-1/2 aspect-[1.19] w-200 -translate-x-1/2 [mask-image:radial-gradient(55%_60%_at_50%_52%,black,black_52%,transparent_88%)] md:aspect-[1.52] md:w-256 lg:aspect-[1.575] lg:w-390 xl:w-480">
        <picture className="absolute inset-0">
          <source
            media="(max-width: 767px)"
            srcSet="/images/pages/community/members-bg-md.svg"
          />
          <Image
            className="absolute inset-0 size-full"
            src="/images/pages/community/members-bg.svg"
            fill
            sizes="(max-width: 767px) 800px, (max-width: 1279px) 1560px, 1920px"
            alt=""
          />
        </picture>
        <ul className="absolute inset-0">
          {members.slice(0, MEMBER_POSITIONS.length).map((member, index) => (
            <li
              className={cn(
                "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center",
                MEMBER_POSITIONS[index]
              )}
              key={member.login}
            >
              <span
                className={cn(
                  "relative size-full rounded-full border p-px shadow-[0_0_20px_rgba(88,227,255,.2)]",
                  index % 3 === 0
                    ? "border-[#ff97f5]/60 bg-[#ff97f5]/10"
                    : "border-[#97e0ff]/60 bg-[#97e0ff]/10"
                )}
              >
                <Image
                  className="rounded-full object-cover grayscale transition-[filter] duration-300 hover:grayscale-0"
                  src={member.avatarUrl}
                  fill
                  sizes="92px"
                  alt={member.login}
                />
              </span>
              <span className="mt-1.5 max-w-24 truncate text-[7px] leading-tight text-primary md:text-[10px]">
                {member.login}
              </span>
              <span className="text-[6px] whitespace-nowrap text-white/70 md:text-[8px]">
                {member.pullRequests} PRs
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Contribute() {
  return (
    <section className="mt-20 px-5 md:mt-25 md:px-8 lg:mt-30 2xl:mt-40">
      <div className="mx-auto max-w-272">
        <SectionHeading>Other ways to help</SectionHeading>
        <ul className="mx-auto mt-8 grid max-w-220 grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-5 md:mt-14 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12 2xl:gap-x-14">
          {CONTRIBUTION_ITEMS.map((item) => (
            <li className="flex flex-col" key={item.title}>
              <Image
                className="h-8 w-auto self-start sm:h-10"
                src={`/images/pages/community/${item.icon}.svg`}
                width={40}
                height={40}
                alt=""
              />
              <h3 className="mt-3.5 text-lg leading-snug sm:mt-4 sm:text-xl lg:mt-6 lg:text-2xl">
                {item.title}
              </h3>
              <p className="mt-1 leading-snug font-light text-gray-9 sm:mt-2">
                {item.description}
              </p>
              <Link
                className="mt-2.5 text-sm font-light"
                href={item.linkUrl}
                size="none"
              >
                <span className="sr-only">{item.title} – </span>Learn more
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function BlogPosts({ posts }: { posts: IPost[] }) {
  return (
    <section className="mt-20 mb-14 px-5 md:mt-25 md:mb-16 md:px-8 lg:mt-30 lg:mb-20 2xl:mt-40 2xl:mb-30">
      <div className="mx-auto max-w-272">
        <SectionHeading>Check out our latest blog posts</SectionHeading>
        {posts.length > 0 ? (
          <div className="mx-auto mt-8 grid max-w-220 gap-8 sm:grid-cols-2 md:mt-11 lg:mt-14 lg:grid-cols-3">
            {posts.map((post) => (
              <article className="flex flex-col" key={post.slug.current}>
                <Link
                  className="relative aspect-video overflow-hidden rounded-xl"
                  href={post.url}
                  variant="clean"
                  size="none"
                >
                  <Image
                    className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                    src={post.cover}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 384px"
                    alt={post.coverAlt || post.title}
                  />
                </Link>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-8">
                  <span>{post.category.title}</span>
                  <span aria-hidden>·</span>
                  <time dateTime={post.publishedAt}>
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(post.publishedAt))}
                  </time>
                </div>
                <h3 className="mt-2 text-xl leading-tight font-medium">
                  <Link href={post.url} variant="white" size="none">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 leading-snug font-book text-gray-9">
                  {post.caption}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-gray-9">
            Visit the Novu blog for the latest community stories.
          </p>
        )}
        <Button
          className="mx-auto mt-8 flex md:mt-10 lg:mt-14"
          variant="outline"
          asChild
        >
          <Link
            href="https://github.com/novuhq/blog"
            variant="clean"
            size="none"
          >
            Submit Your Content
          </Link>
        </Button>
      </div>
    </section>
  )
}

export default async function Community() {
  const [stats, members, issues, posts] = await Promise.all([
    getCommunityStats(),
    getCommunityMembers(),
    getCommunityIssues(),
    getLatestPosts(3).catch(() => []),
  ])

  return (
    <div className="-mt-16 bg-[#09050b] text-white">
      <div className="relative overflow-hidden">
        <Hero />
        <GetInvolved />
        <GitHubStat stats={stats} />
      </div>
      <Events />
      <MembersMap members={members} />
      <OpenIssues issues={issues} />
      <Contribute />
      <BlogPosts posts={posts} />
    </div>
  )
}
