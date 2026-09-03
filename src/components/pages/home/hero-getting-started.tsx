"use client"

import { Suspense } from "react"
import { ROUTE } from "@/constants/routes"

import { trackGettingStartedFlowEvent } from "@/lib/getting-started-flow-client"
import {
  GETTING_STARTED_FLOW_SELECTED_EVENT,
  WEBSITE_CLI_COMMAND_COPIED_EVENT,
  WEBSITE_PROMPT_COPIED_EVENT,
} from "@/lib/getting-started-flow-experiment"
import { Button } from "@/components/ui/button"
import { CopyCommand } from "@/components/ui/copy-command"
import GettingStartedFlowRuntime from "@/components/getting-started-flow-runtime"

import AnimatedCopyCheck from "./animated-copy-check"
import CopyPromptButton from "./copy-prompt-button"

const SIGN_UP_HREF = String(ROUTE.dashboardV2AgentsSignUp)

function SignupButton({ label }: { label: string }) {
  return (
    <Button
      asChild
      variant="default"
      size="none"
      className="h-11 w-full px-5 text-base leading-none font-medium tracking-tight normal-case sm:w-auto"
    >
      <a
        href={SIGN_UP_HREF}
        data-click-location="home_hero"
        data-click-text="get_started_free"
        data-getting-started-flow-action="sign_up_primary"
        data-getting-started-flow-signup
      >
        {label}
      </a>
    </Button>
  )
}

function SecondarySignupLink({ label }: { label: string }) {
  return (
    <a
      className="w-fit text-sm font-medium tracking-tight text-[#a3a6b2] underline-offset-4 transition-colors hover:text-white hover:underline"
      href={SIGN_UP_HREF}
      data-click-location="home_hero"
      data-click-text="sign_up_instead"
      data-getting-started-flow-signup
    >
      {label}
    </a>
  )
}

interface BaselineActionsProps {
  command: string
  prompt: string
  identifiedForExperiment: boolean
}

function BaselineActions({
  command,
  prompt,
  identifiedForExperiment,
}: BaselineActionsProps) {
  return (
    <div
      className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-5"
      data-getting-started-flow-variant={
        identifiedForExperiment ? "baseline" : undefined
      }
    >
      <CopyCommand
        command={command}
        variant="highlighted"
        commandClassName="pointer-events-auto select-text"
        copiedContent={<AnimatedCopyCheck />}
        copyButtonProps={{
          "data-click-location": "home_hero",
          "data-click-text": "copy_cli",
        }}
      />
      <CopyPromptButton
        className="h-11 w-full px-5 text-base leading-none font-medium tracking-tight normal-case hover:border-[#867A94] hover:bg-white/7 sm:w-39 [&_svg]:size-3.5"
        variant="outline-transparent"
        size="none"
        resetInterval={2000}
        value={prompt}
        data-click-location="home_hero"
        data-click-text="copy_prompt"
      />
    </div>
  )
}

interface HeroGettingStartedProps {
  command: string
  experimentEnabled: boolean
  experimentQaEnabled: boolean
  prompt: string
  secondarySignupLabel: string
  signupLabel: string
  signupNote: string
}

function HeroGettingStarted({
  command,
  experimentEnabled,
  experimentQaEnabled,
  prompt,
  secondarySignupLabel,
  signupLabel,
  signupNote,
}: HeroGettingStartedProps) {
  const baseline = (
    <BaselineActions
      command={command}
      prompt={prompt}
      identifiedForExperiment
    />
  )

  return (
    <div className="mt-6 w-full lg:mt-7">
      <Suspense fallback={null}>
        <GettingStartedFlowRuntime
          enabled={experimentEnabled}
          qaEnabled={experimentQaEnabled}
        />
      </Suspense>
      {baseline}

      <div
        className="min-h-19 w-full flex-col gap-3"
        data-getting-started-flow-variant="ui"
      >
        <SignupButton label={signupLabel} />
        <p className="text-sm tracking-tight text-[#a3a6b2]">{signupNote}</p>
      </div>

      <div
        className="min-h-19 w-full flex-col gap-3"
        data-getting-started-flow-variant="cli"
      >
        <CopyCommand
          command={command}
          variant="highlighted"
          commandClassName="pointer-events-auto select-text"
          copiedContent={<AnimatedCopyCheck />}
          onCopySuccess={() => {
            trackGettingStartedFlowEvent(GETTING_STARTED_FLOW_SELECTED_EVENT, {
              action: "copy_cli",
            })
            trackGettingStartedFlowEvent(WEBSITE_CLI_COMMAND_COPIED_EVENT, {
              command,
            })
          }}
          copyButtonProps={{
            "data-click-location": "home_hero",
            "data-click-text": "copy_cli",
            "data-getting-started-flow-action": "copy_cli",
            "data-getting-started-flow-copy-value": command,
          }}
        />
        <SecondarySignupLink label={secondarySignupLabel} />
      </div>

      <div
        className="min-h-19 w-full flex-col gap-3"
        data-getting-started-flow-variant="prompt"
      >
        <CopyPromptButton
          className="h-11 w-full px-5 text-base leading-none font-medium tracking-tight normal-case sm:w-auto [&_svg]:size-3.5"
          variant="default"
          size="none"
          resetInterval={2000}
          value={prompt}
          onCopySuccess={() => {
            trackGettingStartedFlowEvent(GETTING_STARTED_FLOW_SELECTED_EVENT, {
              action: "copy_prompt",
            })
            trackGettingStartedFlowEvent(WEBSITE_PROMPT_COPIED_EVENT, {
              prompt,
            })
          }}
          data-click-location="home_hero"
          data-click-text="copy_prompt"
          data-getting-started-flow-action="copy_prompt"
          data-getting-started-flow-copy-value={prompt}
        />
        <SecondarySignupLink label={secondarySignupLabel} />
      </div>
    </div>
  )
}

export default HeroGettingStarted
