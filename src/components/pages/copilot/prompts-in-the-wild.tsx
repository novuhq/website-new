import conversionCardImage from "@/images/pages/copilot/cards/conversion.webp"
import digestCardImage from "@/images/pages/copilot/cards/digest.webp"
import engagementCardImage from "@/images/pages/copilot/cards/engagement.webp"
import milestoneCardImage from "@/images/pages/copilot/cards/milestone.webp"

import PromptInTheWildCard, {
  type PromptInTheWildCardProps,
} from "./prompt-in-the-wild-card"

const RE_ENGAGEMENT_CARD: PromptInTheWildCardProps = {
  title: "Re-engagement",
  prompt:
    "When a user is inactive for two weeks, send a personal Email. If they don't return in 3 days, send a Push notification, then an SMS reminder after 2 days.",
  output: "A nudge that remembers where they left off, not a generic email.",
  background: engagementCardImage,
  steps: ["email", "delay", "push", "delay"],
  theme: {
    titleColor: "#f5cffc",
    stepIconColor: "#CC97DC",
    stepIconOpacities: [0.6, 0.7, 0.8, 1],
    connectorColor: "#e9cffc",
    outputIconBackground:
      "linear-gradient(0deg, rgba(225, 140, 242, 0.1), rgba(225, 140, 242, 0.1)), rgba(255, 255, 255, 0.14)",
    outputIconColor: "#d994e8",
  },
}

const TRANSACTIONAL_DIGEST_CARD: PromptInTheWildCardProps = {
  title: "Transactional digest",
  prompt:
    "Bundle routine order updates into one daily summary via Email, but break through instantly with Push when something is actually urgent.",
  output: "One calm summary a day instead of a dozen interrupting pings.",
  background: digestCardImage,
  steps: ["email", "inApp", "push", "delay"],
  theme: {
    titleColor: "#ccf7ff",
    stepSurfaceBackgrounds: [
      "radial-gradient(99.83% 161.65% at 90% -23.08%, rgba(60, 118, 130, 0.66) 2.53%, rgba(49, 72, 91, 0.36) 51.27%, rgba(38, 25, 51, 0) 100%), linear-gradient(141deg, rgba(20, 31, 41, 0.53) -0.65%, rgba(20, 31, 41, 0.18) 87.68%)",
      "radial-gradient(92.53% 135.58% at 54.41% -35.58%, rgba(60, 118, 130, 0.56) 2.53%, rgba(49, 72, 91, 0.31) 51.27%, rgba(38, 25, 51, 0) 100%), linear-gradient(141deg, rgba(20, 31, 41, 0.53) -0.65%, rgba(20, 31, 41, 0.18) 87.68%)",
      "radial-gradient(92.53% 135.58% at 54.41% -35.58%, rgba(60, 118, 130, 0.56) 2.53%, rgba(49, 72, 91, 0.31) 51.27%, rgba(38, 25, 51, 0) 100%), linear-gradient(141deg, rgba(20, 31, 41, 0.53) -0.65%, rgba(20, 31, 41, 0.18) 87.68%)",
      "radial-gradient(229.97% 180.2% at -90% -31.73%, rgba(60, 118, 130, 0.66) 2.53%, rgba(49, 72, 91, 0.36) 51.27%, rgba(38, 25, 51, 0) 100%), linear-gradient(141deg, rgba(20, 31, 41, 0.53) -0.65%, rgba(20, 31, 41, 0.18) 87.68%)",
    ],
    stepBorderBackgrounds: [
      "linear-gradient(30deg,rgb(30, 41, 57) 0%, #253346 58%, #4e7e8a 76%, #b5d6de 100%)",
      "linear-gradient(180deg, #b5d6de 0%, #3c7682 44%, #253346 100%)",
      "linear-gradient(180deg, #b5d6de 0%, #3c7682 44%, #253346 100%)",
      "linear-gradient(160deg, #b5d6de 0%, #4e7e8a 24%, #253346 42%, rgb(30, 41, 57) 100%)",
    ],
    stepIconColor: "#6f97af",
    stepIconOpacities: [0.5, 0.6, 0.8, 1],
    connectorColor: "#80eaff",
    outputIconBackground: "rgba(128, 234, 255, 0.2)",
    outputIconColor: "#80eaff",
  },
}

const TRIAL_CONVERSION_CARD: PromptInTheWildCardProps = {
  title: "Trial conversion",
  prompt:
    "A friendly heads-up via Email before a trial ends, a softer In-App reminder the day before, and a clear upgrade offer via Push on expiry.",
  output: "A sequence that feels helpful, not pushy.",
  background: conversionCardImage,
  steps: ["email", "inApp", "push", "delay"],
  theme: {
    titleColor: "#ccd9ff",
    stepSurfaceBackgrounds: [
      "radial-gradient(99.83% 161.65% at 90% -23.08%, rgba(42, 93, 194, 0.66) 2.53%, #1f2a55 51.27%, rgba(38, 25, 51, 0) 100%), linear-gradient(141deg, rgba(20, 31, 41, 0.53) -0.65%, rgba(20, 31, 41, 0.18) 87.68%)",
      "radial-gradient(92.53% 135.58% at 54.41% -35.58%, rgba(42, 93, 194, 0.56) 2.53%, #2b3a71 51.27%, rgba(38, 25, 51, 0) 100%), linear-gradient(141deg, rgba(20, 31, 41, 0.53) -0.65%, rgba(20, 31, 41, 0.18) 87.68%)",
      "radial-gradient(92.53% 135.58% at 54.41% -35.58%, rgba(42, 93, 194, 0.56) 2.53%, #2b3a71 51.27%, rgba(38, 25, 51, 0) 100%), linear-gradient(141deg, rgba(20, 31, 41, 0.53) -0.65%, rgba(20, 31, 41, 0.18) 87.68%)",
      "radial-gradient(229.97% 180.2% at -90% -31.73%, rgba(42, 93, 194, 0.66) 2.53%, #2b3a71 51.27%, rgba(38, 25, 51, 0) 100%), linear-gradient(141deg, rgba(20, 31, 41, 0.53) -0.65%, rgba(20, 31, 41, 0.18) 87.68%)",
    ],
    stepBorderBackgrounds: [
      "linear-gradient(30deg,rgb(26, 34, 66) 0%,rgb(31, 41, 80) 58%, #5570c6 76%, #b7c5ef 100%)",
      "linear-gradient(180deg, #b7c5ef 0%, #5570c6 44%, #2a376b 100%)",
      "linear-gradient(180deg, #b7c5ef 0%, #5570c6 44%, #2a376b 100%)",
      "linear-gradient(160deg, #b7c5ef 0%, #5570c6 24%, rgb(54, 70, 127) 42%, rgb(43, 53, 95) 100%)",
    ],
    stepIconColor: "#80bbff",
    stepIconOpacities: [0.45, 0.6, 0.8, 1],
    connectorColor: "#80bbff",
    outputIconBackground: "rgba(128, 187, 255, 0.2)",
    outputIconColor: "#80bbff",
  },
}

const MILESTONE_CELEBRATION_CARD: PromptInTheWildCardProps = {
  title: "Milestone celebration",
  prompt:
    "Celebrate users when they hit a meaningful milestone with In-App and Push, then invite them to share it via Email the day after.",
  output: "Recognition at the moment it matters.",
  background: milestoneCardImage,
  steps: ["inApp", "push", "delay", "email"],
  theme: {
    titleColor: "#dccffc",
    stepSurfaceBackgrounds: [
      "radial-gradient(99.83% 161.65% at 90% -23.08%, rgba(129, 92, 214, 0.5) 2.53%, rgba(106, 75, 173, 0.38) 26.9%, rgba(83, 58, 133, 0.25) 51.27%, rgba(38, 25, 51, 0) 100%), linear-gradient(141deg, rgba(77, 67, 112, 0.48) -0.65%, rgba(77, 67, 112, 0.14) 87.68%)",
      "radial-gradient(92.53% 135.58% at 54.41% -35.58%, rgba(179, 149, 250, 0.6) 2.53%, rgba(144, 118, 200, 0.45) 26.9%, rgba(109, 87, 151, 0.3) 51.27%, rgba(73, 56, 101, 0.15) 75.63%, rgba(38, 25, 51, 0) 100%), linear-gradient(141deg, rgba(77, 67, 112, 0.48) -0.65%, rgba(77, 67, 112, 0.14) 87.68%)",
      "radial-gradient(92.53% 135.58% at 54.41% -35.58%, rgba(179, 149, 250, 0.6) 2.53%, rgba(144, 118, 200, 0.45) 26.9%, rgba(109, 87, 151, 0.3) 51.27%, rgba(73, 56, 101, 0.15) 75.63%, rgba(38, 25, 51, 0) 100%), linear-gradient(141deg, rgba(77, 67, 112, 0.48) -0.65%, rgba(77, 67, 112, 0.14) 87.68%)",
      "radial-gradient(229.97% 180.2% at -90% -31.73%, rgba(126, 92, 214, 0.5) 2.53%, rgba(104, 75, 173, 0.38) 26.9%, rgba(82, 58, 133, 0.25) 51.27%, rgba(38, 25, 51, 0) 100%), linear-gradient(141deg, rgba(77, 67, 112, 0.48) -0.65%, rgba(77, 67, 112, 0.14) 87.68%)",
    ],
    stepBorderBackgrounds: [
      "linear-gradient(30deg,rgb(61, 46, 81) 0%, #5a4478 58%, #8267a7 76%, #d9cff5 100%)",
      "linear-gradient(180deg, #d9cff5 0%, #8267a7 44%, #5a4478 100%)",
      "linear-gradient(180deg, #d9cff5 0%, #8267a7 44%, #5a4478 100%)",
      "linear-gradient(160deg, #d9cff5 0%, #8267a7 24%,rgb(67, 51, 90) 42%, rgb(42, 32, 56) 100%)",
    ],
    stepIconColor: "#b78cf2",
    stepIconOpacities: [0.7, 0.9, 0.9, 1],
    connectorColor: "#dccffc",
    outputIconBackground:
      "linear-gradient(0deg, rgba(183, 140, 242, 0.1), rgba(183, 140, 242, 0.1)), rgba(255, 255, 255, 0.14)",
    outputIconColor: "#b78cf2",
  },
}

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
          <PromptInTheWildCard {...RE_ENGAGEMENT_CARD} />
          <PromptInTheWildCard {...TRANSACTIONAL_DIGEST_CARD} />
          <PromptInTheWildCard {...TRIAL_CONVERSION_CARD} />
          <PromptInTheWildCard {...MILESTONE_CELEBRATION_CARD} />
        </div>
      </div>
    </section>
  )
}

export default PromptsInTheWild
