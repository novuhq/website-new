import Image, { type StaticImageData } from "next/image"
import { ROUTE } from "@/constants/routes"
import discordIcon from "@/images/pages/mcp/icons/discord.svg"
import githubIcon from "@/images/pages/mcp/icons/github.svg"
import novuIcon from "@/images/pages/mcp/icons/novu-gradient-logo.svg"
import { ChevronRight } from "lucide-react"

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
    <section className="relative z-10 mcp-section-container mt-40 md:mt-48 lg:mt-54">
      <div className="relative z-10 flex flex-col items-center gap-10 md:gap-12 lg:gap-14">
        <h2 className="text-center text-3xl leading-[1.125] font-medium tracking-tighter text-foreground md:text-4xl lg:text-[2.5rem]">
          {TITLE}
        </h2>
        <ul className="flex w-full flex-wrap items-start justify-center gap-x-16 gap-y-10">
          {ITEMS.map(({ icon, title, description, linkText, linkUrl }) => (
            <li
              key={title}
              className="flex w-64 flex-col items-center gap-5 text-center"
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
                  <h3 className="text-2xl leading-[1.25] font-medium tracking-[-0.02em] text-foreground">
                    {title}
                  </h3>
                  <p className="text-[15px] leading-[1.375] font-book tracking-[-0.02em] text-gray-8">
                    {description}
                  </p>
                </div>
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[15px] leading-[1.375] font-book text-lagune-3 transition-colors hover:text-lagune-2"
                >
                  {linkText}
                  <ChevronRight className="size-3.5 shrink-0" aria-hidden />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default GetInvolved
