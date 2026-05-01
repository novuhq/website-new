import Image, { type StaticImageData } from "next/image"
import docsIcon from "@/images/pages/copilot/icons/docs.svg"
import handoffsIcon from "@/images/pages/copilot/icons/handoffs.svg"
import promptsIcon from "@/images/pages/copilot/icons/prompts.svg"
import rocketIcon from "@/images/pages/copilot/icons/rocket.svg"
import shapeIcon from "@/images/pages/copilot/icons/shape.svg"
import ticketsIcon from "@/images/pages/copilot/icons/tickets.svg"
import oldWayImage from "@/images/pages/copilot/old-way.svg"
import yourTeamImage from "@/images/pages/copilot/your-team.svg"

import { cn } from "@/lib/utils"

interface IOldWayFeature {
  title: string
  description: string
  icon: StaticImageData
}

interface IOldWayContent {
  eyebrow: string
  title: string
  description: string
  image: StaticImageData
  features: IOldWayFeature[]
}

const OLD_WAY_BACKGROUND_ELLIPSES = [
  "top-20 -right-[12rem] h-[23.0938rem] w-[31.3125rem] blur-[2rem] [background:radial-gradient(50%_50%_at_50%_50%,rgba(18,28,59,0.82)_0%,rgba(18,28,59,0)_72%)] sm:top-8 sm:right-[-15rem] md:h-[46.1875rem] md:w-[62.625rem]",
  "top-20 right-0 sm:top-10 h-[22.6318rem] w-[13.2117rem] origin-center -rotate-[74deg] [background:radial-gradient(50%_50%_at_50%_50%,#1C2D5E_0%,rgba(18,28,59,0)_100%)] md:h-[45.2635rem] md:w-[26.4234rem]",
  "top-24 sm:top-0 left-0 h-[21.8537rem] w-[15.2581rem] origin-center -rotate-[25deg] opacity-60 [background:radial-gradient(50%_50%_at_50%_50%,#1C2D5E_0%,rgba(18,28,59,0)_100%)] md:h-[43.7074rem] md:w-[30.5161rem]",
  "top-18 right-55 sm:top-24 sm:right-34 h-[14.0625rem] w-18 origin-center rotate-[90deg] blur-[2.75rem] [background:radial-gradient(50%_50%_at_50%_50%,#314479_0%,rgba(49,68,121,0)_100%)] md:h-[28.125rem] md:w-36",
]

const YOUR_TEAM_BACKGROUND_ELLIPSES = [
  "top-30 -right-[12rem] sm:top-8 sm:right-[-15rem] h-[23.0938rem] w-[31.3125rem] blur-[2rem] [background:radial-gradient(50%_50%_at_50%_50%,rgba(18,46,59,0.82)_0%,rgba(18,46,59,0)_72%)] md:h-[46.1875rem] md:w-[62.625rem]",
  "top-30 sm:top-10 right-0 h-[22.6318rem] w-[13.2117rem] origin-center -rotate-[74deg] opacity-50 [background:radial-gradient(50%_50%_at_50%_50%,#1C435E_0%,rgba(18,42,59,0)_100%)] md:h-[45.2635rem] md:w-[26.4234rem]",
  "top-34 sm:top-0 left-0 h-[21.8537rem] w-[15.2581rem] origin-center -rotate-[25deg] opacity-60 [background:radial-gradient(50%_50%_at_50%_50%,#1C4E5E_0%,rgba(18,42,59,0)_100%)] md:h-[43.7074rem] md:w-[30.5161rem]",
  "top-18 right-55 sm:top-24 sm:right-34 h-[14.0625rem] w-18 origin-center rotate-[90deg] opacity-70 blur-[2.75rem] [background:radial-gradient(50%_50%_at_50%_50%,#316879_0%,rgba(49,92,121,0)_100%)] md:h-[28.125rem] md:w-36",
]

const OLD_WAY_CONTENT: IOldWayContent = {
  eyebrow: "The Old Way",
  title: "Every notification change used to be a project.",
  description:
    "Read the docs. Learn the dashboard. Map out the flow. File a ticket. Wait. Iterate. Copilot collapses that loop into a sentence.",
  image: oldWayImage,
  features: [
    {
      title: "From docs to done",
      description:
        "Skip the ramp-up. Say what you need in plain language and get a working flow back.",
      icon: docsIcon,
    },
    {
      title: "Fewer handoffs",
      description:
        "Copy tweaks, timing changes, and new channels don't need an engineering ticket.",
      icon: handoffsIcon,
    },
    {
      title: "Same day, not next sprint",
      description: "Write a prompt in the morning, test it before lunch.",
      icon: promptsIcon,
    },
  ],
}

const YOUR_TEAM_CONTENT: IOldWayContent = {
  eyebrow: "For Your Team",
  title: "Less notification work on your engineers' plate.",
  description:
    "Most engineers don't enjoy being the bottleneck on copy tweaks, timing changes, and new channels. Copilot takes that load off them — product moves faster, engineering still owns the workflow end to end.",
  image: yourTeamImage,
  features: [
    {
      title: "No boring asks in their queue",
      description: "Copy edits, timing tweaks, new channels — no more tickets.",
      icon: ticketsIcon,
    },
    {
      title: "They still own what ships",
      description: "Generated workflows land in dev as real Novu workflows.",
      icon: rocketIcon,
    },
    {
      title: "No new system to learn",
      description: "Same shape as every other workflow in the project.",
      icon: shapeIcon,
    },
  ],
}

function CopilotVisualFeatureSection({
  eyebrow,
  title,
  description,
  image,
  features,
  backgroundEllipses,
}: IOldWayContent & { backgroundEllipses?: string[] }) {
  return (
    <section className="relative isolate section-container mt-26 md:mt-34 lg:mt-40">
      {backgroundEllipses?.map((className) => (
        <span
          className={cn(
            "pointer-events-none absolute z-0 rounded-full",
            className
          )}
          aria-hidden
          key={className}
        />
      ))}

      <div className="relative z-10 flex max-w-[44rem] flex-col gap-4 md:gap-5">
        <div className="flex items-center gap-2">
          <span className="size-1.5 bg-lagune-3" />
          <span className="text-sm leading-none tracking-tight text-lagune-1 uppercase">
            {eyebrow}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-[1.75rem] leading-[1.125] font-medium tracking-tighter text-foreground md:text-[2.5rem] lg:text-[2.75rem]">
            {title}
          </h2>
          <p className="max-w-[42.125rem] text-base leading-normal font-book tracking-tighter text-pretty text-gray-8 md:text-lg">
            {description}
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-8 sm:mt-12 lg:mt-14">
        <Image
          src={image}
          alt=""
          aria-hidden
          className="h-auto w-full select-none"
          sizes="(max-width: 1248px) 100vw, 1216px"
          priority={false}
        />
      </div>

      <ul className="relative z-10 mt-3 grid gap-8 md:grid-cols-3 md:gap-12">
        {features.map((feature) => (
          <li className="flex min-w-0 flex-col gap-3.5" key={feature.title}>
            <Image
              src={feature.icon}
              alt=""
              aria-hidden
              className="size-10 shrink-0"
            />
            <div className="flex flex-col gap-2.5">
              <h3 className="text-xl leading-snug font-medium tracking-tighter text-foreground">
                {feature.title}
              </h3>
              <p className="text-base leading-snug font-light text-gray-9">
                {feature.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function OldWay() {
  return (
    <CopilotVisualFeatureSection
      {...OLD_WAY_CONTENT}
      backgroundEllipses={OLD_WAY_BACKGROUND_ELLIPSES}
    />
  )
}

export function YourTeam() {
  return (
    <CopilotVisualFeatureSection
      {...YOUR_TEAM_CONTENT}
      backgroundEllipses={YOUR_TEAM_BACKGROUND_ELLIPSES}
    />
  )
}

export default OldWay
