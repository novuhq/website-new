import Image, { type StaticImageData } from "next/image"
import { ROUTE } from "@/constants/routes"
import discordIcon from "@/images/pages/mcp/icons/discord.svg"
import githubIcon from "@/images/pages/mcp/icons/github.svg"
import novuIcon from "@/images/pages/mcp/icons/novu-gradient-logo.svg"

import { Link } from "@/components/ui/link"

const TITLE = "Get involved: start, engage, contribute"

interface IGetInvolvedItem {
  icon: StaticImageData
  title: string
  description: string
  linkText: string
  linkUrl: string
}

const ITEMS: IGetInvolvedItem[] = [
  {
    icon: novuIcon,
    title: "Novu Cloud",
    description: "Embark on your journey by creating your personalized account",
    linkText: "Get started",
    linkUrl: `${ROUTE.dashboard}/?utm_campaign=gs-website-mcp`,
  },
  {
    icon: discordIcon,
    title: "Join Discord",
    description:
      "Immerse yourself in the community by joining our dedicated server",
    linkText: "Join Discord",
    linkUrl: ROUTE.discord as string,
  },
  {
    icon: githubIcon,
    title: "Fork and Work",
    description:
      "Discover an issue within our project and make a valuable contribution",
    linkText: "Find an issue",
    linkUrl: ROUTE.githubIssues as string,
  },
]

function GetInvolved() {
  return (
    <section className="section-container relative z-10 mt-40 md:mt-48 lg:mt-54">
      <div className="relative z-10 flex flex-col items-center gap-10 md:gap-12 lg:gap-14">
        <h2 className="text-center text-[1.75rem] leading-[1.125] font-medium tracking-tighter text-foreground md:text-4xl lg:text-[2.5rem]">
          {TITLE}
        </h2>
        <ul className="flex w-full flex-wrap items-start justify-center gap-x-16 gap-y-10">
          {ITEMS.map(({ icon, title, description, linkText, linkUrl }) => (
            <li
              className="flex w-64 flex-col items-center gap-5 text-center"
              key={title}
            >
              <Image
                className="size-10"
                src={icon}
                alt={`${title} icon`}
                width={40}
                height={40}
              />
              <div className="flex w-full flex-col items-center gap-2.5">
                <div className="flex flex-col items-center gap-1.5">
                  <h3 className="text-base leading-tight font-medium tracking-tighter text-foreground md:text-xl 2xl:text-2xl">
                    {title}
                  </h3>
                  <p className="text-[0.9375rem] leading-snug font-book tracking-tighter text-gray-8">
                    {description}
                  </p>
                </div>
                <Link
                  href={linkUrl}
                  variant="clean"
                  size="none"
                  className="group text-[0.9375rem] leading-snug font-book text-lagune-3 transition-colors hover:text-lagune-2"
                >
                  {linkText}
                  <span className="relative mt-0.5 w-1.5 shrink-0 overflow-hidden transition-[width] duration-200 group-hover:w-3">
                    <svg
                      className="pointer-events-none ml-auto h-2.5 w-1.5"
                      width="6"
                      height="10"
                      viewBox="0 0 6 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        d="M1 9L5 5L1 1"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                    </svg>
                    <span className="absolute top-1/2 right-px h-px w-full -translate-y-1/2 bg-lagune-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default GetInvolved
