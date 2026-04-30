import Image, { type StaticImageData } from "next/image"
import conversionCardImage from "@/images/pages/copilot/cards/conversion.webp"
import digestCardImage from "@/images/pages/copilot/cards/digest.webp"
import engagementCardImage from "@/images/pages/copilot/cards/engagement.webp"
import milestoneCardImage from "@/images/pages/copilot/cards/milestone.webp"

interface IPromptInTheWildCard {
  title: string
  prompt: string
  output: string
  image: StaticImageData
}

const CARDS: IPromptInTheWildCard[] = [
  {
    title: "Re-engagement",
    prompt:
      "When a user is inactive for two weeks, send a personal Email. If they don't return in 3 days, send a Push notification, then an SMS reminder after 2 days.",
    output: "A nudge that remembers where they left off, not a generic email.",
    image: engagementCardImage,
  },
  {
    title: "Transactional digest",
    prompt:
      "Bundle routine order updates into one daily summary via Email, but break through instantly with Push when something is actually urgent.",
    output: "One calm summary a day instead of a dozen interrupting pings.",
    image: digestCardImage,
  },
  {
    title: "Trial conversion",
    prompt:
      "A friendly heads-up via Email before a trial ends, a softer In-App reminder the day before, and a clear upgrade offer via Push on expiry.",
    output: "A sequence that feels helpful, not pushy.",
    image: conversionCardImage,
  },
  {
    title: "Milestone celebration",
    prompt:
      "Celebrate users when they hit a meaningful milestone with In-App and Push, then invite them to share it via Email the day after.",
    output: "Recognition at the moment it matters.",
    image: milestoneCardImage,
  },
]

function PromptsInTheWild() {
  return (
    <section className="section-container mt-26 max-w-6xl md:mt-48 lg:mt-60">
      <div className="flex flex-col items-center gap-12 md:gap-14">
        <div className="mx-auto flex max-w-[47rem] flex-col items-center gap-5 text-center">
          <div className="flex items-center gap-2">
            <span className="size-1.5 bg-blue-3" />
            <span className="text-sm leading-none tracking-tight text-blue-1 uppercase">
              Prompts in the wild
            </span>
          </div>

          <div className="flex flex-col items-center gap-4">
            <h2 className="text-[1.75rem] leading-[1.125] font-medium tracking-tighter text-balance text-foreground md:text-[2.5rem] lg:text-[3rem]">
              What you can ship this afternoon.
            </h2>
            <p className="max-w-[38rem] text-base leading-normal font-book tracking-tighter text-pretty text-gray-8 md:text-lg">
              Each of these started as a single sentence. They&apos;re the kind
              of journeys that move onboarding completion, retention, and
              conversion.
            </p>
          </div>
        </div>

        <div className="grid w-full gap-5 md:grid-cols-2 md:gap-7">
          {CARDS.map((card) => (
            <article
              className="overflow-hidden rounded-xl"
              key={card.title}
              aria-labelledby={`prompt-in-the-wild-${card.title
                .toLowerCase()
                .replaceAll(" ", "-")}`}
            >
              <div className="sr-only">
                <h3
                  id={`prompt-in-the-wild-${card.title
                    .toLowerCase()
                    .replaceAll(" ", "-")}`}
                >
                  {card.title}
                </h3>
                <p>{card.prompt}</p>
                <p>Output: {card.output}</p>
              </div>

              <Image
                src={card.image}
                alt=""
                aria-hidden
                className="h-auto w-full select-none"
                loading="eager"
                sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1248px) calc((100vw - 92px) / 2), 530px"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PromptsInTheWild
