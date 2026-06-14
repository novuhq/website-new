"use client"

import { useId } from "react"
import Image from "next/image"
import fieldBackgroundImage from "@/images/pages/connect/cli/field-bg.svg"
import CheckIcon from "@/svgs/icons/check.svg"

import { cn } from "@/lib/utils"
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"

const CONNECT_COMMAND = "npx novu connect"
const FIELD_BACKGROUND_IMAGE = fieldBackgroundImage.src
const INPUT_GLOW_BLURS = [
  "blur-[18px]",
  "blur-[14px]",
  "blur-[10px]",
  "blur-[6px]",
  "blur-[3.5px]",
  "blur-[2px]",
  "blur-[1px]",
] as const

function CommandInputStroke({
  id,
  type,
  className,
}: {
  id: string
  type: "border" | "glow"
  className?: string
}) {
  const isGlow = type === "glow"
  const middleStop = isGlow ? "#ccd7ff" : "#a7bbff"
  const endStop = isGlow ? "#c2b3ff" : "#c6baf7"

  return (
    <svg
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 size-full overflow-visible",
        className
      )}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 303 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient
          id={id}
          cx="444.44"
          cy="40.6"
          r="492.86"
          gradientTransform="translate(444.44 40.6) scale(1 0.0337) translate(-444.44 -40.6)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="2.5%" stopColor="#fff" />
          <stop offset="21.5%" stopColor={middleStop} />
          <stop
            offset="100%"
            stopColor={endStop}
            stopOpacity={isGlow ? 1 : 0.8}
          />
        </radialGradient>
      </defs>
      <rect
        x="0.5"
        y="0.5"
        width="302"
        height="47"
        rx="5.5"
        stroke="#fff"
        strokeOpacity="0.5"
        vectorEffect="non-scaling-stroke"
      />
      <rect
        x="0.5"
        y="0.5"
        width="302"
        height="47"
        rx="5.5"
        stroke={`url(#${id})`}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function ConnectCommandInput({
  className,
  clickLocation,
  hasFieldBackground = false,
}: {
  className?: string
  clickLocation: string
  hasFieldBackground?: boolean
}) {
  const { isCopied, handleCopy } = useCopyToClipboard(5000)
  const idPrefix = useId().replaceAll(":", "")

  return (
    <div
      className={cn(
        "relative isolate flex h-12 w-full items-center overflow-visible rounded-md pr-24 pl-5",
        className
      )}
      aria-label={`Command: ${CONNECT_COMMAND}`}
    >
      {hasFieldBackground && (
        <span
          aria-hidden
          data-connect-command-field-bg
          className="pointer-events-none absolute top-[-4.5rem] left-[-5.375rem] z-0 h-[12rem] w-[31rem] bg-[length:100%_100%] bg-no-repeat md:top-[-6.5rem] md:left-[-7.6875rem] md:h-[16.4375rem] md:w-[39.4375rem]"
          style={{
            backgroundImage: `url(${FIELD_BACKGROUND_IMAGE})`,
          }}
        />
      )}

      {INPUT_GLOW_BLURS.map((blur, index) => (
        <CommandInputStroke
          id={`${idPrefix}-connect-command-input-glow-${index}`}
          key={blur}
          className={cn("z-0 rounded-md opacity-50", blur)}
          type="glow"
        />
      ))}

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-md bg-[#05050b]"
      />
      <CommandInputStroke
        id={`${idPrefix}-connect-command-input-border`}
        className="z-20 rounded-md"
        type="border"
      />

      <code className="relative z-30 min-w-0 truncate font-mono text-sm leading-[1.2] font-medium text-white min-[360px]:text-base">
        {CONNECT_COMMAND}
      </code>

      <button
        type="button"
        className="absolute top-1.5 right-1.5 z-30 flex h-9 w-18.5 items-center justify-center rounded-[0.25rem] bg-white text-xs leading-none font-medium text-black uppercase transition-colors hover:bg-gray-10 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:cursor-default"
        onClick={() => handleCopy(CONNECT_COMMAND)}
        disabled={isCopied}
        aria-label={isCopied ? "Copied command" : "Copy command"}
        data-click-location={clickLocation}
        data-click-text="copy_connect_command"
      >
        {isCopied ? (
          <Image src={CheckIcon} width={22} height={22} alt="" aria-hidden />
        ) : (
          "Copy"
        )}
      </button>

      <span className="sr-only" aria-live="polite">
        {isCopied ? "Command copied" : ""}
      </span>
    </div>
  )
}

export default ConnectCommandInput
