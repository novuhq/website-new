import type { CSSProperties } from "react"
import Image, { type StaticImageData } from "next/image"
import arrowUpIcon from "@/images/pages/copilot/cards/icons/arrow-up.svg"
import delayIcon from "@/images/pages/copilot/cards/icons/delay.svg"
import emailIcon from "@/images/pages/copilot/cards/icons/email.svg"
import inAppIcon from "@/images/pages/copilot/cards/icons/inapp.svg"
import pushIcon from "@/images/pages/copilot/cards/icons/push.svg"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

export type PromptInTheWildButtonType = "email" | "delay" | "push" | "inApp"

interface PromptInTheWildStepMeta {
  label: string
  icon: StaticImageData
}

interface PromptInTheWildCardTheme {
  titleColor?: string
  stepSurfaceBackgrounds?: readonly string[]
  stepBorderBackgrounds?: readonly string[]
  stepIconColor?: string
  stepIconOpacities?: readonly number[]
  connectorColor?: string
  outputIconBackground?: string
  outputIconColor?: string
}

export interface PromptInTheWildCardProps {
  title: string
  prompt: string
  output: string
  steps: PromptInTheWildButtonType[]
  background: StaticImageData
  className?: string
  sizes?: string
  theme?: PromptInTheWildCardTheme
}

const DEFAULT_THEME = {
  titleColor: "#f5cffc",
  stepSurfaceBackgrounds: [
    "radial-gradient(99.83% 161.65% at 90% -23.08%, rgba(192, 92, 214, 0.5) 2.53%, #261D31 100%), linear-gradient(141deg, rgba(92, 67, 112, 0.48) -0.65%, rgba(92, 67, 112, 0.14) 87.68%)",
    "radial-gradient(92.53% 135.58% at 54.41% -35.58%, rgba(192, 92, 214, 0.5) 2.53%, rgba(38, 25, 51, 0) 100%), linear-gradient(141deg, rgba(92, 67, 112, 0.48) -0.65%, rgba(92, 67, 112, 0.14) 87.68%)",
    "radial-gradient(92.53% 135.58% at 54.41% -35.58%, rgba(192, 92, 214, 0.5) 2.53%, rgba(38, 25, 51, 0) 100%), linear-gradient(141deg, rgba(92, 67, 112, 0.48) -0.65%, rgba(92, 67, 112, 0.14) 87.68%)",
    "radial-gradient(229.97% 180.2% at -90% -31.73%, rgba(192, 92, 214, 0.5) 2.53%, rgba(38, 25, 51, 0) 100%), linear-gradient(141deg, rgba(92, 67, 112, 0.48) -0.65%, rgba(92, 67, 112, 0.14) 87.68%)",
  ],
  stepBorderBackgrounds: [
    "linear-gradient(30deg, #281b37 0%, #584172 58%, #725885 76%, #c5b7cb 100%)",
    "linear-gradient(180deg, #c5b7cb 0%, #6e5680 44%, #584172 100%)",
    "linear-gradient(180deg, #c5b7cb 0%, #6e5680 44%, #584172 100%)",
    "linear-gradient(160deg, #c5b7cb 0%, #725885 24%, #584172 42%, #281b37 100%)",
  ],
  stepIconColor: "#c585d6",
  stepIconOpacities: [1, 1, 1, 1],
  connectorColor: "#e9cffc",
  outputIconBackground:
    "linear-gradient(0deg, rgba(225, 140, 242, 0.1), rgba(225, 140, 242, 0.1)), rgba(255, 255, 255, 0.14)",
  outputIconColor: "#d994e8",
}

type PromptCardStyle = CSSProperties & Record<`--prompt-card-${string}`, string>

const STEP_META: Record<PromptInTheWildButtonType, PromptInTheWildStepMeta> = {
  email: {
    label: "Email",
    icon: emailIcon,
  },
  delay: {
    label: "Delay",
    icon: delayIcon,
  },
  push: {
    label: "Push",
    icon: pushIcon,
  },
  inApp: {
    label: "In-App",
    icon: inAppIcon,
  },
}

function FlowConnector() {
  return (
    <svg
      aria-hidden
      className="h-[1em] w-[18em] shrink-0 text-[var(--prompt-card-connector-color)]"
      fill="none"
      viewBox="0 0 18 1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 0.5L18 0.500002"
        opacity="0.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
    </svg>
  )
}

function getStepSurfaceBackground(
  index: number,
  stepSurfaceBackgrounds: readonly string[]
) {
  return stepSurfaceBackgrounds[index] ?? stepSurfaceBackgrounds[0]
}

function getStepBorderBackground(
  index: number,
  stepBorderBackgrounds: readonly string[]
) {
  return stepBorderBackgrounds[index] ?? stepBorderBackgrounds[0]
}

function getStepIconOpacity(
  index: number,
  stepIconOpacities: readonly number[]
) {
  return stepIconOpacities[index] ?? 1
}

function FlowStep({
  type,
  index,
  stepSurfaceBackgrounds,
  stepBorderBackgrounds,
  stepIconOpacities,
}: {
  type: PromptInTheWildButtonType
  index: number
  stepSurfaceBackgrounds: readonly string[]
  stepBorderBackgrounds: readonly string[]
  stepIconOpacities: readonly number[]
}) {
  const { icon, label } = STEP_META[type]
  const stepSurfaceBackground = getStepSurfaceBackground(
    index,
    stepSurfaceBackgrounds
  )
  const stepBorderBackground = getStepBorderBackground(
    index,
    stepBorderBackgrounds
  )
  const stepIconOpacity = getStepIconOpacity(index, stepIconOpacities)

  return (
    <div
      className="relative flex h-[52em] w-[109em] shrink-0 items-center justify-center gap-[10em] rounded-[8em] leading-none font-medium tracking-[-0.02em] text-white/85 [box-shadow:0_18em_44em_rgba(15,16,21,0.6)] backdrop-blur-[12px]"
      style={{
        background: stepSurfaceBackground,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[8em] p-[1em]"
        style={{
          background: stepBorderBackground,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
        }}
      />
      <span
        aria-hidden
        className="size-[19em] shrink-0 bg-[var(--prompt-card-step-icon-color)]"
        style={{
          mask: `url(${icon.src}) center / contain no-repeat`,
          opacity: stepIconOpacity,
          WebkitMask: `url(${icon.src}) center / contain no-repeat`,
        }}
      />
      <span
        className="truncate font-inter text-[19em] leading-none font-medium tracking-[-0.02em]"
        style={{ fontFeatureSettings: "'liga' 0, 'calt' 0" }}
      >
        {label}
      </span>
    </div>
  )
}

function PromptInTheWildCard({
  title,
  prompt,
  output,
  steps,
  background,
  className,
  sizes = "(max-width: 767px) calc(100vw - 40px), (max-width: 1248px) calc((100vw - 92px) / 2), 562px",
  theme,
}: PromptInTheWildCardProps) {
  const mergedTheme = { ...DEFAULT_THEME, ...theme }
  const stepSurfaceBackgrounds =
    theme?.stepSurfaceBackgrounds ?? DEFAULT_THEME.stepSurfaceBackgrounds
  const stepBorderBackgrounds =
    theme?.stepBorderBackgrounds ?? DEFAULT_THEME.stepBorderBackgrounds
  const stepIconOpacities =
    theme?.stepIconOpacities ?? DEFAULT_THEME.stepIconOpacities
  const titleId = `prompt-in-the-wild-${title
    .toLowerCase()
    .replaceAll(" ", "-")}`
  const style: PromptCardStyle = {
    "--prompt-card-title-color": mergedTheme.titleColor,
    "--prompt-card-step-icon-color": mergedTheme.stepIconColor,
    "--prompt-card-connector-color": mergedTheme.connectorColor,
    "--prompt-card-output-icon-background": mergedTheme.outputIconBackground,
    "--prompt-card-output-icon-color": mergedTheme.outputIconColor,
  }

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "[container-type:inline-size] relative isolate aspect-[562/298] w-full overflow-hidden rounded-xl bg-[#0e0c17]",
        className
      )}
      style={style}
    >
      <Image
        src={background}
        alt=""
        aria-hidden
        fill
        className="-z-10 object-cover select-none"
        loading="eager"
        sizes={sizes}
      />

      <div className="absolute inset-0 [font-size:calc(100cqw/562)]">
        <h3
          id={titleId}
          className="absolute top-[5.7047%] left-[4.0925%] max-w-[91.8149%] text-[13em] leading-none tracking-normal text-[var(--prompt-card-title-color)] uppercase"
        >
          {title}
        </h3>

        <div className="absolute top-[16.443%] right-[4.0925%] left-[4.0925%] flex items-end gap-[17em] overflow-hidden rounded-[10em] bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_1.32%,rgba(255,255,255,0.75)_98.71%)] py-[10em] pr-[10em] pl-[16em] [box-shadow:0_18em_44em_rgba(15,16,21,0.6)]">
          <p className="min-w-0 flex-1 font-inter text-[16em] leading-[1.375] font-normal tracking-[-0.02em] text-black/90">
            {prompt}
          </p>
          <span className="flex size-[24em] shrink-0 items-center justify-center rounded-[4.5em] bg-[#7f859c] text-white">
            <span
              aria-hidden
              className="size-[16em] bg-current"
              style={{
                mask: `url(${arrowUpIcon.src}) center / contain no-repeat`,
                WebkitMask: `url(${arrowUpIcon.src}) center / contain no-repeat`,
              }}
            />
          </span>
        </div>

        <div className="absolute top-[56.3758%] left-[4.0925%] flex flex-nowrap items-center justify-center gap-[4em]">
          {steps.map((step, index) => (
            <div className="contents" key={`${step}-${index}`}>
              <FlowStep
                type={step}
                index={index}
                stepSurfaceBackgrounds={stepSurfaceBackgrounds}
                stepBorderBackgrounds={stepBorderBackgrounds}
                stepIconOpacities={stepIconOpacities}
              />
              {index < steps.length - 1 && <FlowConnector />}
            </div>
          ))}
        </div>

        <div className="absolute top-[85.2349%] left-[4.0925%] flex w-[91.4591%] items-center gap-[8em]">
          <span
            className="flex size-[18em] shrink-0 items-center justify-center rounded-full"
            style={{ background: "var(--prompt-card-output-icon-background)" }}
          >
            <Check
              aria-hidden
              className="size-[11em] text-[var(--prompt-card-output-icon-color)]"
              strokeWidth={3}
            />
          </span>
          <p className="min-w-0 font-inter text-[14em] leading-[1.375] font-normal tracking-[-0.02em] text-white/80">
            Output: {output}
          </p>
        </div>
      </div>
    </article>
  )
}

export default PromptInTheWildCard
