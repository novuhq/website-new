import Image, { type StaticImageData } from "next/image"
import { EMAIL_AGENTS_CAPABILITIES } from "@/data/pages/email-for-ai-agents"
import approvalsUi from "@/images/pages/email-for-ai-agents/capabilities/approvals.png"
import attachmentsUi from "@/images/pages/email-for-ai-agents/capabilities/attachments.png"
import routingUi from "@/images/pages/email-for-ai-agents/capabilities/routing.png"
import templatesUi from "@/images/pages/email-for-ai-agents/capabilities/templates.png"
import noiseTexture from "@/images/pages/home/surface-noise.webp"

import type { IChannelPageData } from "@/types/channel"

import ConnectCommand from "./connect-command"

// Two glow treatments alternate across the row, matching the design's two
// background variants.
const CARD_GLOWS = [
  "bg-[radial-gradient(115%_85%_at_-8%_-6%,#5c3ba9_0%,#402770_26%,#271b48_50%,rgba(17,15,27,0)_80%)]",
  "bg-[radial-gradient(105%_95%_at_-12%_10%,#4a3596_0%,#33245f_28%,#221a3f_54%,rgba(17,15,27,0)_82%)]",
]

// The per-card illustration, exported from the design's `ui` frames already
// clipped to the visible 268x198. The panel's fill and top corners are baked
// into the export; the border, shadow and backdrop blur stay in CSS. Keyed by
// label so the row order is free to change.
const CARD_UI: Record<string, StaticImageData> = {
  "Responsive message templates": templatesUi,
  "High-deliverability routing": routingUi,
  "Attachments and rich content": attachmentsUi,
  "Secure action links for approvals": approvalsUi,
}

// The design anchors the panel at (12, 122) in a 292x320 card and runs it off
// the bottom edge, so the offsets are percentages of the card and the bottom
// border is dropped.
const UI_PANEL =
  "pointer-events-none absolute inset-x-[4.11%] top-[38.125%] rounded-t-xl border border-b-0 border-gray-20 shadow-[0_5.554px_37.027px_#13151d,0_5.554px_29.622px_rgba(0,0,0,0.1)] backdrop-blur-[46px] select-none"

// The capability cards for /email-for-ai-agents. A route-local section: the
// shared ChannelConnect stays as the plain bulleted list the channel pages use.
function EmailAgentsCapabilities({ channel }: { channel: IChannelPageData }) {
  return (
    <section className="mt-24 md:mt-32 lg:mt-55 xl:mt-55">
      <div className="container mx-auto max-w-288 px-5 md:px-8 xl:px-0">
        <h2 className="text-[1.75rem] leading-[1.12] font-normal tracking-tighter text-balance text-white md:text-[2rem] lg:text-[2.5rem] xl:text-[2.75rem]">
          What your agent can do in {channel.channelName}
        </h2>
        <div className="mt-8 flex flex-col items-start gap-6 lg:flex-row lg:justify-between lg:gap-16">
          <p className="max-w-176 text-base leading-normal font-normal tracking-tight text-gray-70 md:text-lg">
            {EMAIL_AGENTS_CAPABILITIES.description}
          </p>
          <ConnectCommand
            className="w-full shrink-0 sm:w-95.5"
            command={`npx novu connect --channel ${channel.cliSlug}`}
          />
        </div>
      </div>

      <div className="container mx-auto mt-14 max-w-304 px-5 md:px-8 xl:px-0">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EMAIL_AGENTS_CAPABILITIES.cards.map(({ label }, index) => {
            const ui = CARD_UI[label]

            return (
              <li
                className={`relative aspect-[292/320] overflow-clip rounded-2xl bg-[#110f1b] ${CARD_GLOWS[index % CARD_GLOWS.length]}`}
                key={label}
              >
                <span
                  className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
                  style={{
                    backgroundImage: `url("${noiseTexture.src}")`,
                    backgroundPosition: "top left",
                    backgroundRepeat: "repeat",
                    backgroundSize: "256px 256px",
                  }}
                  aria-hidden
                />
                {ui && (
                  <div className={UI_PANEL} aria-hidden>
                    <Image
                      className="block w-full"
                      src={ui}
                      alt=""
                      sizes="(min-width: 1280px) 268px, (min-width: 640px) 45vw, 92vw"
                      draggable={false}
                    />
                  </div>
                )}
                <p className="absolute inset-x-6 top-6 text-xl leading-[1.25] font-normal tracking-tighter text-balance text-white">
                  {label}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default EmailAgentsCapabilities
