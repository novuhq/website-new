import type { CSSProperties } from "react"
import Image, { type StaticImageData } from "next/image"
import emailIcon from "@/images/pages/no-reply-is-dead/channel-icons/email.svg"
import imessageIcon from "@/images/pages/no-reply-is-dead/channel-icons/imessage.svg"
import slackIcon from "@/images/pages/no-reply-is-dead/channel-icons/slack.svg"
import teamsIcon from "@/images/pages/no-reply-is-dead/channel-icons/teams.svg"
import telegramIcon from "@/images/pages/no-reply-is-dead/channel-icons/telegram.svg"
import whatsappIcon from "@/images/pages/no-reply-is-dead/channel-icons/whatsapp.svg"

import { cn } from "@/lib/utils"

/* Glyphs are the white monochrome marks from the Figma tabs. Sizing is by
   height with auto width: Teams is 31x28, the rest are square. */

/* Scatter positions come from the Figma tab group (1326px wide). Pills on the
   right half are anchored from the right edge rather than the left: they sit
   flush to that edge in the design, so a left-anchored percentage would push a
   fixed-width pill past the container as it narrows. Below lg the offsets are
   ignored and the pills simply wrap. */
const CHANNELS: {
  name: string
  icon: StaticImageData
  side: "left" | "right"
  x: string
  y: string
}[] = [
  { name: "Slack", icon: slackIcon, side: "left", x: "0%", y: "33.7%" },
  { name: "Telegram", icon: telegramIcon, side: "left", x: "25.5%", y: "9.9%" },
  { name: "iMessage", icon: imessageIcon, side: "right", x: "28.4%", y: "0%" },
  { name: "Email", icon: emailIcon, side: "right", x: "0%", y: "37.9%" },
  {
    name: "WhatsApp",
    icon: whatsappIcon,
    side: "right",
    x: "18.3%",
    y: "85.7%",
  },
  {
    name: "Microsoft Teams",
    icon: teamsIcon,
    side: "left",
    x: "12.3%",
    y: "87.6%",
  },
]

export function Channels() {
  return (
    <section id="channels" className="mt-24 scroll-mt-24 md:mt-32 lg:mt-50">
      <div className="mx-auto max-w-336 px-5 md:px-8 2xl:px-0">
        <div className="relative isolate lg:aspect-[1344/617]">
          {/* Dark elliptical vignette behind everything
              (Figma: two #0E0C17 ellipses, blur 115px and 130px) */}
          <span
            className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto aspect-[1344/617] w-full max-w-320 -translate-y-1/2 rounded-[50%] bg-[#0E0C17] blur-[115px]"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto aspect-[1043/481] w-[78%] max-w-260 -translate-y-1/2 rounded-[50%] bg-[#0E0C17] blur-[130px]"
            aria-hidden
          />

          <h2 className="text-center text-[2rem] leading-dense font-normal tracking-plus-tight text-balance text-white md:text-[2.75rem] lg:absolute lg:inset-x-0 lg:top-1/2 lg:mx-auto lg:max-w-232 lg:-translate-y-1/2 lg:text-[3.5rem]">
            The reply lands wherever <br className="hidden lg:inline" />
            the user already is
          </h2>

          <ul className="mt-10 flex flex-wrap justify-center gap-3 lg:absolute lg:inset-x-0 lg:top-[6.8%] lg:mt-0 lg:block lg:h-[78.3%]">
            {CHANNELS.map(({ name, icon, side, x, y }) => (
              <li
                key={name}
                className={cn(
                  "relative inline-flex items-center gap-3.25 rounded-full border border-white/12 bg-[linear-gradient(115deg,#050510_0%,#0C0C1E_45%,#1C1E48_100%)] py-3 pr-5 pl-3 shadow-[0_5px_15.5px_rgba(5,17,40,0.45)] lg:absolute lg:top-(--pill-y) lg:py-4 lg:pr-7 lg:pl-4",
                  side === "left" ? "lg:left-(--pill-x)" : "lg:right-(--pill-x)"
                )}
                style={{ "--pill-x": x, "--pill-y": y } as CSSProperties}
              >
                <Image
                  src={icon}
                  alt=""
                  className="h-5 w-auto shrink-0 opacity-75 lg:h-7"
                />
                <span className="text-base leading-none font-medium tracking-tighter whitespace-nowrap text-white/75 lg:text-[1.625rem]">
                  {name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
