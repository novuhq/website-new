import type { CSSProperties } from "react"
import Image from "next/image"
import cliBackgroundLightsMobileImage from "@/images/pages/connect/cli/bg-lights-mobile.svg"
import cliBackgroundLightsImage from "@/images/pages/connect/cli/bg-lights.svg"
import cliBlobImage from "@/images/pages/connect/cli/blob.png"
import cliGithubImage from "@/images/pages/connect/cli/github.png"
import cliMcpImage from "@/images/pages/connect/cli/mcp.png"
import cliPromptImage from "@/images/pages/connect/cli/prompt.png"
import cliToolsImage from "@/images/pages/connect/cli/tools.png"
import cliWindowImage from "@/images/pages/connect/cli/window.png"

import ConnectCommandInput from "./command-input"

const CLI_WINDOWS_STAGE_BACKGROUND = `url(${cliBackgroundLightsImage.src})`
const CLI_WINDOWS_STAGE_MOBILE_BACKGROUND = `url(${cliBackgroundLightsMobileImage.src})`
const CLI_WINDOW_BACKGROUND = `url(${cliWindowImage.src})`
const CLI_BORDER_ACCENT_MASK_STYLE = {
  WebkitMask:
    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  maskComposite: "exclude",
} satisfies CSSProperties
const CLI_TOP_LEFT_BORDER_ACCENT_STYLE = {
  ...CLI_BORDER_ACCENT_MASK_STYLE,
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.72) 18%, rgba(255,255,255,0.24) 34%, rgba(255,255,255,0) 50%)",
} satisfies CSSProperties
const CLI_TOP_RIGHT_BORDER_ACCENT_STYLE = {
  ...CLI_BORDER_ACCENT_MASK_STYLE,
  background:
    "linear-gradient(225deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.72) 18%, rgba(255,255,255,0.24) 34%, rgba(255,255,255,0) 50%)",
} satisfies CSSProperties

function CliCardBorder({
  id,
  className = "z-10",
  accentClassName,
  accentStyle,
}: {
  id: string
  className?: string
  accentClassName?: string
  accentStyle?: CSSProperties
}) {
  return (
    <>
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-[inherit] border border-white/50 mix-blend-soft-light ${className}`}
        data-connect-cli-border-base={id}
      />
      {accentStyle ? (
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 rounded-[inherit] p-px mix-blend-overlay ${accentClassName ?? className}`}
          data-connect-cli-border-accent={id}
          style={accentStyle}
        />
      ) : null}
    </>
  )
}

function CliCommandWindow() {
  return (
    <div
      className="absolute top-8 left-1/2 z-10 aspect-[64/45] w-full -translate-x-1/2 overflow-hidden rounded-[clamp(0.375rem,0.797vw,0.75rem)] bg-[#110f1c] md:top-[calc(3.25rem_+_1.953vw)] md:w-[calc(-2.1rem_+_46.19vw)] md:max-w-none lg:top-[17.5585%] lg:w-[42.8954%]"
      data-connect-cli-command-window
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[length:100%_100%] bg-center bg-no-repeat"
        style={{
          backgroundImage: CLI_WINDOW_BACKGROUND,
        }}
      />
      <CliCardBorder
        id="connect-cli-command"
        className="z-30"
        accentStyle={CLI_TOP_LEFT_BORDER_ACCENT_STYLE}
      />

      <Image
        src={cliBlobImage}
        alt=""
        aria-hidden
        className="absolute top-[11.333333%] left-[34.21875%] z-10 h-auto w-[31.443%]"
        priority={false}
      />

      <div className="absolute top-[68.222222%] left-[8.4375%] z-20 flex w-[83.125%] flex-col items-center gap-[clamp(0.266rem,0.625vw,0.5rem)] font-mono text-[clamp(0.5rem,calc(2.1875vw_+_0.0078125rem),0.9375rem)] leading-[1.5] tracking-[-0.009375rem] md:text-[clamp(0.5rem,1.005vw,0.9375rem)]">
        <p className="bg-[linear-gradient(88.713deg,#ff7cbe_29.792%,#893aff_75.786%)] bg-clip-text text-transparent">
          Welcome to Novu Connect
        </p>
        <p className="text-[#f9e0ff]">
          Spin up an <span className="text-[#ff7cbe]">AI SDK Agent</span> and
          connect it to <span className="text-[#ba50eb]">Slack, Telegram,</span>{" "}
          <span className="text-[#ff7cbe]">MS Team</span> and more &mdash; all
          from your terminal
        </p>
        <p className="bg-[linear-gradient(93.527deg,#ff7cbe_29.774%,#993aff_100%)] bg-clip-text text-transparent">
          Press Enter to sign in or create an account &rarr;
        </p>
      </div>
    </div>
  )
}

function CliToolsWindow() {
  return (
    <div
      className="absolute top-[2.5625rem] left-[2.625rem] z-10 hidden aspect-[360/269] w-[22.5rem] overflow-hidden rounded-[clamp(0.375rem,0.797vw,0.75rem)] shadow-[0_0.1095625rem_2.6293125rem_0_rgba(0,0,0,0.4)] md:top-[calc(3.481rem_-_2.695vw)] md:left-[calc(2.35rem_-_0.859vw)] md:block md:w-[calc(-1.081rem_+_25.82vw)] lg:top-[6.8562%] lg:left-[2.815%] lg:w-[24.129%]"
      data-connect-cli-tools-window
    >
      <Image
        src={cliToolsImage}
        alt=""
        aria-hidden
        className="size-full object-cover"
        priority={false}
      />
      <CliCardBorder
        id="connect-cli-tools"
        accentStyle={CLI_TOP_LEFT_BORDER_ACCENT_STYLE}
      />
    </div>
  )
}

function CliMcpWindow() {
  return (
    <div
      className="absolute top-[clamp(17rem,calc(70.3125vw_+_1.2421875rem),31.125rem)] left-0 z-10 aspect-[60/23] w-[37.5%] max-w-[15rem] overflow-hidden rounded-[clamp(0.375rem,0.797vw,0.75rem)] shadow-[0_0.1095625rem_2.6293125rem_0_rgba(0,0,0,0.4)] md:top-[calc(2.768rem_+_18.09vw)] md:left-[calc(1.9rem_+_7.89vw)] md:w-[calc(-0.631rem_+_17.07vw)] md:max-w-none lg:top-[55.8528%] lg:left-[10.858%] lg:w-[16.086%]"
      data-connect-cli-mcp-window
    >
      <Image
        src={cliMcpImage}
        alt=""
        aria-hidden
        className="size-full object-cover"
        priority={false}
      />
      <CliCardBorder
        id="connect-cli-mcp"
        accentStyle={CLI_TOP_LEFT_BORDER_ACCENT_STYLE}
      />
    </div>
  )
}

function CliGithubWindow() {
  return (
    <div
      className="absolute top-[2.5625rem] right-[2.625rem] z-10 hidden aspect-[24/13] w-[22.5rem] overflow-hidden rounded-[clamp(0.375rem,0.797vw,0.75rem)] shadow-[0_0.1095625rem_2.6293125rem_0_rgba(0,0,0,0.4)] md:top-[calc(3.481rem_-_2.695vw)] md:right-[calc(2.35rem_-_0.859vw)] md:block md:w-[calc(-1.081rem_+_25.82vw)] lg:top-[6.8562%] lg:right-[2.815%] lg:w-[24.129%]"
      data-connect-cli-github-window
    >
      <Image
        src={cliGithubImage}
        alt=""
        aria-hidden
        className="size-full object-cover"
        priority={false}
      />
      <CliCardBorder
        id="connect-cli-github"
        accentStyle={CLI_TOP_LEFT_BORDER_ACCENT_STYLE}
      />
    </div>
  )
}

function CliPromptWindow() {
  return (
    <div
      className="absolute top-[clamp(17rem,calc(70.3125vw_+_1.2421875rem),31.125rem)] right-0 z-10 flex w-[calc(62.5%_-_1rem)] flex-col gap-1 overflow-hidden rounded-[clamp(0.375rem,0.797vw,0.75rem)] px-[clamp(0.53125rem,calc(2.224vw_+_0.0309rem),1.096875rem)] pt-[clamp(0.375rem,calc(1.597vw_+_0.0156rem),0.78125rem)] pb-[clamp(0.46875rem,calc(2.028vw_+_0.0126rem),0.984375rem)] shadow-[0_0.1095625rem_2.6293125rem_0_rgba(0,0,0,0.4)] md:top-[calc(2.8rem_+_13.05vw)] md:right-[calc(1.9625rem_+_4.375vw)] md:left-auto md:block md:aspect-[291/130] md:h-auto md:w-[calc(-0.944rem_+_20.977vw)] md:max-w-none md:p-0 lg:top-[43.4783%] lg:right-[7.44%] lg:w-[19.504%]"
      data-connect-cli-prompt-window
    >
      <Image
        src={cliPromptImage}
        alt=""
        aria-hidden
        className="absolute inset-0 size-full object-cover"
        priority={false}
      />
      <p className="relative z-10 text-left font-mono text-[clamp(0.47rem,calc(1.1vw_+_0.2225rem),0.75rem)] leading-[1.5] tracking-[-0.01em] whitespace-nowrap text-[rgba(146,122,227,0.5)] md:absolute md:top-[9.2308%] md:left-[5.8419%] md:text-[clamp(0.46875rem,1.005vw,0.9375rem)]">
        System prompt
      </p>
      <p className="relative z-10 text-left font-mono text-[clamp(0.47rem,calc(1.1vw_+_0.2225rem),0.75rem)] leading-[1.5] tracking-[-0.01em] text-[#afa0ff] md:absolute md:top-[32.3077%] md:left-[5.8419%] md:line-clamp-3 md:h-[55.3846%] md:w-[88.66%] md:overflow-hidden md:text-[clamp(0.46875rem,1.005vw,0.9375rem)]">
        You are a Pull Request review agent focused on analyzing code changes,
        identifying risks, and producing concise, actionable review output
        for...
      </p>
      <CliCardBorder
        id="connect-cli-prompt"
        className="z-20"
        accentStyle={CLI_TOP_RIGHT_BORDER_ACCENT_STYLE}
      />
    </div>
  )
}

function CliWindowsStage() {
  return (
    <div
      className="pointer-events-none relative mt-6 h-[clamp(23.25rem,calc(86.489vw_+_1.6025rem),39.25rem)] w-full max-w-[40rem] overflow-visible md:mt-0 md:aspect-[746/299] md:h-auto md:w-screen md:max-w-none lg:mt-[clamp(-2.0625rem,calc(2.3571rem_-_3.683vw),0rem)] lg:w-[calc(100vw-1px)] lg:max-w-[93.25rem]"
      aria-hidden
      data-connect-cli-windows-stage
    >
      <span
        data-connect-cli-windows-lights-mobile
        className="pointer-events-none absolute top-[0.5rem] left-1/2 h-[26rem] w-[42.5rem] -translate-x-1/2 bg-[length:100%_100%] bg-center bg-no-repeat md:hidden"
        style={{
          backgroundImage: CLI_WINDOWS_STAGE_MOBILE_BACKGROUND,
        }}
      />
      <span
        data-connect-cli-windows-lights-desktop
        className="pointer-events-none absolute top-[67%] left-1/2 hidden h-[199.666%] w-screen max-w-[111rem] -translate-x-1/2 -translate-y-1/2 bg-[length:100%_100%] bg-center bg-no-repeat md:block"
        style={{
          backgroundImage: CLI_WINDOWS_STAGE_BACKGROUND,
        }}
      />
      <CliToolsWindow />
      <CliMcpWindow />
      <CliGithubWindow />
      <CliPromptWindow />
      <CliCommandWindow />
    </div>
  )
}

function CliSection() {
  return (
    <section
      id="cli"
      className="scroll-mt-16 pt-[6.5rem] pb-[6.1875rem] md:py-28 lg:py-[clamp(7rem,calc(14.2857vw_-_2.1429rem),15rem)]"
      data-connect-section="cli"
    >
      <div className="mx-auto flex w-full max-w-[93.25rem] flex-col items-center px-5 text-center md:px-8 2xl:px-0">
        <div className="flex w-full flex-col items-center gap-4">
          <h2 className="max-w-[52.125rem] text-[1.75rem] leading-dense font-medium tracking-normal text-wrap text-white md:text-[2.5rem] md:text-balance 2xl:text-5xl">
            Open source, ready in one command
          </h2>
          <p className="max-w-[40.5625rem] text-base leading-normal font-book tracking-normal text-pretty text-gray-8 md:text-lg">
            Novu Connect is built in the open &mdash; inspect the code,
            contribute integrations, or adapt it for your team&apos;s workflow.
          </p>
        </div>
        <ConnectCommandInput
          className="relative z-20 mt-10 max-w-[20.5rem] pl-4 md:mt-11"
          clickLocation="connect_cli"
          hasFieldBackground
        />
        <CliWindowsStage />
      </div>
    </section>
  )
}

export default CliSection
