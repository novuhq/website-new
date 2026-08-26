import Image from "next/image"
import { EMAIL_AGENTS_HERO_THREAD } from "@/data/pages/email-for-ai-agents"
import customerAvatar from "@/images/pages/email-for-ai-agents/tomas-vidal.jpg"
import noiseTexture from "@/images/pages/home/surface-noise.webp"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const { agent, customer, outcome } = EMAIL_AGENTS_HERO_THREAD

// The hero visual for /email-for-ai-agents: an email client showing the agent
// writing, the customer replying, and the action settling, all in one thread.
// The card deliberately bleeds past the bottom of its glow frame, as designed.
function EmailThreadPreview() {
  return (
    <div className="relative w-full overflow-clip rounded-3xl bg-[#1b1a2b] px-4 pt-6 sm:px-7.5 sm:pt-10 lg:max-w-152">
      <span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_108%_at_105%_100%,#f77dff_0%,#ed71ff_12%,#eb77ff_17%,#c657f1_37%,#6d3cae_59%,#3e3068_79%,#201c3b_92%,rgba(27,26,43,0)_100%),radial-gradient(95%_115%_at_-8%_62%,#6a5ce0_0%,#6456d4_8%,#5c53c2_23%,#5c5dbd_30%,#4a3a9b_42%,#362878_54%,#36285f_63%,#231e43_80%,rgba(27,26,43,0)_100%)]"
        aria-hidden
      />
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

      <div className="relative -mb-4 rounded-2xl border border-gray-20 bg-[linear-gradient(184.73deg,#000_6.47%,#0a0a0a_30.02%,rgba(10,10,10,0.8)_120%)] p-4 pb-10 shadow-[0_5.5px_37px_#13151d,0_5.5px_30px_rgba(0,0,0,0.1)] sm:p-6 sm:pb-14">
        <span
          className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(71.29deg,#fff_13.53%,rgba(153,153,153,0)_49.57%)] mix-blend-overlay"
          aria-hidden
        />

        <div className="relative">
          <ThreadRail className="top-13.5 -bottom-7.25" />

          <header className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="relative size-11 shrink-0" aria-hidden>
                <span className="absolute -inset-[2.75px] rounded-full bg-[radial-gradient(circle_at_38%_34%,#fee0f3_0%,#fc67c5_26%,#e0489f_52%,#c25cd6_78%,#8c6bef_100%)] blur-[1.4px]" />
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="-mb-1 truncate pb-1 text-base leading-none font-medium tracking-tighter text-gray-90">
                  {agent.name}
                </p>
                <p className="truncate text-[0.9375rem] leading-snug tracking-tighter text-gray-50">
                  {agent.email}
                </p>
              </div>
            </div>
            <span className="shrink-0 text-[0.8125rem] leading-none tracking-tighter text-gray-40">
              {agent.time}
            </span>
          </header>

          <div className="mt-6 sm:pl-13.5">
            <p className="text-[0.9375rem] leading-snug tracking-tighter text-gray-40">
              {agent.subject}
            </p>
            <p className="mt-3 text-base leading-snug tracking-tighter text-gray-90">
              {agent.message}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="flex h-8 items-center rounded-md bg-[rgba(1,122,89,0.2)] px-2 text-[0.9375rem] leading-none font-medium tracking-tight text-[rgba(65,255,203,0.76)] backdrop-blur-[4px]">
                {agent.approveLabel}
              </span>
              <span className="flex h-8 items-center rounded-md bg-[rgba(234,57,116,0.2)] px-2 text-[0.9375rem] leading-none font-medium tracking-tight text-[rgba(255,152,186,0.7)] backdrop-blur-[4px]">
                {agent.denyLabel}
              </span>
              <div className="flex items-center gap-3">
                <span
                  className="hidden h-px w-20.25 bg-gradient-to-r from-gray-20 to-gray-50 xl:block"
                  aria-hidden
                />
                <div className="flex items-center gap-2">
                  <SecureBadge />
                  <span className="text-[0.9375rem] leading-snug tracking-tighter text-gray-70">
                    {agent.secureLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative -mx-1 mt-8 rounded-xl border border-white/20 bg-[linear-gradient(192.84deg,rgba(77,80,92,0.2)_46.43%,rgba(174,179,204,0.2)_112.28%)] p-3 shadow-[0_8px_12px_rgba(0,0,0,0.1)] sm:-mx-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <Image
                className="size-11 shrink-0 rounded-full object-cover"
                src={customerAvatar}
                width={44}
                height={44}
                alt=""
              />
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="flex items-center gap-1 text-base leading-none font-medium tracking-tighter text-gray-90">
                  <ReplyIcon />
                  <span className="-mb-1 truncate pb-1">{customer.name}</span>
                </p>
                <p className="truncate text-[0.9375rem] leading-snug tracking-tighter text-gray-60">
                  {customer.email}
                </p>
              </div>
            </div>
            <span className="shrink-0 text-[0.8125rem] leading-none tracking-tighter text-gray-40">
              {customer.time}
            </span>
          </div>
          <p className="mt-3 text-base leading-snug tracking-tighter text-gray-90 sm:pl-13.5">
            {customer.message}
          </p>
        </div>

        <div className="relative mt-12">
          <ThreadRail className="-top-11.5 h-11" />
          <div className="ml-1 flex items-center gap-4">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[rgba(1,122,89,0.5)] backdrop-blur-[4px]"
              aria-hidden
            >
              <Check className="size-5 text-[#34d3a7]" strokeWidth={2} />
            </span>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <p className="text-base leading-snug tracking-tighter text-gray-90">
                {outcome.label}
              </p>
              <span
                className="text-base leading-snug tracking-tighter text-gray-90"
                aria-hidden
              >
                ·
              </span>
              <span className="relative flex items-center rounded-md bg-white/12 p-2">
                <span className="text-[0.9375rem] leading-none tracking-tight text-white">
                  <span className="font-light">{outcome.noteLabel}</span>{" "}
                  <span className="font-medium">{outcome.noteValue}</span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// The vertical line that ties the thread together, under the avatar column.
function ThreadRail({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "absolute left-5.5 hidden w-px bg-gradient-to-b from-gray-20 to-gray-40 sm:block",
        className
      )}
      aria-hidden
    />
  )
}

// A glass badge whose circle overflows its 16px slot, matching the design.
function SecureBadge() {
  return (
    <span className="relative size-4 shrink-0" aria-hidden>
      <span className="absolute -inset-1.5 rounded-full bg-white/30 mix-blend-overlay" />
      <span className="absolute -inset-1.5 rounded-full ring-1 ring-white/30 ring-inset" />
      <svg
        className="absolute -inset-1.5 size-7"
        viewBox="0 0 28 28"
        fill="none"
      >
        <path
          className="fill-purple-2"
          d="M14 20.8568C14 20.8568 20 19.5234 20 13.5234V8.85677C17.8647 8.85677 15.9267 8.36944 14 7.52344C12.0733 8.36944 10.1353 8.85677 8 8.85677V13.5234C8 19.5234 14 20.8568 14 20.8568Z"
        />
        <path
          d="M11.3281 14.6901L12.8281 16.1901L16.6615 12.0234"
          stroke="black"
          strokeWidth="1.2"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function ReplyIcon() {
  return (
    <svg
      className="size-4 shrink-0 fill-gray-50"
      viewBox="0 0 16 16"
      aria-hidden
    >
      <path
        transform="translate(1.3333 2)"
        d="M0 5.33333L5.33333 0V3.33333C9.06667 3.33333 14 4.8 14 11.3333C12.2 8.26667 10.3333 7.33333 5.33333 7.33333V10.6667L0 5.33333Z"
      />
    </svg>
  )
}

export default EmailThreadPreview
